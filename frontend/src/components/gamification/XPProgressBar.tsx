'use client'

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface XPProgressBarProps {
  currentXP: number
  nextLevelXP: number
  level: number
  compact?: boolean
}

export function XPProgressBar({ currentXP, nextLevelXP, level, compact = false }: XPProgressBarProps) {
  const percentage = Math.min((currentXP / nextLevelXP) * 100, 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="level-badge text-xs">LV {level}</span>
        <div className="flex-1 xp-bar">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">{currentXP}/{nextLevelXP}</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="level-badge">Level {level}</span>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Zap className="w-4 h-4 text-[var(--xp-gold)]" />
            <span className="text-foreground">{currentXP.toLocaleString()} XP</span>
          </div>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {(nextLevelXP - currentXP).toLocaleString()} XP to Level {level + 1}
        </span>
      </div>
      <div className="xp-bar h-3">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  )
}
