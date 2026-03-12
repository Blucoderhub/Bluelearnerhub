// src/components/tutorials/TableOfContents.tsx

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface TOCItem {
  id: string
  title: string
  level: number
  href: string
}

interface TableOfContentsProps {
  items: TOCItem[]
  currentId?: string
}

export default function TableOfContents({ items, currentId }: TableOfContentsProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-20"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        On This Page
      </h3>
      
      <ul className="space-y-2">
        {items.map((item) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ paddingLeft: `${(item.level - 1) * 16}px` }}
          >
            <Link href={item.href}>
              <a className={`text-sm hover:text-primary dark:hover:text-blue-400 transition-colors ${
                currentId === item.id
                  ? 'text-primary dark:text-blue-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {item.title}
              </a>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
