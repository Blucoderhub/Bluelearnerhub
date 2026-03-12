/**
 * Tutorials Controller
 * ====================
 * Handles the interactive tutorial engine — the W3Schools-style learning core.
 *
 * Routes:
 *   GET  /api/tutorials              — browse / filter tutorials
 *   GET  /api/tutorials/search       — semantic search (via AI service)
 *   GET  /api/tutorials/:slug        — full tutorial with sections
 *   POST /api/tutorials              — create tutorial (TEACHER / FACULTY / ADMIN)
 *   PUT  /api/tutorials/:id          — update tutorial (owner)
 *   POST /api/tutorials/:id/progress — mark section complete + award XP
 *   POST /api/tutorials/:id/run-code — execute code in the AI service sandbox
 */

import { Request, Response } from 'express';
import axios from 'axios';
import { db } from '../db';
import { eq, desc, ilike, and } from 'drizzle-orm';
import {
  tutorials,
  tutorialSections,
  tutorialProgress,
  tutorialCompletions,
  learningBehaviorEvents,
} from '../db/schema-v2';
import { users } from '../db/schema';
import { GamificationService } from '../services/gamification.service';
import { config } from '../config';
import logger from '../utils/logger';
import { fetchAdaptiveGuidanceFromAI, fallbackTutorialGuidance } from '@/services/adaptiveGuidance';

// ────────────────────────────────────────────────────────────────────────────
// BROWSE & SEARCH
// ────────────────────────────────────────────────────────────────────────────

