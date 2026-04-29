'use client'

import * as React from 'react'
import { useState, lazy, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn, getStorageItem, setStorageItem } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { generateAvatarURL } from '@/utils/generateAvatar'
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Bot,
  Flag,
  FlaskConical,
  Crown,
  ClipboardCheck,
  Menu,
  X,
  Settings,
  ShieldCheck,
  Loader2,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronDown,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StudentGuard } from '@/components/auth/StudentGuard'

const AIAssistant = lazy(() => import('@/components/ai/AIAssistant').then(mod => ({ default: mod.AIAssistant })))

function AIAssistantFallback() {
  return (
    <div className="fixed bottom-24 right-6 z-50 flex items-center justify-center">
      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-lg" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    </div>
  )
}

const navItems = [
  { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Tutorials', href: '/tutorials', icon: BookOpen },
  { title: 'Daily Quiz', href: '/daily-quiz', icon: ClipboardCheck },
  { title: 'Exercises', href: '/exercises', icon: Code2 },
  { title: 'Labs', href: '/labs', icon: FlaskConical },
  { title: 'IDE Sandbox', href: '/ide', icon: Code2 },
  { title: 'AI Tutor', href: '/ai-companion', icon: Bot },
  { title: 'Hackathons', href: '/hackathons', icon: Flag },
  { title: 'Premium', href: '/premium', icon: Crown },
]

const mobileTabItems = [
  { title: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Quiz', href: '/daily-quiz', icon: ClipboardCheck },
  { title: 'IDE', href: '/ide', icon: Code2 },
  { title: 'More', href: '#more', icon: Menu },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    const savedTheme = getStorageItem<string>('theme', '')
    const prefersDark = savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    setDarkMode(prefersDark)
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    setStorageItem('theme', newMode ? 'dark' : 'light')
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  const displayName = user?.fullName ?? user?.name ?? 'Student'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="bg-noise pointer-events-none opacity-50" />

      {/* ─── DESKTOP SIDEBAR ──────────────────────────────────────────────── */}
      <aside className="sticky top-0 z-40 hidden h-screen w-64 flex-col border-r border-border bg-card transition-all duration-300 lg:w-72 md:flex">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/student/dashboard" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">
              BlueLearnerHub
            </span>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
          <nav className="space-y-1">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Main Menu
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
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5',
                      isActive ? 'text-white' : 'text-primary/70'
                    )}
                  />
                  <span className="truncate">{item.title}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 h-5 w-1 rounded-full bg-white"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <nav className="space-y-1">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Settings
            </p>
            <Link
              href="/tools"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground"
            >
              <Settings className="h-5 w-5 text-primary/70" />
              <span>Utilities</span>
            </Link>
          </nav>
        </div>

        {/* ─── Profile Section ─────────────────────────────────────────── */}
        <div className="border-t border-border/50 p-4">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex w-full items-center gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3 transition-all hover:bg-secondary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-gradient-to-br from-primary to-violet-600 font-bold text-white shadow-inner">
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
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">View Profile</p>
              </div>
              <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', profileOpen && 'rotate-180')} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-0 right-0 mb-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
                >
                  <Link
                    href={user?.role === 'CORPORATE' ? '/corporate/dashboard' : '/student/profile'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-secondary/50"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.role === 'CORPORATE' ? 'Dashboard' : 'My Profile'}</span>
                  </Link>
                  <Link
                    href={user?.role === 'CORPORATE' ? '/corporate/dashboard' : '/student/profile'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-secondary/50"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                  <div className="border-t border-border/50" />
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
              className="fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto border-r border-border bg-card p-6 md:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-foreground">
                    BlueLearnerHub
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleDarkMode}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                  >
                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-lg border border-border p-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:bg-secondary/50'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </nav>
              <div className="mt-6 border-t border-border/50 pt-6">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── MAIN CONTENT ─────────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="relative flex-1 overflow-y-auto pb-24">
          <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-full bg-gradient-to-b from-primary/5 to-transparent" />

          <div className="mx-auto w-full max-w-7xl p-6 lg:p-8">
            <StudentGuard>{children}</StudentGuard>
          </div>
          
          <Suspense fallback={<AIAssistantFallback />}>
            <AIAssistant />
          </Suspense>
        </main>

        {/* ─── MOBILE BOTTOM NAVBAR ────────────────────────────────────────── */}
        <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl md:hidden">
          <div className="flex h-16 items-center justify-around px-2">
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
                  className="flex flex-col items-center justify-center gap-0.5 p-2 text-muted-foreground"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
                    {item.title}
                  </span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-0.5 p-2 transition-all',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">
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
