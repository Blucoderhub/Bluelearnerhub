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
    title: 'Interactive Tutorials',
    description: 'Learn coding with interactive W3Schools-style tutorials covering JavaScript, Python, Web Dev, and more.',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'group-hover:border-blue-500/50',
    character: 'learning',
  },
  {
    title: 'Coding Challenges',
    description: 'Solve real-world coding problems with hints, test cases, and progressive difficulty levels.',
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'group-hover:border-purple-500/50',
    character: 'coding',
  },
  {
    title: 'Hackathons',
    description: 'Compete in exciting hackathons, showcase your skills, and win prizes from top companies.',
    icon: Trophy,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'group-hover:border-amber-500/50',
    character: 'celebration',
  },
  {
    title: 'AI Interview Prep',
    description: 'Practice with AI-powered mock interviews, get real-time feedback, and boost your confidence.',
    icon: Bot,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'group-hover:border-emerald-500/50',
    character: 'coding',
  },
  {
    title: 'Career Dashboard',
    description: 'Track job applications, schedule interviews, build your portfolio, and manage your career.',
    icon: Briefcase,
    color: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'group-hover:border-indigo-500/50',
    character: 'learning',
  },
  {
    title: 'Community & Rankings',
    description: 'Connect with learners worldwide, compete on leaderboards, and celebrate achievements together.',
    icon: Users,
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
    borderColor: 'group-hover:border-rose-500/50',
    character: 'collaborating',
  },
]

function FeatureCharacter({ type }: { type: string }) {
  switch (type) {
    case 'coding':
      return <CodingCharacter size={48} />
    case 'learning':
      return <LearningCharacter size={48} />
    case 'celebration':
      return <CelebrationCharacter size={48} />
    case 'collaborating':
      return <CollaboratingCharacters size={48} />
    default:
      return null
  }
}

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <section id="features" className="py-16 md:py-24 px-4 bg-gray-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            A complete platform for learning, competing, and launching your tech career
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`group relative`}
              >
                <div className={`relative p-6 md:p-8 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm ${feature.borderColor} transition-all duration-300 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20`}>
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} [&>*]:stroke-current text-white`} />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 0.6, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                      viewport={{ once: true }}
                      className="opacity-0 group-hover:opacity-80 transition-opacity duration-300"
                    >
                      <FeatureCharacter type={feature.character} />
                    </motion.div>
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className={`mt-4 h-0.5 w-0 group-hover:w-12 bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500`} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
