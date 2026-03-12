'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Timer,
    Brain,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Trophy,
    Zap,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { quizzesAPI } from '@/lib/api-civilization';

export default function DailyQuizPage() {
    const [step, setStep] = useState<'intro' | 'active' | 'result'>('intro');
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [isLoading, setIsLoading] = useState(false);
    const [quizId, setQuizId] = useState<number | null>(null);
    const [adaptiveGuidance, setAdaptiveGuidance] = useState<string[]>([]);

    const trackQuizBehavior = (eventType: string, eventPayload?: Record<string, unknown>) => {
        if (!quizId) return;
        void quizzesAPI.trackBehavior(quizId, eventType, eventPayload).catch(() => undefined);
    };

    const fetchQuiz = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/quiz');
            const data = await res.json();
            setQuestions(data.questions);
            const parsedQuizId = Number(data?.quizId);
            const nextQuizId = Number.isInteger(parsedQuizId) && parsedQuizId > 0 ? parsedQuizId : null;
            setQuizId(nextQuizId);
            if (nextQuizId) {
                void quizzesAPI.adaptiveGuidance(nextQuizId)
                    .then((guidanceData) => {
                        const guidance = Array.isArray(guidanceData?.guidance) ? guidanceData.guidance.filter((item: unknown) => typeof item === 'string') : [];
                        setAdaptiveGuidance(guidance.slice(0, 3));
                    })
                    .catch(() => setAdaptiveGuidance([]));
            } else {
                setAdaptiveGuidance([]);
            }
            setStep('active');
        } catch (error) {
            console.error('Failed to fetch quiz');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (step === 'active' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setStep('result');
        }
    }, [step, timeLeft]);

    useEffect(() => {
        if (!quizId) return;
        trackQuizBehavior('quiz_opened', { step: 'active' });
    }, [quizId]);

    useEffect(() => {
        if (step === 'result') {
            trackQuizBehavior('quiz_completed', {
                score,
                totalQuestions: questions.length,
                accuracy: questions.length > 0 ? score / questions.length : 0,
            });
        }
    }, [step, score, questions.length]);

    const handleNext = () => {
        trackQuizBehavior('question_answered', {
            index: currentQuestionIndex,
            selectedAnswer,
        });

        if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        } else {
            setStep('result');
        }
    };

    if (step === 'intro') {
        return (
            <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
                    <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="relative max-w-md w-full text-center space-y-6 rounded-3xl border border-white/10 bg-background/50 p-8 shadow-[0_24px_90px_rgba(8,47,73,0.35)] backdrop-blur-xl"
                >
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-pulse">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black italic text-white italic tracking-tighter">DAILY <span className="text-primary ai-glow">BRAIN_HACK</span></h1>
                    <p className="text-muted-foreground">
                        5 AI-generated challenges tailored to your Level and Domain. Earn XP and protect your daily streak.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Reward</span>
                            <span className="text-xs text-foreground/70 font-black">+100 XP</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border">
                            <span className="text-xs text-muted-foreground uppercase font-bold">Time Limit</span>
                            <span className="text-xs text-foreground/70 font-black">2 Minutes</span>
                        </div>
                    </div>
                    {adaptiveGuidance.length > 0 && (
                        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-left">
                            <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-cyan-300">Adaptive Guidance</p>
                            <ul className="list-disc pl-5 text-xs text-cyan-100">
                                {adaptiveGuidance.map((tip) => (
                                    <li key={tip}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <Button
                        onClick={fetchQuiz}
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-black italic h-12 mt-4"
                    >
                        {isLoading ? 'GENERATING CHALLENGES...' : 'START CHALLENGE'}
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (step === 'active' && questions.length > 0) {
        const q = questions[currentQuestionIndex];
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

        return (
            <div className="relative max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 top-40 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-primary font-mono">{currentQuestionIndex + 1} / {questions.length}</Badge>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-mono">
                            <Timer className="w-3 h-3" />
                            <span className={timeLeft < 30 ? 'text-red-400 animate-pulse' : ''}>
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <div className="w-48">
                        <Progress value={progress} className="h-1.5 bg-secondary" />
                    </div>
                </div>

                {adaptiveGuidance.length > 0 && (
                    <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-left">
                        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-cyan-300">Adaptive Guidance</p>
                        <ul className="list-disc pl-5 text-xs text-cyan-100">
                            {adaptiveGuidance.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Card className="relative overflow-hidden border border-white/10 bg-background/55 shadow-[0_28px_80px_rgba(2,6,23,0.55)] ring-1 ring-blue-400/15 backdrop-blur-xl">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-500/10 to-transparent" />
                    <CardHeader className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px] uppercase font-black">{q.type}</Badge>
                        </div>
                        <CardTitle className="text-xl md:text-2xl text-white font-medium leading-relaxed">
                            {q.content}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {q.options.map((option: string) => (
                                <button
                                    type="button"
                                    key={option}
                                    onClick={() => setSelectedAnswer(option)}
                                    aria-pressed={selectedAnswer === option}
                                    className={`flex w-full items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 ${selectedAnswer === option
                                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                                        : 'bg-background/40 border-border hover:border-border'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedAnswer === option ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                                        }`}>
                                        {selectedAnswer === option && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <span className={`text-sm ${selectedAnswer === option ? 'text-white font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                        {option}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end p-6 bg-background/20 border-t border-border">
                        <Button
                            disabled={!selectedAnswer}
                            onClick={handleNext}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-11 font-bold rounded-full group"
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'FINISH' : 'NEXT QUESTION'}
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (step === 'result') {
        const isSuccess = score >= questions.length * 0.6;
        return (
            <div className="relative flex items-center justify-center min-h-[70vh] overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
                    <div className="absolute -right-16 bottom-4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-md w-full"
                >
                    <Card className="relative overflow-hidden border border-white/10 bg-background/70 text-center shadow-[0_28px_80px_rgba(2,6,23,0.6)] backdrop-blur-xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent" />
                        <CardHeader>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <Trophy className={`w-10 h-10 ${isSuccess ? 'text-yellow-400' : 'text-muted-foreground'}`} />
                            </div>
                            <CardTitle className="text-3xl font-black italic tracking-tighter">CHALLENGE <span className="text-primary truncate">REPORT</span></CardTitle>
                            <CardDescription>Performance assessment complete</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-card border border-border">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Score</p>
                                    <p className="text-2xl font-black text-white">{score} <span className="text-xs text-muted-foreground">/ {questions.length}</span></p>
                                </div>
                                <div className="p-4 rounded-xl bg-card border border-border">
                                    <p className="text-xs text-muted-foreground uppercase font-bold mb-1">XP Earned</p>
                                    <p className="text-2xl font-black text-foreground/70">+{score * 20}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-left">
                                <Zap className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs text-white font-bold">STREAK PROTECTED</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">You're on a 5-day winning spree!</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 p-6">
                            <Button asChild className="w-full bg-white text-black hover:bg-white/90 font-black h-12">
                                <Link href="/student/dashboard">CONTINUE TO DASHBOARD</Link>
                            </Button>
                            <Button variant="ghost" className="text-xs text-muted-foreground hover:text-white">Review Detailed Explanation</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return null;
}
