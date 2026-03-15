'use client'

import { motion } from 'framer-motion'
import { Compass, Code2, Rocket, BadgeCheck } from 'lucide-react'
import dynamic from 'next/dynamic'

const LearningCharacter = dynamic(() => import('@/components/animations/characters/LearningCharacter'), { ssr: false })
const CodingCharacter = dynamic(() => import('@/components/animations/characters/CodingCharacter'), { ssr: false })
const CelebrationCharacter = dynamic(() => import('@/components/animations/characters/CelebrationCharacter'), { ssr: false })
const CollaboratingCharacters = dynamic(() => import('@/components/animations/characters/CollaboratingCharacters'), { ssr: false })

const steps = [
  {
    title: 'Selection',
    description: 'Define your engineering stack and target domain.',
  },
  {
    title: 'Execution',
    description: 'Execute intensive labs and binary challenges.',
  },
  {
    title: 'Innovation',
    description: 'Deploy solutions to active innovation kernels.',
  },
  {
    title: 'Validation',
    description: 'Receive definitive system certification.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em] mb-4 block">
            / Protocol_Workflow
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            System_Deployment
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              className="relative p-10 border border-white/5 bg-black"
            >
              <div className="text-[10px] font-mono text-white/20 mb-6 tracking-widest">
                STEP_0{idx + 1}
              </div>
              <h3 className="text-xl font-black text-white uppercase mb-4 tracking-tighter">
                {step.title}
              </h3>
              <p className="text-xs font-mono text-white/40 leading-relaxed uppercase">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
