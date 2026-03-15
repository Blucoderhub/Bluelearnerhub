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
  return (
    <div className="relative w-full h-full flex flex-col gap-8">
      {/* Upper Content: Editor */}
      <div className="flex flex-col gap-4">
        {/* Code Editor Window */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative border border-white/20 bg-black overflow-hidden"
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
            <div className="flex-1">
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">/ main.sys.protocal</span>
            </div>
          </div>

          {/* Code content */}
          <div className="p-6 min-h-[220px]">
            <TypewriterCode />
          </div>
        </motion.div>

        {/* Binary Stream Overlay */}
        <div className="flex justify-between px-4">
          <span className="text-[10px] font-mono text-white/10">01011001 01010101</span>
          <span className="text-[10px] font-mono text-white/10">AUTHENTICATED_ACCESS</span>
        </div>
      </div>
    </div>
  )
}
