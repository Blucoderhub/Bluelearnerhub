import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, KeyRound, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentLoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>
  error?: string | null
}

export const StudentLoginForm: React.FC<StudentLoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ email, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="flex h-10 items-center justify-center gap-2 rounded-xl border-border bg-background/50 text-xs font-bold text-white transition-all hover:bg-white hover:text-black"
        >
          <Github size={14} /> GitHub
        </Button>
        <Button
          variant="outline"
          className="flex h-10 items-center justify-center gap-2 rounded-xl border-border bg-background/50 text-xs font-bold text-white transition-all hover:bg-white hover:text-black"
        >
          <Linkedin size={14} /> LinkedIn
        </Button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-[10px] text-muted-foreground/40">or continue with email</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="group relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border-border bg-background/40 pl-10 text-sm transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20"
            required
          />
        </div>

        <div className="group relative">
          <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border-border bg-background/40 pl-10 text-sm transition-all placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-primary/20"
            required
          />
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-muted-foreground/60 transition-colors hover:text-primary">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground/50">
        No account?{' '}
        <Link href="/get-started" className="font-bold text-white transition-colors hover:text-primary">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
