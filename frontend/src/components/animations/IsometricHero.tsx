'use client'

import { useRef } from 'react'
import Link from 'next/link'
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
      className="relative min-h-screen overflow-hidden flex flex-col bg-black"
    >
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 flex-1 flex flex-col justify-center px-5 sm:px-8 py-20 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl lg:max-w-none">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase"
            >
              Learn.<br />Build.<br />Master.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-sm font-mono tracking-widest text-white/40 uppercase"
            >
              Elite Engineering Protocols Only
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="w-full sm:w-auto border-2 border-white bg-white text-black px-12 py-4 font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all duration-200 text-center"
              >
                <span>Initialize_Access</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 w-full max-w-xl lg:max-w-none"
          >
            <IsometricScene />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="relative z-10 pb-8 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/20 font-mono uppercase tracking-[0.3em]">
          System_v2.0 // Bluelearnerhub
        </span>
      </motion.div>
    </section>
  )
}
