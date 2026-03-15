'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Code2,
  Trophy,
  BookOpen,
  Zap,
  Star,
  Users,
  CheckCircle2,
  Play,
  ChevronRight,
  Terminal,
  Brain,
  Flame,
  Award,
  BarChart3,
  Globe,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { value: '120K+', label: 'Active Learners' },
  { value: '2,400+', label: 'Coding Challenges' },
  { value: '180+', label: 'Learning Paths' },
  { value: '98%', label: 'Satisfaction Rate' },
]

const features = [
  {
    icon: BookOpen,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    title: 'Interactive Tutorials',
    desc: 'Learn by doing with W3Schools-style lessons and a live code playground side-by-side.',
  },
  {
    icon: Code2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    title: 'Coding Challenges',
    desc: 'Solve LeetCode-style problems with instant feedback, hints, and solutions explained.',
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
    desc: 'Earn industry-recognized credentials and share them directly to LinkedIn.',
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

const paths = [
  { title: 'Frontend Development', lessons: 48, level: 'Beginner', icon: '🎨', color: 'from-blue-600/20 to-indigo-600/20', badge: 'Popular' },
  { title: 'Data Structures & Algorithms', lessons: 120, level: 'Intermediate', icon: '🔷', color: 'from-violet-600/20 to-purple-600/20', badge: 'Top Pick' },
  { title: 'Machine Learning & AI', lessons: 64, level: 'Advanced', icon: '🤖', color: 'from-emerald-600/20 to-teal-600/20', badge: 'Trending' },
  { title: 'System Design', lessons: 36, level: 'Advanced', icon: '🏗️', color: 'from-orange-600/20 to-amber-600/20', badge: '' },
  { title: 'Backend Engineering', lessons: 52, level: 'Intermediate', icon: '⚙️', color: 'from-red-600/20 to-pink-600/20', badge: '' },
  { title: 'DevOps & Cloud', lessons: 44, level: 'Intermediate', icon: '☁️', color: 'from-sky-600/20 to-cyan-600/20', badge: 'New' },
]

const challenges = [
  { title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'Hash Map'], solved: '98.2K', acceptance: '92%' },
  { title: 'Binary Tree Traversal', difficulty: 'Medium', tags: ['Tree', 'DFS'], solved: '54.1K', acceptance: '74%' },
  { title: 'LRU Cache Design', difficulty: 'Hard', tags: ['Design', 'LinkedList'], solved: '21.8K', acceptance: '48%' },
]

const hackathons = [
  { title: 'AI Revolution 2026', prize: '$10,000', participants: 1240, daysLeft: 5, domain: 'Computer Science' },
  { title: 'FinTech Hack X', prize: '$7,500', participants: 890, daysLeft: 12, domain: 'Finance' },
  { title: 'Green Civil Futures', prize: '$3,000', participants: 600, daysLeft: 20, domain: 'Civil Eng.' },
]

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    color: 'bg-violet-500',
    text: 'BlueLearnerHub is the most complete learning platform I have used. The LeetCode-style challenges combined with video lessons kept me hooked for months. Landed my dream job.',
    rating: 5,
  },
  {
    name: 'Alex Chen',
    role: 'CS Student @ MIT',
    avatar: 'AC',
    color: 'bg-blue-500',
    text: 'The AI daily quizzes are incredibly smart — they actually adapt to where I am weak. My DSA skills went from average to top 5% in 3 months.',
    rating: 5,
  },
  {
    name: 'Jordan Lee',
    role: 'Freelance Developer',
    avatar: 'JL',
    color: 'bg-emerald-500',
    text: 'I won my first hackathon through this platform. The community is incredibly supportive, and the certificates are genuinely recognized by recruiters.',
    rating: 5,
  },
]

const difficultyColors: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Hard: 'text-red-400 bg-red-400/10 border-red-400/20',
}

