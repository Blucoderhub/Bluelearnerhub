'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  LogOut,
  Trophy,
  Menu,
  X,
  BookOpen,
  ArrowRight,
  Code2,
  Hammer,
  Zap,
  ExternalLink,
  GraduationCap,
  BarChart3,
  PlusCircle,
  BookMarked,
  LogIn,
  UserPlus,
  Users,
  Award,
} from 'lucide-react'
import { getAllDomains } from '@/lib/domain-config'
import { useAuth } from '@/hooks/useAuth'

const hackathons = [
  { name: 'MLH Hackathons', description: 'Major League Hacking — official student hackathons', href: 'https://mlh.io/seasons/2025/events', logo: '🏆' },
  { name: 'Devfolio', description: "India's largest hackathon platform", href: 'https://devfolio.co/hackathons', logo: '⚡' },
  { name: 'HackerEarth', description: 'Developer challenges & hackathons', href: 'https://www.hackerearth.com/hackathon/explore/', logo: '🌐' },
  { name: 'Unstop', description: 'Competitions, hackathons & challenges', href: 'https://unstop.com/hackathons', logo: '🚀' },
  { name: 'Devpost', description: 'The home of virtual hackathons', href: 'https://devpost.com/hackathons', logo: '💻' },
]

const mentorFeatures = [
  { name: 'Become an Instructor', description: 'Share your expertise, teach thousands', href: '/mentor/apply', icon: GraduationCap },
  { name: 'Create a Course', description: 'Build interactive courses and tutorials', href: '/mentor/create-course', icon: PlusCircle },
  { name: 'Manage Students', description: 'Track progress, grade and mentor learners', href: '/mentor/students', icon: Users },
  { name: 'Instructor Dashboard', description: 'Analytics, earnings, and course insights', href: '/mentor/dashboard', icon: BarChart3 },
  { name: 'Teaching Resources', description: 'Templates, guides, and best practices', href: '/mentor/resources', icon: BookMarked },
  { name: 'Certification Issuing', description: 'Award certificates to your learners', href: '/mentor/certificates', icon: Award },
]

