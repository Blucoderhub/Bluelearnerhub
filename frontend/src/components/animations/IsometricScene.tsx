'use client'

import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Code2, Brain, Trophy, BookOpen } from 'lucide-react'
import IsometricBuilding from './IsometricBuilding'

const buildings = [
  {
    icon: Code2,
    label: 'Code Editor',
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.3)',
    position: { x: '5%', y: '30%' },
    mobilePosition: { x: '2%', y: '25%' },
    delay: 0.2,
    size: 'lg' as const,
  },
  {
    icon: Brain,
    label: 'AI Lab',
    color: '#a855f7',
    glowColor: 'rgba(168,85,247,0.3)',
    position: { x: '60%', y: '10%' },
    mobilePosition: { x: '55%', y: '5%' },
    delay: 0.4,
    size: 'md' as const,
  },
  {
    icon: Trophy,
    label: 'Hackathon Arena',
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.3)',
    position: { x: '55%', y: '55%' },
    mobilePosition: { x: '50%', y: '55%' },
    delay: 0.6,
    size: 'lg' as const,
  },
  {
    icon: BookOpen,
    label: 'Learning Hub',
    color: '#0ea5e9',
    glowColor: 'rgba(59,130,246,0.3)',
    position: { x: '10%', y: '65%' },
    mobilePosition: { x: '5%', y: '65%' },
    delay: 0.8,
    size: 'md' as const,
  },
]

const connectionLines = [
  { from: 0, to: 1 },
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 0 },
  { from: 0, to: 2 },
]

function Particles() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: (i * 37 + 13) % 100,
        startY: 80 + (i * 7) % 20,
        size: 1.5 + (i % 4) * 0.6,
        duration: 4 + (i % 6),
        delay: (i * 0.4) % 5,
        opacity: 0.15 + (i % 5) * 0.07,
      })),
    []
  )

  if (!mounted) return null

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: `${100 - p.startY}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${p.x > 50 ? '168,85,247' : '59,130,246'}, ${p.opacity})`,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -120 - Math.random() * 80],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

function ConnectionLines() {
  const centers = [
    { x: 180, y: 450 },
    { x: 720, y: 250 },
    { x: 680, y: 700 },
    { x: 220, y: 780 },
  ]

  return (
    <svg className="absolute inset-0 w-full h-full z-0 hidden md:block" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <defs>
        {connectionLines.map((line, i) => (
          <linearGradient key={`grad-${i}`} id={`line-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={buildings[line.from].color} stopOpacity="0.4" />
            <stop offset="50%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor={buildings[line.to].color} stopOpacity="0.4" />
          </linearGradient>
        ))}
      </defs>
      {connectionLines.map((line, i) => {
        const from = centers[line.from]
        const to = centers[line.to]
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2 - 80
        return (
          <motion.path
            key={i}
            d={`M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`}
            stroke={`url(#line-grad-${i})`}
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="6 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 1 + i * 0.2, duration: 1.2, ease: 'easeOut' }}
          />
        )
      })}
    </svg>
  )
}

function IsometricGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
      <div
        className="absolute inset-0"
        style={{
          transform: 'rotateX(60deg) rotateZ(45deg) scale(2)',
          transformOrigin: 'center center',
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  )
}

export default function IsometricScene() {
  return (
    <div className="relative w-full h-full min-h-[350px] md:min-h-[450px]">
      <IsometricGrid />

      <ConnectionLines />

      <Particles />

      {buildings.map((building, i) => (
        <div
          key={i}
          className="absolute z-10"
          style={{
            left: building.position.x,
            top: building.position.y,
          }}
        >
          <IsometricBuilding
            icon={building.icon}
            label={building.label}
            color={building.color}
            glowColor={building.glowColor}
            delay={building.delay}
            size={building.size}
          />
        </div>
      ))}

      <motion.div
        className="absolute top-[15%] left-[40%] hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5, type: 'spring' }}
      >
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="px-2 py-1 rounded-md bg-primary/15 border border-border backdrop-blur-sm"
        >
          <span className="text-[9px] font-bold text-foreground/70">🏆 +500 XP</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] right-[15%] hidden md:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5, type: 'spring' }}
      >
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="px-2 py-1 rounded-md bg-primary/15 border border-border backdrop-blur-sm"
        >
          <span className="text-[9px] font-bold text-foreground/70">✨ Level Up!</span>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-[50%] right-[5%] hidden lg:block"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.0, duration: 0.5, type: 'spring' }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="px-2 py-1 rounded-md bg-purple-500/20 border border-purple-500/30 backdrop-blur-sm"
        >
          <span className="text-[9px] font-bold text-purple-400">🤖 AI Ready</span>
        </motion.div>
      </motion.div>
    </div>
  )
}
