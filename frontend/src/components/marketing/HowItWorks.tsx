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
    number: 1,
    title: 'Choose Your Path',
    description: 'Start as a student or corporate user. Select learning paths tailored to your skill development goals.',
    icon: Compass,
    color: 'from-primary/20 to-primary/40',
    Character: LearningCharacter,
  },
  {
    number: 2,
    title: 'Learn & Practice',
    description: 'Complete interactive labs and challenges tailored to your chosen skill path.',
    icon: Code2,
    color: 'from-primary/30 to-primary/50',
    Character: CodingCharacter,
  },
  {
    number: 3,
    title: 'Innovate & Showcase',
    description: 'Participate in innovation challenges, solve complex problems, and build a world-class portfolio.',
    icon: Rocket,
    color: 'from-primary/40 to-primary/60',
    Character: CollaboratingCharacters,
  },
  {
    number: 4,
    title: 'Get Certified',
    description: 'Validate your skills with expert-led assessments and showcase your mastery to the world.',
    icon: BadgeCheck,
    color: 'from-primary/50 to-primary/70',
    Character: CelebrationCharacter,
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Your Journey to{' '}
            <span className="bg-gradient-to-r from-primary via-primary/70 to-white bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto font-medium">
            From learning to mastery, in 4 simple steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 -translate-y-1/2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const StepCharacter = step.Character
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="relative z-10 text-center p-8 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-md hover:bg-card/50 hover:border-primary/30 transition-all duration-500 group">
                    <div className="relative mx-auto mb-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-xl shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-500`}
                      >
                        <Icon className="w-8 h-8 text-primary-foreground" />
                      </motion.div>
                      <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary-foreground border-2 border-primary flex items-center justify-center shadow-lg`}>
                        <span className="text-xs font-black text-primary">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-foreground mb-3 uppercase tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium">
                      {step.description}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + idx * 0.15 }}
                      viewport={{ once: true }}
                      className="flex justify-center"
                    >
                      <StepCharacter size={64} />
                    </motion.div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-4 z-20 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
