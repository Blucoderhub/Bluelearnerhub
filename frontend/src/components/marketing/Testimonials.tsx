// src/components/marketing/Testimonials.tsx

'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    content: 'Bluelearnerhub helped me transition from bootcamp graduate to working at Google. The hackathons gave me real-world experience!',
    avatar: '👩‍💻',
  },
  {
    name: 'Raj Patel',
    role: 'Product Manager at Meta',
    content: 'The interview prep module is incredible. I went through 10 mock interviews and got confidence for my real interviews.',
    avatar: '👨‍💼',
  },
  {
    name: 'Emma Wilson',
    role: 'Full Stack Developer at Stripe',
    content: 'I loved the interactive tutorials. Learning by doing actually stuck with me, unlike traditional courses.',
    avatar: '👩‍💻',
  },
  {
    name: 'Alex Kumar',
    role: 'Data Scientist at Microsoft',
    content: 'The community aspect is amazing. Getting feedback from peers on my code submissions helped me improve so much.',
    avatar: '👨‍🔬',
  },
]

export default function Testimonials() {
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
            Loved by Learners
          </h2>
          <p className="text-gray-300 text-lg">
            Join thousands of students who have transformed their careers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{testimonial.content}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
