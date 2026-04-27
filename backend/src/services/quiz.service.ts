import { db } from '../db';
import mongoose from 'mongoose';

export class QuizService {
    static async getDailyQuiz(userId: string) {
        const user = await db.query.users.findFirst({ _id: userId });
        if (!user) return null;

        // Create a simple quiz
        const newQuiz = await db.query.quizzes.create({
            title: `Daily Quiz - ${new Date().toLocaleDateString()}`,
            description: 'Daily challenge',
            category: 'daily',
            difficulty: 'EASY',
            createdBy: new mongoose.Types.ObjectId(userId),
            createdAt: new Date(),
        });

        return { quiz: newQuiz, questions: [] };
    }

    static async submitQuiz(userId: string, quizId: string, answers: any[]) {
        await db.query.quizAttempts.create({
            quizId: new mongoose.Types.ObjectId(quizId),
            userId: new mongoose.Types.ObjectId(userId),
            score: 0,
            totalQuestions: answers.length,
            answers: answers.map((a, i) => ({ questionId: i.toString(), selectedIndex: a, correct: false })),
            startedAt: new Date(),
        });

        return { score: 0, xpGained: 0 };
    }
}
