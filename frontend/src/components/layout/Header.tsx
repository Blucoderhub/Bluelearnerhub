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
import { motion, AnimatePresence } from 'framer-motion'
import { generateAvatarURL } from '@/utils/generateAvatar'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const hackathonLinks = [
  { name: 'Browse Hackathons', description: 'Explore all active and upcoming hackathons', href: '/hackathons', icon: Trophy },
  { name: 'My Registrations', description: 'View hackathons you have joined', href: '/hackathons/my', icon: BookMarked },
  { name: 'My Team', description: 'Manage your team and collaborators', href: '/hackathons/team', icon: Users },
  { name: 'Leaderboard', description: 'See top performers and rankings', href: '/hackathons/leaderboard', icon: BarChart3 },
]

type MenuKey = 'tutorials' | 'hackathon' | 'spaces' | 'mentor' | 'getin' | null

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [libraryExpanded, setLibraryExpanded] = useState(false)
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
    setScrolled(window.scrollY > 20)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navLinkCls = (active: boolean) =>
    cn(
      "relative flex items-center gap-1.5 px-4 h-full text-[13px] font-bold uppercase tracking-widest transition-all duration-300",
      active 
        ? "text-primary after:absolute after:bottom-0 after:left-4 after:right-4 after:h-0.5 after:bg-primary" 
        : "text-muted-foreground hover:text-white"
    )

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[60] w-full border-b border-border/50 transition-all duration-500",
          scrolled ? "bg-background/80 backdrop-blur-2xl py-0 shadow-2xl shadow-black/50" : "bg-transparent py-2"
        )}
      >
        <div className="bg-noise pointer-events-none opacity-20" />
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12">
          {/* Brand */}
          <Link href="/" className="group flex items-center">
            <span className="font-heading text-xl font-bold tracking-tight text-white transition-colors group-hover:text-primary">
              BlueLearnerHub
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden h-full flex-1 items-center justify-center gap-2 lg:flex">
            <div className="relative h-full" onMouseEnter={() => openHover('tutorials')} onMouseLeave={closeHover}>
              <button className={navLinkCls(pathname?.startsWith('/tutorials'))}>
                Library <ChevronDown className={cn("h-3 w-3 transition-transform", openMenu === 'tutorials' && "rotate-180")} />
              </button>
              <AnimatePresence>
                {openMenu === 'tutorials' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-0 top-full w-[280px] pt-2"
                  >
                    <div className="overflow-hidden rounded-3xl border border-border bg-card/60 p-4 shadow-3xl backdrop-blur-3xl">
                      <div className="space-y-6">
                        {allDomains.map((domain) => (
                          <div key={domain.id} className="space-y-3">
                            <Badge variant="outline" className="rounded-full border-primary/20 px-3 text-[9px] font-black uppercase tracking-widest text-primary/70">
                              {domain.name}
                            </Badge>
                            <div className="grid gap-1">
                              {domain.categories.map((cat) => (
                                <Link
                                  key={cat}
                                  href={`/tutorials/${domain.id}/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="rounded-xl px-4 py-2 text-[13px] font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-white"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/hackathons" className={navLinkCls(pathname?.startsWith('/hackathons'))}>Hackathons</Link>
            <Link href="/spaces" className={navLinkCls(pathname?.startsWith('/spaces'))}>Spaces</Link>
            <Link href="/mentor" className={navLinkCls(pathname?.startsWith('/mentor'))}>Mentor</Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
               <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button className="flex items-center gap-3 rounded-full border border-border bg-card/40 pl-2 pr-5 py-2 transition-all hover:bg-card hover:shadow-xl">
                    <Avatar className="h-8 w-8 border border-primary/20">
                      <AvatarImage src={user.avatarConfig ? generateAvatarURL(user.avatarConfig) : user.profilePicture} />
                      <AvatarFallback className="bg-primary text-[10px] font-bold text-white">
                        {user.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-bold text-white uppercase tracking-widest">Portal</span>
                 </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-64 rounded-3xl border-border bg-card/80 p-2 backdrop-blur-3xl">
                 <DropdownMenuLabel className="p-4 font-heading text-lg text-white">Identity Hub</DropdownMenuLabel>
                 <DropdownMenuSeparator className="bg-border/50" />
                 <DropdownMenuItem asChild className="rounded-2xl p-3 focus:bg-primary focus:text-white">
                   <Link href="/student/dashboard" className="flex items-center gap-3">
                     <LayoutDashboard size={18} /> Dashboard
                   </Link>
                 </DropdownMenuItem>
                 <DropdownMenuItem onClick={logout} className="rounded-2xl p-3 text-red-500 focus:bg-red-500 focus:text-white">
                   <LogOut size={18} /> Terminate Session
                 </DropdownMenuItem>
               </DropdownMenuContent>
             </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all hover:text-primary"
                >
                  Access
                </Link>
                <Link
                  href="/get-started"
                  className="rounded-full bg-primary px-8 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  Join Matrix
                </Link>
              </div>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/40 transition-all hover:bg-secondary lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer handled in StudentLayout but also here for public pages */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-xl md:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed inset-y-0 right-0 z-[80] w-[300px] border-l border-border bg-card p-8 md:hidden">
               <div className="mb-12 flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-white">BlueLearnerHub</span>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-full border border-border p-2">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-4">
                 <Link href="/tutorials" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
                   <BookOpen size={18} /> Library
                 </Link>
                 <Link href="/hackathons" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
                   <Trophy size={18} /> Hackathons
                 </Link>
                 <Link href="/spaces" className="flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-white">
                   <Globe size={18} /> Spaces
                 </Link>
                 <Link href="/login" className="mt-12 flex h-14 items-center justify-center rounded-2xl bg-primary text-xs font-black uppercase tracking-widest text-white">
                    Get Started
                 </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const LayoutDashboard = ({ size }: { size: number }) => <BarChart3 size={size} />
