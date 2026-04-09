'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Background Decorative Blobs (Global Theme) */}
      <div className="spilled-paint-bg">
        <div className="blob blob-1 !opacity-20" />
        <div className="blob blob-2 !opacity-10" />
        <div className="blob blob-3 !opacity-20" />
      </div>

      <div className="z-10 flex flex-col items-center text-center">
        {/* Main 404 Illustration with Hanging Physics */}
        <div className="relative mb-16 flex items-end justify-center space-x-1">
          {/* Number 4 (Left) */}
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'top center' }}
            className="relative"
          >
            <div className="absolute top-[-100px] left-1/2 h-[100px] w-0.5 -translate-x-1/2 bg-white/30" />
            <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M120 160H20V120L100 20V160ZM110 50L40 120H110V50Z" fill="white" fillOpacity="0.9" />
              <path d="M120 160H20V120L100 20V160Z" stroke="white" strokeWidth="4" strokeLinejoin="round" />
            </svg>
            
            {/* Hanging Student 1 */}
            <motion.div
              className="absolute -bottom-10 -left-6"
              animate={{ rotate: [-5, 5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
            >
              <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="15" r="8" fill="#2D3436" />
                <path d="M12 25C12 25 5 35 5 45S10 55 20 55S35 55 35 45S28 25 28 25H12Z" fill="#2563EB" />
                <path d="M12 25L8 40" stroke="#FFD4A3" strokeWidth="3" strokeLinecap="round" />
                <path d="M28 25L32 40" stroke="#FFD4A3" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Number 0 (Middle) */}
          <motion.div
            initial={{ y: -5 }}
            animate={{ y: 5 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <div className="absolute top-[-100px] left-1/2 h-[100px] w-0.5 -translate-x-1/2 bg-white/30" />
            <svg width="160" height="200" viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="20" y="20" width="120" height="160" rx="60" fill="white" fillOpacity="0.95" />
              <rect x="50" y="50" width="60" height="100" rx="30" fill="#F97316" />
              <rect x="20" y="20" width="120" height="160" rx="60" stroke="white" strokeWidth="4" />
            </svg>

            {/* Student Sitting on 0 */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -5] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'mirror' }}
            >
              <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="12" r="7" fill="#2D3436" />
                <path d="M10 20C10 20 5 30 5 40H35C35 30 30 20 30 20H10Z" fill="#22C55E" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Number 4 (Right) */}
          <motion.div
            initial={{ rotate: 10 }}
            animate={{ rotate: -10 }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'top center' }}
            className="relative"
          >
            <div className="absolute top-[-100px] left-1/2 h-[110px] w-0.5 -translate-x-1/2 bg-white/30" />
            <svg width="140" height="180" viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M120 160H20V120L100 20V160ZM110 50L40 120H110V50Z" fill="white" fillOpacity="0.8" />
              <path d="M120 160H20V120L100 20V160Z" stroke="white" strokeWidth="4" strokeLinejoin="round" />
            </svg>

            {/* Hanging Student 2 */}
            <motion.div
              className="absolute bottom-10 -right-6"
              animate={{ rotate: [5, -5] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatType: 'mirror' }}
            >
              <svg width="35" height="55" viewBox="0 0 35 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="12" r="7" fill="#2D3436" />
                <path d="M10 22C10 22 5 32 5 42S10 52 17 52S30 52 30 42S25 22 25 22H10Z" fill="#EF4444" />
                <path d="M10 22L4 12" stroke="#FFD4A3" strokeWidth="2.5" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Text Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-black tracking-[0.2em] text-white/90">
            OPPS! PAGE NOT FOUND
          </h2>
          <p className="mx-auto max-w-sm text-sm font-medium text-white/60">
            Looks like you've engineered a path to a non-existent dimension. 
            Let's get you back to the hub.
          </p>

          <Link href="/" className="mt-12 block">
            <Button
              className="group relative h-12 w-56 rounded-full bg-white text-[11px] font-black uppercase tracking-widest text-orange-600 transition-all hover:scale-105 hover:bg-white hover:shadow-xl hover:shadow-orange-700/20 active:scale-95"
            >
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              BACK TO HOME
              <motion.div
                className="absolute inset-0 rounded-full border border-white opacity-0 group-hover:opacity-100"
                initial={false}
                animate={{ scale: [1, 1.15], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Ground Shadow */}
      <div className="absolute bottom-20 left-1/2 h-4 w-96 -translate-x-1/2 rounded-[100%] bg-orange-950/20 blur-xl" />
    </div>
  )
}
