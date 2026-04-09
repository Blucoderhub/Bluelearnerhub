'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  GraduationCap,
  Users,
  Building2,
  Rocket,
  BarChart3,
  Zap,
  ChevronRight,
  PlayCircle,
  Award,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ACADEMY_FEATURES = [
  {
    title: 'Admin Dashboard',
    description: 'Powerful control panel to manage students, groups, and assignments in one place.',
    icon: Users,
    color: 'text-foreground/70',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Custom Learning Paths',
    description: "Tailor modules, quizzes, and exams to match your organization's specific needs.",
    icon: Rocket,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Real-Time Analytics',
    description:
      'Measure performance and track progress with detailed reporting and data insights.',
    icon: BarChart3,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Certified Mastery',
    description:
      'Official Bluelearner certificates and badges for every student who completes a path.',
    icon: Award,
    color: 'text-foreground/70',
    bgColor: 'bg-primary/10',
  },
]

const SECTORS = [
  {
    title: 'Schools & Universities',
    description: 'Supplement your curriculum with industry-standard labs and real-time tracking.',
    icon: GraduationCap,
    link: '#contact',
  },
  {
    title: 'Businesses & Teams',
    description: 'Upskill your workforce with specialized tracks in Engineering and Management.',
    icon: Building2,
    link: '#contact',
  },
  {
    title: 'Bootcamps',
    description: 'Accelerate student learning with pre-built projects and automated assessments.',
    icon: Zap,
    link: '#contact',
  },
]

