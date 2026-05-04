'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { CommandPalette } from '@/components/layout/CommandPalette'

const mainNavItems = [
  { label: 'Lessons',   href: '/library' },
  { label: 'Hackathons', href: '/hackathons' },
  { label: 'Spaces',    href: '/spaces' },
  { label: 'Mentors',   href: '/mentors' },
]

export default function Header() {
  const [scrolled, setScrolled]         = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      {/* ── Sticky Navbar – floats on scroll ── */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'py-2'
            : 'py-3'
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300',
          )}
        >
          <div
            className={cn(
              'flex h-14 items-center justify-between rounded-xl px-5 transition-all duration-300',
              scrolled
                ? 'bg-card/95 backdrop-blur-md border border-border shadow-md'
                : 'bg-card/85 backdrop-blur-sm border border-border/70 shadow-sm'
            )}
          >
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              {/* Shield icon like Hacksplaining */}
              <svg
                className="h-7 w-7 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-base font-bold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="text-primary">Blue</span>learnerhub
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden items-center gap-1 lg:flex">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* ── Desktop Actions ── */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                id="header-search-btn"
                onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
                className="hidden items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:bg-secondary hover:text-foreground sm:flex"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search...</span>
                <kbd className="hidden items-center gap-0.5 rounded border border-border bg-card px-1.5 font-mono text-[10px] opacity-80 lg:flex">
                  Ctrl K
                </kbd>
              </button>

              <ThemeToggle />

              {/* Mobile hamburger */}
              <button
                id="header-mobile-menu-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-card border-l border-border shadow-xl flex flex-col">
            {/* Mobile header */}
            <div className="flex h-14 items-center justify-between px-5 border-b border-border">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span className="text-base font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  <span className="text-primary">Blue</span>learnerhub
                </span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-5 space-y-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href || pathname.startsWith(item.href + '/')
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/70'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <CommandPalette />
    </>
  )
}
