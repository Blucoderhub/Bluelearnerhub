'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-primary/10 blur-[120px]" />
        <div
          className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] animate-pulse rounded-full bg-primary/5 blur-[120px]"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-card/40 p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-10"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />

        <div className="mb-8 flex justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
            <KeyRound className="relative z-10 h-8 w-8 text-primary" />
          </div>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center"
          >
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <div className="space-y-2">
              <h2 className="font-mono text-2xl font-black uppercase tracking-tight text-white">
                Check_Inbox
              </h2>
              <p className="text-[11px] font-bold uppercase leading-relaxed tracking-wider text-muted-foreground">
                If <span className="text-white">{email}</span> is registered, a reset link has been
                dispatched.
              </p>
            </div>
            <p className="font-mono text-[10px] leading-relaxed text-muted-foreground">
              Didn&apos;t receive it? Check your spam folder or wait a few minutes before requesting
              again.
            </p>
            <Button
              variant="outline"
              className="h-11 w-full border-white/20 bg-transparent font-mono text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/5"
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
            >
              Send_Again
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="font-mono text-2xl font-black uppercase tracking-tight text-white">
                Reset_Access
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Enter your registered email to receive a reset link
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 font-mono text-[10px] leading-tight text-red-500"
              >
                <span className="font-bold uppercase tracking-widest">[ERROR]:</span> {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="ml-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                  Registered_Email
                </label>
                <Input
                  type="email"
                  placeholder="SYSTEM_ID@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-white/20 bg-black font-mono text-xs transition-none placeholder:text-white/10 focus:border-white"
                  required
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full border-2 border-white bg-white font-mono text-[12px] font-black uppercase tracking-widest text-black transition-none hover:bg-black hover:text-white"
                >
                  {loading ? 'Dispatching...' : 'Send_Reset_Link'}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" /> Back_To_Login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
