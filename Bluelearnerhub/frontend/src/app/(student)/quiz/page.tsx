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
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function DailyQuizPage() {
    const [step, setStep] = useState<'intro' | 'active' | 'result'>('intro');
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [isLoading, setIsLoading] = useState(false);

    const fetchQuiz = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/quiz');
            const data = await res.json();
            setQuestions(data.questions);
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

    const handleNext = () => {
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
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full text-center space-y-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-pulse">
                        <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black italic text-white italic tracking-tighter">DAILY <span className="text-primary ai-glow">BRAIN_HACK</span></h1>
                    <p className="text-slate-400">
                        5 AI-generated challenges tailored to your Level and Domain. Earn XP and protect your daily streak.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <span className="text-xs text-slate-500 uppercase font-bold">Reward</span>
                            <span className="text-xs text-emerald-400 font-black">+100 XP</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                            <span className="text-xs text-slate-500 uppercase font-bold">Time Limit</span>
                            <span className="text-xs text-orange-400 font-black">2 Minutes</span>
                        </div>
                    </div>
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
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-primary font-mono">{currentQuestionIndex + 1} / {questions.length}</Badge>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                            <Timer className="w-3 h-3" />
                            <span className={timeLeft < 30 ? 'text-red-400 animate-pulse' : ''}>
                                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <div className="w-48">
                        <Progress value={progress} className="h-1.5 bg-slate-800" />
                    </div>
                </div>

                <Card className="bg-slate-900/40 border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
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
                                <div
                                    key={option}
                                    onClick={() => setSelectedAnswer(option)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${selectedAnswer === option
                                        ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]'
                                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${selectedAnswer === option ? 'border-primary bg-primary text-primary-foreground' : 'border-slate-700'
                                        }`}>
                                        {selectedAnswer === option && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                    <input
                                        type="radio"
                                        className="sr-only"
                                        checked={selectedAnswer === option}
                                        onChange={() => setSelectedAnswer(option)}
                                    />
                                    <span className={`text-sm ${selectedAnswer === option ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {option}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end p-6 bg-slate-950/20 border-t border-slate-800">
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
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
                    <Card className="bg-slate-950 border-slate-800 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        <CardHeader>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <Trophy className={`w-10 h-10 ${isSuccess ? 'text-yellow-400' : 'text-slate-400'}`} />
                            </div>
                            <CardTitle className="text-3xl font-black italic tracking-tighter">CHALLENGE <span className="text-primary truncate">REPORT</span></CardTitle>
                            <CardDescription>Performance assessment complete</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Score</p>
                                    <p className="text-2xl font-black text-white">{score} <span className="text-xs text-slate-600">/ {questions.length}</span></p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">XP Earned</p>
                                    <p className="text-2xl font-black text-emerald-400">+{score * 20}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 text-left">
                                <Zap className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-xs text-white font-bold">STREAK PROTECTED</p>
                                    <p className="text-[10px] text-slate-400 uppercase">You're on a 5-day winning spree!</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 p-6">
                            <Button asChild className="w-full bg-white text-black hover:bg-white/90 font-black h-12">
                                <Link href="/student/dashboard">CONTINUE TO DASHBOARD</Link>
                            </Button>
                            <Button variant="ghost" className="text-xs text-slate-500 hover:text-white">Review Detailed Explanation</Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return null;
}
