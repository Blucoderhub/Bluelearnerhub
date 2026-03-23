'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { gamificationAPI } from '@/lib/api-civilization'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import { DailyChallenge } from '@/components/gamification/DailyChallenge'
import { LeaderboardPreview } from '@/components/gamification/LeaderboardPreview'
import { AchievementGrid } from '@/components/gamification/AchievementBadge'
import ProgressChart from '@/components/dashboard/ProgressChart'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import CelebrationCharacter from '@/components/animations/characters/CelebrationCharacter'
import Confetti from '@/components/animations/Confetti'
import { LearningPathOverview } from '@/components/dashboard/LearningPathOverview'
import { SkillProficiency } from '@/components/dashboard/SkillProficiency'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Code2,
  Trophy,
  Award,
  ArrowRight,
  Flame,
  Target,
  Sparkles,
  Brain,
  Play,
  Star,
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function nextLevelThreshold(level: number) {
  return (level + 1) * 1000
}

function currentLevelXP(totalPoints: number) {
  return totalPoints % 1000
}

type AchievementStatus = 'locked' | 'new' | 'unlocked'

const FALLBACK_ACHIEVEMENTS = [
  {
    id: 'FIRST_STEPS',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    status: 'locked' as AchievementStatus,
  },
  {
    id: 'CODE_NINJA',
    title: 'Code Ninja',
    description: 'Solve 50 challenges',
    icon: '🥷',
    status: 'locked' as AchievementStatus,
  },
  {
    id: 'WEEK_WARRIOR',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    status: 'locked' as AchievementStatus,
  },
  {
    id: 'HACKATHON_HERO',
    title: 'Hackathon Hero',
    description: 'Win a hackathon',
    icon: '🏆',
    status: 'locked' as AchievementStatus,
  },
]

