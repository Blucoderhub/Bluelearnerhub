'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  GraduationCap,
  ChevronDown,
} from 'lucide-react'
import IsometricScene from './IsometricScene'
import CodingCharacter from './characters/CodingCharacter'
import LearningCharacter from './characters/LearningCharacter'

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#050201] via-[#0c0502] to-[#0a0604]" />

      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,166,77,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-primary/10 to-transparent blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-primary/5 to-transparent blur-3xl hidden lg:block" />

      <motion.div
        style={{ y, opacity }}
        className="relative z-20 flex-1 flex flex-col justify-center px-5 sm:px-8 py-20 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            >
              <span className="text-white">Learn. Build.</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/70 to-white bg-clip-text text-transparent">
                Master Skills.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-xl font-medium"
            >
              Master complex software engineering disciplines, compete in global innovation challenges, and reach peak technical expertise — all on one premium platform built for the next generation of software engineers. Master Computer Science, Web Tech, and AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-10 py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 shimmer"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 20,
              delay: 0.4
            }}
            className="flex-1 relative w-full max-w-xl lg:max-w-none"
          >
            <div className="relative w-full aspect-square max-h-[550px]">
              <IsometricScene />

              <motion.div
                className="absolute bottom-[8%] left-[2%] z-20 hidden md:block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 70,
                  damping: 15,
                  delay: 1.0
                }}
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
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 70,
                  damping: 15,
                  delay: 1.2
                }}
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
                  className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/25 backdrop-blur-sm"
                >
                  <span className="text-[11px] font-bold text-primary flex items-center gap-1">
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
                  className="px-2.5 py-1 rounded-md bg-primary/15 border border-primary/25 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-primary">⚡ +250 XP</span>
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
                  className="px-2.5 py-1 rounded-md bg-primary/15 border border-primary/25 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-primary">🔥 5-Day Streak</span>
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
                  className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 backdrop-blur-sm"
                >
                  <span className="text-[10px] font-bold text-primary">🤖 AI Ready</span>
                </motion.div>
              </motion.div>

              {[
                { s: 4, l: 25, t: 35, dy: -50, dur: 3.5, bg: '#f38d58' },
                { s: 5, l: 42, t: 48, dy: -60, dur: 4.0, bg: '#ffb380' },
                { s: 3, l: 58, t: 38, dy: -45, dur: 3.8, bg: '#ff9966' },
                { s: 4.5, l: 70, t: 55, dy: -55, dur: 4.2, bg: '#ffd1b3' },
                { s: 3.5, l: 35, t: 60, dy: -48, dur: 3.2, bg: '#f38d58' },
                { s: 5, l: 55, t: 42, dy: -65, dur: 4.5, bg: '#ffb380' },
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 }}
        className="relative z-10 pb-8 flex flex-col items-center gap-3"
      >
        <span className="text-xs text-white/30 tracking-wide uppercase">
          Powered by{' '}
          <span className="text-primary/60 font-semibold">
            Bluecoderhub
          </span>
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-primary/30" />
        </motion.div>
      </motion.div>
    </section>
  )
}
