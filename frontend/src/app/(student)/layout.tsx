'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { XPProgressBar } from '@/components/gamification/XPProgressBar'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import CodingCharacter from '@/components/animations/characters/CodingCharacter'
import { useAuth } from '@/hooks/useAuth'
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
  Flame,
  Zap,
} from 'lucide-react'

const navItems = [
  { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Tutorials', href: '/tutorials', icon: BookOpen },
  { title: 'Courses', href: '/courses', icon: GraduationCap },
  { title: 'Exercises', href: '/exercises', icon: Code2 },
  { title: 'Quiz', href: '/quiz', icon: ClipboardCheck },
  { title: 'Labs', href: '/labs', icon: FlaskConical },
  { title: 'IDE', href: '/ide', icon: Terminal },
  { title: 'AI Companion', href: '/ai-companion', icon: Bot },
  { title: 'Hackathons', href: '/hackathons', icon: Flag },
  { title: 'Premium', href: '/premium', icon: Crown },
]

const mobileTabItems = [
  { title: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
  { title: 'Learn', href: '/tutorials', icon: BookOpen },
  { title: 'Code', href: '/ide', icon: Terminal },
  { title: 'Compete', href: '/hackathons', icon: Flag },
  { title: 'More', href: '#more', icon: Menu },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  // Derive display values from real user data with sensible defaults
  const displayName = user?.fullName ?? user?.name ?? 'Student'
  const initials = displayName.charAt(0).toUpperCase()
  const level = user?.level ?? 1
  const currentXP = user?.totalPoints ?? 0
  const nextLevelXP = level * 1000
  const streak = user?.currentStreak ?? 0

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden md:flex w-64 lg:w-72 flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 h-screen z-40">
        <div className="flex h-14 items-center border-b border-border/50 px-6">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
              <span className="text-xs font-bold text-primary-foreground">BL</span>
            </div>
            <span className="font-heading font-bold text-base tracking-tight">Student</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
          <div className="px-3">
            <XPProgressBar currentXP={currentXP} nextLevelXP={nextLevelXP} level={level} compact />
          </div>

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2">Navigation</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                  )}
                >
                  {isActive && <span className="absolute left-0 w-[3px] h-5 bg-primary rounded-r-full" />}
                  <Icon className={cn('w-[18px] h-[18px] shrink-0 transition-colors', isActive ? 'text-primary' : 'group-hover:text-foreground')} />
                  <span className="truncate">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mx-3 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
            <div className="flex items-center gap-2">
              <CodingCharacter size={48} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-primary">Streak Buddy</p>
                <p className="text-[10px] text-muted-foreground leading-snug">
                  {streak >= 14
                    ? '🔥 Legendary streak! Unstoppable!'
                    : streak >= 7
                      ? '💪 Great streak! Keep it up!'
                      : streak >= 3
                        ? '👍 Nice start! Stay consistent!'
                        : '🚀 Start your streak today!'}
                </p>
              </div>
            </div>
          </div>

          <div className="mx-3 p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
            <h4 className="text-sm font-bold text-primary">Join Community</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">Connect with 50K+ learners.</p>
            <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80 font-semibold">
              Join Discord →
            </Button>
          </div>
        </div>

        <div className="p-3 border-t border-border/50">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/20">
            <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="level-badge text-[10px] py-0">LV {level}</span>
                <span className="flex items-center gap-0.5 text-[10px] text-[var(--streak-orange)]">
                  <Flame className="w-3 h-3" /> {streak}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-card border-r border-border z-50 md:hidden overflow-y-auto animate-slide-in-left">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-heading font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-muted touch-target">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 border-b border-border">
              <XPProgressBar currentXP={currentXP} nextLevelXP={nextLevelXP} level={level} compact />
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all touch-target',
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 md:pb-8 max-w-[1400px] mx-auto w-full">
          {children}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-xl border-t border-border safe-bottom">
          <div className="flex items-center justify-around h-16 px-2">
            {mobileTabItems.map((item) => {
              const isActive = item.href !== '#more' && (pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href)))
              const Icon = item.icon
              return item.href === '#more' ? (
                <button
                  key="more"
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 touch-target text-muted-foreground"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.title}</span>
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 touch-target transition-colors',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive && 'drop-shadow-[0_0_6px_var(--primary)]')} />
                  <span className="text-[10px] font-medium">{item.title}</span>
                  {isActive && <span className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