type MenuKey = 'tutorials' | 'hackathon' | 'mentor' | 'getin' | null

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tutorialsExpanded, setTutorialsExpanded] = useState(false)
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuKey>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const allDomains = getAllDomains()

  const openHover = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(key)
  }
  const closeHover = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const navLinkCls = (active: boolean) =>
    `relative flex items-center gap-1 px-4 h-full text-[13px] font-bold transition-colors duration-150 border-b-2 ${
      active
        ? 'text-foreground border-foreground'
        : 'text-foreground/60 border-transparent hover:text-foreground'
    }`

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50'
            : 'bg-background/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1400px]">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 group-hover:scale-105 transition-all duration-200">
              <span className="text-sm font-black text-primary-foreground">BL</span>
            </div>
            <span className="hidden sm:block font-black text-[15px] tracking-tighter">
              BLUELEARNERHUB
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center h-14 flex-1 gap-0">

            {/* Tutorials — hover mega menu */}
            <div
              className="relative h-full"
              onMouseEnter={() => openHover('tutorials')}
              onMouseLeave={closeHover}
            >
              <button className={navLinkCls(!!pathname?.startsWith('/tutorials'))}>
                <BookOpen className="h-3.5 w-3.5 opacity-60" />
                Tutorials
                <ChevronDown className={`h-3 w-3 opacity-40 transition-transform duration-200 ${openMenu === 'tutorials' ? 'rotate-180' : ''}`} />
              </button>
              {openMenu === 'tutorials' && (
                <div
                  className="absolute top-full left-0 mt-0 w-[780px] bg-background/98 backdrop-blur-xl border border-border/60 rounded-b-2xl shadow-2xl p-8 z-50"
                  onMouseEnter={() => openHover('tutorials')}
                  onMouseLeave={closeHover}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-6">Browse by Domain</p>
                  <div className="grid grid-cols-3 gap-x-10 gap-y-8">
                    {allDomains.map((domain) => (
                      <div key={domain.id} className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{domain.icon}</span>
                          <span className="text-[12px] font-black text-foreground">{domain.name}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {domain.categories.slice(0, 5).map((cat) => (
                            <Link
                              key={cat}
                              href={`/tutorials/${domain.id}/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors py-0.5"
                              onClick={() => setOpenMenu(null)}
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-border/40 flex gap-4">
                    <Link href="/ide" className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpenMenu(null)}>
                      <Code2 className="h-4 w-4" /> IDE Sandbox
                    </Link>
                    <Link href="/tools" className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors" onClick={() => setOpenMenu(null)}>
                      <Hammer className="h-4 w-4" /> Tools
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Courses — coming soon */}
            <div className="relative h-full flex items-center">
              <span className={`${navLinkCls(false)} opacity-50 cursor-not-allowed`}>
                Courses
                <span className="ml-1.5 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tight bg-foreground/10 text-foreground/50 rounded">
                  Soon
                </span>
              </span>
            </div>

            {/* Hackathon — hover panel */}
            <div
              className="relative h-full"
              onMouseEnter={() => openHover('hackathon')}
              onMouseLeave={closeHover}
            >
              <button className={navLinkCls(!!pathname?.startsWith('/hackathon'))}>
                Hackathon
                <ChevronDown className={`h-3 w-3 opacity-40 transition-transform duration-200 ${openMenu === 'hackathon' ? 'rotate-180' : ''}`} />
              </button>
              {openMenu === 'hackathon' && (
                <div
                  className="absolute top-full left-0 mt-0 w-[400px] bg-background/98 backdrop-blur-xl border border-border/60 rounded-b-2xl shadow-2xl p-6 z-50"
                  onMouseEnter={() => openHover('hackathon')}
                  onMouseLeave={closeHover}
                >
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">External Platforms</p>
                  <div className="flex flex-col gap-1">
                    {hackathons.map((h) => (
                      <a
                        key={h.name}
                        href={h.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all"
                        onClick={() => setOpenMenu(null)}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{h.logo}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{h.name}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{h.description}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mentor — hover panel (W3Schools teacher style) */}
            <div
              className="relative h-full"
              onMouseEnter={() => openHover('mentor')}
              onMouseLeave={closeHover}
            >
              <button className={navLinkCls(!!pathname?.startsWith('/mentor'))}>
                Mentor
                <ChevronDown className={`h-3 w-3 opacity-40 transition-transform duration-200 ${openMenu === 'mentor' ? 'rotate-180' : ''}`} />
              </button>
              {openMenu === 'mentor' && (
                <div
                  className="absolute top-full left-0 mt-0 w-[480px] bg-background/98 backdrop-blur-xl border border-border/60 rounded-b-2xl shadow-2xl z-50 overflow-hidden"
                  onMouseEnter={() => openHover('mentor')}
                  onMouseLeave={closeHover}
                >
                  {/* Header banner */}
                  <div className="bg-primary/8 border-b border-border/50 px-6 py-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/20">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-black text-foreground">Teach on Bluelearnerhub</p>
                      <p className="text-[11px] text-muted-foreground">Join thousands of instructors worldwide</p>
                    </div>
                    <Link
                      href="/mentor/apply"
                      className="ml-auto shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-black hover:bg-primary/90 transition-all"
                      onClick={() => setOpenMenu(null)}
                    >
                      Start Teaching <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  {/* Feature grid */}
                  <div className="p-4 grid grid-cols-2 gap-1">
                    {mentorFeatures.map((f) => {
                      const Icon = f.icon
                      return (
                        <Link
                          key={f.name}
                          href={f.href}
                          className="group flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all"
                          onClick={() => setOpenMenu(null)}
                        >
                          <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors">
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="text-[12px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{f.name}</p>
                            <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{f.description}</p>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {user ? (
              /* Logged-in user avatar dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-1.5 py-1.5 rounded-xl hover:bg-muted/50 focus:outline-none transition-all group">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary/50 transition-all">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {user.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 bg-primary border-2 border-background rounded-full" />
                    </div>
                    <ChevronDown className="hidden sm:block h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl border-border/50">
                  <DropdownMenuLabel className="font-semibold text-primary text-[10px] uppercase tracking-wider">Account</DropdownMenuLabel>
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
                  <DropdownMenuItem onClick={logout} className="rounded-lg text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* "Get In" hover dropdown — Sign In / Sign Up */
              <div
                className="relative hidden lg:block"
                onMouseEnter={() => openHover('getin')}
                onMouseLeave={closeHover}
              >
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-black hover:bg-primary/90 transition-all active:scale-[0.98]">
                  Get In
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${openMenu === 'getin' ? 'rotate-180' : ''}`} />
                </button>
                {openMenu === 'getin' && (
                  <div
                    className="absolute top-full right-0 mt-1.5 w-52 bg-background/98 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden z-50"
                    onMouseEnter={() => openHover('getin')}
                    onMouseLeave={closeHover}
                  >
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors group border-b border-border/40"
                      onClick={() => setOpenMenu(null)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors">
                        <LogIn className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">Sign In</p>
                        <p className="text-[11px] text-muted-foreground">Already have an account</p>
                      </div>
                    </Link>
                    <Link
                      href="/get-started"
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                      onClick={() => setOpenMenu(null)}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 group-hover:bg-primary/10 transition-colors">
                        <UserPlus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">Sign Up</p>
                        <p className="text-[11px] text-muted-foreground">Create a free account</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-sm font-black text-primary-foreground">BL</span>
              </div>
              <span className="font-black text-[15px] tracking-tighter">Bluelearnerhub</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 transition-all" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            {/* Tutorials accordion */}
            <button
              onClick={() => setTutorialsExpanded(!tutorialsExpanded)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-foreground/80 hover:bg-muted/50 transition-all"
            >
              <BookOpen className="h-5 w-5 shrink-0" />
              Tutorials
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${tutorialsExpanded ? 'rotate-180' : ''}`} />
            </button>
            {tutorialsExpanded && (
              <div className="pl-3 space-y-0.5">
                {allDomains.map((domain) => (
                  <div key={domain.id}>
                    <button
                      onClick={() => setExpandedDomain(expandedDomain === domain.id ? null : domain.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:bg-muted/40 transition-all font-medium"
                    >
                      <span className="text-base">{domain.icon}</span>
                      {domain.name}
                      <ChevronDown className={`ml-auto h-3 w-3 transition-transform ${expandedDomain === domain.id ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedDomain === domain.id && (
                      <div className="pl-9 flex flex-col gap-0.5 pb-1">
                        {domain.categories.map((cat) => (
                          <Link
                            key={cat}
                            href={`/tutorials/${domain.id}/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-muted-foreground hover:text-foreground py-1.5 transition-colors"
                          >
                            {cat}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Courses */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-foreground/40 cursor-not-allowed">
              Courses
              <span className="ml-1 px-1.5 py-0.5 text-[9px] font-black uppercase bg-foreground/10 text-foreground/40 rounded">Soon</span>
            </div>

            {/* Hackathon */}
            <button
              onClick={() => setExpandedDomain(expandedDomain === 'hackathon' ? null : 'hackathon')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-foreground/80 hover:bg-muted/50 transition-all"
            >
              Hackathon
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${expandedDomain === 'hackathon' ? 'rotate-180' : ''}`} />
            </button>
            {expandedDomain === 'hackathon' && (
              <div className="pl-3 space-y-0.5">
                {hackathons.map((h) => (
                  <a key={h.name} href={h.href} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all font-medium">
                    <span>{h.logo}</span> {h.name} <ExternalLink className="ml-auto h-3 w-3 opacity-40" />
                  </a>
                ))}
              </div>
            )}

            {/* Mentor */}
            <button
              onClick={() => setExpandedDomain(expandedDomain === 'mentor' ? null : 'mentor')}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-foreground/80 hover:bg-muted/50 transition-all"
            >
              <GraduationCap className="h-5 w-5 shrink-0" />
              Mentor
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${expandedDomain === 'mentor' ? 'rotate-180' : ''}`} />
            </button>
            {expandedDomain === 'mentor' && (
              <div className="pl-3 space-y-0.5">
                {mentorFeatures.map((f) => {
                  const Icon = f.icon
                  return (
                    <Link key={f.name} href={f.href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all font-medium">
                      <Icon className="h-4 w-4 shrink-0" /> {f.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom auth */}
          <div className="p-4 border-t border-border/50 space-y-2">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                <Avatar className="h-9 w-9 border-2 border-primary/30">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {user.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border/60 text-sm font-bold text-foreground/80 hover:bg-muted/50 transition-all"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-black hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