export const listTutorials = async (req: Request, res: Response) => {
  try {
    const { domain, difficulty, page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const conditions: any[] = [eq(tutorials.isPublished, true)];
    if (domain)     conditions.push(ilike(tutorials.domain, `%${domain}%`));
    if (difficulty) conditions.push(eq(tutorials.difficulty as any, difficulty));

    const rows = await db
      .select({
        id:               tutorials.id,
        slug:             tutorials.slug,
        title:            tutorials.title,
        description:      tutorials.description,
        domain:           tutorials.domain,
        difficulty:       tutorials.difficulty,
        estimatedMinutes: tutorials.estimatedMinutes,
        xpReward:         tutorials.xpReward,
        viewCount:        tutorials.viewCount,
        completionCount:  tutorials.completionCount,
        tags:             tutorials.tags,
        authorName:       users.fullName,
        createdAt:        tutorials.createdAt,
      })
      .from(tutorials)
      .leftJoin(users, eq(tutorials.authorId, users.id))
      .where(and(...conditions))
      .orderBy(desc(tutorials.viewCount))
      .limit(parseInt(limit))
      .offset(offset);

    res.json({ success: true, data: rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    logger.error('listTutorials error', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tutorials' });
  }
};

export const searchTutorials = async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q: string };
    if (!q?.trim()) return res.json({ success: true, data: [] });

    // Delegate semantic search to the Python AI microservice
    const { data } = await axios.post(`${config.aiServiceUrl}/api/v1/search/semantic`, {
      query: q,
      content_type: 'tutorial',
      top_k: 10,
    });

    res.json({ success: true, data: data.results });
  } catch (err) {
    logger.error('searchTutorials error', err);
    // Fallback: basic title search
    const { q } = req.query as { q: string };
    const rows = await db
      .select()
      .from(tutorials)
      .where(and(eq(tutorials.isPublished, true), ilike(tutorials.title, `%${q}%`)))
      .limit(10);
    res.json({ success: true, data: rows, fallback: true });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET SINGLE TUTORIAL WITH SECTIONS
// ────────────────────────────────────────────────────────────────────────────

export const getTutorial = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const userId = (req as any).user?.id;

    const [tutorial] = await db
      .select()
      .from(tutorials)
      .where(and(eq(tutorials.slug, slug), eq(tutorials.isPublished, true)));

    if (!tutorial) return res.status(404).json({ success: false, message: 'Tutorial not found' });

    const sections = await db
      .select()
      .from(tutorialSections)
      .where(eq(tutorialSections.tutorialId, tutorial.id))
      .orderBy(tutorialSections.sectionOrder);

    // If authenticated, overlay completion state
    let completedSections: number[] = [];
    if (userId) {
      const progress = await db
        .select({ sectionId: tutorialProgress.sectionId })
        .from(tutorialProgress)
        .where(
          and(
            eq(tutorialProgress.userId, userId),
            eq(tutorialProgress.tutorialId, tutorial.id),
          ),
        );
      completedSections = progress.map((p) => p.sectionId);
    }

    // Increment view count (fire-and-forget)
    db.update(tutorials)
      .set({ viewCount: tutorial.viewCount + 1 })
      .where(eq(tutorials.id, tutorial.id))
      .catch(() => {});

    res.json({
      success: true,
      data: {
        ...tutorial,
        sections: sections.map((s) => ({
          ...s,
          // Hide solution from response; served only after exercise submission
          solutionCode: undefined,
          completed: completedSections.includes(s.id),
        })),
        totalSections: sections.length,
        completedSections: completedSections.length,
        progressPercent: sections.length
          ? Math.round((completedSections.length / sections.length) * 100)
          : 0,
      },
    });
  } catch (err) {
    logger.error('getTutorial error', err);
    res.status(500).json({ success: false, message: 'Failed to load tutorial' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// CREATE TUTORIAL (Teacher / Faculty / Admin)
// ────────────────────────────────────────────────────────────────────────────

export const createTutorial = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user.id;
    const {
      title, slug, description, domain, subDomain, difficulty,
      estimatedMinutes, xpReward, tags, prerequisites, sections,
    } = req.body;

    // Insert tutorial
    const [created] = await db
      .insert(tutorials)
      .values({
        title, slug, description, domain, subDomain, difficulty,
        estimatedMinutes, xpReward, tags, prerequisites,
        authorId, isPublished: false,
      })
      .returning();

    // Insert sections if provided
    if (Array.isArray(sections) && sections.length > 0) {
      await db.insert(tutorialSections).values(
        sections.map((s: any, i: number) => ({
          tutorialId:          created.id,
          title:               s.title,
          content:             s.content,
          sectionOrder:        s.order ?? i + 1,
          language:            s.language,
          starterCode:         s.starterCode,
          solutionCode:        s.solutionCode,
          hasExercise:         !!s.exercisePrompt,
          exercisePrompt:      s.exercisePrompt,
          exerciseTestCases:   s.exerciseTestCases,
          exerciseXpReward:    s.exerciseXpReward ?? 20,
        })),
      );
    }

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    logger.error('createTutorial error', err);
    res.status(500).json({ success: false, message: 'Failed to create tutorial' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// MARK SECTION COMPLETE + AWARD XP
// ────────────────────────────────────────────────────────────────────────────

export const markSectionComplete = async (req: Request, res: Response) => {
  try {
    const userId     = (req as any).user.id;
    const tutorialId = parseInt(req.params.id);
    const { sectionId } = req.body;

    // Upsert progress record
    await db
      .insert(tutorialProgress)
      .values({ userId, tutorialId, sectionId })
      .onConflictDoNothing();

    // Check if entire tutorial is now complete
    const [tutorial]  = await db.select().from(tutorials).where(eq(tutorials.id, tutorialId));
    const allSections = await db
      .select({ id: tutorialSections.id })
      .from(tutorialSections)
      .where(eq(tutorialSections.tutorialId, tutorialId));

    const doneRows = await db
      .select()
      .from(tutorialProgress)
      .where(
        and(eq(tutorialProgress.userId, userId), eq(tutorialProgress.tutorialId, tutorialId)),
      );

    const isComplete = doneRows.length >= allSections.length;
    let xpAwarded = 0;

    if (isComplete) {
      // Award XP only once
      const existingCompletion = await db
        .select()
        .from(tutorialCompletions)
        .where(
          and(
            eq(tutorialCompletions.userId, userId),
            eq(tutorialCompletions.tutorialId, tutorialId),
          ),
        );

      if (existingCompletion.length === 0) {
        xpAwarded = tutorial?.xpReward ?? 50;
        await db
          .insert(tutorialCompletions)
          .values({ userId, tutorialId, xpAwarded });

        // Award XP through gamification service
        await GamificationService.awardXP(userId, xpAwarded, 'TUTORIAL_COMPLETE');

        // Increment tutorial completion counter
        await db
          .update(tutorials)
          .set({ completionCount: (tutorial?.completionCount ?? 0) + 1 })
          .where(eq(tutorials.id, tutorialId));
      }
    }

    res.json({ success: true, isComplete, xpAwarded });
  } catch (err) {
    logger.error('markSectionComplete error', err);
    res.status(500).json({ success: false, message: 'Failed to save progress' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// RUN CODE — proxies to Judge0 via AI service
// ────────────────────────────────────────────────────────────────────────────

export const runCode = async (req: Request, res: Response) => {
  try {
    const { code, language, stdin, testCases } = req.body;

    const { data } = await axios.post(`${config.aiServiceUrl}/api/v1/hackathon/evaluate`, {
      code,
      language,
      stdin,
      test_cases: testCases,
      run_only: true,               // Don't score — just execute and return stdout
    });

    res.json({ success: true, data });
  } catch (err) {
    logger.error('runCode error', err);
    res.status(500).json({ success: false, message: 'Code execution failed' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// BEHAVIOR EVENTS + ADAPTIVE GUIDANCE
// ────────────────────────────────────────────────────────────────────────────

export const createTutorialBehaviorEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tutorialId = parseInt(req.params.id, 10);
    const { eventType, eventPayload } = req.body || {};

    if (!Number.isInteger(tutorialId) || tutorialId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid tutorial id' });
    }
    if (!eventType || typeof eventType !== 'string') {
      return res.status(400).json({ success: false, message: 'eventType is required' });
    }

    await db.insert(learningBehaviorEvents).values({
      userId,
      moduleType: 'tutorial',
      targetId: tutorialId,
      eventType: eventType.trim().slice(0, 100),
      eventPayload: eventPayload && typeof eventPayload === 'object' ? eventPayload : {},
    });

    res.status(201).json({ success: true });
  } catch (err) {
    logger.error('createTutorialBehaviorEvent error', err);
    res.status(500).json({ success: false, message: 'Failed to record behavior event' });
  }
};

export const getTutorialAdaptiveGuidance = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tutorialId = parseInt(req.params.id, 10);
    if (!Number.isInteger(tutorialId) || tutorialId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid tutorial id' });
    }

    const [tutorial] = await db.select().from(tutorials).where(eq(tutorials.id, tutorialId));
    if (!tutorial) {
      return res.status(404).json({ success: false, message: 'Tutorial not found' });
    }

    const [sections, completedRows, recentEvents] = await Promise.all([
      db.select({ id: tutorialSections.id }).from(tutorialSections).where(eq(tutorialSections.tutorialId, tutorialId)),
      db.select({ sectionId: tutorialProgress.sectionId }).from(tutorialProgress).where(and(eq(tutorialProgress.tutorialId, tutorialId), eq(tutorialProgress.userId, userId))),
      db.select({ eventType: learningBehaviorEvents.eventType, eventPayload: learningBehaviorEvents.eventPayload, createdAt: learningBehaviorEvents.createdAt })
        .from(learningBehaviorEvents)
        .where(and(
          eq(learningBehaviorEvents.userId, userId),
          eq(learningBehaviorEvents.moduleType, 'tutorial'),
          eq(learningBehaviorEvents.targetId, tutorialId),
        ))
        .orderBy(desc(learningBehaviorEvents.createdAt))
        .limit(80),
    ]);

    const runCodeEvents = recentEvents.filter((event) => String(event.eventType || '').toLowerCase().includes('run_code')).length;
    const errorEvents = recentEvents.filter((event) => event.eventType.toLowerCase().includes('error')).length;

    const snapshot = {
      completionPercent: sections.length ? Math.round((completedRows.length / sections.length) * 100) : 0,
      completedSections: completedRows.length,
      totalSections: sections.length,
      runCodeEvents,
      errorEvents,
    };

    const fallbackGuidance = fallbackTutorialGuidance(snapshot);

    try {
      const data = await fetchAdaptiveGuidanceFromAI('tutorial', String((req as any).requestId || 'unknown'), {
        target_id: tutorialId,
        target_title: tutorial.title,
        metrics: snapshot,
        events: recentEvents.map((event) => ({
          event_type: event.eventType,
          event_payload: event.eventPayload,
          created_at: event.createdAt,
        })),
      });

      return res.json({
        success: true,
        guidance: Array.isArray(data?.guidance) && data.guidance.length > 0 ? data.guidance : fallbackGuidance,
        behaviorSummary: data?.behavior_summary || snapshot,
        generatedAt: data?.generated_at || new Date().toISOString(),
      });
    } catch (upstreamErr) {
      logger.warn('getTutorialAdaptiveGuidance upstream fallback', upstreamErr);
      return res.json({
        success: true,
        guidance: fallbackGuidance,
        behaviorSummary: snapshot,
        generatedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    logger.error('getTutorialAdaptiveGuidance error', err);
    res.status(500).json({ success: false, message: 'Failed to generate adaptive guidance' });
  }
};