export default function AcademyPage() {
  const [selectedSubject, setSelectedSubject] = useState('HTML & CSS')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden pb-24 pt-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-8 text-center">
            <Badge
              variant="outline"
              className="rounded-full border-border bg-primary/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground/70"
            >
              Bluelearner Academy
            </Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl">
              The Complete Platform to{' '}
              <span className="bg-gradient-to-r from-primary/80 to-blue-200 bg-clip-text text-transparent">
                Train Your Team
              </span>
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground md:text-2xl">
              Manage learning, track progress, and upskill your organization with the world's most
              trusted engineering content.
            </p>
            <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
              <Button className="h-14 rounded-2xl bg-primary px-10 text-lg font-black text-white shadow-xl shadow-primary/15 transition-all hover:bg-primary/90 active:scale-[0.98]">
                Get Started Free
              </Button>
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border bg-card/50 px-10 text-lg font-bold text-white transition-all hover:bg-secondary"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Organizations Grid */}
      <section className="border-y border-slate-800/50 bg-slate-900/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Built for Organizations That Train
            </h2>
            <p className="text-muted-foreground">
              Everything you need to deliver world-class technical education.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {SECTORS.map((sector) => (
              <div
                key={sector.title}
                className="group rounded-[2.5rem] border border-border bg-slate-900/40 p-8 transition-all hover:border-border"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-foreground/70 transition-transform group-hover:scale-110">
                  <sector.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{sector.title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {sector.description}
                </p>
                <Link
                  href={sector.link}
                  className="inline-flex items-center gap-2 text-sm font-bold text-foreground/70 hover:underline"
                >
                  Learn More <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Set Up Semester Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
                Set Up a Semester{' '}
                <span className="text-foreground/70 underline decoration-border">in Seconds</span>
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Pick a subject, and your learning path is ready. Modules, quizzes, and a final exam,
                all built in. Fully customizable for your team.
              </p>
              <div className="space-y-4">
                {['HTML & CSS', 'Python Mastery', 'Data Analytics', 'Management 101'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`group flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${selectedSubject === sub ? 'border-primary/40 bg-primary/10 text-foreground/70' : 'border-border bg-card/50 text-muted-foreground hover:border-border'}`}
                  >
                    <span className="font-bold">{sub}</span>
                    <CheckCircle2
                      className={`h-5 w-5 transition-opacity ${selectedSubject === sub ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full flex-1">
              <div className="relative overflow-hidden rounded-[3rem] border border-border bg-card/50 p-8 pt-12 shadow-2xl">
                <div className="absolute left-8 top-4 flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-primary/50" />
                  <div className="h-3 w-3 rounded-full bg-blue-500/50" />
                </div>
                <div className="space-y-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">
                        {selectedSubject} Academy Track
                      </h4>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        Enrollment: 124 Students
                      </p>
                    </div>
                    <Badge className="border-none bg-primary/10 text-foreground/70">
                      Active Hub
                    </Badge>
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-2xl border border-white/5 bg-secondary/30 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-foreground/70">
                        <PlayCircle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-2 h-2 w-24 rounded-full bg-muted" />
                        <div className="h-1.5 w-40 rounded-full bg-secondary" />
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-slate-700" />
                    </div>
                  ))}
                  <div className="mt-8 flex items-center justify-between border-t border-border pt-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Progress: 68%</span>
                    <span>Average: 84%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need */}
      <section className="border-y border-border bg-primary/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-20 space-y-4 text-center">
            <h2 className="text-4xl font-extrabold text-white">Everything You Need</h2>
            <p className="text-lg text-muted-foreground">
              Powerful features to manage learning at any scale.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {ACADEMY_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="space-y-4 rounded-3xl border border-border bg-card/60 p-6"
              >
                <div
                  className={`h-12 w-12 ${feature.bgColor} ${feature.color} flex items-center justify-center rounded-xl`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results You Can Measure */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[3rem] border border-border bg-slate-900/40 p-12 lg:p-20">
            <div className="absolute right-0 top-0 -mr-64 -mt-64 h-[600px] w-[600px] bg-primary/5 blur-[120px]" />
            <div className="relative z-10 flex flex-col items-center gap-16 lg:flex-row">
              <div className="flex-1 space-y-6">
                <h2 className="text-4xl font-black text-white">
                  Results You Can <span className="text-foreground/70">Measure</span>
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Show leadership exactly what training delivers. Track individual performance,
                  identify skill gaps, and celebrate mastery.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white">92%</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Completion Rate
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-white">4.8/5</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Student Rating
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full flex-1 space-y-8 rounded-3xl border border-white/5 bg-secondary/50 p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Monthly Skills Growth</span>
                  <TrendingUp className="h-5 w-5 text-foreground/70" />
                </div>
                <div className="flex h-48 items-end gap-3 px-4">
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div
                      key={i}
                      className="group relative flex-1 rounded-t-lg bg-primary/15 transition-all hover:bg-primary/40"
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-primary px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {h}%
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-black tracking-tight text-white">
              Simple Seat-Based Pricing
            </h2>
            <p className="text-muted-foreground">
              Scalable training for any size. No long-term commitment required.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-8 rounded-[2.5rem] border border-border bg-card/60 p-10">
              <h3 className="text-2xl font-bold text-white">Self-Service</h3>
              <div className="space-y-2">
                <p className="text-5xl font-black text-white">
                  $5.99
                  <span className="ml-2 text-sm font-bold text-muted-foreground">
                    / seat per month
                  </span>
                </p>
                <p className="text-sm font-bold text-foreground/70">Standard Platform Access</p>
              </div>
              <ul className="space-y-4">
                {[
                  'Access to all 45+ Technologies',
                  'Admin Dashboard',
                  'Real-time Progress Tracking',
                  'Official Certificates',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-foreground/70" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="h-12 w-full rounded-xl bg-white font-black text-slate-900 transition-all hover:bg-slate-100">
                Try Academy Free
              </Button>
            </div>
            <div className="relative space-y-8 overflow-hidden rounded-[2.5rem] border-2 border-border bg-primary/10 p-10">
              <div className="absolute right-5 top-5">
                <Badge className="border-none bg-primary text-[10px] font-black uppercase tracking-widest text-white">
                  Scale
                </Badge>
              </div>
              <h3 className="text-2xl font-bold text-white">Organizations</h3>
              <div className="space-y-2">
                <p className="text-5xl font-black text-white">Custom</p>
                <p className="text-center text-sm font-bold text-foreground/70">
                  Volume Discounts Available
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  'Everything in Self-Service',
                  'Custom Learning Paths',
                  'Bulk User Enrollment',
                  'Dedicated Account Support',
                  'SSO & API Access',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                    <CheckCircle2 className="h-5 w-5 text-foreground/70" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="h-12 w-full rounded-xl bg-primary font-black text-white shadow-lg shadow-primary/15 transition-all hover:bg-primary/90">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="group relative space-y-8 overflow-hidden rounded-[3rem] bg-gradient-to-br from-primary/90 to-blue-600 p-12 text-center shadow-2xl md:p-20">
            <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative z-10 space-y-6"
            >
              <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Ready to Train Your Team?
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium text-foreground">
                Join thousands of organizations building the next generation of engineers with
                Bluelearner Academy.
              </p>
              <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
                <Button className="h-16 rounded-2xl bg-white px-12 text-xl font-black text-foreground/90 shadow-xl transition-all hover:bg-secondary active:scale-[0.95]">
                  Start Free Trial
                </Button>
                <Button
                  variant="outline"
                  className="h-16 rounded-2xl border-white/30 bg-white/10 px-12 text-xl font-bold text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
