// src/components/dashboard/ProgressChart.tsx

'use client'

import { motion } from 'framer-motion'

export default function ProgressChart() {
  const weekData = [
    { day: 'Mon', xp: 450 },
    { day: 'Tue', xp: 520 },
    { day: 'Wed', xp: 380 },
    { day: 'Thu', xp: 610 },
    { day: 'Fri', xp: 700 },
    { day: 'Sat', xp: 550 },
    { day: 'Sun', xp: 490 },
  ]

  const maxXP = Math.max(...weekData.map(d => d.xp))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        This Week's Progress
      </h3>

      <div className="flex items-end gap-2 h-64">
        {weekData.map((data, idx) => (
          <motion.div
            key={idx}
            initial={{ height: 0 }}
            animate={{ height: `${(data.xp / maxXP) * 100}%` }}
            transition={{ delay: idx * 0.1 }}
            className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:opacity-80 transition-opacity group relative"
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
              {data.xp} XP
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-between mt-6 text-xs text-gray-600 dark:text-gray-400">
        {weekData.map((data, idx) => (
          <span key={idx}>{data.day}</span>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">3,700 XP</span> this week
        </p>
      </div>
    </motion.div>
  )
}
