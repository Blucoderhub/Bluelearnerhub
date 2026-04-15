/**
 * Developer Portal — Repositories Controller
 * ============================================
 * GitHub-style code repository system integrated into BlueLearnerHub.
 * Users build portfolios, collaborate, submit hackathon projects.
 *
 * Routes:
 *   GET  /api/repositories/:username         — user's repos
 *   GET  /api/repositories/:username/:slug   — repo detail + file tree
 *   GET  /api/repositories/:username/:slug/file — file content
 *   GET  /api/repositories/:username/:slug/commits — commit history
 *   POST /api/repositories                   — create repo
 *   POST /api/repositories/:id/commits       — commit files (create/update)
 *   POST /api/repositories/:id/issues        — create issue
 *   GET  /api/repositories/:id/issues        — list issues
 *   POST /api/repositories/:id/pulls         — open pull request
 *   GET  /api/repositories/:id/pulls         — list pull requests
 *   POST /api/repositories/:id/pulls/:prId/review — AI code review
 *   POST /api/repositories/:id/star          — star / unstar
 */

import { Request, Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { db } from '../db';
import { sanitizeText, sanitizeRichText } from '../utils/sanitize';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  repositories, repositoryFiles, commits, issues,
  pullRequests, repositoryStars,
} from '../db/schema-v2';
import { users } from '../db/schema';
import { config } from '../config';
import logger from '../utils/logger';

// ────────────────────────────────────────────────────────────────────────────
// LIST USER REPOSITORIES
// ────────────────────────────────────────────────────────────────────────────

