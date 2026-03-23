'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { dailyQuizAPI } from '@/lib/api-civilization'

const DOMAINS_FALLBACK = [
  'JavaScript',
  'TypeScript',
  'Python',
  'React',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'System Design',
]

const MOCK_QUIZ = {
  domain: 'TypeScript',
  date: '2026-03-10',
  questions: [
    {
      question: 'What does the `keyof` operator return in TypeScript?',
      options: [
        'A union type of all property names of a type',
        'The keys of a JavaScript object at runtime',
        'An array of strings representing enum values',
        'A type that maps keys to boolean values',
      ],
      correctIndex: 0,
      explanation:
        '`keyof T` produces a union type of all known public property names (keys) of type T. For example, `keyof { a: number; b: string }` yields `"a" | "b"`.',
      difficulty: 'medium' as const,
    },
    {
      question: 'Which utility type makes all properties of type T optional?',
      options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T, K>'],
      correctIndex: 1,
      explanation:
        '`Partial<T>` constructs a type with all properties set to optional. `Required<T>` does the opposite, making all properties required.',
      difficulty: 'easy' as const,
    },
    {
      question: 'What is a discriminated union in TypeScript?',
      options: [
        'A union type where one member is excluded',
        'A union where each member has a common literal type property for narrowing',
        'A union that only allows primitive types',
        'A union combined with an intersection type',
      ],
      correctIndex: 1,
      explanation:
        'A discriminated union uses a shared "discriminant" property (usually a string literal) that TypeScript uses to narrow the type inside conditionals.',
      difficulty: 'medium' as const,
    },
    {
      question: 'What does `infer` do inside a conditional type?',
      options: [
        'Infers the return type of a function at runtime',
        'Declares a type variable to be inferred within the conditional branch',
        'Forces TypeScript to infer generics automatically',
        'Removes the need for explicit type annotations',
      ],
      correctIndex: 1,
      explanation:
        '`infer R` introduces a type variable R that TypeScript infers within a conditional type. E.g., `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never`.',
      difficulty: 'hard' as const,
    },
    {
      question: 'Which of the following correctly describes `never`?',
      options: [
        'It is the same as void — used when a function returns nothing',
        'It represents a type that no value can satisfy (bottom type)',
        'It represents undefined and null together',
        'It is an alias for unknown in strict mode',
      ],
      correctIndex: 1,
      explanation:
        "`never` is the bottom type — no value can be assigned to it. It's used for functions that never return (throw or infinite loop) and for exhaustive checks.",
      difficulty: 'medium' as const,
    },
  ],
}

const DIFFICULTY_COLORS = {
  easy: 'bg-muted text-foreground/70',
  medium: 'bg-blue-900/50 text-blue-400',
  hard: 'bg-purple-900/50 text-purple-400',
}

type QuizState = 'domain-select' | 'in-progress' | 'completed'

