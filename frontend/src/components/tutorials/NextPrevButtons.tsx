// src/components/tutorials/NextPrevButtons.tsx

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface NextPrevButtonsProps {
  prevLesson?: string
  nextLesson?: string
}

export default function NextPrevButtons({ prevLesson, nextLesson }: NextPrevButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700"
    >
      {prevLesson ? (
        <Link href={prevLesson}>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-semibold transition-colors">
            ← Previous Lesson
          </button>
        </Link>
      ) : (
        <button disabled className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
          ← Previous Lesson
        </button>
      )}

      <div className="flex-1" />

      {nextLesson ? (
        <Link href={nextLesson}>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 font-semibold transition-colors">
            Next Lesson →
          </button>
        </Link>
      ) : (
        <button disabled className="flex items-center gap-2 px-4 py-2 text-gray-400 cursor-not-allowed">
          Next Lesson →
        </button>
      )}
    </motion.div>
  )
}
