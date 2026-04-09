'use client'

import { useState, useMemo, useEffect, lazy, Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { BookOpen, Code2, Trophy, Target, Zap, Flame, Award, ArrowRight, CheckCircle2, Circle, Play, Users, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { OnboardingTour, useOnboarding } from '@/components/onboarding/OnboardingTour'

// Lazy load heavy components
const XPProgressBar = lazy(() => import('@/components/gamification/XPProgressBar').then(m => ({ default: m.XPProgressBar })))
const Confetti = lazy(() => import('@/components/animations/Confetti'))

// ─── Loading States ─────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-40 rounded-3xl bg-card" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-3xl bg-card" />
        ))}
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 h-64 rounded-3xl bg-card" />
        <div className="h-64 rounded-3xl bg-card" />
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: typeof BookOpen
  title: string
  description: string
  action: () => void
  actionLabel: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>
      <Button onClick={action} className="gap-2">
        {actionLabel} <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

// ─── Progress Ring ────────────────────────────────────────────────────────────────
function ProgressRing({ progress, size = 80, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth={strokeWidth} fill="none" className="text-border" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-1000"
      />
    </svg>
  )
}

// ─── Onboarding Checklist ─────────────────────────────────────────────────────────
const onboardingSteps = [
  { id: 'profile', label: 'Complete your profile', icon: Users },
  { id: 'quiz', label: 'Take your first daily quiz', icon: Target },
  { id: 'track', label: 'Enroll in a learning track', icon: BookOpen },
  { id: 'challenge', label: 'Solve a coding challenge', icon: Code2 },
]

