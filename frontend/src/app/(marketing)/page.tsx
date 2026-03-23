'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HomeJsonLd } from '@/components/seo/JsonLd'

// ─── Static data ──────────────────────────────────────────────────────────────

const faqs = [
  { q: 'Is BlueLearnerHub completely free?', a: 'Yes. Our core platform — including all learning tracks, coding challenges, daily AI quizzes, and community Q&A — is 100% free. A premium tier unlocks advanced features like priority AI coaching and exclusive hackathon prizes.' },
  { q: 'What courses are available?', a: 'Python, JavaScript, TypeScript, React, Node.js, System Design, Data Structures & Algorithms, Docker, Machine Learning, SQL, and DevOps — with new tracks launched monthly.' },
  { q: 'Are the certificates recognised by employers?', a: 'Yes. Each certificate has a unique verifiable URL and is accepted by our partner companies in their hiring pipelines. Sharing your BlueLearnerHub profile directly to recruiters is built-in.' },
  { q: 'How do the AI hackathons work?', a: 'Our hackathons use Google Gemini AI to auto-generate problem sets, evaluate submissions, and provide personalised coaching tips. Students compete globally for real prizes.' },
  { q: 'Can I use BlueLearnerHub to hire talent?', a: 'Absolutely. Our Organizations portal lets companies post challenges, filter by certificate, and directly recruit verified learners who have proven skills in their required domains.' },
]

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
      <section className="relative mx-auto max-w-[980px] px-6 pt-16 pb-32 sm:pt-24 sm:pb-48">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="text-center"
        >
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
    </main>
  )
}
