'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
// import { QuizService } from '@/lib/api' // Assuming a service or direct API call
import {
    CheckCircle2,
    XCircle,
    ArrowRight,
    Timer,
    Trophy,
    Lightbulb,
    Sparkles
} from 'lucide-react'

// Dummy fallback data if API fails or for initial UI design
const mockQuestions = [
    {
        id: 1,
        question: "What is the primary purpose of a 'Transformer' architecture in Deep Learning?",
        options: [
            "To transform images into sounds",
            "To handle sequential data with parallel processing using Self-Attention",
            "To Transform DC current to AC current",
            "To optimize database queries"
        ],
        correctAnswer: 1,
        explanation: "Transformers rely on self-attention mechanisms to process all parts of a sequence simultaneously, making them highly efficient for NLP tasks."
    },
    {
        id: 2,
        question: "Which of the following is NOT a React Hook?",
        options: [
            "useState",
            "useEffect",
            "useContext",
            "useRender"
        ],
        correctAnswer: 3,
        explanation: "useRender is not a standard React hook. The common ones are useState, useEffect, useContext, useReducer, etc."
    }
]

export default function QuizPage() {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [isFinished, setIsFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(30)
    const [showExplanation, setShowExplanation] = useState(false)

    const currentQuestion = mockQuestions[currentQuestionIdx]

    useEffect(() => {
        if (timeLeft > 0 && !isAnswered && !isFinished) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !isAnswered) {
            handleAnswerSubmit(-1) // Timeout
        }
    }, [timeLeft, isAnswered, isFinished])

    const handleAnswerSubmit = (idx: number) => {
        if (isAnswered) return
        setSelectedOption(idx)
        setIsAnswered(true)
        if (idx === currentQuestion.correctAnswer) {
            setScore(score + 1)
        }
        setShowExplanation(true)
    }

    const nextQuestion = () => {
        if (currentQuestionIdx < mockQuestions.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1)
            setSelectedOption(null)
            setIsAnswered(false)
            setTimeLeft(30)
            setShowExplanation(false)
        } else {
            setIsFinished(true)
        }
    }

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                    <Trophy className="h-24 w-24 text-primary relative z-10" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black font-heading">Quiz Completed!</h2>
                    <p className="text-xl text-muted-foreground">You scored {score} out of {mockQuestions.length}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="bg-card border border-border/50 p-6 rounded-3xl text-center">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accuracy</p>
                        <p className="text-3xl font-black text-primary">{Math.round((score / mockQuestions.length) * 100)}%</p>
                    </div>
                    <div className="bg-card border border-border/50 p-6 rounded-3xl text-center">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">XP Gained</p>
                        <p className="text-3xl font-black text-primary">+{score * 50}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold" onClick={() => window.location.reload()}>
                        Try Another Quiz
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-4">
            {/* Quiz Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> AI Generated Quiz
                    </h3>
                    <p className="text-2xl font-black font-heading">Advanced Machine Learning</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                        <Timer className={`h-5 w-5 ${timeLeft < 10 ? 'text-destructive animate-pulse' : 'text-primary'}`} />
                        <span className="font-mono font-bold text-lg">{timeLeft}s</span>
                    </div>
                    <div className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl">
                        {currentQuestionIdx + 1} / {mockQuestions.length}
                    </div>
                </div>
            </div>

            <Progress value={((currentQuestionIdx + 1) / mockQuestions.length) * 100} className="h-2 bg-muted border-none" />

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-card border border-border/50 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Lightbulb className="h-32 w-32" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold font-heading leading-tight relative z-10">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 gap-4 mt-12 relative z-10">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedOption === idx
                            const isCorrect = idx === currentQuestion.correctAnswer

                            let variantClasses = "border-border/50 hover:border-primary/50 hover:bg-primary/5"
                            if (isAnswered) {
                                if (isCorrect) variantClasses = "border-green-500 bg-green-500/10 text-green-400"
                                else if (isSelected) variantClasses = "border-red-500 bg-red-500/10 text-red-400"
                                else variantClasses = "opacity-50 border-border/20"
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={isAnswered}
                                    onClick={() => handleAnswerSubmit(idx)}
                                    className={`flex items-center justify-between p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${variantClasses}`}
                                >
                                    <span className="text-lg font-semibold">{option}</span>
                                    {isAnswered && isCorrect && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                                    {isAnswered && isSelected && !isCorrect && <XCircle className="h-6 w-6 text-red-500" />}
                                </button>
                            )
                        })}
                    </div>

                    <AnimatePresence>
                        {showExplanation && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-2xl"
                            >
                                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Explanation</p>
                                <p className="text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-end pt-4">
                <Button
                    disabled={!isAnswered}
                    onClick={nextQuestion}
                    size="lg"
                    className="rounded-2xl px-10 h-14 text-lg font-bold gap-2 group shadow-xl shadow-primary/20"
                >
                    {currentQuestionIdx === mockQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>
        </div>
    )
}
