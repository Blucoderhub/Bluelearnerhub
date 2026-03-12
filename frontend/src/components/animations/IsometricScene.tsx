'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, BookOpen, Trophy, Award, Code2, Brain, Zap } from 'lucide-react'

const CODE_LINES = [
  { text: '// BluelearnerHub — Your Learning OS', dim: true },
  { text: '', dim: false },
  { text: 'const engineer = new Student({', dim: false },
  { text: '  name: "You",', dim: true },
  { text: '  domains: ["CS", "AI", "Mech", "Civil"],', dim: true },
  { text: '  goal: "Become Unstoppable",', dim: true },
  { text: '})', dim: false },
  { text: '', dim: false },
  { text: 'await engineer', dim: false },
  { text: '  .study(1400 + " guided lessons")', dim: true },
  { text: '  .compete(50 + " hackathons")', dim: true },
  { text: '  .learnFrom("industry mentors")', dim: true },
  { text: '  .getCertified()', dim: true },
  { text: '', dim: false },
  { text: '// 🚀  Career unlocked.', dim: true },
]

const STATS = [
  { icon: Users, value: '12,000+', label: 'Active Learners', delay: 0.4 },
  { icon: BookOpen, value: '1,400+', label: 'Lessons', delay: 0.55 },
  { icon: Trophy, value: '50+', label: 'Hackathons', delay: 0.7 },
  { icon: Award, value: '200+', label: 'Certificates', delay: 0.85 },
]

const BADGES = [
  { icon: Zap, text: '+500 XP Earned', delay: 2.0 },
  { icon: Brain, text: 'AI Mentor Active', delay: 2.8 },
  { icon: Code2, text: 'Challenge Complete', delay: 3.6 },
]

function TypewriterCode() {
  const [visibleLines, setVisibleLines] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return
    const line = CODE_LINES[visibleLines].text
    if (charCount < line.length) {
      const t = setTimeout(() => setCharCount(c => c + 1), 25)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setVisibleLines(v => v + 1)
        setCharCount(0)
      }, line === '' ? 60 : 90)
      return () => clearTimeout(t)
    }
  }, [visibleLines, charCount])

  return (
    <div className="font-mono text-[11px] sm:text-[12px] leading-6 space-y-0">
      {CODE_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="flex gap-4">
          <span className="select-none text-foreground/15 w-5 text-right shrink-0 tabular-nums">{i + 1}</span>
          <span className={line.dim ? 'text-foreground/40' : 'text-foreground/90'}>{line.text || '\u00A0'}</span>
        </div>
      ))}
      {visibleLines < CODE_LINES.length && (
        <div className="flex gap-4">
          <span className="select-none text-foreground/15 w-5 text-right shrink-0 tabular-nums">{visibleLines + 1}</span>
          <span className={CODE_LINES[visibleLines].dim ? 'text-foreground/40' : 'text-foreground/90'}>
            {CODE_LINES[visibleLines].text.slice(0, charCount)}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
              className="inline-block w-[2px] h-[13px] bg-foreground/80 align-middle ml-[1px]"
            />
          </span>
        </div>
      )}
    </div>
  )
}

export default function IsometricScene() {
  const [toastIndex, setToastIndex] = useState<number | null>(null)

  useEffect(() => {
    let i = 0
    const cycle = () => {
      setToastIndex(i % BADGES.length)
      setTimeout(() => setToastIndex(null), 2200)
      i++
      setTimeout(cycle, 3200)
    }
    const t = setTimeout(cycle, 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col gap-4">

      {/* Code Editor Window */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative rounded-2xl border border-border/60 bg-card overflow-hidden shadow-2xl"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-foreground/15" />
            <div className="w-3 h-3 rounded-full bg-foreground/15" />
            <div className="w-3 h-3 rounded-full bg-foreground/15" />
          </div>
          <div className="flex-1 flex justify-center">
            <span className="text-[11px] text-foreground/30 font-mono">main.ts — BluelearnerHub</span>
          </div>
        </div>

        {/* Code content */}
        <div className="p-5 min-h-[200px]">
          <TypewriterCode />
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {toastIndex !== null && (
            <motion.div
              key={toastIndex}
              initial={{ opacity: 0, x: 40, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border shadow-xl"
            >
              {(() => { const Icon = BADGES[toastIndex].icon; return <Icon className="h-3.5 w-3.5 text-foreground/70 shrink-0" /> })()}
              <span className="text-[11px] font-bold text-foreground/80 whitespace-nowrap">{BADGES[toastIndex].text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {STATS.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay, ease: 'easeOut' }}
              className="flex flex-col items-center gap-1 p-3 rounded-xl border border-border/50 bg-card/80 hover:border-border hover:bg-card transition-all duration-200"
            >
              <Icon className="h-3.5 w-3.5 text-foreground/40 shrink-0" />
              <span className="text-sm sm:text-base font-black text-foreground tracking-tight leading-none">{stat.value}</span>
              <span className="text-[10px] text-foreground/40 font-medium text-center leading-tight">{stat.label}</span>
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

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
