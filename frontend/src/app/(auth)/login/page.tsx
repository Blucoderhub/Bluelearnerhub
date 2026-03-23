'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { StudentLoginForm } from '@/components/auth/StudentLoginForm'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

// useSearchParams() must live inside a component wrapped in <Suspense>.
// Next.js 16 enforces this at build time.
function LoginPortalContent() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  // Single navigation point: fires when isAuthenticated flips to true (after login
  // or on mount if already logged in). Respects the ?from= redirect set by middleware.
  useEffect(() => {
    if (isAuthenticated) {
      const from = searchParams.get('from')
      router.replace(from && from.startsWith('/') ? from : '/student/dashboard')
    }
  }, [isAuthenticated, router, searchParams])

  const handleSubmit = async (data: any) => {
    setError(null)
    try {
      await login(data.email, data.password)
      // Do NOT call router.push here — the useEffect above handles navigation
      // once isAuthenticated updates. Calling push here AND in the effect causes
      // a double-navigation race that can leave the user stuck on the login page.
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to initialize secure session.')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-20 text-foreground">
      <div className="bg-noise pointer-events-none" />

      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-12"
      >
        <div className="space-y-8 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
            to Matrix
          </Link>

          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary shadow-2xl shadow-primary/40">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="rounded-full border-primary/30 bg-primary/10 px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-primary"
              >
                Secure Authentication
              </Badge>
              <h1 className="font-pixel text-5xl text-foreground">
                Welcome back.
              </h1>
              <p className="font-pixel text-lg text-muted-foreground">
                Continue your research and mastery journey.
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-3xl relative overflow-hidden rounded-[2.5rem] bg-card p-10">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <StudentLoginForm onSubmit={handleSubmit} error={error} />
        </div>

        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Platform protected by <span className="text-primary">Bluelearner Core Secure</span>
        </p>
      </motion.div>
    </div>
  )
}

export default function LoginPortal() {
  return (
    <Suspense>
      <LoginPortalContent />
    </Suspense>
  )
}
