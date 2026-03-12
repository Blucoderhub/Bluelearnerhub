import { Request, Response, NextFunction } from 'express';
import { HackathonService } from '@/services/hackathon';
import { db } from '@/db';
import { learningBehaviorEvents } from '@/db/schema-v2';
import { and, desc, eq } from 'drizzle-orm';
import logger from '@/utils/logger';
import { fetchAdaptiveGuidanceFromAI, fallbackHackathonGuidance } from '@/services/adaptiveGuidance';

const hackathonService = new HackathonService();
const isPlainObject = (value: unknown): value is Record<string, unknown> => (
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.prototype.toString.call(value) === '[object Object]'
);

export class HackathonController {
  async getHackathons(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, domain, difficulty, page = 1, limit = 10 } = req.query;
      const userId = req.user?.id;

      const filters = {
        status,
        domain,
        difficulty,
      };

      const result = await hackathonService.getHackathons(
        filters,
        parseInt(page as string),
        parseInt(limit as string),
        userId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHackathonById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const hackathon = await hackathonService.getHackathonById(parseInt(id), userId);

      res.json({
        success: true,
        data: hackathon,
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { teamId } = req.body;

      const result = await hackathonService.registerForHackathon(
        parseInt(id),
        userId,
        teamId
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { teamName } = req.body;

      const team = await hackathonService.createTeam(parseInt(id), userId, teamName);

      res.json({
        success: true,
        message: 'Team created successfully',
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  async joinTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { teamCode } = req.body;

      const result = await hackathonService.joinTeam(parseInt(id), userId, teamCode);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const { language, sourceCode, ...additionalFiles } = req.body;

      const submission = await hackathonService.submitCode(
        parseInt(id),
        userId,
        language,
        sourceCode,
        additionalFiles
      );

      res.json({
        success: true,
        message: 'Code submitted successfully',
        data: submission,
      });
    } catch (error) {
      next(error);
    }
  }

  async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { code, language, input } = req.body;

      const result = await hackathonService.runCode(parseInt(id), code, language, input);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const leaderboard = await hackathonService.getLeaderboard(parseInt(id));

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserSubmissions(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const submissions = await hackathonService.getUserSubmissions(parseInt(id), userId);

      res.json({
        success: true,
        data: submissions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPotentialMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      const matches = await hackathonService.getPotentialMatches(parseInt(id), userId);

      res.json({
        success: true,
        data: matches,
      });
    } catch (error) {
      next(error);
    }
  }

  async createBehaviorEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const hackathonId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      const { eventType, eventPayload } = req.body || {};

      if (!Number.isInteger(hackathonId) || hackathonId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid hackathon id' });
      }
      if (!eventType || typeof eventType !== 'string') {
        return res.status(400).json({ success: false, message: 'eventType is required' });
      }

      await db.insert(learningBehaviorEvents).values({
        userId,
        moduleType: 'hackathon',
        targetId: hackathonId,
        eventType: eventType.trim().slice(0, 100),
        eventPayload: isPlainObject(eventPayload) ? eventPayload : {},
      });

      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async getAdaptiveGuidance(req: Request, res: Response, next: NextFunction) {
    try {
      const hackathonId = parseInt(req.params.id, 10);
      const userId = req.user!.id;
      if (!Number.isInteger(hackathonId) || hackathonId <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid hackathon id' });
      }

      const [hackathon, userSubmissions, recentEvents] = await Promise.all([
        hackathonService.getHackathonById(hackathonId, userId),
        hackathonService.getUserSubmissions(hackathonId, userId),
        db.select({ eventType: learningBehaviorEvents.eventType, eventPayload: learningBehaviorEvents.eventPayload, createdAt: learningBehaviorEvents.createdAt })
          .from(learningBehaviorEvents)
          .where(and(
            eq(learningBehaviorEvents.userId, userId),
            eq(learningBehaviorEvents.moduleType, 'hackathon'),
            eq(learningBehaviorEvents.targetId, hackathonId),
          ))
          .orderBy(desc(learningBehaviorEvents.createdAt))
          .limit(80),
      ]);

      const submissionCount = Array.isArray(userSubmissions) ? userSubmissions.length : 0;
      const runEvents = recentEvents.filter((event) => {
        if (!event || typeof event.eventType !== 'string' || !event.eventType.trim()) return false;
        const type = event.eventType.toLowerCase();
        return type.includes('run');
      }).length;
      const errorEvents = recentEvents.filter((event) => {
        if (!event || typeof event.eventType !== 'string' || !event.eventType.trim()) return false;
        const type = event.eventType.toLowerCase();
        return type.includes('error');
      }).length;

      const snapshot = {
        isRegistered: !!hackathon?.isRegistered,
        submissionCount,
        runEvents,
        errorEvents,
      };

      const fallbackGuidance = fallbackHackathonGuidance(snapshot);

      try {
        const data = await fetchAdaptiveGuidanceFromAI('hackathon', String((req as any).requestId || 'unknown'), {
          target_id: hackathonId,
          target_title: hackathon?.title || `Hackathon ${hackathonId}`,
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
        logger.warn('hackathon adaptive guidance upstream fallback', upstreamErr);
        return res.json({
          success: true,
          guidance: fallbackGuidance,
          behaviorSummary: snapshot,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      next(error);
    }
  }
}
