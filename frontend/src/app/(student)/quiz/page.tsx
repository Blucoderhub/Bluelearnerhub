'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer, Brain, CheckCircle2, XCircle, Trophy, Zap,
  ChevronRight, ChevronLeft, RotateCcw, Sparkles,
  BookOpen, Target, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const MOCK_QUESTIONS = [
  {
    id: 1,
    type: 'Multiple Choice',
    content: 'Which data structure is used in Breadth-First Search (BFS)?',
    options: ['Stack', 'Queue', 'Heap', 'Linked List'],
    correctAnswer: 'Queue',
    explanation: 'BFS uses a Queue (FIFO) to explore nodes level by level, ensuring all neighbors at the current depth are visited before moving deeper.',
    difficulty: 'Easy',
    topic: 'Data Structures',
    xp: 20,
  },
  {
    id: 2,
    type: 'Multiple Choice',
    content: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search divides the search space in half with each step, resulting in O(log n) time complexity.',
    difficulty: 'Easy',
    topic: 'Algorithms',
    xp: 20,
  },
  {
    id: 3,
    type: 'Multiple Choice',
    content: 'Which Python keyword is used to handle exceptions?',
    options: ['catch', 'except', 'error', 'handle'],
    correctAnswer: 'except',
    explanation: 'Python uses try/except blocks for exception handling, unlike Java/C++ which use try/catch.',
    difficulty: 'Easy',
    topic: 'Python',
    xp: 15,
  },
  {
    id: 4,
    type: 'Multiple Choice',
    content: 'In a hash table, what happens when two keys hash to the same index?',
    options: ['The second key overwrites the first', 'A collision occurs', 'The hash table expands automatically', 'An error is thrown'],
    correctAnswer: 'A collision occurs',
    explanation: 'A collision occurs when two keys produce the same hash. Common resolution techniques include chaining and open addressing.',
    difficulty: 'Medium',
    topic: 'Data Structures',
    xp: 30,
  },
  {
    id: 5,
    type: 'Multiple Choice',
    content: 'What is the output of: print(type([])) in Python?',
    options: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "list"],
    correctAnswer: "<class 'list'>",
    explanation: "Python's type() function returns the class of an object. An empty [] is a list, so it returns <class 'list'>.",
    difficulty: 'Easy',
    topic: 'Python',
    xp: 15,
  },
];

type Step = 'intro' | 'quiz' | 'review' | 'result';

const difficultyColors: Record<string, string> = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const LETTER_OPTIONS = ['A', 'B', 'C', 'D'];

