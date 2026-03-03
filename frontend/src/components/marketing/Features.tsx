// src/components/marketing/Features.tsx

'use client'

import { motion } from 'framer-motion'

const features = [
  {
    title: 'Interactive Tutorials',
    description: 'Learn coding with interactive W3Schools-style tutorials covering JavaScript, Python, Web Dev, and more.',
    icon: '📚',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Coding Challenges',
    description: 'Solve real-world coding problems with hints, test cases, and progressive difficulty levels.',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Hackathons',
    description: 'Compete in exciting hackathons, showcase your skills, and win prizes from top companies.',
    icon: '🏆',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'AI Interview Prep',
    description: 'Practice with AI-powered mock interviews, get real-time feedback, and boost your confidence.',
    icon: '🤖',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Career Dashboard',
    description: 'Track job applications, schedule interviews, build your portfolio, and manage your career.',
    icon: '💼',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    title: 'Community & Rankings',
    description: 'Connect with learners worldwide, compete on leaderboards, and celebrate achievements together.',
    icon: '👥',
    color: 'from-yellow-500 to-orange-500',
  },
]

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Powerful Features
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Everything you need to learn, compete, and succeed in your tech career
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-lg blur-lg transition-opacity" />
              <div className="relative p-8 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 h-1 w-8 bg-gradient-to-r rounded opacity-0 group-hover:opacity-100 transition-opacity" style={{
                  backgroundImage: `linear-gradient(90deg, var(--tw-gradient-stops))`
                }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
