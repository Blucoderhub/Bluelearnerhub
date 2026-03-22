'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  ChevronRight,
  Zap,
  Star,
  Cpu,
  Settings,
  Building2,
  Briefcase,
  Play,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { tutorialsAPI } from '@/lib/api-civilization'
import TutorialTrackSkeleton from '@/components/skeletons/TutorialTrackSkeleton'
import { cn } from '@/lib/utils'

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  'computer-science': Cpu,
  software: Cpu,
  mechanical: Settings,
  electrical: Zap,
  civil: Building2,
  architecture: Building2,
  finance: Briefcase,
  management: Briefcase,
}
const LEVEL_ICONS: Record<string, LucideIcon> = {
  beginner: BookOpen,
  intermediate: Star,
  advanced: Zap,
  expert: Cpu,
}

interface TutorialItem {
  id: string
  title: string
  lessons: number
  level: string
  progress: number
  icon: LucideIcon
}
interface TrackGroup {
  category: string
  icon: LucideIcon
  color: string
  tutorials: TutorialItem[]
}

const MOCK_TUTORIAL_TRACKS: TrackGroup[] = [
  {
    category: 'Engineering & Technology',
    icon: Cpu,
    color: 'text-primary',
    tutorials: [
      { id: 't1', title: 'Python for AI Mastery', lessons: 24, level: 'Advanced', progress: 45, icon: Zap },
      { id: 't2', title: 'Machine Learning Fundamentals', lessons: 18, level: 'Intermediate', progress: 10, icon: Star },
      { id: 't3', title: 'Mechatronics Systems', lessons: 32, level: 'Expert', progress: 0, icon: Settings },
    ],
  },
]

function apiToTracks(tutorials: any[]): TrackGroup[] {
  const grouped: Record<string, TutorialItem[]> = {}
  const catIcons: Record<string, LucideIcon> = {}
  tutorials.forEach((t: any) => {
    const domain = (t.domain || 'general').toLowerCase()
    const cat = domain.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    if (!grouped[cat]) {
      grouped[cat] = []
      catIcons[cat] = DOMAIN_ICONS[domain] || BookOpen
    }
    grouped[cat].push({
      id: `${t.id}`,
      title: t.title,
      lessons: t.sectionCount ?? (t.estimatedMinutes ? Math.ceil(t.estimatedMinutes / 15) : 10),
      level: t.difficulty ? t.difficulty.charAt(0).toUpperCase() + t.difficulty.slice(1) : 'Intermediate',
      progress: t.userProgress?.progressPercent ?? 0,
      icon: LEVEL_ICONS[t.difficulty] ?? Star,
    })
  })
  return Object.entries(grouped).map(([category, tutorials]) => ({
    category,
    icon: catIcons[category],
    color: 'text-primary',
    tutorials,
  }))
}

export default function TutorialsLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  const [tutorialTracks, setTutorialTracks] = useState<TrackGroup[]>(MOCK_TUTORIAL_TRACKS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tutorialsAPI.list()
      .then((d: any) => { if (d?.length) setTutorialTracks(apiToTracks(d)) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visibleTracks = tutorialTracks
    .map((track) => ({
      ...track,
      tutorials: track.tutorials.filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((track) => track.tutorials.length > 0)

  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="bg-noise" />
      
      <div className="relative mx-auto max-w-7xl px-6 space-y-24 pb-32 pt-16">
        {/* Subtle Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
        </div>

        {/* Header Section */}
        <header className="mx-auto max-w-4xl space-y-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              The Learning Library
            </Badge>
          </motion.div>
          
          <div className="space-y-6">
            <h1 className="font-serif text-6xl font-medium tracking-tight text-foreground sm:text-7xl">
              Knowledge <span className="gradient-primary-text">Manifesto.</span>
            </h1>
            <p className="mx-auto max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground">
              Deep-dive into specialized interactive tutorials across every domain.
              Master the principles of engineering, management, and technology.
            </p>
          </div>

          <div className="group relative mx-auto max-w-2xl">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/50 to-violet-600/50 opacity-20 blur transition duration-1000 group-focus-within:opacity-40 group-focus-within:duration-200" />
            <div className="relative">
              <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                placeholder="What do you want to master today?"
                className="h-16 rounded-full border-border bg-card pl-16 pr-8 text-lg font-medium transition-all focus-visible:border-primary/50 focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Tracks Section */}
        <div className="space-y-32">
          {loading ? (
            Array.from({ length: 2 }).map((_, i) => <TutorialTrackSkeleton key={i} />)
          ) : (
            <AnimatePresence>
              {visibleTracks.map((track, i) => (
                <motion.section
                  key={track.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-12"
                >
                  <div className="flex items-end justify-between border-b border-border/10 pb-8">
                    <div className="flex items-center gap-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                        <track.icon size={32} />
                      </div>
                      <div className="space-y-1">
                        <h2 className="font-serif text-4xl font-medium text-foreground tracking-tight">
                          {track.category}
                        </h2>
                        <p className="text-sm font-medium text-muted-foreground">
                          {track.tutorials.length} specialized tracks available
                        </p>
                      </div>
                    </div>
                    <Button variant="link" className="group h-auto p-0 text-sm font-bold uppercase tracking-widest text-primary hover:no-underline">
                      Explore Track <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {track.tutorials.map((tutorial) => (
                      <Link key={tutorial.id} href={`/tutorials/view/${tutorial.id}/lesson-1`}>
                        <motion.div
                          whileHover={{ y: -10 }}
                          className="group relative h-full overflow-hidden rounded-[2.5rem] bg-card p-10 transition-all hover:bg-card hover:shadow-2xl hover:shadow-primary/10"
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                          
                          <div className="mb-10 flex items-start justify-between">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                              <tutorial.icon size={32} />
                            </div>
                            <Badge variant="outline" className="rounded-lg border-border/50 bg-secondary/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              {tutorial.level}
                            </Badge>
                          </div>

                          <h3 className="mb-6 font-serif text-2xl font-medium leading-[1.3] text-foreground transition-colors group-hover:text-primary">
                            {tutorial.title}
                          </h3>

                          <div className="space-y-6">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              <span>{tutorial.lessons} Lessons</span>
                              <span className="text-primary">{tutorial.progress}% Complete</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${tutorial.progress}%` }}
                                className="h-full bg-primary shadow-[0_0_15px_hsl(var(--primary)/0.4)]"
                              />
                            </div>
                          </div>

                          <div className="mt-10 flex items-center justify-center gap-2 rounded-full bg-secondary py-3 text-[11px] font-black uppercase tracking-widest text-foreground opacity-0 transition-all duration-300 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 group-hover:bg-primary group-hover:text-primary-foreground">
                            <Play size={14} className="fill-current" /> Continue Learning
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer CTA */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[3rem] bg-card p-20 text-center"
        >
          <div className="absolute -left-[10%] -top-[20%] -z-10 h-[300px] w-[300px] rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute -right-[10%] -bottom-[20%] -z-10 h-[300px] w-[300px] rounded-full bg-violet-600/20 blur-[100px]" />
          
          <div className="mx-auto max-w-2xl space-y-8">
            <h2 className="font-serif text-5xl font-medium tracking-tight text-foreground">
              Ready for Certification?
            </h2>
            <p className="font-serif text-xl leading-relaxed text-muted-foreground">
              Complete any track to earn industry-recognized credentials verified 
              on the blockchain. Elevate your professional standing.
            </p>
            <Button className="h-16 rounded-full bg-white px-12 text-lg font-black text-black transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              Get Certified Now
            </Button>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
