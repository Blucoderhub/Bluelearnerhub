'use client'

import { motion } from 'framer-motion'
import {
  BookOpen,
  Zap,
  Trophy,
  Bot,
  Briefcase,
  Users,
} from 'lucide-react'
import dynamic from 'next/dynamic'

const CodingCharacter = dynamic(() => import('@/components/animations/characters/CodingCharacter'), { ssr: false })
const LearningCharacter = dynamic(() => import('@/components/animations/characters/LearningCharacter'), { ssr: false })
const CelebrationCharacter = dynamic(() => import('@/components/animations/characters/CelebrationCharacter'), { ssr: false })
const CollaboratingCharacters = dynamic(() => import('@/components/animations/characters/CollaboratingCharacters'), { ssr: false })

const features = [
  {
    title: 'Interactive Labs',
    description: 'Master engineering environments via brute-force practice.',
  },
  {
    title: 'Smart Protocols',
    description: 'Intelligent hints and progressive difficulty tracking.',
  },
  {
    title: 'Innovation Kernels',
    description: 'Participate in global computational challenges.',
  },
  {
    title: 'Core Management',
    description: 'Monitor skill frequency and deployment metrics.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-black border-y border-white/10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-4 block">
            / Protocol_Capabilities
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            System_Features
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 border border-white/10 bg-black hover:bg-white hover:text-black transition-none group"
            >
              <h3 className="text-sm font-black uppercase tracking-widest mb-4 font-mono">
                [{idx.toString().padStart(2, '0')}] {feature.title}
              </h3>
              <p className="text-xs font-mono text-white/40 group-hover:text-black/60 leading-relaxed uppercase">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
