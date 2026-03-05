'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import { DailyChallenge } from '@/components/gamification/DailyChallenge'
import { LeaderboardPreview } from '@/components/gamification/LeaderboardPreview'
import { AchievementGrid } from '@/components/gamification/AchievementBadge'
import ProgressChart from '@/components/dashboard/ProgressChart'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import CelebrationCharacter from '@/components/animations/characters/CelebrationCharacter'
import Confetti from '@/components/animations/Confetti'
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
} from 'lucide-react'
import Link from 'next/link'

const sampleAchievements = [
  { id: '1', title: 'First Steps', description: 'Complete your first lesson', icon: '🎯', status: 'unlocked' as const },
  { id: '2', title: 'Code Ninja', description: 'Solve 50 challenges', icon: '🥷', status: 'unlocked' as const },
  { id: '3', title: 'Week Warrior', description: '7-day streak', icon: '🔥', status: 'new' as const },
  { id: '4', title: 'Hackathon Hero', description: 'Win a hackathon', icon: '🏆', status: 'locked' as const },
  { id: '5', title: 'Team Player', description: 'Join 3 teams', icon: '🤝', status: 'locked' as const },
  { id: '6', title: 'Certified Pro', description: 'Earn a certificate', icon: '📜', status: 'locked' as const },
  { id: '7', title: 'AI Explorer', description: 'Use AI companion 10 times', icon: '🤖', status: 'unlocked' as const },
  { id: '8', title: 'Speed Demon', description: 'Complete a quiz in under 60s', icon: '⚡', status: 'locked' as const },
]

const sampleLeaderboard = [
  { rank: 1, name: 'Alex Chen', xp: 12450, level: 12, avatar: '🧑‍💻', trend: 'up' as const },
  { rank: 2, name: 'Priya Sharma', xp: 11200, level: 11, avatar: '👩‍💻', trend: 'same' as const },
  { rank: 3, name: 'Jordan Lee', xp: 10800, level: 10, avatar: '🧑‍🎓', trend: 'up' as const },
  { rank: 4, name: 'Sam Torres', xp: 9500, level: 9, avatar: '🧑‍🔬', trend: 'down' as const },
  { rank: 5, name: 'You', xp: 2450, level: 5, avatar: '🎓', trend: 'up' as const, isCurrentUser: true },
]

const quickActions = [
  { label: 'Continue Learning', icon: BookOpen, href: '/tutorials', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { label: 'Daily Quiz', icon: Target, href: '/quiz', color: 'bg-[var(--streak-orange)]/10 text-[var(--streak-orange)] border-[var(--streak-orange)]/20' },
  { label: 'Join Hackathon', icon: Trophy, href: '/hackathons', color: 'bg-[var(--xp-gold)]/10 text-[var(--xp-gold)] border-[var(--xp-gold)]/20' },
  { label: 'Practice Code', icon: Code2, href: '/ide', color: 'bg-[var(--level-purple)]/10 text-[var(--level-purple)] border-[var(--level-purple)]/20' },
]

export default function StudentDashboard() {
  const { user } = useAuth()
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const newAchievements = sampleAchievements.filter(a => a.status === 'new')
  const hasNewAchievement = newAchievements.length > 0

  const handleCelebrate = useCallback(() => {
    setShowConfetti(true)
    setShowCelebration(true)
    setTimeout(() => {
      setShowConfetti(false)
      setShowCelebration(false)
    }, 3500)
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      <Confetti active={showConfetti} />

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-card/90 backdrop-blur-xl rounded-3xl p-8 border border-primary/30 shadow-2xl flex flex-col items-center gap-3 pointer-events-auto"
            >
              <CelebrationCharacter size={120} />
              <p className="text-lg font-bold font-heading text-foreground">Achievement Unlocked!</p>
              <p className="text-sm text-muted-foreground">You earned a new badge 🎉</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-heading tracking-tight text-foreground">
              Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5">
              You're in the top <span className="text-primary font-bold">5%</span> of learners this week. Keep going!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StreakDisplay currentStreak={12} longestStreak={21} hasStreakProtection compact />
          </div>
        </div>

        <XPProgressBar currentXP={2450} nextLevelXP={3000} level={5} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {quickActions.map((action, i) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-[1.02] active:scale-[0.98] touch-target ${action.color}`}
            >
              <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold text-center leading-tight">{action.label}</span>
            </Link>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <DailyChallenge
          title="Array Manipulation Challenge"
          description="Solve a medium-difficulty array problem to earn bonus XP and protect your streak."
          difficulty="Medium"
          xpReward={150}
          category="Data Structures"
          timeRemaining={43200}
          onStart={() => window.location.href = '/quiz'}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-5 sm:p-6 rounded-2xl glass-card border border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base sm:text-lg font-bold font-heading">Learning Progress</h3>
              <Link href="/analytics" className="text-xs text-primary font-semibold hover:text-primary/80 flex items-center gap-1">
                Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="h-[250px] sm:h-[280px]">
              <ProgressChart />
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl glass-card border border-border/50">
            {hasNewAchievement && (
              <motion.button
                onClick={handleCelebrate}
                className="w-full mb-4 flex items-center gap-3 p-3 rounded-xl bg-[var(--xp-gold)]/10 border border-[var(--xp-gold)]/20 hover:bg-[var(--xp-gold)]/15 transition-colors cursor-pointer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <CelebrationCharacter size={48} />
                <div className="text-left flex-1">
                  <p className="text-sm font-bold text-[var(--xp-gold)]">New Achievement!</p>
                  <p className="text-xs text-muted-foreground">Tap to celebrate your "{newAchievements[0].title}" badge</p>
                </div>
                <Sparkles className="w-5 h-5 text-[var(--xp-gold)] animate-pulse" />
              </motion.button>
            )}
            <AchievementGrid achievements={sampleAchievements} />
          </div>
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="p-5 rounded-2xl glass-card border border-border/50">
            <LeaderboardPreview
              entries={sampleLeaderboard}
              currentUserRank={42}
              totalUsers={50000}
            />
          </div>

          <div className="p-5 rounded-2xl glass-card border border-border/50">
            <StreakDisplay currentStreak={12} longestStreak={21} hasStreakProtection />
          </div>

          <div className="rounded-2xl glass-card border border-border/50 overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h3 className="text-base font-bold font-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Recent Activity
              </h3>
            </div>
            <ActivityFeed />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total XP', value: '2,450', icon: Flame, iconColor: 'text-[var(--xp-gold)]', trend: '+12%' },
          { label: 'Challenges Solved', value: '145', icon: Code2, iconColor: 'text-primary', trend: '+8' },
          { label: 'Hackathons', value: '7', icon: Trophy, iconColor: 'text-[var(--streak-orange)]', trend: '+2' },
          { label: 'Certificates', value: '3', icon: Award, iconColor: 'text-[var(--level-purple)]', trend: '+1' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="p-4 rounded-xl glass-card border border-border/50 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center ${stat.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-heading">{stat.value}</span>
                  <span className="text-[10px] text-green-400 font-semibold">{stat.trend}</span>
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
