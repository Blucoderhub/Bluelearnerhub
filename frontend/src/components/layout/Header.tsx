'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Trophy,
  Menu,
  X,
  BookOpen,
  Play,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  Hammer,
  MessageSquare,
  Map,
  Award,
  GitBranch,
  Building2,
  Zap,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getAllDomains } from '@/lib/domain-config'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tutorialsExpanded, setTutorialsExpanded] = useState(false)
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const allDomains = getAllDomains()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const mainNavigation = [
    { name: 'Tutorials', href: '/tutorials', icon: BookOpen, isMega: true },
    { name: 'Tracks', href: '/learning-tracks', icon: Map },
    { name: 'Academy', href: '/mentors', icon: GraduationCap },
    { name: 'Q&A', href: '/qna', icon: MessageSquare },
    { name: 'Dev Portal', href: '/dev', icon: GitBranch },
    { name: 'Courses', href: '/courses', icon: Play, badge: 'Soon' },
  ]

  const secondaryNavigation = [
    { name: 'Daily Quiz', href: '/daily-quiz', icon: Zap, isHighlight: false },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: 'Premium', href: '/premium', icon: Sparkles, isHighlight: true },
    { name: 'Community', href: '/community', icon: Users },
  ]

  return (
    <>
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
          ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50'
          : 'bg-background/80 backdrop-blur-md border-b border-transparent'
          }`}
      >
        {/* Top Bar: Brand, Search, Auth */}
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex items-center gap-6 flex-1">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-200">
                <span className="text-lg font-bold text-primary-foreground">BL</span>
              </div>
              <span className="hidden sm:block font-black text-xl tracking-tighter">
                BLUELEARNERHUB
              </span>
            </Link>

            {/* Psychological Attraction: Centralized Search */}
            <div className="hidden md:flex flex-1 max-w-xl relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Zap className="h-4 w-4 text-primary group-focus-within:animate-pulse" />
              </div>
              <Input
                type="text"
                placeholder="Search tutorials, courses, or documentation..."
                className="w-full pl-10 h-10 bg-muted/30 border-border/50 rounded-2xl focus-visible:ring-primary/30 focus-visible:border-primary transition-all text-sm"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50">⌘K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-1.5 py-1.5 rounded-xl hover:bg-muted/50 focus:outline-none transition-all group">
                    <div className="relative">
                      <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/50 transition-all">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {user.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-primary border-2 border-background rounded-full" />
                    </div>
                    <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border/50">
                  <DropdownMenuLabel className="font-semibold text-primary text-xs uppercase tracking-wider">Account</DropdownMenuLabel>
                  <div className="px-2 pb-2">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer" asChild>
                    <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer" asChild>
                    <Link href="/dashboard"><Trophy className="mr-2 h-4 w-4" />Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:block text-sm font-bold text-foreground/70 hover:text-primary transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-black px-6 h-10 text-xs uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all group">
                  <Link href="/login" className="flex items-center gap-2">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navbar: Navigation (W3Schools Style) */}
        <nav className="hidden lg:flex border-t border-border/30 h-12 bg-muted/10">
          <div className="mx-auto flex h-full items-center px-4 sm:px-6 lg:px-8 max-w-[1400px] w-full gap-1 overflow-x-auto scrollbar-hide">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

              if (item.isMega) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`relative flex items-center gap-1.5 px-4 h-full text-[13px] font-bold transition-all duration-200 focus:outline-none border-b-2 ${isActive
                          ? 'text-primary border-primary bg-primary/5'
                          : 'text-foreground/70 border-transparent hover:text-foreground hover:bg-muted/50'
                          }`}
                      >
                        {item.name}
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      sideOffset={0}
                      className="w-[90vw] max-w-[1200px] p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 rounded-b-2xl rounded-t-none shadow-2xl border-border/50 bg-background/95 backdrop-blur-xl"
                    >
                      {allDomains.map((domain) => (
                        <div key={domain.id} className="space-y-4">
                          <DropdownMenuLabel className="flex items-center gap-2 p-0 text-sm font-bold text-foreground">
                            <span className="text-lg">{domain.icon}</span>
                            {domain.name}
                          </DropdownMenuLabel>
                          <div className="flex flex-col gap-1.5">
                            {domain.categories.slice(0, 6).map((category) => (
                              <Link
                                key={category}
                                href={`/tutorials/${domain.id}/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-[13px] text-muted-foreground hover:text-primary transition-colors py-0.5"
                              >
                                {category}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div className="space-y-4 border-l border-border/50 pl-10 ml-2">
                        <DropdownMenuLabel className="flex items-center gap-2 p-0 text-sm font-black text-primary uppercase tracking-widest">
                          Deep Dive
                        </DropdownMenuLabel>
                        <div className="flex flex-col gap-3">
                          <Link href="/ide" className="group flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all">
                            <Code2 className="h-4 w-4 text-primary" />
                            <span className="text-[13px] font-bold">IDE Sandbox</span>
                          </Link>
                          <Link href="/tools" className="group flex items-center gap-3 p-2 rounded-xl hover:bg-primary/5 transition-all">
                            <Hammer className="h-4 w-4 text-primary" />
                            <span className="text-[13px] font-bold">Tools</span>
                          </Link>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }

              return (
                <Link
                  key={item.name}
                  href={item.badge ? '#' : item.href}
                  className={`relative flex items-center gap-1.5 px-4 h-full text-[13px] font-bold transition-all duration-200 border-b-2 ${isActive
                    ? 'text-primary border-primary bg-primary/5'
                    : 'text-foreground/70 border-transparent hover:text-foreground hover:bg-muted/50'
                    } ${item.badge ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {item.name}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary rounded-sm">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
            <div className="flex-1" />
            {secondaryNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 h-full text-[12px] font-bold transition-all duration-200 flex items-center gap-2 ${item.isHighlight
                  ? 'text-primary hover:bg-primary/10'
                  : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {item.isHighlight && <Sparkles className="h-3.5 w-3.5" />}
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
                <span className="text-sm font-bold text-white">BL</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Bluelearnerhub</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 mb-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Learn</p>
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                if (item.isMega) {
                  return (
                    <div key={item.name} className="flex flex-col">
                      <button
                        onClick={() => setTutorialsExpanded(!tutorialsExpanded)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${tutorialsExpanded || isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-foreground/80 hover:bg-muted/50 active:bg-muted'
                          }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                        <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${tutorialsExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {tutorialsExpanded && (
                        <div className="pl-4 mt-1 space-y-1 mb-2">
                          {allDomains.map((domain) => (
                            <div key={domain.id} className="flex flex-col">
                              <button
                                onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${expandedDomain === domain.id ? 'text-primary font-bold' : 'text-foreground/70'
                                  }`}
                              >
                                <span>{domain.icon}</span>
                                {domain.name}
                                <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`} />
                              </button>

                              {expandedDomain === domain.id && (
                                <div className="pl-8 flex flex-col gap-1 py-1">
                                  {domain.categories.map((category) => (
                                    <Link
                                      key={category}
                                      href={`/tutorials/${domain.id}/${category.toLowerCase().replace(/\s+/g, '-')}`}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className="text-xs text-muted-foreground hover:text-primary py-1.5"
                                    >
                                      {category}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.badge ? '#' : item.href}
                    onClick={() => !item.badge && setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:bg-muted/50 active:bg-muted'
                      } ${item.badge ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-500 rounded-md">
                        {item.badge}
                      </span>
                    )}
                    {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                  </Link>
                )
              })}
            </div>

            <div className="px-3 mb-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Explore</p>
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground/80 hover:bg-muted/50 active:bg-muted'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    {isActive && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="p-4 border-t border-border/50">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Avatar className="h-10 w-10 border-2 border-primary/30">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 font-bold h-12 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all group">
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 w-full">
                    Get Started
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
