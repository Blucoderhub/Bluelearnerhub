'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, ArrowRight, Play, Users, Award, Code2, Trophy, Brain, Zap, CheckCircle2, Star, BookOpen, Target, TrendingUp, X, Video } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HomeJsonLd } from '@/components/seo/JsonLd'

// ─── Demo Video Modal ─────────────────────────────────────────────────────────
function DemoVideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-4xl mx-4 rounded-3xl bg-card overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Video placeholder - replace src with actual video URL */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-violet-600/20 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Video className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-foreground">BlueLearnerHub Demo</h3>
                <p className="mb-4 text-muted-foreground">Platform walkthrough video coming soon</p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <Play className="h-5 w-5" /> Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border p-6">
              <h4 className="mb-2 font-semibold text-foreground">What you'll learn:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> How to take your first AI-powered quiz
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Earn XP and unlock achievements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Complete learning tracks to earn certificates
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Animated Counter ───────────────────────────────────────────────────────────
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Stats Section ─────────────────────────────────────────────────────────────
const stats = [
  { value: 50000, suffix: '+', label: 'Active Learners' },
  { value: 150, suffix: '+', label: 'Learning Tracks' },
  { value: 10000, suffix: '+', label: 'Challenges Solved' },
  { value: 85, suffix: '%', label: 'Success Rate' },
]

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Gemini AI generates personalized quizzes and provides real-time feedback on your code submissions.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Trophy,
    title: 'Weekly Hackathons',
    description: 'Compete in AI-generated challenges, win prizes, and build a portfolio that stands out.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    description: 'Earn employer-recognized certificates with unique verification URLs directly shareable to recruiters.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Code2,
    title: 'Real Code Editor',
    description: 'Practice in our browser-based IDE supporting 15+ programming languages with instant execution.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: BookOpen,
    title: 'Structured Tracks',
    description: 'Follow curated learning paths from beginner to advanced, designed by industry experts.',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'XP, streaks, achievements, and leaderboards keep you motivated throughout your journey.',
    color: 'from-indigo-500 to-blue-600',
  },
]

// ─── How It Works ─────────────────────────────────────────────────────────────
const steps = [
  {
    step: '01',
    title: 'Choose Your Path',
    description: 'Select from 150+ learning tracks across Python, JavaScript, React, System Design, and more.',
  },
  {
    step: '02',
    title: 'Learn by Doing',
    description: 'Complete interactive exercises, solve coding challenges, and build real projects.',
  },
  {
    step: '03',
    title: 'Get AI Feedback',
    description: 'Receive instant code reviews and personalized guidance from our Gemini AI tutor.',
  },
  {
    step: '04',
    title: 'Earn & Compete',
    description: 'Accumulate XP, unlock achievements, and climb the global leaderboard.',
  },
]

// ─── Testimonials ───────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Google',
    avatar: 'PS',
    content: 'BlueLearnerHub helped me crack my Google interview. The system design tracks are incredible.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Full Stack Developer',
    avatar: 'RV',
    content: 'The daily AI quizzes kept my skills sharp. I solved 500+ challenges in 3 months.',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Computer Science Student',
    avatar: 'AP',
    content: 'Best free platform for DSA practice. The hackathons gave me real-world project experience.',
    rating: 5,
  },
]

// ─── FAQ ───────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Is BlueLearnerHub completely free?',
    a: 'Yes! Our core platform — including all learning tracks, 10,000+ coding challenges, daily AI quizzes, and community Q&A — is 100% free forever. Premium adds priority AI coaching and exclusive hackathon prizes.',
  },
  {
    q: 'What programming languages can I learn?',
    a: 'Python, JavaScript, TypeScript, Java, C++, Go, Rust, SQL, and more. Each language has dedicated tracks from basics to advanced with hands-on coding exercises.',
  },
  {
    q: 'How do the AI-powered quizzes work?',
    a: 'Our Gemini AI generates fresh quizzes daily based on your skill level and learning history. Each question includes explanations and links to relevant resources.',
  },
  {
    q: 'Are the certificates recognized by employers?',
    a: 'Yes! Our certificates have unique verification URLs and are accepted by 500+ hiring partners including Google, Amazon, Microsoft, and top startups across India.',
  },
  {
    q: 'How do hackathons work?',
    a: 'Every weekend, we run AI-generated hackathons. You get a problem, 48 hours, and your creativity. Top performers win prizes and get featured on our leaderboard.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="cursor-pointer rounded-2xl border border-border/50 bg-card/40 p-6 transition-all hover:border-primary/30 hover:bg-card"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-foreground">{q}</h3>
        <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden text-muted-foreground"
          >
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <HomeJsonLd />
      
      {/* Demo Video Modal */}
      <DemoVideoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

      {/* ── NAVIGATION ─────────────────────────────────────────────────────── */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">BlueLearnerHub</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link href="/get-started" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-violet-500/10 to-transparent blur-[120px]" />
          <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-[100px]" />
        </div>

        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-primary">5,000+ learners joined this month</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl"
          >
            <span className="text-foreground">Learn to Code.</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-violet-600 to-amber-500 bg-clip-text text-transparent">
              Land Your Dream Job.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            The complete coding bootcamp that's free forever. Master Python, JavaScript, React, and System Design through AI-powered quizzes, real code challenges, and weekly hackathons.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/get-started"
              className="group flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => setShowDemo(true)}
              className="group flex items-center gap-2 rounded-2xl border border-border/50 bg-card/50 px-8 py-4 text-lg font-semibold transition-all hover:bg-card hover:border-border"
            >
              <Play className="h-5 w-5" />
              Watch Demo (2 min)
            </button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% free forever
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="mb-2 text-3xl font-black sm:text-4xl">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Why BlueLearnerHub?
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Everything you need to{' '}
              <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
                become a developer
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We built the platform we wished existed when we were learning to code. No fluff, no paywalls — just practical skills that get you hired.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-8 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={cn('mb-6 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white', feature.color)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-card/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Getting Started
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Start your journey in 4 steps
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/50 via-violet-500/50 to-transparent sm:block hidden" />

            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={cn('relative flex flex-col gap-8 sm:flex-row', i % 2 === 1 && 'sm:flex-row-reverse')}
                >
                  <div className="flex-1 sm:text-right">
                    {i % 2 === 0 ? (
                      <div className="rounded-3xl border border-border/50 bg-card p-8 text-left">
                        <span className="mb-4 inline-block font-mono text-sm font-bold text-primary">{step.step}</span>
                        <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    ) : (
                      <div className="rounded-3xl border border-border/50 bg-card p-8 text-left sm:text-right">
                        <span className="mb-4 inline-block font-mono text-sm font-bold text-primary">{step.step}</span>
                        <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-border bg-background shadow-lg sm:static sm:translate-x-0">
                    <span className="font-mono text-sm font-bold text-primary">{step.step}</span>
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section id="testimonials" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Success Stories
            </span>
            <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Hear from our learners
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-border/50 bg-card p-8"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-600 text-lg font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary via-violet-600 to-purple-700 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="mx-auto mb-6 h-12 w-12" />
            <h2 className="mb-6 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Ready to start your coding journey?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80">
              Join 50,000+ learners who are mastering programming skills and landing their dream jobs. It's completely free — no credit card needed.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-primary shadow-xl transition-all hover:bg-white/90 hover:shadow-2xl hover:-translate-y-1"
            >
              <Users className="h-5 w-5" />
              Join BlueLearnerHub Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              FAQ
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 bg-card/30 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">BlueLearnerHub</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 BlueLearnerHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
