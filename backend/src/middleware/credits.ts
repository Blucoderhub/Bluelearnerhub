import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { userCredits, userSubscriptions } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

export const checkCredits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.id;

        // Fetch user credits
        let credits = await db.query.userCredits.findFirst({
            where: eq(userCredits.userId, userId),
        });

        // Initialize credits if not exists (should be done on user creation, but guard here)
        if (!credits) {
            await db.insert(userCredits).values({ userId });
            credits = await db.query.userCredits.findFirst({
                where: eq(userCredits.userId, userId),
            });
        }

        if (credits!.aiTokensBalance + credits!.bonusCredits <= 0) {
            return res.status(403).json({
                message: 'Insufficient AI credits. Please upgrade to INNOVATOR tier for unlimited access.',
                code: 'INSUFFICIENT_CREDITS'
            });
        }

        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Error checking credits' });
    }
};

export const consumeCredit = async (userId: number) => {
    // Basic logic: Decrement balance, then bonus if balance is 0
    // Skip if user is on UNLIMITED tier (should be checked before calling this)
    const subscription = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, userId),
    });

    if (subscription?.tier === 'INNOVATOR' || subscription?.tier === 'ENTERPRISE') {
        return; // Unlimited
    }

    await db.update(userCredits)
        .set({
            aiTokensBalance: sql`CASE WHEN ai_tokens_balance > 0 THEN ai_tokens_balance - 1 ELSE 0 END`,
            bonusCredits: sql`CASE WHEN ai_tokens_balance = 0 AND bonus_credits > 0 THEN bonus_credits - 1 ELSE bonus_credits END`,
        })
        .where(eq(userCredits.userId, userId));
};
