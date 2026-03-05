// src/components/dashboard/ActivityFeed.tsx

'use client'

import { motion } from 'framer-motion'

const activities = [
  {
    type: 'challenge',
    title: 'Completed JavaScript Challenge: Arrays & Objects',
    time: '2 hours ago',
    icon: '✅',
  },
  {
    type: 'hackathon',
    title: 'Ranked #45 in Web Dev Hackathon',
    time: '1 day ago',
    icon: '🏅',
  },
  {
    type: 'course',
    title: 'Completed React Fundamentals course',
    time: '3 days ago',
    icon: '🎓',
  },
  {
    type: 'achievement',
    title: 'Earned badge: 7-Day Streak Master',
    time: '5 days ago',
    icon: '🔥',
  },
]

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Your Activity
      </h3>

      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 pb-4 last:pb-0 last:border-0 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {activity.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        View all activity →
      </button>
    </motion.div>
  )
}
