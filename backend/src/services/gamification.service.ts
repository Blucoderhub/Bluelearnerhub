import { db } from '../db';
import { users, userAchievements, achievements } from '../db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';
import { redisHelpers } from '../utils/database';
import type { PgTransaction } from 'drizzle-orm/pg-core';

const LEADERBOARD_CACHE_TTL = 300; // 5 minutes

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all-time';

export class GamificationService {
    static async awardXP(userId: number, amount: number, _reason?: string) {
        return await this.addExperience(userId, amount);
    }

    static async addExperience(userId: number, amount: number) {
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        const currentXp = user[0].xp + amount;
        const currentLevel = Math.floor(Math.sqrt(currentXp / 100)) + 1;
        const now = new Date();
        const nowUtc = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        ));

        const updatedUser = await db.update(users)
            .set({
                xp: currentXp,
                level: currentLevel,
                last_active: nowUtc
            })
            .where(eq(users.id, userId))
            .returning();

        await this.checkAchievements(userId, currentXp, currentLevel);

        return updatedUser[0];
    }

    static async updateStreak(userId: number) {
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        const lastActive = new Date(user[0].last_active);
        const now = new Date();
        const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600);
        const nowUtc = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        ));

        let streak = user[0].current_streak;
        let longestStreak = user[0].longest_streak ?? 0;

        if (diffInHours >= 24 && diffInHours < 48) {
            streak += 1;
        } else if (diffInHours < 24 && diffInHours > 0) {
            // Already active today, do nothing
        } else {
            streak = 1;
        }

        if (streak > longestStreak) {
            longestStreak = streak;
        }

        return await db.update(users)
            .set({ current_streak: streak, longest_streak: longestStreak, last_active: nowUtc })
            .where(eq(users.id, userId))
            .returning();
    }

    static async checkAchievements(userId: number, xp: number, level: number) {
        if (xp > 0) {
            await this.awardAchievement(userId, 'WAKING_UP', 'Waking Up', 'First steps on the platform', 25);
        }
        if (level >= 5) {
            await this.awardAchievement(userId, 'LEVEL_5', 'Specialist', 'Reached level 5', 200);
        }
    }

    static async awardAchievement(userId: number, _code: string, title: string, description?: string, xpReward?: number) {
        return await db.transaction(async (tx: PgTransaction<any, any, any>) => {
            const existing = await tx.select()
                .from(userAchievements)
                .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
                .where(sql`${userAchievements.userId} = ${userId} AND ${achievements.title} = ${title}`);

            if (existing.length) return;

            let achievement = await tx.select().from(achievements).where(eq(achievements.title, title));
            if (!achievement.length) {
                achievement = await tx.insert(achievements).values({
                    title,
                    description: description ?? `Awarded for ${title.toLowerCase()}`,
                    xpReward: xpReward ?? 50,
                }).returning();
            }

            await tx.insert(userAchievements).values({
                userId,
                achievementId: achievement[0].id,
            });

            if (xpReward && xpReward > 0) {
                await this.addExperienceTransaction(tx, userId, xpReward);
            }
        });
    }

    private static async addExperienceTransaction(tx: PgTransaction<any, any, any>, userId: number, amount: number) {
        const user = await tx.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        const currentXp = user[0].xp + amount;
        const currentLevel = Math.floor(Math.sqrt(currentXp / 100)) + 1;
        const now = new Date();
        const nowUtc = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        ));

        return await tx.update(users)
            .set({
                xp: currentXp,
                level: currentLevel,
                last_active: nowUtc
            })
            .where(eq(users.id, userId))
            .returning();
    }

    static async getLeaderboard(limit = 10, offset = 0, period: LeaderboardPeriod = 'all-time') {
        const cacheKey = `leaderboard:${period}:${limit}:${offset}`;
        
        const cached = await redisHelpers.get(cacheKey);
        if (cached) {
            return cached;
        }

        let dateFilter = undefined;
        const now = new Date();
        const nowUtc = new Date(Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
            now.getUTCMilliseconds()
        ));

        if (period === 'weekly') {
            const weekAgo = new Date(nowUtc);
            weekAgo.setUTCDate(weekAgo.getUTCDate() - 7);
            dateFilter = gte(users.last_active, weekAgo);
        } else if (period === 'monthly') {
            const monthAgo = new Date(nowUtc);
            monthAgo.setUTCMonth(monthAgo.getUTCMonth() - 1);
            dateFilter = gte(users.last_active, monthAgo);
        }

        const condition = dateFilter ? and(dateFilter) : undefined;
        
        const rows = await db.select({
            id: users.id,
            name: users.full_name,
            xp: users.xp,
            level: users.level,
            role: users.role,
            streak: users.current_streak,
            longestStreak: users.longest_streak,
            lastActive: users.last_active,
        })
            .from(users)
            .where(condition)
            .orderBy(sql`${users.xp} DESC, ${users.last_active} ASC`)
            .limit(limit)
            .offset(offset);

        const leaderboard = rows.map((u: any, i: number) => ({
            rank: offset + i + 1,
            id: u.id,
            name: u.name,
            xp: u.xp,
            level: u.level,
            streak: u.streak ?? 0,
            longestStreak: u.longestStreak ?? 0,
        }));

        await redisHelpers.set(cacheKey, leaderboard, LEADERBOARD_CACHE_TTL);

        return leaderboard;
    }

    static async invalidateLeaderboardCache(): Promise<void> {
        await redisHelpers.clearPattern('leaderboard:*');
    }
}
