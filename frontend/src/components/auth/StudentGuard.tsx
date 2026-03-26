'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

export const StudentGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login, but save the current path so we can return after login
      router.replace(`/login?from=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="bg-noise pointer-events-none opacity-50" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-2xl shadow-primary/40">
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2 text-center">
            <h2 className="font-serif text-xl font-medium tracking-tight">
              Initializing Secure Session
            </h2>
            <div className="mx-auto h-1 w-24 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full bg-primary"
                animate={{
                  x: [-100, 100],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return <>{children}</>
}