const EASE = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function LandingPage() {
  const [hoveredPath, setHoveredPath] = useState<number | null>(null)

  return (
    <main className="bg-background text-foreground overflow-x-hidden">

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="relative z-10 max-w-4xl mx-auto space-y-8"
        >
          <motion.div variants={fadeUp}>
            <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-xs font-semibold rounded-full mb-6 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              The All-in-One Developer Learning Platform
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl font-black font-heading tracking-tighter text-white leading-[1.05]"
          >
            Master Coding.{' '}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Learn to code with interactive tutorials, solve real challenges, compete in hackathons, and prepare for technical interviews — all in one focused platform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/get-started"
              className="group inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 border border-border bg-background/60 backdrop-blur-sm hover:bg-muted/50 text-foreground/80 px-8 py-4 rounded-2xl text-base font-bold hover:-translate-y-0.5 transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Explore Courses
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {['bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-background flex items-center justify-center text-white text-[10px] font-bold`}>
                  {['A', 'P', 'J', 'S'][i]}
                </div>
              ))}
            </div>
            <span>Joined by <strong className="text-foreground">120,000+</strong> developers worldwide</span>
          </motion.div>
        </motion.div>

        {/* Hero code preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-16 w-full max-w-3xl mx-auto"
        >
          <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-card/80">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs text-muted-foreground font-mono">two_sum.py</span>
              <Badge className="ml-auto text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Easy</Badge>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-muted-foreground/60 text-xs mb-3"># Two Sum — return indices of two numbers that add to target</div>
              <div><span className="text-violet-400">def</span> <span className="text-blue-400">two_sum</span><span className="text-foreground/80">(nums, target):</span></div>
              <div className="pl-6"><span className="text-violet-400">seen</span> <span className="text-foreground/80">= {}</span></div>
              <div className="pl-6"><span className="text-amber-400">for</span> <span className="text-foreground/80">i, num</span> <span className="text-amber-400">in</span> <span className="text-foreground/80">enumerate(nums):</span></div>
              <div className="pl-12"><span className="text-foreground/80">complement = target - num</span></div>
              <div className="pl-12"><span className="text-amber-400">if</span> <span className="text-foreground/80">complement</span> <span className="text-amber-400">in</span> <span className="text-foreground/80">seen:</span></div>
              <div className="pl-20"><span className="text-amber-400">return</span> <span className="text-foreground/80">[seen[complement], i]</span></div>
              <div className="pl-12"><span className="text-foreground/80">seen[num] = i</span></div>
              <div className="mt-3 flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All 12 test cases passed · O(n) time · +50 XP earned</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── STATS ─────────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-black font-heading text-white">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ──────────────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-4"
          >
            <Badge className="bg-muted text-muted-foreground border-border text-xs px-4 py-1.5 rounded-full">Everything in one place</Badge>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-white">
              One platform, every skill.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              BlueLearnerHub brings together the best of W3Schools, LeetCode, HackerRank, and Coursera into a single, focused learning experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="group p-6 rounded-2xl border border-border bg-card/40 hover:bg-card/80 hover:border-border/80 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── LEARNING PATHS ────────────────────────────────────────────── */}
      <section className="py-28 px-4 bg-card/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div className="space-y-3">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs px-4 py-1.5 rounded-full">Structured Curriculum</Badge>
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-white">
                Choose your path.
              </h2>
              <p className="text-muted-foreground max-w-xl">
                Curated learning tracks from beginner to advanced, with clear milestones and certification at the end.
              </p>
            </div>
            <Link href="/tutorials" className="group flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors shrink-0">
              View all paths <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paths.map((path, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                onHoverStart={() => setHoveredPath(i)}
                onHoverEnd={() => setHoveredPath(null)}
                className="group relative p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{path.icon}</span>
                    {path.badge && (
                      <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20">{path.badge}</Badge>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-white">{path.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{path.lessons} lessons</span>
                    <span>·</span>
                    <Badge variant="outline" className="text-[10px] border-border">{path.level}</Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs font-bold text-primary">Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CODING CHALLENGES ─────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/20 text-xs px-4 py-1.5 rounded-full">LeetCode-style practice</Badge>
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-white">
                Sharpen your algorithm skills.
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                2,400+ curated coding problems with detailed explanations, optimal solutions, and real-time code execution in your browser.
              </p>
              <ul className="space-y-3">
                {[
                  'Monaco-powered code editor with IntelliSense',
                  'Multi-language support: Python, JS, Java, C++, Go',
                  'Instant test case validation with stdout preview',
                  'Step-by-step editorial explanations',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/ide">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-11 font-bold gap-2">
                  <Terminal className="w-4 h-4" />
                  Try a Challenge
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {challenges.map((c, i) => (
                <div key={i} className="group p-5 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-border/80 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <Badge className={`text-[10px] border font-semibold ${difficultyColors[c.difficulty]}`}>{c.difficulty}</Badge>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {c.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] border-border text-muted-foreground">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
                    <span>{c.solved} solved</span>
                    <span>{c.acceptance} acceptance</span>
                    <span className="group-hover:text-primary transition-colors font-semibold flex items-center gap-1">
                      Solve <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HACKATHON ─────────────────────────────────────────────────── */}
      <section className="py-28 px-4 bg-card/20 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 space-y-4"
          >
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs px-4 py-1.5 rounded-full">
              <Trophy className="w-3 h-3 mr-1.5 inline" />
              Compete Globally
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-white">
              Win prizes. Get hired.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Domain-specific hackathons where companies sponsor challenges, discover talent, and offer real job opportunities to top performers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {hackathons.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 fill-current" />
                    OPEN
                  </Badge>
                  <span className="text-xs text-muted-foreground">{h.daysLeft} days left</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-primary transition-colors">{h.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">{h.domain}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Prize Pool</div>
                    <div className="text-base font-black text-white">{h.prize}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Participants</div>
                    <div className="text-base font-black text-white">{h.participants.toLocaleString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/hackathons">
              <Button variant="outline" className="border-border hover:bg-muted/50 rounded-xl px-8 h-11 font-bold gap-2">
                View All Hackathons <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 space-y-4"
          >
            <Badge className="bg-muted text-muted-foreground border-border text-xs px-4 py-1.5 rounded-full">Learner Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-white">
              Loved by 120,000+ learners.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl border border-border bg-card/50 flex flex-col gap-4"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/15 to-transparent rounded-full blur-3xl" />
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-4 py-1.5 rounded-full mb-6 inline-flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" />
              Free to start — no credit card required
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-white mb-6">
              Ready to level up your skills?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join 120,000+ developers who are mastering coding, winning hackathons, and landing their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/get-started"
                className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-2xl text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/tutorials"
                className="inline-flex items-center justify-center gap-2 border border-border bg-background/60 hover:bg-muted/50 text-foreground/80 px-10 py-4 rounded-2xl text-base font-bold hover:-translate-y-0.5 transition-all duration-200"
              >
                Browse Tutorials
              </Link>
            </div>
            <div className="flex items-center justify-center gap-8 mt-12 text-xs text-muted-foreground">
              {[
                { icon: Shield, text: 'No spam, ever' },
                { icon: Globe, text: 'Available worldwide' },
                { icon: Users, text: 'Active community' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