export default function DailyQuizPage() {
  const router = useRouter()
  const [state, setState] = useState<QuizState>('domain-select')
  const [selectedDomain, setDomain] = useState('TypeScript')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [chosen, setChosen] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [domains, setDomains] = useState<string[]>(DOMAINS_FALLBACK)
  const [quiz, setQuiz] = useState(MOCK_QUIZ)
  const [loadingQuiz, setLoading] = useState(false)

  useEffect(() => {
    dailyQuizAPI
      .domains()
      .then((d) => {
        if (d?.length) setDomains(d)
      })
      .catch(() => {
        /* keep fallback domain list */
      })
  }, [])

  const loadQuiz = async (domain: string) => {
    setLoading(true)
    try {
      const d = await dailyQuizAPI.getQuiz(domain)
      if (d?.questions?.length) setQuiz(d)
    } catch {
      /* keep mock */
    }
    setLoading(false)
  }
  const q = quiz.questions[current]
  const total = quiz.questions.length

  const correctCount = answers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length
  const score = Math.round((correctCount / total) * 100)

  const startQuiz = async () => {
    setAnswers([])
    setChosen(null)
    setRevealed(false)
    setCurrent(0)
    await loadQuiz(selectedDomain)
    setState('in-progress')
  }

  const handleChoose = (idx: number) => {
    if (revealed) return
    setChosen(idx)
    setRevealed(true)
    const correct = idx === q.correctIndex
    const xp = correct ? (q.difficulty === 'hard' ? 30 : q.difficulty === 'medium' ? 20 : 10) : 0
    setXpEarned((x) => x + xp)
  }

  const handleNext = () => {
    const updatedAnswers = [...answers, chosen]
    setAnswers(updatedAnswers)
    if (current + 1 >= total) {
      const finalScore = Math.round(
        (updatedAnswers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length / total) *
          100
      )
      // Persist XP to backend (fire-and-forget)
      dailyQuizAPI.submitResult(selectedDomain, finalScore, xpEarned).catch(() => {})
      setState('completed')
    } else {
      setCurrent(current + 1)
      setChosen(null)
      setRevealed(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <div className="border-b border-border bg-gradient-to-b from-card to-background px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5">
            <Zap className="h-4 w-4 text-foreground/70" />
            <span className="text-sm font-medium text-foreground/70">
              Daily Challenge · {quiz.date}
            </span>
          </div>
          <h1 className="mb-2 text-3xl font-bold">Daily Quiz</h1>
          <p className="text-sm text-gray-400">
            5 questions · AI-generated · New every day · Earn XP
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* ── Domain Select ── */}
        {state === 'domain-select' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="mb-4 text-lg font-semibold">Choose a domain</h2>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => setDomain(d)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    selectedDomain === d
                      ? 'border-primary bg-muted/20 text-foreground/70'
                      : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <Button
              onClick={startQuiz}
              disabled={loadingQuiz}
              className="h-12 w-full bg-gradient-to-r from-primary to-primary text-base font-semibold hover:opacity-90"
            >
              {loadingQuiz ? 'Loading…' : `Start ${selectedDomain} Quiz`}{' '}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── In Progress ── */}
        {state === 'in-progress' && (
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Progress */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Question {current + 1} of {total}
              </span>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Zap className="h-3.5 w-3.5" />
                {xpEarned} XP
              </div>
            </div>
            <Progress value={(current / total) * 100} className="mb-6 h-1.5" />

            <Card className="mb-4 border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold leading-relaxed text-white">
                    {q.question}
                  </h2>
                  <Badge className={`shrink-0 text-xs ${DIFFICULTY_COLORS[q.difficulty]}`}>
                    {q.difficulty}
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    let style = 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600'
                    if (revealed) {
                      if (idx === q.correctIndex)
                        style = 'border-primary bg-muted/60 text-foreground/60'
                      else if (idx === chosen) style = 'border-red-600 bg-red-900/30 text-red-300'
                      else style = 'border-gray-800 bg-gray-900/50 text-gray-600'
                    } else if (chosen === idx) {
                      style = 'border-blue-500 bg-blue-900/20 text-blue-300'
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoose(idx)}
                        disabled={revealed}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${style}`}
                      >
                        <span className="shrink-0 font-mono text-xs text-gray-500">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {revealed && idx === q.correctIndex && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground/70" />
                        )}
                        {revealed && idx === chosen && idx !== q.correctIndex && (
                          <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Explanation */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card className="mb-5 border-gray-800 bg-gray-900">
                    <CardContent className="p-4">
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Explanation
                      </p>
                      <p className="text-sm leading-relaxed text-gray-300">{q.explanation}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleNext}
              disabled={!revealed}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90"
            >
              {current + 1 >= total ? 'See Results' : 'Next Question'}{' '}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── Completed ── */}
        {state === 'completed' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary shadow-lg shadow-primary/20">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="mb-1 text-2xl font-bold">Quiz Complete!</h2>
              <p className="text-sm text-gray-400">
                You scored {correctCount}/{total} on today's {selectedDomain} quiz
              </p>
            </div>

            {/* Score card */}
            <Card className="mb-5 border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="mb-5 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-white">{score}%</p>
                    <p className="text-xs text-gray-500">Score</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground/70">{correctCount}</p>
                    <p className="text-xs text-gray-500">Correct</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground/70">+{xpEarned}</p>
                    <p className="text-xs text-gray-500">XP Earned</p>
                  </div>
                </div>

                <Progress value={score} className="mb-4 h-2" />

                {/* Per-question summary */}
                <div className="space-y-2">
                  {quiz.questions.map((question, i) => {
                    const ans = answers[i] ?? null
                    const correct = ans === question.correctIndex
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        {correct ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                        ) : (
                          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                        )}
                        <span
                          className={`text-xs leading-relaxed ${correct ? 'text-gray-300' : 'text-gray-500'}`}
                        >
                          {question.question}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setState('domain-select')
                  setXpEarned(0)
                  setAnswers([])
                }}
                variant="outline"
                className="flex-1 gap-2 border-gray-700 text-gray-300 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" /> Try Another
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90"
                onClick={() => router.push('/student/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