function OnboardingChecklist({ completedSteps, onStepClick }: { completedSteps: string[]; onStepClick: (stepId: string) => void }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Get Started</h3>
        <Badge variant="outline" className="text-xs">
          {completedSteps.length}/{onboardingSteps.length} complete
        </Badge>
      </div>
      <div className="space-y-3">
        {onboardingSteps.map((step) => {
          const isComplete = completedSteps.includes(step.id)
          const Icon = step.icon
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className="flex w-full items-center gap-3 rounded-xl p-3 transition-colors hover:bg-card"
            >
              {isComplete ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className={cn('flex-1 text-left text-sm', isComplete ? 'text-muted-foreground line-through' : 'text-foreground')}>
                {step.label}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Quick Stats ─────────────────────────────────────────────────────────────────
function QuickStatCard({ label, value, icon: Icon, color, trend }: { label: string; value: string | number; icon: typeof Flame; color: string; trend?: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={cn('rounded-xl p-2.5', color)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <Badge variant="outline" className="text-xs">
            {trend}
          </Badge>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

// ─── Learning Activity ───────────────────────────────────────────────────────────
function LearningActivity({ type, title, time, xp }: { type: string; title: string; time: string; xp: number }) {
  const icons: Record<string, typeof BookOpen> = {
    quiz: Target,
    track: BookOpen,
    challenge: Code2,
    hackathon: Trophy,
  }
  const Icon = icons[type] || BookOpen

  return (
    <div className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-card">
      <div className="rounded-xl bg-primary/10 p-2">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Badge variant="outline" className="text-xs">
        +{xp} XP
      </Badge>
    </div>
  )
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [showConfetti] = useState(false)
  const { isFirstTime, showTour, completeTour } = useOnboarding()

  const xp = user?.totalPoints ?? 0
  const level = user?.level ?? 1
  const streak = user?.currentStreak ?? 0
  const longestStreak = user?.longestStreak ?? 0
  const quizzesTaken = user?.stats?.quizzes_taken ?? 0
  const hackathonCount = user?.stats?.hackathons_participated ?? 0
  const enrolledPaths = user?.stats?.enrolled_paths ?? 0
  const firstName = user?.fullName?.split(' ')[0] ?? 'Learner'

  const isNewUser = xp === 0 && quizzesTaken === 0 && enrolledPaths === 0

  const levelXP = xp % 1000
  const nextXP = (level + 1) * 100

  // Simulated activity data
  const recentActivity = useMemo(() => [
    { type: 'quiz', title: 'Completed JavaScript Quiz', time: '2 hours ago', xp: 50 },
    { type: 'track', title: 'Started React Fundamentals', time: 'Yesterday', xp: 100 },
    { type: 'challenge', title: 'Solved Array Challenge', time: '2 days ago', xp: 75 },
  ], [])

  const completedSteps = useMemo(() => {
    const steps: string[] = []
    if (user?.fullName) steps.push('profile')
    if (quizzesTaken > 0) steps.push('quiz')
    if (enrolledPaths > 0) steps.push('track')
    // Add challenge step when user has completed challenges
    return steps
  }, [user?.fullName, quizzesTaken, enrolledPaths])

  const handleOnboardingStep = (stepId: string) => {
    switch (stepId) {
      case 'profile':
        router.push('/profile')
        break
      case 'quiz':
        router.push('/daily-quiz')
        break
      case 'track':
        router.push('/learning-tracks')
        break
      case 'challenge':
        router.push('/exercises')
        break
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <Confetti active={showConfetti} />
      </Suspense>

      <div className="mx-auto max-w-7xl p-6 lg:p-8 space-y-8">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              {isNewUser
                ? "Let's get you started on your learning journey!"
                : `You've earned ${xp.toLocaleString()} XP so far. Keep it up!`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Suspense fallback={<div className="h-12 w-32 rounded-xl bg-card animate-pulse" />}>
              {streak > 0 && (
                <div className="flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-amber-600">{streak} day streak</span>
                </div>
              )}
            </Suspense>
          </div>
        </header>

        {/* ── Onboarding for New Users ─────────────────────────────────── */}
        {isNewUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-8"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold text-foreground">Start Your Journey</h2>
                <p className="text-muted-foreground">
                  Complete these quick steps to get the most out of BlueLearnerHub. Each step helps you build essential skills!
                </p>
              </div>
              <div className="lg:w-80">
                <OnboardingChecklist completedSteps={completedSteps} onStepClick={handleOnboardingStep} />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Quick Actions ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/daily-quiz"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center transition-all hover:border-primary/40 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-primary/20 p-4 transition-transform group-hover:scale-110">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <span className="font-semibold text-foreground">Daily Quiz</span>
            <span className="text-xs text-muted-foreground">+10-30 XP</span>
          </Link>
          <Link
            href="/exercises"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 text-center transition-all hover:border-emerald-500/40 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-emerald-500/20 p-4 transition-transform group-hover:scale-110">
              <Code2 className="h-6 w-6 text-emerald-500" />
            </div>
            <span className="font-semibold text-foreground">Practice</span>
            <span className="text-xs text-muted-foreground">+20-50 XP</span>
          </Link>
          <Link
            href="/learning-tracks"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-6 text-center transition-all hover:border-violet-500/40 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-violet-500/20 p-4 transition-transform group-hover:scale-110">
              <BookOpen className="h-6 w-6 text-violet-500" />
            </div>
            <span className="font-semibold text-foreground">Learn Track</span>
            <span className="text-xs text-muted-foreground">+50-100 XP</span>
          </Link>
          <Link
            href="/hackathons"
            className="group flex flex-col items-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 text-center transition-all hover:border-amber-500/40 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="rounded-2xl bg-amber-500/20 p-4 transition-transform group-hover:scale-110">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <span className="font-semibold text-foreground">Hackathon</span>
            <span className="text-xs text-muted-foreground">Win prizes!</span>
          </Link>
        </div>

        {/* ── Stats Overview ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <QuickStatCard label="Total XP" value={xp.toLocaleString()} icon={Zap} color="bg-amber-500/20 text-amber-500" trend="+12%" />
          <QuickStatCard label="Quizzes" value={quizzesTaken} icon={Target} color="bg-primary/20 text-primary" />
          <QuickStatCard label="Tracks" value={enrolledPaths} icon={BookOpen} color="bg-violet-500/20 text-violet-500" />
          <QuickStatCard label="Hackathons" value={hackathonCount} icon={Trophy} color="bg-amber-500/20 text-amber-500" />
        </div>

        {/* ── Main Content Grid ────────────────────────────────────────── */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Progress Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Your Progress</h2>
                    <p className="text-sm text-muted-foreground">Level {level} • {levelXP}/{nextXP} XP to next level</p>
                  </div>
                  <div className="relative">
                    <ProgressRing progress={(levelXP / nextXP) * 100} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold">{level}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={<div className="h-20 rounded-xl bg-secondary/50 animate-pulse" />}>
                  <XPProgressBar currentXP={levelXP} nextLevelXP={nextXP} level={level} />
                </Suspense>
              </div>
            </div>

            {/* Recent Activity or Empty State */}
            <div className="overflow-hidden rounded-3xl border border-border">
              <div className="border-b border-border/50 bg-secondary/30 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                  <Link href="/student/profile" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-border/50">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, i) => (
                    <LearningActivity key={i} {...activity} />
                  ))
                ) : (
                  <EmptyState
                    icon={Sparkles}
                    title="No activity yet"
                    description="Complete your first quiz, start a track, or solve a challenge to see your activity here."
                    action={() => router.push('/daily-quiz')}
                    actionLabel="Take Your First Quiz"
                  />
                )}
              </div>
            </div>

            {/* Learning Tracks Preview */}
            <div className="overflow-hidden rounded-3xl border border-border">
              <div className="border-b border-border/50 bg-secondary/30 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Continue Learning</h2>
                  <Link href="/learning-tracks" className="text-sm text-primary hover:underline">
                    Browse all
                  </Link>
                </div>
              </div>
              {enrolledPaths > 0 ? (
                <div className="p-6">
                  <p className="text-center text-muted-foreground">Your enrolled tracks will appear here.</p>
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="Start a Learning Track"
                  description="Enroll in structured learning paths designed by industry experts to master new skills."
                  action={() => router.push('/learning-tracks')}
                  actionLabel="Explore Tracks"
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Daily Challenge */}
            <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="bg-gradient-to-r from-primary/10 to-transparent p-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Daily Challenge</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 rounded-xl bg-card p-4">
                  <p className="mb-2 font-semibold text-foreground">Master JavaScript Arrays</p>
                  <p className="mb-4 text-sm text-muted-foreground">Complete 5 array challenges to earn bonus XP.</p>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">Medium</Badge>
                    <span className="text-amber-500">+150 XP</span>
                  </div>
                </div>
                <Button className="w-full gap-2" onClick={() => router.push('/exercises')}>
                  <Play className="h-4 w-4" /> Start Challenge
                </Button>
              </div>
            </div>

            {/* Streak Info */}
            {streak > 0 && (
              <div className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-amber-500/20 p-3">
                      <Flame className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{streak} Day Streak</p>
                      <p className="text-sm text-muted-foreground">Longest: {longestStreak} days</p>
                    </div>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {streak >= 7
                      ? "You're on fire! Keep your streak going!"
                      : "Don't break your streak! Complete a quiz today."}
                  </p>
                  <Button variant="outline" className="w-full" onClick={() => router.push('/daily-quiz')}>
                    <Target className="mr-2 h-4 w-4" /> Take Quiz to Maintain
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div className="overflow-hidden rounded-3xl border border-border">
              <div className="border-b border-border/50 bg-secondary/30 p-6">
                <h2 className="text-lg font-semibold text-foreground">Quick Links</h2>
              </div>
              <div className="divide-y divide-border/50">
                <Link href="/ide" className="flex items-center gap-4 p-4 transition-colors hover:bg-card">
                  <Code2 className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm">Open IDE</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="/certificates" className="flex items-center gap-4 p-4 transition-colors hover:bg-card">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm">My Certificates</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link href="/community" className="flex items-center gap-4 p-4 transition-colors hover:bg-card">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="flex-1 text-sm">Community Q&A</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>

            {/* Achievements Preview */}
            <div className="overflow-hidden rounded-3xl border border-border">
              <div className="border-b border-border/50 bg-secondary/30 p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Achievements</h2>
                  <Link href="/student/profile" className="text-sm text-primary hover:underline">
                    View all
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-4 flex justify-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Complete challenges to unlock achievements!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Tour for first-time users */}
      <OnboardingTour isFirstTime={isFirstTime && showTour} onComplete={completeTour} />
    </div>
  )
}
