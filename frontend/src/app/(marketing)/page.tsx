'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Users,
  GraduationCap,
  Code2,
  Trophy,
  BookOpen,
  Star,
  Play,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react'
import { MiniIDE } from '@/components/ui/MiniIDE'
import { AIBubblePreview } from '@/components/ui/AIBubblePreview'
import { LeaderboardTicker } from '@/components/ui/LeaderboardTicker'

// ─── Features ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Gemini AI generates personalized quizzes and provides real-time feedback on your code submissions.',
  },
  {
    icon: Code2,
    title: 'Built-in Code Editor',
    description: 'Practice in our browser-based IDE supporting 15+ languages with instant execution.',
  },
  {
    icon: Trophy,
    title: 'Weekly Hackathons',
    description: 'Compete in AI-generated challenges, win prizes, and build a portfolio that stands out.',
  },
  {
    icon: GraduationCap,
    title: 'Expert Mentorship',
    description: 'Connect with industry mentors for personalized guidance and career advice.',
  },
  {
    icon: BookOpen,
    title: 'Free Library',
    description: 'Access comprehensive engineering tutorials for CS, Mechanical, Electrical, Civil, and Management domains.',
  },
  {
    icon: TrendingUp,
    title: 'Career Growth',
    description: 'Track your progress, earn XP, climb leaderboards, and showcase achievements to recruiters.',
  },
]

// ─── Domains ───────────────────────────────────────────────────────────────────
const domains = [
  {
    name: 'Computer Science',
    icon: Code2,
    color: 'bg-blue-500/10 text-blue-600',
    topics: ['Python', 'JavaScript', 'Data Structures', 'Algorithms'],
  },
  {
    name: 'Mechanical',
    icon: Trophy,
    color: 'bg-orange-500/10 text-orange-600',
    topics: ['Thermodynamics', 'CAD/CAM', 'Manufacturing'],
  },
  {
    name: 'Electrical',
    icon: Zap,
    color: 'bg-yellow-500/10 text-yellow-600',
    topics: ['Circuit Analysis', 'Power Systems', 'Electronics'],
  },
  {
    name: 'Civil',
    icon: Star,
    color: 'bg-emerald-500/10 text-emerald-600',
    topics: ['Structural Analysis', 'Geotechnical', 'Hydraulics'],
  },
]


export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              Learn. Practice.{' '}
              <span className="text-primary">Compete. Succeed.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8"
            >
              India&apos;s complete EdTech platform for engineering students. Master programming with AI-powered quizzes, coding challenges, hackathons, and expert mentorship.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:bg-primary/90"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-transparent px-8 py-3.5 text-base font-medium transition-colors hover:bg-accent/50"
              >
                <Play className="h-5 w-5" />
                Browse Library
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 100% free
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cancel anytime
              </span>
            </motion.div>

            {/* ── Interactive IDE Demo ── */}
            <MiniIDE />
          </div>
        </div>
      </section>

      {/* Floating Elements */}
      <AIBubblePreview />
      <LeaderboardTicker />

      {/* ── Features ── */}
      <section className="section">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="mb-4">
              Everything you need to{' '}
              <span className="text-primary">master your engineering domain</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We built the platform we wished existed when we were studying engineering. No fluff, no paywalls — just practical skills.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative flex flex-col rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                
                {/* Visual Mockups for key features */}
                {feature.title === 'Career Growth' && (
                  <div className="mt-auto space-y-3 rounded-lg border border-border/50 bg-background/50 p-3 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground">User Level 12</span>
                      <span className="text-primary font-black">2,450 XP</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '75%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-accent" 
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 text-yellow-500">
                        <Trophy className="h-2.5 w-2.5" /> Golden Dev
                      </div>
                      <div className="flex items-center gap-1 rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-500">
                        <Star className="h-2.5 w-2.5" /> Skill Master
                      </div>
                    </div>
                  </div>
                )}

                {feature.title === 'AI-Powered Learning' && (
                  <div className="mt-auto flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-3 italic text-[10px] text-muted-foreground">
                    <Sparkles className="h-3 w-3 text-primary" />
                    "Your code uses a linear search. Try O(log n) approach..."
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section className="section bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="mb-4">
              Free Learning Library
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Comprehensive engineering and management tutorials. No login required.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain) => (
              <Link
                key={domain.name}
                href={`/library/${domain.name.toLowerCase().replace(' ', '-')}`}
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-border-accent hover:shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <domain.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 font-semibold group-hover:text-primary transition-colors">
                  {domain.name}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {domain.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${domain.color}`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/library"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Browse all domains
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>



      {/* ── CTA ── */}
      <section className="section bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center bg-card p-12 rounded-2xl border border-border">
          <h2 className="mb-4 text-foreground">Ready to start your journey?</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
            Join 50,000+ learners mastering programming skills and landing dream jobs. Free — no credit card needed.
          </p>
          <Link
            href="/get-started"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-base font-medium text-white shadow-sm transition-all hover:bg-primary/90"
          >
            <Users className="h-5 w-5" />
            Join BlueLearnerHub Free
          </Link>
        </div>
      </section>
    </main>
  )
}

