'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowRight, Code2, Trophy, BookOpen, Terminal, Brain, Award, BarChart3,
  ChevronRight, CheckCircle2, Users, Zap, Mail, ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HomeJsonLd } from '@/components/seo/JsonLd'
import api from '@/lib/api'
import { toast } from 'sonner'

// ─── Static data ──────────────────────────────────────────────────────────────

const features = [
  { icon: BookOpen, color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    title: 'Interactive Tutorials',    desc: 'Learn by doing with interactive lessons and a live code playground side-by-side.' },
  { icon: Code2,    color: 'text-violet-400',  bg: 'bg-violet-500/10',  border: 'border-violet-500/20',  title: 'Coding Challenges',        desc: 'Solve algorithmic challenges with instant feedback, hints, and AI explanations.' },
  { icon: Trophy,   color: 'text-amber-400',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   title: 'AI Hackathons',            desc: 'Compete globally, win prizes, and get noticed by top companies in real-world events.' },
  { icon: Brain,    color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: 'AI-Powered Learning',      desc: 'Daily Gemini-powered quizzes, adaptive guidance, and an AI companion that grows with you.' },
  { icon: Award,    color: 'text-pink-400',    bg: 'bg-pink-500/10',    border: 'border-pink-500/20',    title: 'Verified Certificates',    desc: 'Earn industry-recognised credentials and share them directly with your network.' },
  { icon: BarChart3, color: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    title: 'Progress Analytics',       desc: 'Track every skill, streak, XP gain, and milestone in a beautiful dashboard.' },
]

const tracks = [
  { name: 'Python', icon: '🐍', students: '12.4K', level: 'Beginner', href: '/learning-tracks/python' },
  { name: 'JavaScript', icon: '⚡', students: '18.1K', level: 'Beginner', href: '/learning-tracks/javascript' },
  { name: 'React', icon: '⚛️', students: '9.8K', level: 'Intermediate', href: '/learning-tracks/react' },
  { name: 'System Design', icon: '🏗️', students: '7.2K', level: 'Advanced', href: '/learning-tracks/system-design' },
  { name: 'Data Structures', icon: '🧮', students: '11.5K', level: 'Intermediate', href: '/learning-tracks/data-structures' },
  { name: 'Machine Learning', icon: '🤖', students: '6.3K', level: 'Advanced', href: '/learning-tracks/machine-learning' },
]

const faqs = [
  { q: 'Is BlueLearnerHub completely free?', a: 'Yes. Our core platform — including all learning tracks, coding challenges, daily AI quizzes, and community Q&A — is 100% free. A premium tier unlocks advanced features like priority AI coaching and exclusive hackathon prizes.' },
  { q: 'What courses are available?', a: 'Python, JavaScript, TypeScript, React, Node.js, System Design, Data Structures & Algorithms, Docker, Machine Learning, SQL, and DevOps — with new tracks launched monthly.' },
  { q: 'Are the certificates recognised by employers?', a: 'Yes. Each certificate has a unique verifiable URL and is accepted by our partner companies in their hiring pipelines. Sharing your BlueLearnerHub profile directly to recruiters is built-in.' },
  { q: 'How do the AI hackathons work?', a: 'Our hackathons use Google Gemini AI to auto-generate problem sets, evaluate submissions, and provide personalised coaching tips. Students compete globally for real prizes.' },
  { q: 'Can I use BlueLearnerHub to hire talent?', a: 'Absolutely. Our Organizations portal lets companies post challenges, filter by certificate, and directly recruit verified learners who have proven skills in their required domains.' },
]

const challenges = [
  { title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'], solved: '98.2K', acceptance: '92%' },
  { title: 'Binary Tree Traversal', difficulty: 'Medium', tags: ['Tree', 'DFS'], solved: '54.1K', acceptance: '74%' },
  { title: 'LRU Cache Design', difficulty: 'Hard', tags: ['Design', 'LinkedList'], solved: '21.8K', acceptance: '48%' },
]

// ─── Newsletter lead capture ──────────────────────────────────────────────────

function NewsletterCapture({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return
    setLoading(true)
    try {
      // Fire-and-forget — store lead even if backend is starting up
      await api.post('/leads/capture', { email, source: 'homepage_newsletter' }).catch(() => {})
      setDone(true)
      toast.success('You\'re on the list! Check your inbox for your free starter kit.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className={cn('flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4', className)}>
        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
        <span className="text-sm font-bold text-emerald-300">You're in! Free Python Starter Kit arriving shortly.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-3 sm:flex-row', className)}>
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email — get free Python starter kit"
          required
          className="h-14 w-full rounded-full border border-border bg-card/60 pl-11 pr-6 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 backdrop-blur-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="h-14 rounded-full bg-primary px-8 text-sm font-bold text-white transition-all hover:scale-105 hover:shadow-[0_0_25px_hsl(var(--primary)/0.4)] disabled:opacity-50 shrink-0"
      >
        {loading ? 'Joining…' : 'Get Free Access →'}
      </button>
    </form>
  )
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="cursor-pointer rounded-2xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/30 hover:bg-card"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-bold text-foreground">{q}</h3>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4 overflow-hidden text-sm leading-relaxed text-muted-foreground"
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-primary/20">
      <HomeJsonLd />
      <div className="bg-noise" />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-[980px] px-6 py-32 sm:py-48">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-center"
        >
          <div className="mb-8 flex justify-center">
            <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 px-4 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              🚀 The Future of Tech Education — 100% Free
            </Badge>
          </div>

          <h1 className="mb-8 font-serif text-6xl font-medium leading-[1.0] tracking-tight text-foreground sm:text-8xl">
            Master Your Skills.
            <br />
            <span className="gradient-primary-text">Showcase Your Portfolio.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl font-serif text-xl leading-relaxed text-foreground/80 sm:text-2xl">
            Learn, build, and showcase your skills across any domain. Create real-world projects,
            participate in challenges, and build a portfolio that gets you noticed. Join thousands of learners growing every day.
          </p>

        </motion.header>
      </section>


      {/* ── FEATURES GRID ─────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="mb-16">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">Platform Capabilities</h2>
          <h3 className="font-serif text-5xl font-medium text-foreground sm:text-6xl">
            Everything you need to get hired.
          </h3>
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
                className="group relative overflow-hidden rounded-[2.5rem] bg-card p-10 text-left transition-all hover:bg-card/80 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className={cn('mb-8 flex h-16 w-16 items-center justify-center rounded-2xl transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white', f.bg, f.color)}>
                  <Icon size={32} />
                </div>
                <h4 className="mb-4 font-serif text-2xl font-medium text-foreground">{f.title}</h4>
                <p className="font-serif text-base leading-relaxed text-muted-foreground">{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>


      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-primary/80">FAQ</h2>
          <h3 className="font-serif text-4xl font-medium text-foreground">Frequently asked questions</h3>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>

      {/* ── FINAL CTA WITH EMAIL CAPTURE ──────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[3rem] bg-card p-16"
          >
            <h2 className="mb-6 font-serif text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
              Start learning today.<br />It's free.
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-serif text-xl text-muted-foreground">
              Join 50,000 learners already building their dream tech career on BlueLearnerHub.
              No credit card. No catch.
            </p>
            <NewsletterCapture className="mx-auto mb-6 max-w-xl" />
            <p className="text-xs text-muted-foreground">
              Or{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                sign in if you already have an account
              </Link>
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
