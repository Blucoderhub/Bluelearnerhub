'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { ArrowRight, Sparkles, GraduationCap, Rocket } from 'lucide-react'
export default function CallToAction() {
  return (
    <section className="py-32 px-4 bg-black border-t border-white/10 text-center">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.5em] mb-12 block">
            / Deployment_Ready
          </span>

          <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-12">
            Initialize<br />Greatness
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full px-16 py-5 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white border-2 border-white transition-all duration-200">
                Execute_Initialization
              </button>
            </Link>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-10 text-white/20 text-[10px] font-mono uppercase tracking-widest">
            <span>NO_CREDENTIALS_REQUIRED</span>
            <span>PURE_ENGINEERING</span>
            <span>SYSTEM_READY</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
