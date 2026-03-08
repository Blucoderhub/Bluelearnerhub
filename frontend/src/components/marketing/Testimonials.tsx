'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    content: 'Bluelearnerhub helped me transition from bootcamp graduate to working at Google. The hackathons gave me real-world experience!',
    rating: 5,
    initials: 'SC',
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Raj Patel',
    role: 'Product Manager',
    company: 'Meta',
    content: 'The interview prep module is incredible. I went through 10 mock interviews and got confidence for my real interviews.',
    rating: 5,
    initials: 'RP',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Emma Wilson',
    role: 'Full Stack Developer',
    company: 'Stripe',
    content: 'I loved the interactive tutorials. Learning by doing actually stuck with me, unlike traditional courses.',
    rating: 5,
    initials: 'EW',
    color: 'from-emerald-500 to-green-500',
  },
  {
    name: 'Alex Kumar',
    role: 'Data Scientist',
    company: 'Microsoft',
    content: 'The community aspect is amazing. Getting feedback from peers on my code submissions helped me improve so much.',
    rating: 5,
    initials: 'AK',
    color: 'from-amber-500 to-orange-500',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/40'}`}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.offsetWidth * 0.85
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(Math.min(index, testimonials.length - 1))
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-16 md:py-24 px-4 bg-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-level-purple/5 via-transparent to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              50,000+
            </span>{' '}
            Learners
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Join thousands of students who have transformed their careers
          </p>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:hidden"
        >
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[85%] snap-center"
            >
              <TestimonialCard testimonial={testimonial} index={idx} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {testimonials.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-purple-500 w-6' : 'bg-muted'
                }`}
            />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <TestimonialCard testimonial={testimonial} index={idx} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <div className="h-full p-6 md:p-8 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-purple-500/30 transition-all duration-300 group">
      <Quote className="w-8 h-8 text-purple-500/30 mb-4 group-hover:text-purple-500/50 transition-colors" />
      <p className="text-foreground/80 text-sm md:text-base leading-relaxed mb-6">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            whileInView={{
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm font-bold text-white">{testimonial.initials}</span>
            </div>
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${testimonial.color} opacity-0`}
              animate={{ opacity: [0, 0.4, 0], scale: [1, 1.5, 1.8] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5, ease: 'easeOut' }}
            />
          </motion.div>
          <div>
            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.role} at{' '}
              <span className="text-foreground/70 font-medium">{testimonial.company}</span>
            </p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} />
      </div>
    </div>
  )
}
