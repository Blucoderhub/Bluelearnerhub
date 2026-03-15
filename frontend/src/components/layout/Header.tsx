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
  GraduationCap,
  BarChart3,
  PlusCircle,
  BookMarked,
  LogIn,
  UserPlus,
  Users,
  Award,
  Globe,
  GitFork,
  Eye,
  FolderOpen,
} from 'lucide-react'
import { getAllDomains } from '@/lib/domain-config'
import { useAuth } from '@/hooks/useAuth'
import { generateAvatarURL } from '@/utils/generateAvatar'

const hackathonLinks = [
  { name: 'Browse Hackathons', description: 'Explore all active and upcoming hackathons', href: '/hackathons', icon: 'Trophy' },
  { name: 'My Registrations', description: 'View hackathons you have joined', href: '/hackathons/my', icon: 'Bookmark' },
  { name: 'My Team', description: 'Manage your team and collaborators', href: '/hackathons/team', icon: 'Users' },
  { name: 'Leaderboard', description: 'See top performers and rankings', href: '/hackathons/leaderboard', icon: 'BarChart3' },
  { name: 'Past Hackathons', description: 'Results and winner showcases', href: '/hackathons/past', icon: 'Archive' },
  { name: 'Host a Hackathon', description: 'Corporates — create and manage a hackathon', href: '/contact?type=corporate', icon: 'PlusCircle' },
]

const spacesLinks = [
  { name: 'Create a Space', description: 'Start a new HTML/CSS/JS or React project', href: '/spaces/new', icon: FolderOpen },
  { name: 'My Spaces', description: 'Manage your published and private projects', href: '/spaces/my', icon: Globe },
  { name: 'Explore Community', description: 'Browse thousands of learner-built projects', href: '/spaces/explore', icon: Eye },
  { name: 'Fork a Project', description: 'Clone any public Space and remix it', href: '/spaces/explore', icon: GitFork },
]

const mentorFeatures = [
  { name: 'Become an Instructor', description: 'Share your expertise, teach thousands', href: '/mentor/apply', icon: GraduationCap },
  { name: 'Create a Course', description: 'Build interactive courses and tutorials', href: '/mentor/create-course', icon: PlusCircle },
  { name: 'Manage Students', description: 'Track progress, grade and mentor learners', href: '/mentor/students', icon: Users },
  { name: 'Instructor Dashboard', description: 'Analytics, earnings, and course insights', href: '/mentor/dashboard', icon: BarChart3 },
  { name: 'Teaching Resources', description: 'Templates, guides, and best practices', href: '/mentor/resources', icon: BookMarked },
  { name: 'Certification Issuing', description: 'Award certificates to your learners', href: '/mentor/certificates', icon: Award },
]

