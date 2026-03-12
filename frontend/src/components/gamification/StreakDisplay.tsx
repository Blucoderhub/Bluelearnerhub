'use client'

import { motion } from 'framer-motion'
import { Flame, Shield } from 'lucide-react'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  hasStreakProtection?: boolean
  compact?: boolean
}

export function StreakDisplay({ currentStreak, longestStreak, hasStreakProtection = false, compact = false }: StreakDisplayProps) {
  const streakLevel = currentStreak >= 30 ? 'legendary' : currentStreak >= 14 ? 'epic' : currentStreak >= 7 ? 'great' : currentStreak >= 3 ? 'good' : 'start'

  const streakColors = {
    start: 'text-muted-foreground',
    good: 'text-foreground/70',
    great: 'text-foreground/80',
    epic: 'text-[var(--streak-orange)]',
    legendary: 'text-red-500',
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="streak-flame">
          <Flame className={`w-5 h-5 ${streakColors[streakLevel]}`} />
        </div>
        <span className={`text-sm font-bold ${streakColors[streakLevel]}`}>{currentStreak}</span>
        {hasStreakProtection && <Shield className="w-3.5 h-3.5 text-[var(--achievement-cyan)]" />}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--streak-orange)]/5 border border-[var(--streak-orange)]/15">
      <div className="streak-flame">
        <motion.div
          animate={currentStreak > 0 ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Flame className={`w-8 h-8 ${streakColors[streakLevel]}`} />
        </motion.div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black font-heading">{currentStreak}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
          {hasStreakProtection && (
            <span className="flex items-center gap-1 text-xs text-[var(--achievement-cyan)] bg-[var(--achievement-cyan)]/10 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> Protected
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Best: {longestStreak} days
        </p>
      </div>
    </div>
  )
}
