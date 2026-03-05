// src/components/hackathon/LeaderboardTable.tsx

'use client'

import { motion } from 'framer-motion'

interface LeaderboardEntry {
  rank: number
  name: string
  avatar: string
  points: number
  solvedProblems: number
  submissions: number
}

interface LeaderboardTableProps {
  hackathonId: string
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Alex Kumar',
    avatar: '👨‍💻',
    points: 4500,
    solvedProblems: 8,
    submissions: 24,
  },
  {
    rank: 2,
    name: 'Sarah Chen',
    avatar: '👩‍💻',
    points: 4200,
    solvedProblems: 7,
    submissions: 19,
  },
  {
    rank: 3,
    name: 'Raj Patel',
    avatar: '👨‍💼',
    points: 3950,
    solvedProblems: 7,
    submissions: 17,
  },
  {
    rank: 4,
    name: 'Emma Wilson',
    avatar: '👩‍🔬',
    points: 3700,
    solvedProblems: 6,
    submissions: 15,
  },
  {
    rank: 5,
    name: 'Marco Rossi',
    avatar: '👨‍🎓',
    points: 3400,
    solvedProblems: 6,
    submissions: 13,
  },
]

export default function LeaderboardTable({ hackathonId: _hackathonId }: LeaderboardTableProps) {
  // TODO: Implement leaderboard data fetching using _hackathonId
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Coder
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Points
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Solved
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Submissions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockLeaderboard.map((entry, idx) => (
              <motion.tr
                key={entry.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    {getMedalEmoji(entry.rank)}
                    <span>#{entry.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{entry.avatar}</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entry.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm">
                    {entry.points}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {entry.solvedProblems} problems
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {entry.submissions}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
