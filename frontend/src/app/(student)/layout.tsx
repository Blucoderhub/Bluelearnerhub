'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { generateAvatarURL } from '@/utils/generateAvatar'
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Terminal,
  Bot,
  Flag,
  FlaskConical,
  GraduationCap,
  Crown,
  ClipboardCheck,
  Menu,
  X,
  Play,
  Settings,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Library', href: '/tutorials', icon: BookOpen },
  { title: 'Courses', href: '/courses', icon: Play, badge: 'Soon' },
  { title: 'Quiz', href: '/quiz', icon: ClipboardCheck },
  { title: 'Labs', href: '/labs', icon: FlaskConical },
  { title: 'IDE Sandbox', href: '/ide', icon: Code2 },
  { title: 'Utilities', href: '/tools', icon: Settings },
  { title: 'AI Companion', href: '/ai-companion', icon: Bot },
  { title: 'Hackathons', href: '/hackathons', icon: Flag },
  { title: 'Premium', href: '/premium', icon: Crown },
]

const mobileTabItems = [
  { title: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Library', href: '/tutorials', icon: BookOpen },
  { title: 'IDE', href: '/ide', icon: Code2 },
  { title: 'Tools', href: '/tools', icon: Settings },
  { title: 'More', href: '#more', icon: Menu },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  const displayName = user?.fullName ?? user?.name ?? 'Student'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="bg-noise pointer-events-none opacity-50" />

      {/* ─── DESKTOP SIDEBAR ──────────────────────────────────────────────── */}
      <aside className="sticky top-0 z-40 hidden h-screen w-72 flex-col border-r border-border bg-card transition-all duration-500 md:flex">
        <div className="flex h-20 items-center justify-between px-8">
          <Link href="/student/dashboard" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight text-foreground">
              Bluelearner
            </span>
          </Link>
        </div>

        <div className="flex-1 space-y-10 overflow-y-auto px-6 py-8">
          <nav className="space-y-2">
            <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Personal Systems
            </p>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/student/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-[1.02]',
                    isActive
                      ? 'bg-primary text-white shadow-xl shadow-primary/20'
                      : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-primary-foreground' : 'text-primary/70'
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 h-6 w-1 rounded-full bg-white"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="border-t border-border/40 p-6">
          <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-secondary/30 p-4 transition-all hover:bg-secondary/50">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border/40 bg-background font-serif text-lg font-medium text-white shadow-inner">
              {user?.avatarConfig ? (
                <img
                  src={generateAvatarURL(user.avatarConfig)}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  Active Learner
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-lg md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto border-r border-border bg-card p-8 md:hidden"
            >
              <div className="mb-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-serif text-lg font-medium text-foreground">
                    Bluelearner
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-border p-2 text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-white shadow-xl shadow-primary/20'
                          : 'text-muted-foreground hover:bg-secondary/50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="relative flex-1 overflow-y-auto pb-32">
          {/* Subtle Page Glow */}
          <div className="pointer-events-none absolute left-0 top-0 h-[500px] w-full bg-gradient-to-b from-primary/5 to-transparent" />

          <div className="mx-auto w-full max-w-[1400px] p-8 md:p-12 lg:p-16">{children}</div>
        </main>

        {/* ─── MOBILE BOTTOM NABAR ────────────────────────────────────────── */}
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/80 backdrop-blur-2xl md:hidden">
          <div className="flex h-20 items-center justify-around px-4">
            {mobileTabItems.map((item) => {
              const isActive =
                item.href !== '#more' &&
                (pathname === item.href ||
                  (item.href !== '/student/dashboard' && pathname.startsWith(item.href)))
              const Icon = item.icon
              return item.href === '#more' ? (
                <button
                  key="more"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex flex-col items-center justify-center gap-1 p-2 text-muted-foreground"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.title}
                  </span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-1 p-2 transition-all',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn('h-6 w-6', isActive && 'shadow-primary/50')} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {item.title}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-pill"
                      className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary"
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
