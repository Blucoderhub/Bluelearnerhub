// src/components/marketing/HowItWorks.tsx

'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    number: 1,
    title: 'Choose Your Path',
    description: 'Start as a student, job seeker, or corporate user. Select learning paths tailored to your goals.',
  },
  {
    number: 2,
    title: 'Learn & Practice',
    description: 'Complete interactive tutorials and coding challenges to build real-world skills.',
  },
  {
    number: 3,
    title: 'Compete & Showcase',
    description: 'Participate in hackathons, solve challenges, and build an impressive portfolio.',
  },
  {
    number: 4,
    title: 'Get Hired',
    description: 'Apply for jobs, practice interviews, and land your dream role with confidence.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-gray-300 text-lg">
            Your journey from learning to landing the job, in 4 simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Connection line */}
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent" />
              )}

              {/* Step card */}
              <div className="relative z-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
