// src/components/animations/IsometricHero.tsx

'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function IsometricHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <div ref={containerRef} className="relative h-screen overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 isometric-grid opacity-10" />

      {/* Floating Elements */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        {/* Decorative Isometric Building - Repositioned to the right background */}
        <div className="absolute top-1/2 right-[5%] -translate-y-1/2 hidden md:block opacity-40">
          <IsometricBuilding className="w-[30rem] h-[30rem] blur-[2px]" />
        </div>

        {/* Decorative Isometric Building - Smaller on the left background */}
        <div className="absolute top-1/4 left-[5%] opacity-20 hidden md:block">
          <IsometricBuilding className="w-64 h-64 blur-[1px] rotate-45" />
        </div>

        {/* Floating Code Blocks */}
        {[...Array(5)].map((_, i) => (
          <FloatingCodeBlock
            key={i}
            index={i}
            delay={i * 0.2}
          />
        ))}

        {/* Floating Icons */}
        <FloatingIcon
          icon="laptop"
          position={{ x: -300, y: -150 }}
          delay={0.5}
        />
        <FloatingIcon
          icon="trophy"
          position={{ x: 350, y: -100 }}
          delay={0.7}
        />
        <FloatingIcon
          icon="certificate"
          position={{ x: -250, y: 200 }}
          delay={0.9}
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] z-0" />

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
              Bluelearnerhub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Advance in Engineering, Management & Innovation. Compete in global hackathons
            and accelerate your career across all domains.
            <span className="block text-blue-400 font-medium mt-2">The ultimate premium platform for future leaders.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/25">
              Get Started Free
            </button>
            <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold backdrop-blur-md transition-all border border-white/20">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </div>

      {/* Powered By Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>Powered by</span>
          <span className="font-semibold text-blue-400">Bluecoderhub</span>
        </div>
      </motion.div>
    </div>
  )
}

// Isometric Building Component
function IsometricBuilding({ className }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Building structure with isometric perspective */}
        <g className="isometric-building">
          {/* Base */}
          <path d="M200,300 L100,250 L100,150 L200,100 L300,150 L300,250 Z"
            fill="url(#buildingGradient)"
            stroke="#2563eb"
            strokeWidth="2" />

          {/* Windows */}
          {[...Array(6)].map((_, i) => (
            <rect
              key={i}
              x={120 + (i % 3) * 50}
              y={160 + Math.floor(i / 3) * 40}
              width="30"
              height="25"
              fill="#3b82f6"
              opacity="0.6"
            />
          ))}
        </g>

        <defs>
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// Floating Code Block
function FloatingCodeBlock({ index, delay }: { index: number; delay: number }) {
  const positions = [
    { x: -300, y: -200, label: 'Design()', type: 'Eng' },
    { x: 350, y: -150, label: 'Manage()', type: 'Mgmt' },
    { x: -250, y: 150, label: 'Build()', type: 'Eng' },
    { x: 300, y: 200, label: 'Lead()', type: 'Mgmt' },
    { x: 0, y: -300, label: 'Analyze()', type: 'Data' }
  ]

  const config = positions[index % positions.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
      style={{
        left: `calc(50% + ${config.x}px)`,
        top: `calc(50% + ${config.y}px)`
      }}
    >
      <div className="bg-gray-800/80 backdrop-blur-sm p-3 rounded-lg border border-blue-500/30 font-mono text-xs text-blue-300">
        <div className="text-[10px] text-blue-500/50 mb-1">{config.type}</div>
        <div className="font-bold">{config.label}</div>
      </div>
    </motion.div>
  )
}

// Floating Icon
function FloatingIcon({
  icon,
  position,
  delay
}: {
  icon: string;
  position: { x: number; y: number };
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute w-16 h-16 bg-blue-600/20 rounded-lg flex items-center justify-center backdrop-blur-sm"
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(50% + ${position.y}px)`
      }}
    >
      {/* Icon SVG here */}
      <div className="text-3xl">{getIconEmoji(icon)}</div>
    </motion.div>
  )
}

function getIconEmoji(icon: string) {
  const icons: Record<string, string> = {
    laptop: '🏗️', // Engineering/Build
    trophy: '📈', // Management/Growth
    certificate: '🎓', // Qualification
    gear: '⚙️',
    board: '📊'
  }
  return icons[icon] || '✨'
}
