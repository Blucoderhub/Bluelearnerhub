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
    description: 'Start as a student, job seeker, or corporate user. Select learning paths tailored to your professional goals.',
    icon: Compass,
    color: 'from-blue-500 to-cyan-500',
    Character: LearningCharacter,
  },
  {
    number: 2,
    title: 'Learn & Practice',
    description: 'Complete interactive labs and challenges tailored to your chosen professional path.',
    icon: Code2,
    color: 'from-purple-500 to-pink-500',
    Character: CodingCharacter,
  },
  {
    number: 3,
    title: 'Innovate & Showcase',
    description: 'Participate in innovation challenges, solve complex problems, and build a world-class portfolio.',
    icon: Rocket,
    color: 'from-amber-500 to-orange-500',
    Character: CollaboratingCharacters,
  },
  {
    number: 4,
    title: 'Get Hired',
    description: 'Apply for roles, practice with an AI career coach, and land your dream job with confidence.',
    icon: BadgeCheck,
    color: 'from-emerald-500 to-green-500',
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
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Your Journey to{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Success
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            From learning to landing the job, in 4 simple steps
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-amber-500/20 to-emerald-500/20 -translate-y-1/2" />

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
                  <div className="relative z-10 text-center p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 group">
                    <div className="relative mx-auto mb-5">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                        <span className="text-xs font-bold text-white">{step.number}</span>
                      </div>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
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
                      <div className="w-8 h-8 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
