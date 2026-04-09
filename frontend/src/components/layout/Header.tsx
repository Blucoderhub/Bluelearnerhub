'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Menu,
  X,
  Globe,
  ArrowRight,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { Search } from 'lucide-react'

const mainNavItems = [
  { label: 'Library', href: '/library' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Spaces', href: '/spaces' },
  { label: 'Mentors', href: '/mentors' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
          scrolled
            ? 'bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm'
            : 'bg-background/80 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                <span className="text-primary">Blue</span>LearnerHub
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="hidden items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-muted/50 sm:flex"
              >
                <Search className="h-3 w-3" />
                <span>Search...</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
                  <span className="text-xs">Ctrl</span>K
                </kbd>
              </button>
              <ThemeToggle />
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground hover:text-foreground transition-colors sm:block"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card hover:bg-secondary lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-background/95 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 right-0 bg-background border-b border-border">
            <div className="flex h-14 items-center justify-between px-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">
                  <span className="text-primary">Blue</span>LearnerHub
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-border space-y-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-md border border-border bg-card px-4 py-3 text-center font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full rounded-md bg-primary px-4 py-3 text-center font-medium text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
      <CommandPalette />
    </>
  )
}
