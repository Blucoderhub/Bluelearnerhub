'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
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
    Easy: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8 md:p-10 shadow-2xl shadow-amber-500/10 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: 'rgba(16, 185, 129, 0.4)' }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex flex-col md:flex-row gap-8 items-center">
        {/* Character/Visual Side */}
        <div className="hidden md:flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group-hover:bg-amber-500/10 transition-colors">
           <CodingCharacter size={120} />
           <div className="mt-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">CHALLENGE_STATUS</p>
              <p className="text-xs font-bold text-white/40">{completed ? 'VERIFIED' : 'PENDING...'}</p>
           </div>
        </div>

        {/* Content Side */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">DAILY_REVENUE_CHALLENGE</span>
            </div>
            
            {!completed && timeRemaining > 0 && (
              <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-black tracking-widest">{hours}H {minutes}M REMAINING</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white group-hover:text-amber-400 transition-colors">
              {title}
            </h4>
            <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className={`px-5 py-2 rounded-xl border-2 font-black italic text-xs tracking-widest ${difficultyColors[difficulty]}`}>
              {difficulty.toUpperCase()}
            </div>
            <div className="px-5 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-white/60 font-black text-[10px] tracking-[0.1em] uppercase">
              {category}
            </div>
            <div className="flex items-center gap-2 text-xl font-black text-[var(--xp-gold)] ai-glow ml-auto md:ml-0">
              <Zap className="w-6 h-6 fill-current" />
              +{xpReward} XP
            </div>
          </div>

          <div className="pt-4 flex items-center gap-6">
            {completed ? (
              <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black italic tracking-tight text-lg">
                <CheckCircle2 className="w-6 h-6" />
                CHALLENGE_SOLVED
              </div>
            ) : (
              <Button
                onClick={onStart}
                className="h-16 px-10 bg-amber-500 hover:bg-amber-600 text-white font-black text-xl italic tracking-tighter rounded-2xl shadow-2xl shadow-amber-500/30 group/btn transition-all active:scale-95"
              >
                SOLVE_NOW
                <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-2 transition-transform" />
              </Button>
            )}
            <p className="hidden lg:block text-xs font-bold text-white/20 italic max-w-[200px]">
              Complete this to maintain your 12-day streak and earn exclusive domain badges.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
