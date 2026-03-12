'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, GraduationCap, ChevronDown } from 'lucide-react'
import IsometricScene from './IsometricScene'

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
      {/* Clean dark background */}
      <div className="absolute inset-0 bg-background" />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Soft radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full bg-foreground/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-foreground/[0.02] blur-3xl pointer-events-none" />

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
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 70, damping: 20, delay: 0.3 }}
            className="flex-1 w-full max-w-xl lg:max-w-none"
          >
            <IsometricScene />
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
