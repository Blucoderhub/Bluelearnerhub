'use client'

import { motion } from 'framer-motion'
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  level: number
  avatar: string
  trend: 'up' | 'down' | 'same'
  isCurrentUser?: boolean
}

interface LeaderboardPreviewProps {
  entries: LeaderboardEntry[]
  currentUserRank?: number
  totalUsers?: number
}

export function LeaderboardPreview({ entries, currentUserRank, totalUsers }: LeaderboardPreviewProps) {
  const rankColors = ['text-[var(--xp-gold)]', 'text-gray-400', 'text-amber-700']
  const rankBgs = ['bg-[var(--xp-gold)]/10', 'bg-gray-400/10', 'bg-amber-700/10']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[var(--xp-gold)]" />
          <h3 className="text-lg font-bold font-heading">Leaderboard</h3>
        </div>
        <Link
          href="/leaderboard"
          className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              entry.isCurrentUser
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-muted/30'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
              i < 3 ? `${rankBgs[i]} ${rankColors[i]}` : 'bg-muted text-muted-foreground'
            }`}>
              {entry.rank}
            </div>

            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
              {entry.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                {entry.name} {entry.isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Level {entry.level}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-foreground">
                {entry.xp.toLocaleString()}
              </span>
              {entry.trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-blue-400" />}
              {entry.trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
              {entry.trend === 'same' && <Minus className="w-3.5 h-3.5 text-muted-foreground" />}
            </div>
          </motion.div>
        ))}
      </div>

      {currentUserRank && totalUsers && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            You're ranked <span className="font-bold text-primary">#{currentUserRank}</span> out of {totalUsers.toLocaleString()} learners
          </p>
        </div>
      )}
    </div>
  )
}
