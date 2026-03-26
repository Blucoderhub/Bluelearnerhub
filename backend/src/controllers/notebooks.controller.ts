/**
 * Notebooks Controller
 * ====================
 * Handles the "Study Notebooks" feature — a NotebookLM-style AI research
 * assistant that lets students ground a chat session in their own documents.
 *
 * Flow:
 *  1. POST /notebooks            → create notebook
 *  2. POST /notebooks/:id/sources → add text / URL source (AI service ingests it)
 *  3. POST /notebooks/:id/chat   → ask a question (RAG over notebook sources)
 *  4. POST /notebooks/:id/generate → produce study guide / FAQ / quiz / flashcards
 *  5. GET  /notebooks            → list user's notebooks
 *  6. GET  /notebooks/:id        → get one notebook with sources + generated content
 *  7. DELETE /notebooks/:id      → delete notebook (cascades to sources/chats)
 *  8. DELETE /notebooks/:id/sources/:sid → remove one source
 */

import { Request, Response } from 'express';
import { readFile } from 'node:fs/promises';
import axios from 'axios';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  notebooks,
  notebookSources,
  notebookChats,
  notebookGenerations,
  notebookSourceAnnotations,
  notebookBehaviorEvents,
} from '../db/schema-v2';
import { config } from '../config';
import logger from '../utils/logger';

const AI_SERVICE = () => process.env.AI_SERVICE_URL || config.aiServiceUrl || 'http://localhost:8000';
const AI_REQUEST_TIMEOUT_MS = Number.parseInt(process.env.NOTEBOOK_AI_TIMEOUT_MS || '20000', 10);
const MAX_HISTORY_LENGTH = 100;

const reqId = (req: Request) => String(req.requestId || 'unknown');
const userIdForLog = (req: Request) => req.user?.id || null;
const notebookError = (req: Request, action: string, err: unknown, extra: Record<string, unknown> = {}) => {
  logger.error(`[notebooks] ${action} failed`, {
    requestId: reqId(req),
    userId: userIdForLog(req),
    error: err instanceof Error ? err.message : String(err),
    ...extra,
  });
};

const parseRequiredIntParam = (req: Request, res: Response, name: string): number | null => {
  const value = Number.parseInt(String(req.params[name] || ''), 10);
  if (!Number.isInteger(value) || value <= 0) {
    res.status(400).json({ success: false, error: `Invalid ${name} parameter` });
    return null;
  }
  return value;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableUpstreamError = (err: unknown) => {
  if (!axios.isAxiosError(err)) return false;
  if (err.code === 'ECONNABORTED') return true;
  if (!err.response) return true;
  return err.response.status >= 500;
};

const hasPdfSignature = async (filePath: string): Promise<boolean> => {
  try {
    const content = await readFile(filePath);
    if (content.length < 4) return false;
    return content.subarray(0, 4).toString('ascii') === '%PDF';
  } catch {
    return false;
  }
};

const runNotebookIngestion = async (
  payload: {
    source_id: number;
    notebook_id: number;
    source_type: 'text' | 'url' | 'pdf';
    content: string | null;
    url: string | null;
    file_path: string | null;
    title: string;
  },
  sourceId: number,
  requestId?: string,
  userId?: number,
) => {
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { data } = await axios.post(`${AI_SERVICE()}/api/v1/notebooks/ingest`, payload, {
        timeout: AI_REQUEST_TIMEOUT_MS,
        headers: requestId ? { 'x-request-id': requestId } : undefined,
      });

      const update: Record<string, unknown> = { status: 'ready' };
      if (data.chunk_count) update.chunkCount = data.chunk_count;
      if (data.word_count) update.wordCount = data.word_count;
      if (data.extracted_text) update.content = data.extracted_text;
      await db.update(notebookSources).set(update).where(eq(notebookSources.id, sourceId));
      return;
    } catch (err: any) {
      if (attempt < maxAttempts && isRetryableUpstreamError(err)) {
        await sleep(500 * attempt);
        continue;
      }

      logger.error('[notebooks] AI ingest failed', {
        requestId,
        userId,
        notebookId: payload.notebook_id,
        sourceId,
        sourceType: payload.source_type,
        error: err instanceof Error ? err.message : String(err),
      });
      await db.update(notebookSources).set({ status: 'failed' }).where(eq(notebookSources.id, sourceId));
      return;
    }
  }
};