export default function QuizPage() {
  const [step, setStep] = useState<Step>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(Array(MOCK_QUESTIONS.length).fill(null));
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [reviewIndex, setReviewIndex] = useState(0);

  const q = MOCK_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / MOCK_QUESTIONS.length) * 100;
  const score = answers.filter((a, i) => a === MOCK_QUESTIONS[i].correctAnswer).length;
  const totalXP = answers.reduce((acc, a, i) => a === MOCK_QUESTIONS[i].correctAnswer ? acc + MOCK_QUESTIONS[i].xp : acc, 0);

  useEffect(() => {
    if (step !== 'quiz') return;
    if (timeLeft <= 0) { setStep('result'); return; }
    const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(t);
  }, [step, timeLeft]);

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
  };

  const handleConfirm = useCallback(() => {
    if (!selectedAnswer) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);
  }, [selectedAnswer, answers, currentIndex]);

  const handleNext = useCallback(() => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setStep('result');
    }
  }, [currentIndex]);

  const isCorrect = selectedAnswer === q?.correctAnswer;

  // ── INTRO ──
  if (step === 'intro') {
    return (
      <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-md w-full space-y-8 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Brain className="w-12 h-12 text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black font-heading tracking-tight text-white">Practice Quiz</h1>
            <p className="text-muted-foreground">
              {MOCK_QUESTIONS.length} questions · AI-curated for your skill level · Earn XP for correct answers
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { icon: Target, label: 'Questions', value: `${MOCK_QUESTIONS.length} MCQs` },
              { icon: Timer, label: 'Time Limit', value: '2 Minutes' },
              { icon: Zap, label: 'XP Reward', value: '+100 XP max' },
              { icon: BookOpen, label: 'Topics', value: 'DSA · Python' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{label}</p>
                  <p className="text-sm font-bold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setStep('quiz')}
            className="w-full h-13 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-base gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Quiz
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── QUIZ ──
  if (step === 'quiz') {
    return (
      <div className="relative max-w-3xl mx-auto space-y-6 pb-20">
        {/* Ambient */}
        <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-blue-500/8 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-40 h-56 w-56 rounded-full bg-primary/8 blur-3xl" />

        {/* Progress bar header */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-md py-4 z-10 space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="border-border text-foreground/80 font-mono text-xs">
              {currentIndex + 1} / {MOCK_QUESTIONS.length}
            </Badge>

            <div className={`flex items-center gap-2 text-sm font-mono font-bold px-3 py-1.5 rounded-xl border ${
              timeLeft < 30 ? 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse' : 'text-foreground/70 border-border'
            }`}>
              <Timer className="w-4 h-4" />
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </div>

            <Badge className={`text-[10px] border ${difficultyColors[q.difficulty]}`}>
              {q.difficulty}
            </Badge>
          </div>

          <Progress value={progress} className="h-1.5 bg-muted/40" />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {/* Topic + question */}
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card/50 relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-2xl" />
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] font-bold uppercase">
                  {q.topic}
                </Badge>
                <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                  {q.type}
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                {q.content}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, idx) => {
                const letter = LETTER_OPTIONS[idx];
                const isSelected = selectedAnswer === option;
                const isAnswerCorrect = option === q.correctAnswer;

                let variant = 'default';
                if (showFeedback) {
                  if (isAnswerCorrect) variant = 'correct';
                  else if (isSelected && !isAnswerCorrect) variant = 'wrong';
                }

                return (
                  <motion.button
                    key={option}
                    onClick={() => handleSelect(option)}
                    whileHover={!showFeedback ? { scale: 1.01 } : {}}
                    whileTap={!showFeedback ? { scale: 0.99 } : {}}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      variant === 'correct'
                        ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                        : variant === 'wrong'
                        ? 'bg-red-500/10 border-red-500/40'
                        : isSelected
                        ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(var(--primary),0.12)]'
                        : 'bg-card/40 border-border hover:border-border/80 hover:bg-card/70'
                    } ${showFeedback ? 'cursor-default' : ''}`}
                  >
                    {/* Letter bubble */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 transition-colors ${
                      variant === 'correct'
                        ? 'bg-emerald-500 text-white'
                        : variant === 'wrong'
                        ? 'bg-red-500 text-white'
                        : isSelected
                        ? 'bg-primary text-white'
                        : 'bg-muted/50 text-muted-foreground border border-border'
                    }`}>
                      {showFeedback && variant === 'correct' ? <CheckCircle2 className="w-5 h-5" /> :
                       showFeedback && variant === 'wrong' ? <XCircle className="w-5 h-5" /> : letter}
                    </div>

                    <span className={`text-sm leading-snug font-medium flex-1 ${
                      variant === 'correct' ? 'text-emerald-300' :
                      variant === 'wrong' ? 'text-red-300' :
                      isSelected ? 'text-white' : 'text-foreground/80'
                    }`}>
                      {option}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback explanation */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-5 rounded-2xl border ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <XCircle className="w-4 h-4 text-red-400" />
                    }
                    <span className={`text-sm font-bold ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isCorrect ? `Correct! +${q.xp} XP` : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setSelectedAnswer(answers[currentIndex - 1]); setShowFeedback(false); }}}
                disabled={currentIndex === 0}
                className="gap-2 text-muted-foreground hover:text-white rounded-xl"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              {!showFeedback ? (
                <Button
                  onClick={handleConfirm}
                  disabled={!selectedAnswer}
                  className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 h-11 gap-2"
                >
                  Confirm Answer
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8 h-11 gap-2"
                >
                  {currentIndex === MOCK_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── RESULT ──
  if (step === 'result') {
    const percentage = Math.round((score / MOCK_QUESTIONS.length) * 100);
    const isGreat = percentage >= 80;

    return (
      <div className="relative flex items-center justify-center min-h-[80vh] overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/15 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full space-y-6"
        >
          {/* Score card */}
          <div className="relative p-8 rounded-3xl border border-border bg-card/60 backdrop-blur-md text-center overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

            <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Trophy className={`w-12 h-12 ${isGreat ? 'text-amber-400' : 'text-muted-foreground'}`} />
            </div>

            <h1 className="text-4xl font-black font-heading tracking-tight text-white mb-1">
              {isGreat ? 'Outstanding!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
            </h1>
            <p className="text-muted-foreground text-sm mb-6">Quiz complete</p>

            <div className="text-6xl font-black text-white mb-2">{percentage}%</div>
            <p className="text-sm text-muted-foreground mb-6">{score} of {MOCK_QUESTIONS.length} correct</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-background/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">XP Earned</p>
                <p className="text-2xl font-black text-amber-400">+{totalXP}</p>
              </div>
              <div className="p-4 rounded-2xl bg-background/50 border border-border">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Accuracy</p>
                <p className="text-2xl font-black text-white">{percentage}%</p>
              </div>
            </div>

            {/* Streak badge */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
              <Zap className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Streak Protected</p>
                <p className="text-[10px] text-muted-foreground">You're on a 5-day streak!</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button onClick={() => setStep('review')} variant="outline" className="border-border rounded-2xl h-12 font-bold gap-2">
              <BookOpen className="w-4 h-4" />
              Review Answers
            </Button>
            <Button onClick={() => { setStep('intro'); setCurrentIndex(0); setAnswers(Array(MOCK_QUESTIONS.length).fill(null)); setTimeLeft(120); }} className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 font-bold gap-2">
              <RotateCcw className="w-4 h-4" />
              Retry Quiz
            </Button>
            <Link href="/student/dashboard">
              <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-white rounded-2xl gap-2">
                Back to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── REVIEW ──
  if (step === 'review') {
    const rq = MOCK_QUESTIONS[reviewIndex];
    const userAnswer = answers[reviewIndex];
    const isRight = userAnswer === rq.correctAnswer;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Answer Review</h2>
          <Button variant="ghost" onClick={() => setStep('result')} className="text-muted-foreground hover:text-white text-sm">
            Back to Results
          </Button>
        </div>

        {/* Review navigation */}
        <div className="flex gap-2 flex-wrap">
          {MOCK_QUESTIONS.map((_, i) => {
            const a = answers[i];
            const correct = a === MOCK_QUESTIONS[i].correctAnswer;
            return (
              <button
                key={i}
                onClick={() => setReviewIndex(i)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  reviewIndex === i ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                } ${!a ? 'bg-muted border border-border text-muted-foreground' :
                   correct ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <motion.div
          key={reviewIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
            <div className="flex items-center gap-2">
              {isRight
                ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                : <XCircle className="w-5 h-5 text-red-400" />
              }
              <Badge className={`text-[10px] border ${difficultyColors[rq.difficulty]}`}>{rq.difficulty}</Badge>
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">{rq.topic}</Badge>
            </div>
            <h3 className="text-lg font-semibold text-white">{rq.content}</h3>
          </div>

          <div className="space-y-3">
            {rq.options.map((option, idx) => {
              const isUserAnswer = userAnswer === option;
              const isCorrectOption = option === rq.correctAnswer;
              return (
                <div key={option} className={`flex items-center gap-4 p-4 rounded-2xl border ${
                  isCorrectOption ? 'bg-emerald-500/10 border-emerald-500/30' :
                  isUserAnswer && !isCorrectOption ? 'bg-red-500/10 border-red-500/30' :
                  'bg-card/30 border-border'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    isCorrectOption ? 'bg-emerald-500 text-white' :
                    isUserAnswer ? 'bg-red-500 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {LETTER_OPTIONS[idx]}
                  </div>
                  <span className={`text-sm flex-1 ${
                    isCorrectOption ? 'text-emerald-300 font-medium' :
                    isUserAnswer ? 'text-red-300' : 'text-muted-foreground'
                  }`}>{option}</span>
                  {isCorrectOption && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Correct</Badge>}
                  {isUserAnswer && !isCorrectOption && <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">Your answer</Badge>}
                </div>
              );
            })}
          </div>

          <div className="p-5 rounded-2xl bg-blue-500/8 border border-blue-500/20 space-y-2">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Explanation</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{rq.explanation}</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setReviewIndex(Math.max(0, reviewIndex - 1))}
              disabled={reviewIndex === 0}
              variant="outline"
              className="flex-1 border-border rounded-xl gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>
            <Button
              onClick={() => reviewIndex < MOCK_QUESTIONS.length - 1 ? setReviewIndex(reviewIndex + 1) : setStep('result')}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl gap-2"
            >
              {reviewIndex < MOCK_QUESTIONS.length - 1 ? 'Next' : 'Done'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
