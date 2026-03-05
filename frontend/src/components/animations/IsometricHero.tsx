'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Play,
  Users,
  Trophy,
  Briefcase,
  Sparkles,
  GraduationCap,
  Code2,
  ChevronDown,
} from 'lucide-react'

const socialProofAvatars = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
]

const floatingTags = [
  { label: 'Python', x: '8%', y: '20%', delay: 0 },
  { label: 'React', x: '85%', y: '25%', delay: 0.3 },
  { label: 'AI/ML', x: '12%', y: '75%', delay: 0.6 },
  { label: 'DevOps', x: '80%', y: '70%', delay: 0.9 },
  { label: 'Data Science', x: '75%', y: '15%', delay: 1.2 },
  { label: 'Cloud', x: '15%', y: '45%', delay: 1.5 },
]

const stats = [
  { icon: Users, value: '50K+', label: 'Active Learners' },
  { icon: Code2, value: '10K+', label: 'Challenges' },
  { icon: Trophy, value: '500+', label: 'Hackathons' },
  { icon: Briefcase, value: '2K+', label: 'Jobs Posted' },
]

export default function IsometricHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden flex flex-col"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#030B1A] via-[#061A2E] to-[#0A1628]" />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full bg-gradient-to-br from-blue-600/10 via-emerald-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-purple-600/8 to-transparent blur-3xl" />

      {floatingTags.map((tag, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + tag.delay, duration: 0.5 }}
          className="absolute hidden lg:block z-0"
          style={{ left: tag.x, top: tag.y }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm"
          >
            <span className="text-xs font-medium text-white/40 font-mono">
              {tag.label}
            </span>
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex-1 flex flex-col justify-center items-center px-5 sm:px-8 py-20 md:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-white/70 font-medium">
            Join 50K+ learners already ahead
          </span>
          <span className="ml-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 rounded-full">
            Free
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl leading-[1.1] tracking-tight"
        >
          <span className="text-white">Learn. Build.</span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Get Hired.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-white/60 text-center max-w-2xl leading-relaxed"
        >
          Master engineering, compete in global hackathons, and land your dream
          job — all on one premium platform built for future leaders.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0">
            <GraduationCap className="w-5 h-5" />
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/[0.06] hover:bg-white/[0.1] text-white/90 font-semibold rounded-xl transition-all duration-300 border border-white/[0.1] hover:border-white/[0.15]">
            <Play className="w-4 h-4" />
            <span>Watch Demo</span>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-8 flex items-center gap-3"
        >
          <div className="flex -space-x-2">
            {socialProofAvatars.map((bg, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full ${bg} border-2 border-[#061A2E] flex items-center justify-center`}
              >
                <span className="text-[10px] font-bold text-white">
                  {String.fromCharCode(65 + i)}
                </span>
              </div>
            ))}
          </div>
          <div className="text-sm text-white/50">
            <span className="text-white/70 font-medium">2,847</span> joined this
            week
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 w-full max-w-3xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
              >
                <stat.icon className="w-5 h-5 text-emerald-400/70" />
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {stat.value}
                </span>
                <span className="text-xs text-white/40">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 pb-8 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-white/30 tracking-wide uppercase">
          Powered by{' '}
          <span className="text-emerald-400/60 font-semibold">
            Bluecoderhub
          </span>
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  )
}
