'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Users, Lightbulb, Trophy, Briefcase } from 'lucide-react'

interface StatItem {
  label: string
  value: string
  icon: string
}

interface StatsProps {
  stats: StatItem[]
}

const iconMap: Record<string, React.ElementType> = {
  '👨‍💻': Users,
  '💡': Lightbulb,
  '🏆': Trophy,
  '💼': Briefcase,
}

const colorMap: Record<number, string> = {
  0: 'from-blue-500 to-cyan-500',
  1: 'from-purple-500 to-pink-500',
  2: 'from-amber-500 to-orange-500',
  3: 'from-emerald-500 to-green-500',
}

function AnimatedCounter({ value, inView }: { value: string; inView: boolean }) {
  const [displayValue, setDisplayValue] = useState('0')
  const numericMatch = value.match(/^([\d,]+)/)
  const suffix = value.replace(/^[\d,]+/, '')

  useEffect(() => {
    if (!inView || !numericMatch) {
      setDisplayValue(value)
      return
    }

    const target = parseInt(numericMatch[1].replace(/,/g, ''), 10)
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    let step = 0

    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), target)
      setDisplayValue(current.toLocaleString() + suffix)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)

    return () => clearInterval(timer)
  }, [inView, value, numericMatch, suffix])

  return <span>{displayValue}</span>
}

export default function Stats({ stats }: StatsProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <section className="py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
        >
          {stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon] || Users
            const gradient = colorMap[idx] || colorMap[0]
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="relative group"
              >
                <div className="p-5 md:p-8 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm text-center hover:bg-white/[0.06] transition-all duration-300">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-2xl md:text-4xl font-bold text-white mb-1">
                    <AnimatedCounter value={stat.value} inView={inView} />
                  </div>
                  <p className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <div className={`mt-4 mx-auto h-1 rounded-full bg-gray-800 overflow-hidden`}>
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                      initial={{ width: '0%' }}
                      animate={inView ? { width: '100%' } : { width: '0%' }}
                      transition={{ duration: 1.5, delay: idx * 0.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
