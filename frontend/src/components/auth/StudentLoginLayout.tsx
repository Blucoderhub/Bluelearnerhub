'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { PoweredByBadge } from '@/components/branding/Logo'

interface StudentLoginLayoutProps {
  children: React.ReactNode
}

export const StudentLoginLayout: React.FC<StudentLoginLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6">
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Top Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-10 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <GraduationCap size={28} />
          </div>
          <span className="text-2xl font-black uppercase tracking-tighter text-foreground">
            Bluelearnerhub
          </span>
        </div>
        <PoweredByBadge />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-[500px] rounded-[2.5rem] border border-border/50 bg-card/30 p-8 shadow-2xl backdrop-blur-xl md:p-12"
      >
        {children}
      </motion.div>

      {/* Bottom links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-12 text-center"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Need help?{' '}
          <a href="/help" className="text-primary hover:underline">
            Support Center
          </a>
        </p>
      </motion.div>
    </div>
  )
}