const fallbackAdaptiveGuidance = (snapshot: {
  sourceCount: number;
  readySources: number;
  totalMessages: number;
  generationCount: number;
  unresolvedErrors: number;
}) => {
  const guidance: Array<Record<string, unknown>> = [];

  if (snapshot.sourceCount === 0) {
    guidance.push({
      title: 'Start With Strong Source Context',
      insight: 'Your notebook has no sources yet, so AI guidance cannot be grounded.',
      action: 'Add at least 2 reliable sources (PDF, URL, or notes) before asking complex questions.',
      priority: 'high',
      confidence: 0.95,
    });
  }

  if (snapshot.readySources > 0 && snapshot.totalMessages < 3) {
    guidance.push({
      title: 'Increase Question Depth',
      insight: 'You have source material loaded but very few exploratory questions.',
      action: 'Ask comparison, contradiction, and exam-style questions to improve retention.',
      priority: 'medium',
      confidence: 0.84,
    });
  }

  if (snapshot.totalMessages > 6 && snapshot.generationCount === 0) {
    guidance.push({
      title: 'Convert Chat Into Study Assets',
      insight: 'You are actively chatting but not generating reusable learning artefacts.',
      action: 'Generate a Notebook Guide and Practice Quiz to consolidate understanding.',
      priority: 'medium',
      confidence: 0.88,
    });
  }

  if (snapshot.unresolvedErrors > 1) {
    guidance.push({
      title: 'Stabilize Learning Flow',
      insight: 'Recent interaction failures may be interrupting your learning momentum.',
      action: 'Use manual refresh and retry failed actions, then continue with summary-first prompts.',
      priority: 'high',
      confidence: 0.76,
    });
  }

  if (guidance.length === 0) {
    guidance.push({
      title: 'Great Learning Cadence',
      insight: 'Your notebook activity looks balanced across sources, questions, and outputs.',
      action: 'Maintain this rhythm and schedule a quick recall quiz after each session.',
      priority: 'low',
      confidence: 0.72,
    });
  }

  return guidance;
};

// ─────────────────────────────────────────────────────────────────────────────
// LIST
// ─────────────────────────────────────────────────────────────────────────────

