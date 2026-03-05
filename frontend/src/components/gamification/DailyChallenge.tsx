'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CodingCharacter from '@/components/animations/characters/CodingCharacter'

interface DailyChallengeProps {
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  xpReward: number
  category: string
  timeRemaining?: number
  completed?: boolean
  onStart?: () => void
}

export function DailyChallenge({
  title,
  description,
  difficulty,
  xpReward,
  category,
  timeRemaining = 0,
  completed = false,
  onStart,
}: DailyChallengeProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    if (timeRemaining <= 0) return
    const h = Math.floor(timeRemaining / 3600)
    const m = Math.floor((timeRemaining % 3600) / 60)
    setHours(h)
    setMinutes(m)

    const interval = setInterval(() => {
      setHours(prev => {
        const newTime = timeRemaining - Math.floor((Date.now() / 1000) % 86400)
        return Math.floor(Math.max(0, newTime) / 3600)
      })
      setMinutes(prev => {
        const newTime = timeRemaining - Math.floor((Date.now() / 1000) % 86400)
        return Math.floor((Math.max(0, newTime) % 3600) / 60)
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [timeRemaining])

  const difficultyColors = {
    Easy: 'text-green-400 bg-green-400/10 border-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(0, 200, 120, 0.4)' }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="absolute bottom-2 right-3 hidden sm:block opacity-60 pointer-events-none">
        <CodingCharacter size={80} />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="streak-flame">
              <Sparkles className="w-5 h-5 text-[var(--xp-gold)]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Daily Challenge</span>
          </div>
          {!completed && timeRemaining > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{hours}h {minutes}m left</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-base sm:text-lg font-bold text-foreground mb-1">{title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-full bg-muted/30">
            {category}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-[var(--xp-gold)] ml-auto">
            <Zap className="w-3.5 h-3.5" />
            +{xpReward} XP
          </span>
        </div>

        {completed ? (
          <div className="flex items-center gap-2 text-sm text-primary font-semibold">
            <span>Completed!</span>
            <span className="text-[var(--xp-gold)]">+{xpReward} XP earned</span>
          </div>
        ) : (
          <Button
            onClick={onStart}
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-bold touch-target"
          >
            Start Challenge
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}
