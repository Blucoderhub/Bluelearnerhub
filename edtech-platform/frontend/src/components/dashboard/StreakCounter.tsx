// src/components/dashboard/StreakCounter.tsx

'use client'

import { motion } from 'framer-motion'

interface StreakCounterProps {
  currentStreak: number
}

export default function StreakCounter({ currentStreak }: StreakCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 px-6 py-4 rounded-lg bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
    >
      <span className="text-4xl animate-pulse">🔥</span>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {currentStreak} days
        </p>
      </div>
    </motion.div>
  )
}
