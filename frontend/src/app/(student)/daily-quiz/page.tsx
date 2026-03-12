'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { dailyQuizAPI } from '@/lib/api-civilization';

const DOMAINS_FALLBACK = ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'System Design'];

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
      explanation: '`keyof T` produces a union type of all known public property names (keys) of type T. For example, `keyof { a: number; b: string }` yields `"a" | "b"`.',
      difficulty: 'medium' as const,
    },
    {
      question: 'Which utility type makes all properties of type T optional?',
      options: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T, K>'],
      correctIndex: 1,
      explanation: '`Partial<T>` constructs a type with all properties set to optional. `Required<T>` does the opposite, making all properties required.',
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
      explanation: 'A discriminated union uses a shared "discriminant" property (usually a string literal) that TypeScript uses to narrow the type inside conditionals.',
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
      explanation: '`infer R` introduces a type variable R that TypeScript infers within a conditional type. E.g., `type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never`.',
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
      explanation: '`never` is the bottom type — no value can be assigned to it. It\'s used for functions that never return (throw or infinite loop) and for exhaustive checks.',
      difficulty: 'medium' as const,
    },
  ],
};

const DIFFICULTY_COLORS = {
  easy:   'bg-muted text-foreground/70',
  medium: 'bg-blue-900/50 text-blue-400',
  hard:   'bg-purple-900/50 text-purple-400',
};

type QuizState = 'domain-select' | 'in-progress' | 'completed';

export default function DailyQuizPage() {
  const [state, setState]         = useState<QuizState>('domain-select');
  const [selectedDomain, setDomain] = useState('TypeScript');
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState<(number | null)[]>([]);
  const [chosen, setChosen]       = useState<number | null>(null);
  const [revealed, setRevealed]   = useState(false);
  const [xpEarned, setXpEarned]   = useState(0);
  const [domains, setDomains]     = useState<string[]>(DOMAINS_FALLBACK);
  const [quiz, setQuiz]           = useState(MOCK_QUIZ);
  const [loadingQuiz, setLoading] = useState(false);

  useEffect(() => {
    dailyQuizAPI.domains()
      .then((d) => { if (d.data?.length) setDomains(d.data); })
      .catch(() => {});
  }, []);

  const loadQuiz = async (domain: string) => {
    setLoading(true);
    try {
      const d = await dailyQuizAPI.getQuiz(domain);
      if (d.data?.questions?.length) setQuiz(d.data);
    } catch { /* keep mock */ }
    setLoading(false);
  };
  const q    = quiz.questions[current];
  const total = quiz.questions.length;

  const correctCount = answers.filter((a, i) => a === quiz.questions[i]?.correctIndex).length;
  const score = Math.round((correctCount / total) * 100);

  const startQuiz = async () => {
    setAnswers([]);
    setChosen(null);
    setRevealed(false);
    setCurrent(0);
    await loadQuiz(selectedDomain);
    setState('in-progress');
  };

  const handleChoose = (idx: number) => {
    if (revealed) return;
    setChosen(idx);
    setRevealed(true);
    const correct = idx === q.correctIndex;
    const xp = correct ? (q.difficulty === 'hard' ? 30 : q.difficulty === 'medium' ? 20 : 10) : 0;
    setXpEarned((x) => x + xp);
  };

  const handleNext = () => {
    setAnswers([...answers, chosen]);
    if (current + 1 >= total) {
      setState('completed');
    } else {
      setCurrent(current + 1);
      setChosen(null);
      setRevealed(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 border border-border px-4 py-1.5 mb-4">
            <Zap className="h-4 w-4 text-foreground/70" />
            <span className="text-sm font-medium text-foreground/70">Daily Challenge · {quiz.date}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Daily Quiz</h1>
          <p className="text-gray-400 text-sm">5 questions · AI-generated · New every day · Earn XP</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">

        {/* ── Domain Select ── */}
        {state === 'domain-select' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-lg font-semibold mb-4">Choose a domain</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
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
              className="w-full bg-gradient-to-r from-primary to-primary hover:opacity-90 font-semibold h-12 text-base"
            >
              {loadingQuiz ? 'Loading…' : `Start ${selectedDomain} Quiz`} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── In Progress ── */}
        {state === 'in-progress' && (
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Progress */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Question {current + 1} of {total}</span>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Zap className="h-3.5 w-3.5" />
                {xpEarned} XP
              </div>
            </div>
            <Progress value={((current) / total) * 100} className="h-1.5 mb-6" />

            <Card className="bg-gray-900 border-gray-800 mb-4">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <h2 className="text-base font-semibold text-white leading-relaxed">{q.question}</h2>
                  <Badge className={`shrink-0 text-xs ${DIFFICULTY_COLORS[q.difficulty]}`}>{q.difficulty}</Badge>
                </div>

                <div className="space-y-2.5">
                  {q.options.map((opt, idx) => {
                    let style = 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-600';
                    if (revealed) {
                      if (idx === q.correctIndex)   style = 'border-primary bg-muted/60 text-foreground/60';
                      else if (idx === chosen)       style = 'border-red-600 bg-red-900/30 text-red-300';
                      else                           style = 'border-gray-800 bg-gray-900/50 text-gray-600';
                    } else if (chosen === idx) {
                      style = 'border-blue-500 bg-blue-900/20 text-blue-300';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoose(idx)}
                        disabled={revealed}
                        className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all ${style}`}
                      >
                        <span className="text-xs font-mono text-gray-500 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {revealed && idx === q.correctIndex && <CheckCircle2 className="h-4 w-4 text-foreground/70 shrink-0" />}
                        {revealed && idx === chosen && idx !== q.correctIndex && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
                      </button>
                    );
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
                  <Card className="bg-gray-900 border-gray-800 mb-5">
                    <CardContent className="p-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Explanation</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              onClick={handleNext}
              disabled={!revealed}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-semibold"
            >
              {current + 1 >= total ? 'See Results' : 'Next Question'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}

        {/* ── Completed ── */}
        {state === 'completed' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-center mb-8">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary mb-4 shadow-lg shadow-primary/20">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
              <p className="text-gray-400 text-sm">You scored {correctCount}/{total} on today's {selectedDomain} quiz</p>
            </div>

            {/* Score card */}
            <Card className="bg-gray-900 border-gray-800 mb-5">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 text-center mb-5">
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

                <Progress value={score} className="h-2 mb-4" />

                {/* Per-question summary */}
                <div className="space-y-2">
                  {quiz.questions.map((question, i) => {
                    const ans = answers[i] ?? null;
                    const correct = ans === question.correctIndex;
                    return (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        {correct
                          ? <CheckCircle2 className="h-4 w-4 text-foreground/70 shrink-0 mt-0.5" />
                          : <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        }
                        <span className={`text-xs leading-relaxed ${correct ? 'text-gray-300' : 'text-gray-500'}`}>
                          {question.question}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={() => { setState('domain-select'); setXpEarned(0); setAnswers([]); }}
                variant="outline"
                className="flex-1 border-gray-700 text-gray-300 hover:text-white gap-2"
              >
                <RotateCcw className="h-4 w-4" /> Try Another
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-semibold"
                onClick={() => window.location.href = '/dashboard'}
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
