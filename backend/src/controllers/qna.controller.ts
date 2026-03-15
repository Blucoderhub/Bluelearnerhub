/**
 * Q&A Knowledge Network Controller
 * =================================
 * StackOverflow-style community knowledge system.
 *
 * Routes:
 *   GET  /api/qna/questions              — list questions
 *   GET  /api/qna/questions/search       — semantic search
 *   GET  /api/qna/questions/:id          — question + answers
 *   POST /api/qna/questions              — ask question
 *   POST /api/qna/questions/:id/answers  — post answer
 *   POST /api/qna/votes                  — up/downvote
 *   POST /api/qna/questions/:id/accept/:answerId — accept answer
 *   GET  /api/qna/tags                   — browse tags
 */

import { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { db } from '../db';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  qnaQuestions, qnaAnswers, qnaVotes, tags,
  qnaQuestionTags, userReputation,
} from '../db/schema-v2';
import { users } from '../db/schema';
import { GamificationService } from '../services/gamification.service';
import { config } from '../config';
import logger from '../utils/logger';

// ────────────────────────────────────────────────────────────────────────────
// REPUTATION HELPERS
// ────────────────────────────────────────────────────────────────────────────

const REPUTATION_EVENTS = {
  ASK_QUESTION:     5,
  ANSWER_UPVOTED:   10,
  ANSWER_ACCEPTED:  25,
  QUESTION_UPVOTED: 5,
} as const;

async function adjustReputation(userId: number, delta: number) {
  await db
    .insert(userReputation)
    .values({ userId, points: delta })
    .onConflictDoUpdate({
      target: userReputation.userId,
      set:    { points: sql`${userReputation.points} + ${delta}`, updatedAt: new Date() },
    });
}

function computeRank(points: number): string {
  if (points >= 5000) return 'Platform Authority';
  if (points >= 1000) return 'Domain Expert';
  if (points >= 500)  return 'Domain Helper';
  if (points >= 100)  return 'Contributing Member';
  return 'Curious Learner';
}

// ────────────────────────────────────────────────────────────────────────────
// LIST QUESTIONS
// ────────────────────────────────────────────────────────────────────────────

