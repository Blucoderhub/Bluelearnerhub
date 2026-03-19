'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Github, Mail, User, ShieldCheck, KeyRound, MailIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StudentSignupFormProps {
  onSubmit: (userData: any) => Promise<void>
  error?: string | null
}

export const StudentSignupForm: React.FC<StudentSignupFormProps> = ({ onSubmit, error }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ name, email, password })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-[11px] font-bold leading-relaxed text-red-500"
        >
          <span className="uppercase tracking-widest">[AUTH_ERROR]:</span> {error}
        </motion.div>
      )}

      {/* Social Register */}
      <div className="grid grid-cols-1">
        <Button
          variant="outline"
          className="flex h-14 items-center justify-center gap-3 rounded-2xl border-border bg-background/50 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
        >
          <Github size={16} /> Register via GitHub Identity
        </Button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em]">
          <span className="bg-[#121214] px-4 text-muted-foreground/40 text-[9px]">Neural Link Setup</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <div className="group relative">
            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <Input
              type="text"
              placeholder="Biological Name / Alias"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 rounded-2xl border-border bg-background/40 pl-12 text-sm font-medium transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="group relative">
            <MailIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <Input
              type="email"
              placeholder="Communication Uplink (Email)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 rounded-2xl border-border bg-background/40 pl-12 text-sm font-medium transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/20"
              required
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="group relative">
            <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
            <Input
              type="password"
              placeholder="Master Encryption Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 rounded-2xl border-border bg-background/40 pl-12 text-sm font-medium transition-all placeholder:text-muted-foreground/30 focus:border-primary/50 focus:ring-primary/20"
              required
            />
          </div>
        </div>

        <div className="px-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
              By initializing identity, you agree to the <span className="text-white hover:text-primary transition-colors cursor-pointer underline underline-offset-2">Platform Protocol</span> & <span className="text-white hover:text-primary transition-colors cursor-pointer underline underline-offset-2">Data Governance</span>.
            </p>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="h-14 w-full rounded-2xl bg-primary font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Synchronizing Node...' : 'Initialize Identity'}
          </Button>
        </div>
      </form>

      <div className="pt-2 text-center">
        <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Already a recognized entity?{' '}
          <Link href="/login" className="ml-2 text-white transition-colors hover:text-primary">
            Access Portal
          </Link>
        </p>
      </div>
    </div>
  )
}