export const getUserRepositories = async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username);
    const requesterId  = req.user?.id;

    const [owner] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.fullName, username));   // In prod, use a @username column

    if (!owner) return res.status(404).json({ success: false, message: 'User not found' });

    const isOwnProfile = requesterId === owner.id;

    const rows = await db
      .select()
      .from(repositories)
      .where(
        and(
          eq(repositories.ownerId, owner.id),
          isOwnProfile ? undefined : eq(repositories.visibility, 'public'),
        ),
      )
      .orderBy(desc(repositories.updatedAt));

    res.json({ success: true, data: rows });
  } catch (err) {
    logger.error('getUserRepositories error', err);
    res.status(500).json({ success: false, message: 'Failed to load repositories' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET REPOSITORY DETAIL + FILE TREE
// ────────────────────────────────────────────────────────────────────────────

export const getRepository = async (req: Request, res: Response) => {
  try {
    const username = String(req.params.username);
    const slug = String(req.params.slug);
    const requesterId = req.user?.id;

    const [owner] = await db
      .select({ id: users.id, fullName: users.fullName })
      .from(users)
      .where(eq(users.fullName, username));

    if (!owner) return res.status(404).json({ success: false, message: 'User not found' });

    const [repo] = await db
      .select()
      .from(repositories)
      .where(and(eq(repositories.ownerId, owner.id), eq(repositories.slug, slug)));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && requesterId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    // File tree (paths only — content fetched separately)
    const files = await db
      .select({ id: repositoryFiles.id, path: repositoryFiles.path, language: repositoryFiles.language, sizeBytes: repositoryFiles.sizeBytes })
      .from(repositoryFiles)
      .where(eq(repositoryFiles.repoId, repo.id));

    // Latest 5 commits for sidebar
    const recentCommits = await db
      .select()
      .from(commits)
      .where(eq(commits.repoId, repo.id))
      .orderBy(desc(commits.createdAt))
      .limit(5);

    // Check if requester starred this repo
    let isStarred = false;
    if (requesterId) {
      const [star] = await db
        .select()
        .from(repositoryStars)
        .where(and(eq(repositoryStars.userId, requesterId), eq(repositoryStars.repoId, repo.id)));
      isStarred = !!star;
    }

    res.json({
      success: true,
      data: {
        ...repo,
        owner: owner.fullName,
        files: buildTree(files),
        recentCommits,
        isStarred,
      },
    });
  } catch (err) {
    logger.error('getRepository error', err);
    res.status(500).json({ success: false, message: 'Failed to load repository' });
  }
};

/**
 * Convert flat file paths into a nested tree structure for the file browser.
 * e.g. ['src/main.py', 'src/utils/helpers.py', 'README.md']
 * → { src: { main.py: ..., utils: { helpers.py: ... } }, README.md: ... }
 */
function buildTree(files: { id: number; path: string; language: string | null; sizeBytes: number }[]) {
  const tree: any = {};
  for (const f of files) {
    const parts = f.path.split('/');
    let node = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) node[parts[i]] = { __type: 'dir', children: {} };
      node = node[parts[i]].children;
    }
    const filename = parts[parts.length - 1];
    node[filename] = { __type: 'file', id: f.id, path: f.path, language: f.language, sizeBytes: f.sizeBytes };
  }
  return tree;
}

// ────────────────────────────────────────────────────────────────────────────
// GET FILE CONTENT
// ────────────────────────────────────────────────────────────────────────────

export const getFileContent = async (req: Request, res: Response) => {
  try {
    const repoId     = parseInt(String(req.params.id));
    const { path }   = req.query as { path: string };
    const requesterId = req.user?.id;

    // Verify repository exists and requester has access
    const [repo] = await db
      .select({ ownerId: repositories.ownerId, visibility: repositories.visibility })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && requesterId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    const [file] = await db
      .select()
      .from(repositoryFiles)
      .where(and(eq(repositoryFiles.repoId, repoId), eq(repositoryFiles.path, path)));

    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    res.json({ success: true, data: file });
  } catch (err) {
    logger.error('getFileContent error', err);
    res.status(500).json({ success: false, message: 'Failed to load file' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// CREATE REPOSITORY
// ────────────────────────────────────────────────────────────────────────────

export const createRepository = async (req: Request, res: Response) => {
  try {
    const ownerId = req.user!.id;
    const { name: rawName, description: rawDesc, visibility, language, topics, license } = req.body;

    // Sanitize user-supplied text fields
    const name        = sanitizeText(rawName).slice(0, 100);
    const description = sanitizeText(rawDesc).slice(0, 500);

    if (!name) {
      return res.status(400).json({ success: false, message: 'Repository name is required' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const [repo] = await db
      .insert(repositories)
      .values({ ownerId, name, slug, description, visibility, language, topics, license })
      .returning();

    // Auto-create README.md
    await db.insert(repositoryFiles).values({
      repoId:   repo.id,
      path:     'README.md',
      content:  `# ${name}\n\n${description ?? ''}\n`,
      language: 'markdown',
    });

    res.status(201).json({ success: true, data: repo });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, message: 'Repository name already taken' });
    }
    logger.error('createRepository error', err);
    res.status(500).json({ success: false, message: 'Failed to create repository' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// COMMIT FILES
// ────────────────────────────────────────────────────────────────────────────

export const createCommit = async (req: Request, res: Response) => {
  try {
    const repoId   = parseInt(String(req.params.id));
    const authorId = req.user!.id;
    const { message: rawMessage, files, branch = 'main' } = req.body;
    // files: [{ path, content, language }]
    const message = sanitizeText(rawMessage).slice(0, 500) || 'Update files';

    // Verify ownership or collaborator access
    const [repo] = await db
      .select({ ownerId: repositories.ownerId, totalCommits: repositories.totalCommits })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo || repo.ownerId !== authorId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Generate SHA from content + timestamp (simplified; real: git hash object)
    const sha = crypto
      .createHash('sha256')
      .update(`${message}${Date.now()}${authorId}`)
      .digest('hex')
      .substring(0, 40);

    let additions = 0;
    let filesChanged = 0;

    // Upsert each file
    for (const f of (files as { path: string; content: string; language?: string }[])) {
      await db
        .insert(repositoryFiles)
        .values({ repoId, path: f.path, content: f.content, language: f.language })
        .onConflictDoUpdate({
          target: [repositoryFiles.repoId, repositoryFiles.path] as any,
          set:    { content: f.content, language: f.language, updatedAt: new Date() },
        });
      additions += (f.content?.split('\n').length ?? 0);
      filesChanged++;
    }

    // Create commit record
    const [commit] = await db
      .insert(commits)
      .values({
        repoId, authorId, sha, message, branch,
        changesSummary: { filesChanged, additions, deletions: 0 },
      })
      .returning();

    // Update repo metadata
    await db
      .update(repositories)
      .set({ totalCommits: (repo.totalCommits ?? 0) + 1, updatedAt: new Date() })
      .where(eq(repositories.id, repoId));

    res.status(201).json({ success: true, data: commit });
  } catch (err) {
    logger.error('createCommit error', err);
    res.status(500).json({ success: false, message: 'Commit failed' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// ISSUES
// ────────────────────────────────────────────────────────────────────────────

export const listIssues = async (req: Request, res: Response) => {
  try {
    const repoId      = parseInt(String(req.params.id));
    const requesterId = req.user?.id;
    const { status = 'open', page = 1, limit = 30 } = req.query as { status?: string; page?: string; limit?: string };

    if (isNaN(repoId) || repoId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid repository id' });
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 30));
    const offset = (pageNum - 1) * limitNum;

    const [repo] = await db
      .select({ ownerId: repositories.ownerId, visibility: repositories.visibility })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && requesterId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(issues)
        .where(and(eq(issues.repoId, repoId), eq(issues.status, status as any)))
        .orderBy(desc(issues.createdAt))
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(issues)
        .where(and(eq(issues.repoId, repoId), eq(issues.status, status as any)))
    ]);

    const total = Number(countResult[0]?.count) || 0;

    res.json({
      success: true,
      data: {
        data: rows,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load issues' });
  }
};

export const createIssue = async (req: Request, res: Response) => {
  try {
    const repoId   = parseInt(String(req.params.id));
    const authorId = req.user!.id;
    const { title: rawTitle, body: rawBody, labels } = req.body;

    if (isNaN(repoId) || repoId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid repository id' });
    }

    const title = sanitizeText(rawTitle).slice(0, 300);
    const body  = sanitizeRichText(rawBody).slice(0, 20_000);

    if (!title) {
      return res.status(400).json({ success: false, message: 'Issue title is required' });
    }

    // Block writes on private repos the requester doesn't own
    const [repo] = await db
      .select({ ownerId: repositories.ownerId, visibility: repositories.visibility })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && authorId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    // Get next issue number for this repo
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(issues)
      .where(eq(issues.repoId, repoId));

    const [issue] = await db
      .insert(issues)
      .values({ repoId, authorId, number: (count ?? 0) + 1, title, body, labels })
      .returning();

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    logger.error('createIssue error', err);
    res.status(500).json({ success: false, message: 'Failed to create issue' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// PULL REQUESTS + AI CODE REVIEW
// ────────────────────────────────────────────────────────────────────────────

export const listPullRequests = async (req: Request, res: Response) => {
  try {
    const repoId      = parseInt(String(req.params.id));
    const requesterId = req.user?.id;
    const { page = 1, limit = 30 } = req.query as { page?: string; limit?: string };

    if (isNaN(repoId) || repoId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid repository id' });
    }

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 30));
    const offset = (pageNum - 1) * limitNum;

    const [repo] = await db
      .select({ ownerId: repositories.ownerId, visibility: repositories.visibility })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && requesterId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(pullRequests)
        .where(eq(pullRequests.repoId, repoId))
        .orderBy(desc(pullRequests.createdAt))
        .limit(limitNum)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(pullRequests)
        .where(eq(pullRequests.repoId, repoId))
    ]);

    const total = Number(countResult[0]?.count) || 0;

    res.json({
      success: true,
      data: {
        data: rows,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load pull requests' });
  }
};

export const createPullRequest = async (req: Request, res: Response) => {
  try {
    const repoId   = parseInt(String(req.params.id));
    const authorId = req.user!.id;
    const { title: rawTitle, description: rawDesc, sourceBranch, targetBranch = 'main', diffContent } = req.body;

    if (isNaN(repoId) || repoId <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid repository id' });
    }

    const title       = sanitizeText(rawTitle).slice(0, 300);
    const description = sanitizeRichText(rawDesc).slice(0, 20_000);

    if (!title) {
      return res.status(400).json({ success: false, message: 'Pull request title is required' });
    }

    const [repo] = await db
      .select({ ownerId: repositories.ownerId, visibility: repositories.visibility })
      .from(repositories)
      .where(eq(repositories.id, repoId));

    if (!repo) return res.status(404).json({ success: false, message: 'Repository not found' });

    if (repo.visibility === 'private' && authorId !== repo.ownerId) {
      return res.status(403).json({ success: false, message: 'Repository is private' });
    }

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(pullRequests)
      .where(eq(pullRequests.repoId, repoId));

    const [pr] = await db
      .insert(pullRequests)
      .values({
        repoId, authorId,
        number: (count ?? 0) + 1,
        title, description, sourceBranch, targetBranch, diffContent,
      })
      .returning();

    // Trigger AI code review asynchronously (fire-and-forget)
    if (diffContent) {
      triggerAICodeReview(pr.id, diffContent).catch((e) =>
        logger.error('AI code review failed', e),
      );
    }

    res.status(201).json({ success: true, data: pr });
  } catch (err) {
    logger.error('createPullRequest error', err);
    res.status(500).json({ success: false, message: 'Failed to create pull request' });
  }
};

export const requestAIReview = async (req: Request, res: Response) => {
  try {
    const { prId } = req.params;
    const [pr] = await db
      .select()
      .from(pullRequests)
      .where(eq(pullRequests.id, parseInt(String(prId))));

    if (!pr) return res.status(404).json({ success: false, message: 'PR not found' });

    const review = await triggerAICodeReview(pr.id, pr.diffContent ?? '');
    res.json({ success: true, data: { review } });
  } catch (err) {
    logger.error('requestAIReview error', err);
    res.status(500).json({ success: false, message: 'AI review failed' });
  }
};

async function triggerAICodeReview(prId: number, diffContent: string): Promise<string> {
  const { data } = await axios.post(`${config.aiServiceUrl}/api/v1/review/code`, {
    diff: diffContent,
    context: 'pull_request',
  });

  const review: string = data.review ?? 'No review generated.';
  const score: number  = data.score  ?? 0;

  await db
    .update(pullRequests)
    .set({ aiReview: review, aiReviewScore: score })
    .where(eq(pullRequests.id, prId));

  return review;
}

// ────────────────────────────────────────────────────────────────────────────
// STAR / UNSTAR
// ────────────────────────────────────────────────────────────────────────────

export const toggleStar = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const repoId = parseInt(String(req.params.id));

    const [existing] = await db
      .select()
      .from(repositoryStars)
      .where(and(eq(repositoryStars.userId, userId), eq(repositoryStars.repoId, repoId)));

    if (existing) {
      // Unstar
      await db
        .delete(repositoryStars)
        .where(and(eq(repositoryStars.userId, userId), eq(repositoryStars.repoId, repoId)));

      await db
        .update(repositories)
        .set({ starCount: sql`${repositories.starCount} - 1` })
        .where(eq(repositories.id, repoId));

      return res.json({ success: true, starred: false });
    }

    // Star
    await db.insert(repositoryStars).values({ userId, repoId });
    await db
      .update(repositories)
      .set({ starCount: sql`${repositories.starCount} + 1` })
      .where(eq(repositories.id, repoId));

    res.json({ success: true, starred: true });
  } catch (err) {
    logger.error('toggleStar error', err);
    res.status(500).json({ success: false, message: 'Failed to star repository' });
  }
};