type MenuKey = 'tutorials' | 'hackathon' | 'spaces' | 'mentor' | 'getin' | null

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
    `relative flex items-center gap-1 px-4 h-full text-[13.5px] font-semibold transition-colors duration-200 border-b-2 ${
      active
        ? 'text-primary border-primary'
        : 'text-foreground/60 border-transparent hover:text-foreground hover:border-border'
    }`

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border transition-shadow duration-300 ${
          scrolled ? 'shadow-card-md' : 'shadow-none'
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1400px]">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-6 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light shadow-brand">
              <span className="text-xs font-extrabold text-white tracking-tight">BL</span>
            </div>
            <span className="hidden sm:block font-bold text-[15px] tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
              Bluelearnerhub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center h-14 flex-1 gap-0">

            {/* Tutorials */}
            <div
              className="relative h-full"
              onMouseEnter={() => openHover('tutorials')}
              onMouseLeave={closeHover}
            >
              <button className={navLinkCls(!!pathname?.startsWith('/tutorials'))}>
                Tutorials
                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
              </button>
              {openMenu === 'tutorials' && (
                <div
                  className="absolute top-full left-0 w-[580px] bg-background rounded-2xl border border-border p-6 z-50 shadow-card-lg animate-slide-up"
                  onMouseEnter={() => openHover('tutorials')}
                  onMouseLeave={closeHover}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-5">Browse Domains</p>
                  <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                    {allDomains.map((domain) => (
                      <div key={domain.id} className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-foreground">{domain.name}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {domain.categories.slice(0, 4).map((cat) => (
                            <Link
                              key={cat}
                              href={`/tutorials/${domain.id}/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-[12px] text-muted-foreground hover:text-primary transition-colors duration-150 py-0.5"
                              onClick={() => setOpenMenu(null)}
                            >
                              {cat}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hackathon */}
            <div
              className="relative h-full"
              onMouseEnter={() => openHover('hackathon')}
              onMouseLeave={closeHover}
            >
              <button className={navLinkCls(!!pathname?.startsWith('/hackathon'))}>
                Hackathon
                <ChevronDown className="h-3 w-3 opacity-50 ml-0.5" />
              </button>
              {openMenu === 'hackathon' && (
                <div
                  className="absolute top-full left-0 w-[240px] bg-background rounded-2xl border border-border p-2 z-50 shadow-card-lg animate-slide-up"
                  onMouseEnter={() => openHover('hackathon')}
                  onMouseLeave={closeHover}
                >
                  {hackathonLinks.slice(0, 4).map((h) => (
                    <Link
                      key={h.name}
                      href={h.href}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-foreground/70 hover:text-primary hover:bg-accent transition-all duration-150"
                      onClick={() => setOpenMenu(null)}
                    >
                      {h.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Spaces */}
            <Link href="/spaces" className={navLinkCls(!!pathname?.startsWith('/spaces'))}>
              Spaces
            </Link>

            {/* Mentor */}
            <Link href="/mentor" className={navLinkCls(!!pathname?.startsWith('/mentor'))}>
              Mentor
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background hover:bg-muted/50 transition-all duration-200 text-[13px] font-semibold text-foreground shadow-card hover:shadow-card-md">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{user.fullName?.charAt(0) || 'U'}</span>
                </div>
                Account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-[13.5px] font-semibold text-foreground/60 hover:text-foreground transition-colors duration-200 px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-brand to-brand-light text-white px-4 py-2 rounded-xl text-[13.5px] font-semibold shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97]"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors duration-200 border border-border"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-background shadow-card-lg transform transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-light shadow-brand">
                <span className="text-sm font-extrabold text-white">BL</span>
              </div>
              <span className="font-bold text-[15px] tracking-tight text-foreground">Bluelearnerhub</span>
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors" aria-label="Close">
              <X className="h-5 w-5 text-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
            {/* Tutorials accordion */}
            <button
              onClick={() => setTutorialsExpanded(!tutorialsExpanded)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-all duration-200"
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
                            className="text-xs text-muted-foreground hover:text-primary py-1.5 transition-colors duration-150"
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
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-foreground/30 cursor-not-allowed">
              Courses
              <span className="ml-1 px-1.5 py-0.5 text-[9px] font-semibold uppercase bg-muted text-muted-foreground rounded-full">Soon</span>
            </div>

            {/* Hackathon */}
            <button
              onClick={() => setExpandedDomain(expandedDomain === 'hackathon' ? null : 'hackathon')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-all duration-200"
            >
              Hackathon
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${expandedDomain === 'hackathon' ? 'rotate-180' : ''}`} />
            </button>
            {expandedDomain === 'hackathon' && (
              <div className="pl-3 space-y-0.5">
                {hackathonLinks.map((h) => (
                  <Link key={h.name} href={h.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-150 font-medium">
                    <Trophy className="h-4 w-4 shrink-0" /> {h.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Spaces */}
            <button
              onClick={() => setExpandedDomain(expandedDomain === 'spaces' ? null : 'spaces')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-all duration-200"
            >
              <Globe className="h-5 w-5 shrink-0" />
              Spaces
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${expandedDomain === 'spaces' ? 'rotate-180' : ''}`} />
            </button>
            {expandedDomain === 'spaces' && (
              <div className="pl-3 space-y-0.5">
                {spacesLinks.map((s) => {
                  const Icon = s.icon
                  return (
                    <Link key={s.name} href={s.href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-150 font-medium">
                      <Icon className="h-4 w-4 shrink-0" /> {s.name}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Mentor */}
            <button
              onClick={() => setExpandedDomain(expandedDomain === 'mentor' ? null : 'mentor')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-semibold text-foreground/80 hover:bg-muted/60 hover:text-foreground transition-all duration-200"
            >
              <GraduationCap className="h-5 w-5 shrink-0" />
              Mentor
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${expandedDomain === 'mentor' ? 'rotate-180' : ''}`} />
            </button>
            {expandedDomain === 'mentor' && (
              <div className="pl-3 space-y-0.5">
                {mentorFeatures.map((f) => {
                  const Icon = f.icon
                  return (
                    <Link key={f.name} href={f.href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-all duration-150 font-medium">
                      <Icon className="h-4 w-4 shrink-0" /> {f.name}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom auth */}
          <div className="p-4 border-t border-border space-y-2">
            {user ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src={user.avatarConfig ? generateAvatarURL(user.avatarConfig) : user.profilePicture} />
                  <AvatarFallback className="bg-accent text-primary font-bold text-sm">
                    {user.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-border text-sm font-semibold text-foreground/80 hover:bg-muted/50 transition-all duration-200"
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-brand to-brand-light text-white text-sm font-semibold shadow-brand hover:shadow-brand-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4" /> Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
