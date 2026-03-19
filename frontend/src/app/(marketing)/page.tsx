'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Code2,
  Trophy,
  BookOpen,
  Terminal,
  Brain,
  Award,
  BarChart3,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const features = [
  {
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Interactive Tutorials',
    desc: 'Learn by doing with interactive lessons and a live code playground side-by-side.',
  },
  {
    icon: Code2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    title: 'Coding Challenges',
    desc: 'Solve algorithmic challenges with instant feedback, hints, and solutions explained.',
  },
  {
    icon: Trophy,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: 'Hackathons',
    desc: 'Compete globally, win prizes, and get noticed by top companies in real-world events.',
  },
  {
    icon: Brain,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: 'AI-Powered Learning',
    desc: 'Personalized quizzes, adaptive guidance, and an AI companion that grows with you.',
  },
  {
    icon: Award,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    title: 'Verified Certificates',
    desc: 'Earn industry-recognized credentials and share them directly with your network.',
  },
  {
    icon: BarChart3,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: 'Progress Analytics',
    desc: 'Track every skill, streak, XP gain, and milestone in a beautiful dashboard.',
  },
]

const challenges = [
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Map'],
    solved: '98.2K',
    acceptance: '92%',
  },
  {
    title: 'Binary Tree Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'DFS'],
    solved: '54.1K',
    acceptance: '74%',
  },
  {
    title: 'LRU Cache Design',
    difficulty: 'Hard',
    tags: ['Design', 'LinkedList'],
    solved: '21.8K',
    acceptance: '48%',
  },
]

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="bg-noise" />
      
      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[980px] px-6 py-24 sm:py-32">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              The Future of Learning
            </Badge>
          </div>
          
          <h1 className="mb-8 font-serif text-6xl font-medium leading-[1.0] tracking-tight text-white sm:text-8xl">
            Master your Skill.
            <br />
            <span className="gradient-primary-text">Build the Portfolio.</span>
          </h1>
          
          <p className="mx-auto mb-12 max-w-2xl font-serif text-xl leading-relaxed text-foreground/80 sm:text-2xl">
            Experience the most advanced interactive curriculum. Master engineering and management 
            through deep-dive tutorials, global hackathons, and AI-powered assessments.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-5 font-sans sm:flex-row">
            <Link
              href="/login"
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-primary px-10 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_30px_hsl(var(--primary)/0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              Start Learning Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/tutorials"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-border bg-card/40 px-10 text-sm font-bold text-foreground transition-all hover:bg-card hover:text-primary backdrop-blur-sm"
            >
              Explore Library
            </Link>
          </div>
        </motion.header>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mb-24">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">
            Platform Capabilities
          </h2>
          <h3 className="font-serif text-5xl font-medium text-white sm:text-6xl">
            Industry-Standard Curriculum.
          </h3>
          <p className="mt-8 mx-auto max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground">
            From theoretical foundations to advanced practical implementation. 
            Everything you need to become a world-class professional.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/40 p-10 text-left transition-all hover:bg-card hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className={cn("mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white", f.bg, f.color)}>
                  <Icon size={32} />
                </div>
                <h4 className="mb-4 font-serif text-2xl font-medium text-white">{f.title}</h4>
                <p className="font-serif text-base leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ─── CODING CHALLENGES ─────────────────────────────────────────── */}
      <section className="border-t border-border/10 bg-secondary/20 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-xs font-black uppercase tracking-[0.3em] text-primary/80">
                Performance Practice
              </h2>
              <h3 className="mb-8 font-serif text-5xl font-medium text-white">
                Sharpen your skills.
              </h3>
              <p className="mb-10 font-serif text-xl leading-relaxed text-muted-foreground">
                Apply your knowledge to complex, real-world problems. Get instant feedback 
                and scale your capabilities with our adaptive performance engine.
              </p>
              <Link href="/ide">
                <Button className="h-14 rounded-full bg-primary px-8 text-sm font-bold text-white hover:scale-105 transition-transform hover:shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
                  <Terminal className="mr-2 h-5 w-5" /> Start a Challenge
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {challenges.map((c, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="group flex cursor-pointer items-center justify-between rounded-3xl border border-border/50 bg-card/60 p-6 transition-all hover:border-primary/50 hover:bg-card"
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                      <Code2 size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white transition-colors group-hover:text-primary">
                        {c.title}
                      </h4>
                      <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                        <span className="font-bold uppercase tracking-wider text-primary/80">{c.difficulty}</span>
                        <span>•</span>
                        <span>{c.solved} Solved</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
        
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="rounded-[3rem] border border-border bg-card/40 p-20 backdrop-blur-xl"
          >
            <h2 className="mb-8 font-serif text-5xl font-medium tracking-tight text-white sm:text-6xl">
              Start your journey today.
            </h2>
            <p className="mx-auto mb-12 max-w-xl font-serif text-xl text-muted-foreground">
              Join thousands of learners mastering their domains and building the future 
              on the most advanced learning platform.
            </p>
            <Link
              href="/login"
              className="inline-flex h-16 items-center justify-center rounded-full bg-white px-12 text-base font-black text-black transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Start for Free
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