export const listNotebooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const rows = await db
      .select()
      .from(notebooks)
      .where(eq(notebooks.userId, userId))
      .orderBy(desc(notebooks.updatedAt));

    res.json({ success: true, notebooks: rows });
  } catch (err) {
    notebookError(req, 'listNotebooks', err);
    res.status(500).json({ success: false, error: 'Failed to fetch notebooks' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTEBOOKS HEALTH (AI-SERVICE DIAGNOSTICS PROXY)
// ─────────────────────────────────────────────────────────────────────────────

export const getNotebooksHealth = async (req: Request, res: Response) => {
  try {
    const requestId = reqId(req);
    const { data, headers } = await axios.get(`${AI_SERVICE()}/api/v1/notebooks/health`, {
      timeout: AI_REQUEST_TIMEOUT_MS,
      headers: { 'x-request-id': requestId },
    });

    const upstreamRequestId = String(headers['x-request-id'] || '');
    if (upstreamRequestId) {
      res.setHeader('x-upstream-request-id', upstreamRequestId);
    }

    return res.json({
      success: true,
      requestId,
      upstreamRequestId: upstreamRequestId || null,
      health: data,
    });
  } catch (err: any) {
    notebookError(req, 'getNotebooksHealth', err);
    if (axios.isAxiosError(err)) {
      const timedOut = err.code === 'ECONNABORTED';
      return res.status(timedOut ? 504 : 502).json({
        success: false,
        requestId: reqId(req),
        error: timedOut ? 'AI notebooks health check timed out' : 'AI notebooks health check unavailable',
      });
    }
    return res.status(500).json({
      success: false,
      requestId: reqId(req),
      error: 'Failed to fetch AI notebooks health',
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BEHAVIOR EVENT INGESTION
// ─────────────────────────────────────────────────────────────────────────────

export const createBehaviorEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const { eventType, eventPayload } = req.body || {};

    if (!eventType || typeof eventType !== 'string' || eventType.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'eventType is required' });
    }

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    await db.insert(notebookBehaviorEvents).values({
      notebookId,
      userId,
      eventType: eventType.trim().slice(0, 100),
      eventPayload: eventPayload && typeof eventPayload === 'object' ? eventPayload : {},
    });

    res.status(201).json({ success: true });
  } catch (err) {
    notebookError(req, 'createBehaviorEvent', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to record behavior event' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADAPTIVE GUIDANCE
// ─────────────────────────────────────────────────────────────────────────────

export const getAdaptiveGuidance = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;

    const [notebook] = await db
      .select({ id: notebooks.id, title: notebooks.title })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const [sources, chatRows, generations, recentEvents] = await Promise.all([
      db.select({ id: notebookSources.id, status: notebookSources.status }).from(notebookSources).where(eq(notebookSources.notebookId, notebookId)),
      db.select({ messages: notebookChats.messages }).from(notebookChats).where(and(eq(notebookChats.notebookId, notebookId), eq(notebookChats.userId, userId))).limit(1),
      db.select({ id: notebookGenerations.id }).from(notebookGenerations).where(eq(notebookGenerations.notebookId, notebookId)),
      db.select({ eventType: notebookBehaviorEvents.eventType, eventPayload: notebookBehaviorEvents.eventPayload, createdAt: notebookBehaviorEvents.createdAt })
        .from(notebookBehaviorEvents)
        .where(and(eq(notebookBehaviorEvents.notebookId, notebookId), eq(notebookBehaviorEvents.userId, userId)))
        .orderBy(desc(notebookBehaviorEvents.createdAt))
        .limit(80),
    ]);

    const totalMessages = Array.isArray(chatRows[0]?.messages) ? chatRows[0].messages.length : 0;
    const readySources = sources.filter((s: any) => s.status === 'ready').length;
    const unresolvedErrors = recentEvents.filter((e: any) => String(e.eventType).toLowerCase().includes('error')).length;

    const snapshot = {
      sourceCount: sources.length,
      readySources,
      totalMessages,
      generationCount: generations.length,
      unresolvedErrors,
    };

    const fallbackGuidance = fallbackAdaptiveGuidance(snapshot);

    try {
      const { data } = await axios.post(`${AI_SERVICE()}/api/v1/adaptive/guidance`, {
        module_type: 'notebook',
        target_id: notebookId,
        target_title: notebook.title,
        metrics: snapshot,
        events: recentEvents.map((event: any) => ({
          event_type: event.eventType,
          event_payload: event.eventPayload,
          created_at: event.createdAt,
        })),
      }, {
        timeout: AI_REQUEST_TIMEOUT_MS,
        headers: { 'x-request-id': reqId(req) },
      });

      return res.json({
        success: true,
        guidance: Array.isArray(data?.guidance) && data.guidance.length > 0 ? data.guidance : fallbackGuidance,
        behaviorSummary: data?.behavior_summary || snapshot,
        generatedAt: data?.generated_at || new Date().toISOString(),
      });
    } catch (upstreamErr) {
      notebookError(req, 'getAdaptiveGuidanceUpstream', upstreamErr, { notebookId });
      return res.json({
        success: true,
        guidance: fallbackGuidance,
        behaviorSummary: snapshot,
        generatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    notebookError(req, 'getAdaptiveGuidance', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to generate adaptive guidance' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────────────────────

export const createNotebook = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, description, emoji } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'title is required' });
    }

    const [notebook] = await db
      .insert(notebooks)
      .values({
        userId,
        title: title.trim().slice(0, 255),
        description: description?.trim() ?? null,
        emoji: emoji ?? '📓',
      })
      .returning();

    res.status(201).json({ success: true, notebook });
  } catch (err) {
    notebookError(req, 'createNotebook', err);
    res.status(500).json({ success: false, error: 'Failed to create notebook' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET ONE (with sources + latest generated content)
// ─────────────────────────────────────────────────────────────────────────────

export const getNotebook = async (req: Request, res: Response) => {
  try {
    const userId   = req.user!.id;
    const id = parseRequiredIntParam(req, res, 'id');
    if (id === null) return;

    const [notebook] = await db
      .select()
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const [sources, chat, generations] = await Promise.all([
      db.select().from(notebookSources).where(eq(notebookSources.notebookId, id)),
      db
        .select()
        .from(notebookChats)
        .where(and(eq(notebookChats.notebookId, id), eq(notebookChats.userId, userId)))
        .limit(1),
      db
        .select()
        .from(notebookGenerations)
        .where(eq(notebookGenerations.notebookId, id))
        .orderBy(desc(notebookGenerations.createdAt)),
    ]);

    res.json({
      success: true,
      notebook,
      sources,
      messages: chat[0]?.messages ?? [],
      generations,
    });
  } catch (err) {
    notebookError(req, 'getNotebook', err);
    res.status(500).json({ success: false, error: 'Failed to fetch notebook' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE NOTEBOOK
// ─────────────────────────────────────────────────────────────────────────────

export const deleteNotebook = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const id = parseRequiredIntParam(req, res, 'id');
    if (id === null) return;

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, id), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    await db.delete(notebooks).where(eq(notebooks.id, id)); // cascades

    res.json({ success: true, message: 'Notebook deleted' });
  } catch (err) {
    notebookError(req, 'deleteNotebook', err);
    res.status(500).json({ success: false, error: 'Failed to delete notebook' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD SOURCE
// ─────────────────────────────────────────────────────────────────────────────

export const addSource = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const { title, sourceType, content, url } = req.body;

    // Ownership check
    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    if (!['text', 'url'].includes(sourceType)) {
      return res.status(400).json({ success: false, error: 'sourceType must be text or url' });
    }
    if (sourceType === 'text' && (!content || content.trim().length < 10)) {
      return res.status(400).json({ success: false, error: 'content too short for text source' });
    }
    if (sourceType === 'url' && !url) {
      return res.status(400).json({ success: false, error: 'url is required for url source' });
    }

    // Insert source record
    const [source] = await db
      .insert(notebookSources)
      .values({
        notebookId,
        title:      title?.trim().slice(0, 255) || 'Untitled Source',
        sourceType,
        content:    sourceType === 'text' ? content : null,
        url:        sourceType === 'url'  ? url     : null,
        status:     'processing',
      })
      .returning();

    // Update notebook source count
    await db
      .update(notebooks)
      .set({ sourceCount: sql`${notebooks.sourceCount} + 1`, updatedAt: new Date() })
      .where(eq(notebooks.id, notebookId));

    // Kick off AI ingestion asynchronously (don't await — respond immediately)
    void runNotebookIngestion({
      source_id: source.id,
      notebook_id: notebookId,
      source_type: sourceType,
      content: sourceType === 'text' ? content : null,
      url: sourceType === 'url' ? url : null,
      file_path: null,
      title: source.title,
    }, source.id, reqId(req), userId);

    res.status(201).json({ success: true, source });
  } catch (err) {
    notebookError(req, 'addSource', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to add source' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD PDF SOURCE (multipart/form-data)
// ─────────────────────────────────────────────────────────────────────────────

export const addPdfSource = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const file       = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: 'PDF file is required' });
    }

    const hasPdfMime = file.mimetype === 'application/pdf';
    const hasPdfExt = String(file.originalname || '').toLowerCase().endsWith('.pdf');
    const hasSignature = await hasPdfSignature(String(file.path || ''));
    if (!hasPdfMime || !hasPdfExt || !hasSignature) {
      return res.status(400).json({ success: false, error: 'Uploaded file must be a valid PDF' });
    }

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const [source] = await db
      .insert(notebookSources)
      .values({
        notebookId,
        title: file.originalname?.slice(0, 255) || 'Uploaded PDF',
        sourceType: 'pdf',
        s3Key: file.path,
        status: 'processing',
      })
      .returning();

    await db
      .update(notebooks)
      .set({ sourceCount: sql`${notebooks.sourceCount} + 1`, updatedAt: new Date() })
      .where(eq(notebooks.id, notebookId));

    void runNotebookIngestion({
      source_id: source.id,
      notebook_id: notebookId,
      source_type: 'pdf',
      content: null,
      url: null,
      file_path: file.path,
      title: source.title,
    }, source.id, reqId(req), userId);

    res.status(201).json({ success: true, source });
  } catch (err) {
    notebookError(req, 'addPdfSource', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to upload PDF source' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE SOURCE
// ─────────────────────────────────────────────────────────────────────────────

export const deleteSource = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const sourceId = parseRequiredIntParam(req, res, 'sid');
    if (sourceId === null) return;

    // Ownership check via notebook
    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    await db
      .delete(notebookSources)
      .where(and(eq(notebookSources.id, sourceId), eq(notebookSources.notebookId, notebookId)));

    await db
      .update(notebooks)
      .set({ sourceCount: sql`GREATEST(${notebooks.sourceCount} - 1, 0)`, updatedAt: new Date() })
      .where(eq(notebooks.id, notebookId));

    // Tell AI service to delete the chunks (best-effort)
    axios
      .delete(`${AI_SERVICE()}/api/v1/notebooks/sources/${sourceId}`, { timeout: 2000 })
      .catch((err) => {
        logger.debug('[notebooks] source chunk delete failed (non-blocking)', {
          sourceId,
          notebookId,
          error: err instanceof Error ? err.message : String(err),
        });
      });

    res.json({ success: true, message: 'Source removed' });
  } catch (err) {
    notebookError(req, 'deleteSource', err, { notebookId: req.params.id, sourceId: req.params.sid });
    res.status(500).json({ success: false, error: 'Failed to delete source' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET SOURCE DETAIL (for citation inspector)
// ─────────────────────────────────────────────────────────────────────────────

export const getSourceDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const sourceId = parseRequiredIntParam(req, res, 'sid');
    if (sourceId === null) return;
    const focusChunkIndex = req.query.focusChunkIndex
      ? Number.parseInt(String(req.query.focusChunkIndex), 10)
      : null;
    if (focusChunkIndex !== null && (!Number.isInteger(focusChunkIndex) || focusChunkIndex < 0)) {
      return res.status(400).json({ success: false, error: 'Invalid focusChunkIndex query parameter' });
    }
    const searchText = typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const [source] = await db
      .select()
      .from(notebookSources)
      .where(and(eq(notebookSources.id, sourceId), eq(notebookSources.notebookId, notebookId)));

    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }

    // Escape SQL LIKE wildcards to prevent unintended pattern matching
    const escapedSearch = searchText
      ? searchText.toLowerCase().replace(/[%_\\]/g, '\\$&')
      : null;

    const chunkResult = escapedSearch
      ? await db.execute(sql`
          SELECT chunk_index, content
          FROM notebook_chunks
          WHERE source_id = ${sourceId}
            AND LOWER(content) LIKE ${'%' + escapedSearch + '%'}
          ORDER BY chunk_index ASC
          LIMIT 24
        `)
      : focusChunkIndex !== null && !Number.isNaN(focusChunkIndex)
      ? await db.execute(sql`
          SELECT chunk_index, content
          FROM notebook_chunks
          WHERE source_id = ${sourceId}
            AND chunk_index BETWEEN ${Math.max(0, focusChunkIndex - 3)} AND ${focusChunkIndex + 3}
          ORDER BY chunk_index ASC
        `)
      : await db.execute(sql`
          SELECT chunk_index, content
          FROM notebook_chunks
          WHERE source_id = ${sourceId}
          ORDER BY chunk_index ASC
          LIMIT 24
        `);

    const chunkRows = Array.isArray((chunkResult as any).rows)
      ? (chunkResult as any).rows
      : (chunkResult as any);

    const chunks = (chunkRows || []).map((row: any) => ({
      chunkIndex: Number(row.chunk_index ?? row.chunkIndex ?? 0),
      content: String(row.content ?? ''),
    }));

    const previewText = source.content || chunks.map((chunk: any) => chunk.content).join('\n\n');

    res.json({
      success: true,
      source: {
        ...source,
        previewText: previewText.slice(0, 20000),
        chunks,
        focusChunkIndex,
        activeSearch: searchText || null,
      },
    });
  } catch (err) {
    notebookError(req, 'getSourceDetail', err, { notebookId: req.params.id, sourceId: req.params.sid });
    res.status(500).json({ success: false, error: 'Failed to fetch source detail' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SOURCE ANNOTATIONS (saved highlights + notes)
// ─────────────────────────────────────────────────────────────────────────────

export const listSourceAnnotations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const sourceId = parseRequiredIntParam(req, res, 'sid');
    if (sourceId === null) return;

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const rows = await db
      .select()
      .from(notebookSourceAnnotations)
      .where(and(
        eq(notebookSourceAnnotations.notebookId, notebookId),
        eq(notebookSourceAnnotations.sourceId, sourceId),
        eq(notebookSourceAnnotations.userId, userId),
      ))
      .orderBy(desc(notebookSourceAnnotations.createdAt));

    res.json({ success: true, annotations: rows });
  } catch (err) {
    notebookError(req, 'listSourceAnnotations', err, { notebookId: req.params.id, sourceId: req.params.sid });
    res.status(500).json({ success: false, error: 'Failed to fetch annotations' });
  }
};

export const listNotebookAnnotations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const rows = await db
      .select({
        id: notebookSourceAnnotations.id,
        notebookId: notebookSourceAnnotations.notebookId,
        sourceId: notebookSourceAnnotations.sourceId,
        userId: notebookSourceAnnotations.userId,
        quote: notebookSourceAnnotations.quote,
        note: notebookSourceAnnotations.note,
        chunkIndex: notebookSourceAnnotations.chunkIndex,
        createdAt: notebookSourceAnnotations.createdAt,
        sourceTitle: notebookSources.title,
      })
      .from(notebookSourceAnnotations)
      .innerJoin(notebookSources, eq(notebookSources.id, notebookSourceAnnotations.sourceId))
      .where(and(
        eq(notebookSourceAnnotations.notebookId, notebookId),
        eq(notebookSourceAnnotations.userId, userId),
      ))
      .orderBy(desc(notebookSourceAnnotations.createdAt));

    res.json({ success: true, annotations: rows });
  } catch (err) {
    notebookError(req, 'listNotebookAnnotations', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to fetch notebook annotations' });
  }
};

export const createSourceAnnotation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const sourceId = parseRequiredIntParam(req, res, 'sid');
    if (sourceId === null) return;
    const { quote, note, chunkIndex } = req.body;

    if (!quote || typeof quote !== 'string' || quote.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'quote is required' });
    }

    const [source] = await db
      .select({ id: notebookSources.id })
      .from(notebooks)
      .innerJoin(notebookSources, eq(notebookSources.notebookId, notebooks.id))
      .where(and(
        eq(notebooks.id, notebookId),
        eq(notebooks.userId, userId),
        eq(notebookSources.id, sourceId),
      ));

    if (!source) {
      return res.status(404).json({ success: false, error: 'Source not found' });
    }

    const [annotation] = await db
      .insert(notebookSourceAnnotations)
      .values({
        notebookId,
        sourceId,
        userId,
        quote: quote.trim().slice(0, 5000),
        note: note?.trim() ? note.trim().slice(0, 2000) : null,
        chunkIndex: Number.isInteger(chunkIndex) ? chunkIndex : null,
      })
      .returning();

    res.status(201).json({ success: true, annotation });
  } catch (err) {
    notebookError(req, 'createSourceAnnotation', err, { notebookId: req.params.id, sourceId: req.params.sid });
    res.status(500).json({ success: false, error: 'Failed to save annotation' });
  }
};

export const deleteSourceAnnotation = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const sourceId = parseRequiredIntParam(req, res, 'sid');
    if (sourceId === null) return;
    const annotationId = parseRequiredIntParam(req, res, 'aid');
    if (annotationId === null) return;

    const [annotation] = await db
      .select({ id: notebookSourceAnnotations.id })
      .from(notebookSourceAnnotations)
      .innerJoin(notebooks, eq(notebooks.id, notebookSourceAnnotations.notebookId))
      .where(and(
        eq(notebookSourceAnnotations.id, annotationId),
        eq(notebookSourceAnnotations.notebookId, notebookId),
        eq(notebookSourceAnnotations.sourceId, sourceId),
        eq(notebookSourceAnnotations.userId, userId),
        eq(notebooks.userId, userId),
      ));

    if (!annotation) {
      return res.status(404).json({ success: false, error: 'Annotation not found' });
    }

    await db.delete(notebookSourceAnnotations).where(eq(notebookSourceAnnotations.id, annotationId));
    res.json({ success: true, message: 'Annotation deleted' });
  } catch (err) {
    notebookError(req, 'deleteSourceAnnotation', err, {
      notebookId: req.params.id,
      sourceId: req.params.sid,
      annotationId: req.params.aid,
    });
    res.status(500).json({ success: false, error: 'Failed to delete annotation' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT (RAG over notebook sources)
// ─────────────────────────────────────────────────────────────────────────────

export const chat = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'message is required' });
    }

    // Ownership check
    const [notebook] = await db
      .select({ id: notebooks.id, title: notebooks.title })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    // Load or create chat record
    let [chatRecord] = await db
      .select()
      .from(notebookChats)
      .where(and(eq(notebookChats.notebookId, notebookId), eq(notebookChats.userId, userId)))
      .limit(1);

    if (!chatRecord) {
      const [newChat] = await db
        .insert(notebookChats)
        .values({ notebookId, userId, messages: [] })
        .returning();
      chatRecord = newChat;
    }

    const history = (chatRecord.messages as any[]) ?? [];

    // Call AI service for RAG answer
    const { data } = await axios.post(`${AI_SERVICE()}/api/v1/notebooks/chat`, {
      notebook_id: notebookId,
      message:     message.trim(),
      history:     history.slice(-10), // last 5 turns for context
    }, {
      timeout: AI_REQUEST_TIMEOUT_MS,
      headers: { 'x-request-id': reqId(req) },
    });

    const assistantMessage = {
      role:    'assistant',
      content: data.answer,
      sources: data.sources ?? [],
    };

    const updatedMessages = [
      ...history,
      { role: 'user', content: message.trim() },
      assistantMessage,
    ];
    const trimmedMessages = updatedMessages.slice(-MAX_HISTORY_LENGTH);

    // Persist updated history
    await db
      .update(notebookChats)
      .set({ messages: trimmedMessages, updatedAt: new Date() })
      .where(eq(notebookChats.id, chatRecord.id));

    res.json({ success: true, answer: data.answer, sources: data.sources ?? [] });
  } catch (err: any) {
    notebookError(req, 'chat', err, { notebookId: req.params.id });
    if (axios.isAxiosError(err)) {
      const timedOut = err.code === 'ECONNABORTED';
      return res.status(timedOut ? 504 : 502).json({
        success: false,
        error: timedOut ? 'AI service timed out while answering chat' : 'AI service unavailable for chat',
      });
    }
    res.status(500).json({ success: false, error: 'Chat failed' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE (study guide / FAQ / flashcards / quiz)
// ─────────────────────────────────────────────────────────────────────────────

export const generate = async (req: Request, res: Response) => {
  const VALID_TYPES = ['summary', 'study_guide', 'notebook_guide', 'faq', 'flashcards', 'quiz', 'audio_overview', 'compare_sources'];

  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;
    const { type }   = req.body;

    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ success: false, error: `type must be one of: ${VALID_TYPES.join(', ')}` });
    }

    // Ownership check
    const [notebook] = await db
      .select({ id: notebooks.id, title: notebooks.title })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    const { data } = await axios.post(`${AI_SERVICE()}/api/v1/notebooks/generate`, {
      notebook_id: notebookId,
      type,
    }, {
      timeout: AI_REQUEST_TIMEOUT_MS,
      headers: { 'x-request-id': reqId(req) },
    });

    // Persist the generation
    const [generation] = await db
      .insert(notebookGenerations)
      .values({
        notebookId,
        type,
        title: data.title || `${type.replace('_', ' ')} — ${notebook.title}`,
        content: data.content,
      })
      .returning();

    res.json({ success: true, generation });
  } catch (err: any) {
    notebookError(req, 'generate', err, { notebookId: req.params.id, type: req.body?.type });
    if (axios.isAxiosError(err)) {
      const timedOut = err.code === 'ECONNABORTED';
      return res.status(timedOut ? 504 : 502).json({
        success: false,
        error: timedOut ? 'AI service timed out while generating content' : 'AI service unavailable for generation',
      });
    }
    res.status(500).json({ success: false, error: 'Generation failed' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CLEAR CHAT HISTORY
// ─────────────────────────────────────────────────────────────────────────────

export const clearChat = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const notebookId = parseRequiredIntParam(req, res, 'id');
    if (notebookId === null) return;

    const [notebook] = await db
      .select({ id: notebooks.id })
      .from(notebooks)
      .where(and(eq(notebooks.id, notebookId), eq(notebooks.userId, userId)));

    if (!notebook) {
      return res.status(404).json({ success: false, error: 'Notebook not found' });
    }

    await db
      .update(notebookChats)
      .set({ messages: [], updatedAt: new Date() })
      .where(and(eq(notebookChats.notebookId, notebookId), eq(notebookChats.userId, userId)));

    res.json({ success: true, message: 'Chat cleared' });
  } catch (err) {
    notebookError(req, 'clearChat', err, { notebookId: req.params.id });
    res.status(500).json({ success: false, error: 'Failed to clear chat' });
  }
};