export const listQuestions = async (req: Request, res: Response) => {
  try {
    const { domain, tag, sort = 'recent', page = '1', limit = '20' } = req.query as Record<string, string>;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const rows = await db
      .select({
        id:          qnaQuestions.id,
        title:       qnaQuestions.title,
        domain:      qnaQuestions.domain,
        voteScore:   qnaQuestions.voteScore,
        answerCount: qnaQuestions.answerCount,
        viewCount:   qnaQuestions.viewCount,
        isAnswered:  qnaQuestions.isAnswered,
        createdAt:   qnaQuestions.createdAt,
        authorName:  users.fullName,
        authorId:    users.id,
      })
      .from(qnaQuestions)
      .leftJoin(users, eq(qnaQuestions.authorId, users.id))
      .orderBy(sort === 'votes' ? desc(qnaQuestions.voteScore) : desc(qnaQuestions.createdAt))
      .limit(parseInt(limit))
      .offset(offset);

    res.json({ success: true, data: rows, page: parseInt(page) });
  } catch (err) {
    logger.error('listQuestions error', err);
    res.status(500).json({ success: false, message: 'Failed to list questions' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// SEMANTIC SEARCH
// ────────────────────────────────────────────────────────────────────────────

export const searchQuestions = async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q: string };
    if (!q?.trim()) return res.json({ success: true, data: [] });

    const { data } = await axios.post(`${config.aiServiceUrl}/api/v1/search/semantic`, {
      query: q,
      content_type: 'qna_question',
      top_k: 10,
    });

    res.json({ success: true, data: data.results });
  } catch (err) {
    logger.error('searchQuestions error', err);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// GET QUESTION + ANSWERS
// ────────────────────────────────────────────────────────────────────────────

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [question] = await db
      .select({ q: qnaQuestions, authorName: users.fullName })
      .from(qnaQuestions)
      .leftJoin(users, eq(qnaQuestions.authorId, users.id))
      .where(eq(qnaQuestions.id, parseInt(id)));

    if (!question) return res.status(404).json({ success: false, message: 'Not found' });

    const answers = await db
      .select({
        a:          qnaAnswers,
        authorName: users.fullName,
        authorId:   users.id,
      })
      .from(qnaAnswers)
      .leftJoin(users, eq(qnaAnswers.authorId, users.id))
      .where(eq(qnaAnswers.questionId, parseInt(id)))
      .orderBy(desc(qnaAnswers.isAccepted), desc(qnaAnswers.voteScore));

    // Increment view count
    db.update(qnaQuestions)
      .set({ viewCount: (question.q.viewCount ?? 0) + 1 })
      .where(eq(qnaQuestions.id, parseInt(id)))
      .catch(() => {});

    res.json({
      success: true,
      data:    { ...question.q, authorName: question.authorName, answers },
    });
  } catch (err) {
    logger.error('getQuestion error', err);
    res.status(500).json({ success: false, message: 'Failed to load question' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// ASK A QUESTION
// ────────────────────────────────────────────────────────────────────────────

export const askQuestion = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, body, domain, tagNames } = req.body;

    // 1. Check for semantic duplicates before publishing
    let duplicates: any[] = [];
    try {
      const { data } = await axios.post(`${config.aiServiceUrl}/api/v1/search/semantic`, {
        query: `${title} ${body}`,
        content_type: 'qna_question',
        top_k: 3,
        similarity_threshold: 0.92,   // Only surface near-exact duplicates
      });
      duplicates = data.results ?? [];
    } catch {
      // Semantic check is best-effort; proceed even if AI service is down
    }

    if (duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Similar questions already exist',
        duplicates,
      });
    }

    // 2. Create question
    const [created] = await db
      .insert(qnaQuestions)
      .values({ authorId: userId, title, body, domain })
      .returning();

    // 3. Create / associate tags
    if (Array.isArray(tagNames) && tagNames.length > 0) {
      for (const name of tagNames.slice(0, 5)) {
        const slug = name.toLowerCase().replace(/\s+/g, '-');

        // Upsert tag
        const [tag] = await db
          .insert(tags)
          .values({ name, slug })
          .onConflictDoUpdate({ target: tags.slug, set: { usageCount: sql`${tags.usageCount} + 1` } })
          .returning({ id: tags.id });

        await db
          .insert(qnaQuestionTags)
          .values({ questionId: created.id, tagId: tag.id })
          .onConflictDoNothing();
      }
    }

    // 4. Reputation + XP for asking
    await adjustReputation(userId, REPUTATION_EVENTS.ASK_QUESTION);
    await GamificationService.awardXP(userId, 5, 'QUESTION_ASKED');

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    logger.error('askQuestion error', err);
    res.status(500).json({ success: false, message: 'Failed to post question' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// POST AN ANSWER
// ────────────────────────────────────────────────────────────────────────────

export const postAnswer = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const questionId = parseInt(req.params.id);
    const { body }   = req.body;

    const [answer] = await db
      .insert(qnaAnswers)
      .values({ questionId, authorId: userId, body })
      .returning();

    // Increment answer count on question
    await db
      .update(qnaQuestions)
      .set({ answerCount: sql`${qnaQuestions.answerCount} + 1` })
      .where(eq(qnaQuestions.id, questionId));

    await GamificationService.awardXP(userId, 10, 'ANSWER_POSTED');

    res.status(201).json({ success: true, data: answer });
  } catch (err) {
    logger.error('postAnswer error', err);
    res.status(500).json({ success: false, message: 'Failed to post answer' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// VOTE
// ────────────────────────────────────────────────────────────────────────────

export const castVote = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { targetType, targetId, vote } = req.body;  // vote: 'up' | 'down'

    if (!['question', 'answer'].includes(targetType)) {
      return res.status(400).json({ success: false, message: 'Invalid target type' });
    }

    // Upsert vote
    await db
      .insert(qnaVotes)
      .values({ userId, targetType, targetId, vote })
      .onConflictDoUpdate({
        target: [qnaVotes.userId, qnaVotes.targetType, qnaVotes.targetId] as any,
        set:    { vote },
      });

    const delta = vote === 'up' ? 1 : -1;

    if (targetType === 'question') {
      const [q] = await db
        .update(qnaQuestions)
        .set({ voteScore: sql`${qnaQuestions.voteScore} + ${delta}` })
        .where(eq(qnaQuestions.id, targetId))
        .returning({ authorId: qnaQuestions.authorId });

      if (vote === 'up' && q?.authorId) {
        await adjustReputation(q.authorId, REPUTATION_EVENTS.QUESTION_UPVOTED);
      }
    } else {
      const [a] = await db
        .update(qnaAnswers)
        .set({ voteScore: sql`${qnaAnswers.voteScore} + ${delta}` })
        .where(eq(qnaAnswers.id, targetId))
        .returning({ authorId: qnaAnswers.authorId });

      if (vote === 'up' && a?.authorId) {
        await adjustReputation(a.authorId, REPUTATION_EVENTS.ANSWER_UPVOTED);
      }
    }

    res.json({ success: true });
  } catch (err) {
    logger.error('castVote error', err);
    res.status(500).json({ success: false, message: 'Vote failed' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// ACCEPT ANSWER
// ────────────────────────────────────────────────────────────────────────────

export const acceptAnswer = async (req: Request, res: Response) => {
  try {
    const userId     = req.user!.id;
    const questionId = parseInt(req.params.id);
    const answerId   = parseInt(req.params.answerId);

    const [question] = await db
      .select()
      .from(qnaQuestions)
      .where(eq(qnaQuestions.id, questionId));

    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
    if (question.authorId !== userId) {
      return res.status(403).json({ success: false, message: 'Only the question author can accept an answer' });
    }

    // Clear any previous acceptance
    await db
      .update(qnaAnswers)
      .set({ isAccepted: false })
      .where(eq(qnaAnswers.questionId, questionId));

    // Accept the chosen answer
    const [answer] = await db
      .update(qnaAnswers)
      .set({ isAccepted: true })
      .where(eq(qnaAnswers.id, answerId))
      .returning({ authorId: qnaAnswers.authorId });

    // Mark question as answered
    await db
      .update(qnaQuestions)
      .set({ isAnswered: true, acceptedAnswerId: answerId })
      .where(eq(qnaQuestions.id, questionId));

    // Reward answerer
    if (answer?.authorId) {
      await adjustReputation(answer.authorId, REPUTATION_EVENTS.ANSWER_ACCEPTED);
      await GamificationService.awardXP(answer.authorId, 25, 'ANSWER_ACCEPTED');
    }

    res.json({ success: true });
  } catch (err) {
    logger.error('acceptAnswer error', err);
    res.status(500).json({ success: false, message: 'Failed to accept answer' });
  }
};

// ────────────────────────────────────────────────────────────────────────────
// TAGS
// ────────────────────────────────────────────────────────────────────────────

export const listTags = async (req: Request, res: Response) => {
  try {
    const { domain } = req.query as { domain?: string };
    const rows = await db
      .select()
      .from(tags)
      .where(domain ? eq(tags.domain, domain) : undefined)
      .orderBy(desc(tags.usageCount))
      .limit(100);

    res.json({ success: true, data: rows });
  } catch (err) {
    logger.error('listTags error', err);
    res.status(500).json({ success: false, message: 'Failed to load tags' });
  }
};
