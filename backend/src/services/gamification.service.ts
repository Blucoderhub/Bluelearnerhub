import { db } from '../db';
import { users, userAchievements, achievements } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export class GamificationService {
    static async awardXP(userId: number, amount: number, _reason?: string) {
        return await this.addExperience(userId, amount);
    }

    static async addExperience(userId: number, amount: number) {
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        const currentXp = user[0].xp + amount;
        const currentLevel = Math.floor(Math.sqrt(currentXp / 100)) + 1;

        const updatedUser = await db.update(users)
            .set({
                xp: currentXp,
                level: currentLevel,
                lastActive: new Date()
            })
            .where(eq(users.id, userId))
            .returning();

        // Check for level-up achievements or others
        await this.checkAchievements(userId, currentXp, currentLevel);

        return updatedUser[0];
    }

    static async updateStreak(userId: number) {
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        const lastActive = new Date(user[0].lastActive);
        const now = new Date();
        const diffInHours = (now.getTime() - lastActive.getTime()) / (1000 * 3600);

        let streak = user[0].streak;
        if (diffInHours < 24 && diffInHours > 0) {
            // Already active today, do nothing or keep streak
        } else if (diffInHours >= 24 && diffInHours < 48) {
            streak += 1;
        } else {
            streak = 1; // Streak broken
        }

        return await db.update(users)
            .set({ streak, lastActive: now })
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

    static async awardAchievement(userId: number, code: string, title: string, description?: string, xpReward?: number) {
        // Check by title to avoid duplicates
        const existing = await db.select()
            .from(userAchievements)
            .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
            .where(sql`${userAchievements.userId} = ${userId} AND ${achievements.title} = ${title}`);

        if (existing.length) return;

        // Find or create achievement by title
        let achievement = await db.select().from(achievements).where(eq(achievements.title, title));
        if (!achievement.length) {
            achievement = await db.insert(achievements).values({
                title,
                description: description ?? `Awarded for ${title.toLowerCase()}`,
                xpReward: xpReward ?? 50,
            }).returning();
        }

        await db.insert(userAchievements).values({
            userId,
            achievementId: achievement[0].id,
        });
    }

    static async getLeaderboard(limit = 10) {
        return await db.select({
            id: users.id,
            name: users.fullName,
            xp: users.xp,
            level: users.level,
            role: users.role,
        })
            .from(users)
            .orderBy(sql`${users.xp} DESC`)
            .limit(limit);
    }
}
