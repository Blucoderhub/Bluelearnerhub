'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Sparkles, GraduationCap, Rocket } from 'lucide-react'
export default function CallToAction() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="py-16 md:py-32 px-4 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Premium Academic Ecosystem</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-[1.1] tracking-tighter">
            Ready to Transform <br />
            <span className="bg-gradient-to-r from-primary via-primary/70 to-white bg-clip-text text-transparent">
              Your Expertise?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Take the next step in your professional journey. Master elite skills with industry-standard labs and world-class curriculum designed for the next generation.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-12 py-5 bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs rounded-full transition-all shadow-2xl shadow-primary/20 hover:shadow-primary/40 flex items-center justify-center gap-3 shimmer"
              >
                <Rocket className="w-5 h-5" />
                Get Started Now
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/tutorials">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-12 py-5 border-2 border-primary/20 text-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 font-black uppercase tracking-widest text-xs rounded-full transition-all flex items-center justify-center gap-3"
              >
                <GraduationCap className="w-5 h-5" />
                Explore Portals
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-muted-foreground/60 text-[11px] font-black uppercase tracking-[0.2em]"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)] flex shrink-0" />
              No CC Required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary/40 flex shrink-0" />
              Free Access
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary flex shrink-0 shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
              Elite Mentorship
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
