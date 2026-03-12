// src/components/hackathon/HackathonCard.tsx

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface HackathonCardProps {
  id: string
  title: string
  description: string
  status: 'upcoming' | 'active' | 'completed'
  startDate: string
  endDate: string
  participants: number
  prizePool: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  image?: string
}

const statusColors = {
  upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  completed: 'bg-muted/30 text-muted-foreground border-border/50',
}

const difficultyColors = {
  beginner: 'text-blue-400',
  intermediate: 'text-yellow-400',
  advanced: 'text-red-400',
}

export default function HackathonCard({
  id,
  title,
  description,
  status,
  startDate: _startDate,
  endDate: _endDate,
  participants,
  prizePool,
  difficulty,
  image,
}: HackathonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-[32px] border border-border/50 bg-card hover:border-primary/50 transition-all duration-500 shadow-xl shadow-black/5"
    >
      {/* Visual Header / Image Placeholder */}
      <div className="relative h-48 overflow-hidden bg-muted/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-40 group-hover:opacity-60 transition-opacity" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full aspect-video rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center ai-glow opacity-80 group-hover:opacity-100 transition-all">
            <Sparkles className="h-10 w-10 text-primary opacity-50" />
          </div>
        </div>
        <div className="absolute top-6 right-6">
          <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border backdrop-blur-md shadow-lg ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-black font-heading tracking-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Dynamic Meta Info Grid */}
        <div className="grid grid-cols-2 gap-4 py-6 border-y border-border/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/20 flex items-center justify-center text-primary">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prize Pool</p>
              <p className="text-sm font-black text-primary">{prizePool}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/20 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Coders</p>
              <p className="text-sm font-black">{participants.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${difficultyColors[difficulty].replace('text-', 'bg-')}`} />
            <span className={`text-[12px] font-bold uppercase tracking-widest ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          </div>
          <span className="text-[12px] font-bold text-muted-foreground">48h Sprint</span>
        </div>

        {/* Enhanced CTA */}
        <Link href={`/hackathons/${id}`} className="block">
          <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 transition-all gap-2 group/btn">
            {status === 'completed' ? 'View Final Leaderboard' : 'Enter Arena'}
            <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

import { Button } from '@/components/ui/button'
import { Sparkles, Trophy, Users, ChevronRight } from 'lucide-react'