const quickActions = [
  {
    label: 'Mastery Tracks',
    icon: BookOpen,
    href: '/tutorials',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    label: 'Adaptive Quiz',
    icon: Target,
    href: '/daily-quiz',
    color: 'bg-violet-600/10 text-violet-400 border-violet-600/20',
  },
  {
    label: 'Global Hack',
    icon: Trophy,
    href: '/hackathons',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  {
    label: 'IDE Lab',
    icon: Code2,
    href: '/ide',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const xp = user?.totalPoints ?? 0
  const level = user?.level ?? 1
  const streak = user?.currentStreak ?? 0
  const longestStreak = user?.longestStreak ?? 0
  const quizzesTaken = user?.stats?.quizzes_taken ?? 0
  const hackathonCount = user?.stats?.hackathons_participated ?? 0
  const enrolledPaths = user?.stats?.enrolled_paths ?? 0
  const firstName = user?.fullName?.split(' ')[0] ?? ''
  const hasProtection = streak >= 7

  const levelXP = currentLevelXP(xp)
  const nextXP = nextLevelThreshold(level)

  const MOCK_LEADERBOARD = useMemo(
    () => [
      { rank: 1, name: 'Alex Chen', xp: 12450, level: 12, avatar: '🧑‍💻', trend: 'up' as const },
      { rank: 2, name: 'Priya Sharma', xp: 11200, level: 11, avatar: '👩‍💻', trend: 'same' as const },
      { rank: 3, name: 'Jordan Lee', xp: 10800, level: 10, avatar: '🧑‍🎓', trend: 'up' as const },
      { rank: 4, name: 'Sam Torres', xp: 9500, level: 9, avatar: '🧑‍🔬', trend: 'down' as const },
    ],
    []
  )

  const currentUserEntry = useMemo(
    () => ({
      rank: 5,
      name: firstName ? `You (${firstName})` : 'You',
      xp,
      level,
      avatar: '🎓',
      trend: 'up' as const,
      isCurrentUser: true,
      avatarConfig: user?.avatarConfig,
    }),
    [firstName, xp, level, user?.avatarConfig]
  )

  const [leaderboardEntries, setLeaderboardEntries] = useState(MOCK_LEADERBOARD)

  useEffect(() => {
    gamificationAPI
      .leaderboard(4)
      .then((d: any) => {
        const list = (d?.data ?? d) as any[]
        if (Array.isArray(list) && list.length > 0) {
          setLeaderboardEntries(
            list.map((e: any, i: number) => ({
              rank: e.rank ?? i + 1,
              name: e.fullName ?? e.username ?? e.name ?? `User ${i + 1}`,
              xp: e.totalPoints ?? e.xp ?? 0,
              level: e.level ?? 1,
              avatar: e.avatar ?? '🧑‍💻',
              trend: (e.trend ?? 'same') as 'up' | 'down' | 'same',
              avatarConfig: e.avatarConfig,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  const leaderboard = useMemo(
    () => [...leaderboardEntries, currentUserEntry],
    [leaderboardEntries, currentUserEntry]
  )

  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [achievements, setAchievements] =
    useState<typeof FALLBACK_ACHIEVEMENTS>(FALLBACK_ACHIEVEMENTS)

  useEffect(() => {
    gamificationAPI
      .achievements()
      .then((d: any) => {
        const list = d?.data ?? d
        if (Array.isArray(list) && list.length > 0) setAchievements(list)
      })
      .catch(() => {})
  }, [])

  const newAchievements = achievements.filter((a) => a.status === 'new')
  const hasNewAchievement = newAchievements.length > 0

  const handleCelebrate = useCallback(() => {
    setShowConfetti(true)
    setShowCelebration(true)
    setTimeout(() => {
      setShowConfetti(false)
      setShowCelebration(false)
    }, 3500)
  }, [])

  const statCards = useMemo(
    () => [
      {
        label: 'Total XP',
        value: xp.toLocaleString(),
        icon: Flame,
        color: 'text-amber-500',
        trend: '+12%',
      },
      {
        label: 'Quizzes Taken',
        value: quizzesTaken.toString(),
        icon: Target,
        color: 'text-primary',
        trend: `+${Math.max(0, quizzesTaken - 5)}`,
      },
      {
        label: 'Hackathons',
        value: hackathonCount.toString(),
        icon: Trophy,
        color: 'text-violet-400',
        trend: `+${hackathonCount}`,
      },
      {
        label: 'Enrolled Tracks',
        value: enrolledPaths.toString(),
        icon: Award,
        color: 'text-emerald-400',
        trend: `+${enrolledPaths}`,
      },
    ],
    [xp, quizzesTaken, hackathonCount, enrolledPaths]
  )

  return (
    <div className="space-y-12">
      <div className="bg-noise pointer-events-none opacity-30" />
      <Confetti active={showConfetti} />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="pointer-events-auto flex flex-col items-center gap-6 rounded-[3rem] border border-primary/30 bg-card/90 p-12 shadow-2xl backdrop-blur-2xl"
            >
              <CelebrationCharacter size={140} />
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-3xl font-medium text-foreground">
                  Ascension Confirmed.
                </h2>
                <p className="font-heading text-lg text-muted-foreground">
                  You've unlocked a new milestone.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Welcome Section ───────────────────────────────────────────── */}
      <section className="relative space-y-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="rounded-full border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Performance Dashboard
              </Badge>
              {level >= 10 && (
                <Badge className="rounded-full border-amber-500/20 bg-amber-500/5 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  <Star className="mr-1 h-3 w-3 fill-current" /> Elite Member
                </Badge>
              )}
            </div>
            <h1 className="font-heading text-5xl font-medium tracking-tight text-foreground md:text-6xl">
              Greetings{firstName ? `, ${firstName}` : ''}.
            </h1>
            <p className="max-w-xl font-heading text-xl leading-relaxed text-muted-foreground">
              Your cognitive growth is up <span className="text-primary">+14.2%</span> this month.
              Ready to deepen your specialization?
            </p>
          </div>

          <div className="hidden lg:block">
            <StreakDisplay
              currentStreak={streak}
              longestStreak={longestStreak}
              hasStreakProtection={hasProtection}
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-card p-8">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <Brain size={120} className="text-primary" />
          </div>
          <XPProgressBar currentXP={levelXP} nextLevelXP={nextXP} level={level} />
        </div>
      </section>

      {/* ── Quick Actions Grid ────────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <motion.div key={i} whileHover={{ y: -5 }}>
              <Link
                href={action.href}
                className={cn(
                  'group flex flex-col items-center gap-4 rounded-[2rem] border p-8 transition-all hover:bg-card hover:shadow-2xl hover:shadow-primary/5',
                  action.color
                )}
              >
                <div className="bg-current/10 rounded-2xl p-4 transition-transform group-hover:scale-110">
                  <Icon size={28} />
                </div>
                <span className="font-heading text-sm font-medium tracking-wide">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          )
        })}
      </section>

      {/* ── Main Dashboard Intel ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          {/* Daily Challenge Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-card p-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-600/10" />
            <div className="relative rounded-[2.4rem] bg-card/80 p-8 backdrop-blur-xl">
              <DailyChallenge
                title="Mastery Challenge"
                description="Synthesize your knowledge of Array Data Structures to earn bonus XP and secure your streak dominance."
                difficulty="Medium"
                xpReward={150}
                category="Specialization"
                timeRemaining={43200}
                onStart={() => router.push('/daily-quiz')}
              />
            </div>
          </div>

          {/* Progress Chart */}
          <section className="rounded-[2.5rem] border border-border/50 bg-card/30 p-10">
            <div className="mb-10 flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-heading text-2xl font-medium tracking-tight text-foreground">
                  Growth Analytics
                </h3>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Mastery progression over time
                </p>
              </div>
              <Link
                href="/analytics"
                className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-secondary"
              >
                Detailed View <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="h-[300px]">
              <ProgressChart />
            </div>
          </section>

          {/* Learning Paths */}
          <LearningPathOverview />
        </div>

        <aside className="space-y-8">
          {/* Leaderboard */}
          <div className="rounded-[2.5rem] border border-border bg-card/40 p-8 shadow-xl">
            <LeaderboardPreview entries={leaderboard} currentUserRank={42} totalUsers={50000} />
          </div>

          {/* Skill Proficiency */}
          <div className="rounded-[2.5rem] border border-border bg-card/40 p-8">
            <SkillProficiency />
          </div>

          {/* Activity Feed */}
          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-background shadow-2xl">
            <div className="border-b border-border/50 bg-secondary/30 p-6">
              <h3 className="flex items-center gap-3 font-heading text-lg font-medium text-foreground">
                <Sparkles className="h-5 w-5 text-primary" />
                Recent Logs
              </h3>
            </div>
            <ActivityFeed />
          </div>
        </aside>
      </div>

      {/* ── Global Stats Row ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card/40 p-8 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    'rounded-2xl bg-secondary p-3 transition-colors group-hover:bg-primary group-hover:text-primary-foreground',
                    stat.color
                  )}
                >
                  <Icon size={20} />
                </div>
                <Badge
                  variant="outline"
                  className="border-primary/20 text-[9px] font-black uppercase tracking-widest text-primary"
                >
                  {stat.trend}
                </Badge>
              </div>
              <div className="mt-8 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {stat.label}
                </p>
                <h4 className="font-heading text-3xl font-medium text-foreground">{stat.value}</h4>
              </div>
            </motion.div>
          )
        })}
      </section>
    </div>
  )
}
