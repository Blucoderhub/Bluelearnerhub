import { Request, Response, NextFunction } from 'express';
import { HackathonService } from '@/services/hackathon';

const hackathonService = new HackathonService();

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
}
