import { db } from '../db';
import { quizzes, questions, users } from '../db/schema';
import { aiService } from './ai.service';
import { eq, and } from 'drizzle-orm';
import { GamificationService } from './gamification.service';

export class QuizService {
    static async getDailyQuiz(userId: number) {
        const user = await db.select().from(users).where(eq(users.id, userId));
        if (!user.length) return null;

        // Generate quiz using AI
        const quizData = await aiService.generateQuiz(
            user[0].role === 'STUDENT' ? 'Engineering' : 'Management',
            user[0].level,
            `XP: ${user[0].xp}, Streak: ${user[0].streak}`
        );

        if (!quizData) return null;

        // Save quiz to DB
        const newQuiz = await db.insert(quizzes).values({
            moduleId: 0, // Daily quiz has no module
            title: `Daily Quiz - ${new Date().toLocaleDateString()}`,
            difficulty: user[0].level,
        }).returning();

        // Save questions
        const generatedQuestions = (quizData.questions ?? []) as Array<{
            type: string;
            content: string;
            options: unknown;
            correctAnswer: string;
        }>;

        for (const q of generatedQuestions) {
            await db.insert(questions).values({
                quizId: newQuiz[0].id,
                type: q.type,
                content: q.content,
                options: JSON.stringify(q.options),
                correctAnswer: q.correctAnswer,
            });
        }

        return { quiz: newQuiz[0], questions: generatedQuestions };
    }

    static async submitQuiz(userId: number, quizId: number, answers: any[]) {
        // Basic logic to check answers and award XP
        const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, quizId));

        let score = 0;
        quizQuestions.forEach((q: any, i: number) => {
            if (q.correctAnswer === answers[i]) {
                score += 1;
            }
        });

        const xpGained = score * 20;
        const updatedUser = await GamificationService.addExperience(userId, xpGained);
        await GamificationService.updateStreak(userId);

        return { score, xpGained, user: updatedUser };
    }
}
