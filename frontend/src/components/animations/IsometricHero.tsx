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
import IsometricScene from './IsometricScene'
import CodingCharacter from './characters/CodingCharacter'
import LearningCharacter from './characters/LearningCharacter'

const socialProofAvatars = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-amber-500',
  'bg-rose-500',
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

      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-br from-blue-600/10 via-emerald-500/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-purple-600/8 to-transparent blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-emerald-500/5 to-transparent blur-3xl hidden lg:block" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-20 flex-1 flex flex-col justify-center px-5 sm:px-8 py-20 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none">
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
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
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
              className="mt-6 text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-xl font-medium"
            >
              Master engineering, compete in global hackathons, and land your dream
              job — all on one premium platform built for the next generation of engineers.
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
              <button className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 backdrop-blur-md">
                <Play className="w-4 h-4 text-emerald-400" />
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
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 relative w-full max-w-xl lg:max-w-none"
          >
            <div className="relative w-full aspect-square max-h-[550px]">
              <IsometricScene />

              <motion.div
                className="absolute bottom-[8%] left-[2%] z-20 hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <CodingCharacter size={90} />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-[15%] right-[5%] z-20 hidden md:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <LearningCharacter size={80} />
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-[8%] left-[30%] z-30 hidden md:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 backdrop-blur-sm"
                >
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    🏆 Achievement Unlocked!
                  </span>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute bottom-[35%] left-[0%] z-30 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.0, duration: 0.5, type: 'spring' }}
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                  className="px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/25 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-blue-400">⚡ +250 XP</span>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-[40%] right-[0%] z-30 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2, duration: 0.5, type: 'spring' }}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
                  className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/25 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-emerald-400">🔥 5-Day Streak</span>
                </motion.div>
              </motion.div>

              <motion.div
                className="absolute top-[60%] right-[12%] z-30 hidden lg:block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.4, duration: 0.5, type: 'spring' }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/25 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-purple-400">🤖 AI Ready</span>
                </motion.div>
              </motion.div>

              {[
                { s: 4, l: 25, t: 35, dy: -50, dur: 3.5, bg: '#34d399' },
                { s: 5, l: 42, t: 48, dy: -60, dur: 4.0, bg: '#60a5fa' },
                { s: 3, l: 58, t: 38, dy: -45, dur: 3.8, bg: '#a78bfa' },
                { s: 4.5, l: 70, t: 55, dy: -55, dur: 4.2, bg: '#fbbf24' },
                { s: 3.5, l: 35, t: 60, dy: -48, dur: 3.2, bg: '#f472b6' },
                { s: 5, l: 55, t: 42, dy: -65, dur: 4.5, bg: '#22d3ee' },
              ].map((p, i) => (
                <motion.div
                  key={`xp-particle-${i}`}
                  className="absolute rounded-full hidden md:block"
                  style={{
                    width: p.s,
                    height: p.s,
                    left: `${p.l}%`,
                    top: `${p.t}%`,
                    background: p.bg,
                    willChange: 'transform, opacity',
                  }}
                  animate={{
                    y: [0, p.dy],
                    opacity: [0, 0.7, 0],
                  }}
                  transition={{
                    duration: p.dur,
                    repeat: Infinity,
                    delay: i * 0.6,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            <div className="block lg:hidden mt-4">
              <div className="flex justify-center gap-3">
                <CodingCharacter size={60} />
                <LearningCharacter size={60} />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 w-full max-w-4xl mx-auto"
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
