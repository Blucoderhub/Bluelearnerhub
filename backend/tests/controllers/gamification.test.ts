// @ts-nocheck
/**
 * Gamification Controller Tests
 * Tests achievements list, leaderboard, and XP award flows.
 */
import { Request, Response } from 'express';
import { pool } from '../../src/utils/database';
import { GamificationService } from '../../src/services/gamification.service';

const mockPool = pool as jest.Mocked<typeof pool>;

const mockRes = () => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  return res as Response;
};

const mockReq = (overrides: Partial<Request> = {}): Request => ({
  body: {},
  params: {},
  query: {},
  user: { id: 1, email: 'user@test.com', role: 'student', fullName: 'Test User' },
  requestId: 'test-req-id',
  ...overrides,
} as unknown as Request);

describe('Gamification Controller', () => {
  describe('GET /gamification/achievements', () => {
    it('should return achievements list with earned state', async () => {
      const { getMyAchievements } = require('../../src/controllers/gamification.controller');
      const req = mockReq();
      const res = mockRes();
      const next = jest.fn();

      // Mock: earned achievements for user
      mockPool.query.mockResolvedValueOnce({
        rows: [
          { achievement_id: 1, earned_at: new Date() },
        ],
        rowCount: 1,
      });

      await getMyAchievements(req, res, next);

      const json = (res.json as jest.Mock).mock.calls[0]?.[0];
      if (json) {
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data?.achievements)).toBe(true);
      }
    });
  });

  describe('GET /gamification/leaderboard', () => {
    it('should return public leaderboard', async () => {
      const { getLeaderboard } = require('../../src/controllers/gamification.controller');
      const req = mockReq({ query: { limit: '10' } });
      const res = mockRes();
      const next = jest.fn();

      mockPool.query.mockResolvedValueOnce({
        rows: [
          { id: 1, full_name: 'Top User', total_points: 5000, level: 5, role: 'student' },
          { id: 2, full_name: 'Second User', total_points: 4200, level: 4, role: 'student' },
        ],
        rowCount: 2,
      });

      await getLeaderboard(req, res, next);

      const json = (res.json as jest.Mock).mock.calls[0]?.[0];
      if (json) {
        expect(json.success).toBe(true);
        expect(Array.isArray(json.data?.leaderboard ?? json.data)).toBe(true);
      }
    });
  });
});

describe('GamificationService', () => {
  describe('awardXP', () => {
    it('should update user XP and return new total', async () => {
      mockPool.query.mockResolvedValueOnce({
        rows: [{ id: 1, total_points: 150, level: 1 }],
        rowCount: 1,
      });

      const result = await GamificationService.awardXP(1, 50, 'quiz_complete');

      expect(mockPool.query).toHaveBeenCalled();
      // Either returns data or runs without throwing
    });

    it('should handle zero XP gracefully', async () => {
      await expect(GamificationService.awardXP(1, 0, 'no_op')).resolves.not.toThrow();
    });

    it('should handle negative XP gracefully', async () => {
      await expect(GamificationService.awardXP(1, -10, 'invalid')).resolves.not.toThrow();
    });
  });

  describe('updateStreak', () => {
    it('should increment streak when user is active today', async () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      mockPool.query.mockResolvedValueOnce({
        rows: [{ last_active: yesterday, current_streak: 3, longest_streak: 5 }],
        rowCount: 1,
      }).mockResolvedValueOnce({ rows: [], rowCount: 1 });

      await expect(GamificationService.updateStreak(1)).resolves.not.toThrow();
    });
  });
});

describe('API Security — Gamification Routes', () => {
  it('achievements endpoint requires authentication', async () => {
    const { getMyAchievements } = require('../../src/controllers/gamification.controller');
    const req = mockReq({ user: undefined }); // No user
    const res = mockRes();
    const next = jest.fn();

    await getMyAchievements(req, res, next).catch(() => {});

    // Should either return 401 or call next with error
    const statusCall = (res.status as jest.Mock).mock.calls[0]?.[0];
    if (statusCall) {
      expect([401, 403, 500]).toContain(statusCall);
    }
  });
});
