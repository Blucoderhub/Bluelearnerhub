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
  Search,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Trophy,
  Menu,
  X,
  BookOpen,
  FileText,
  Award,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 10)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMobileMenuOpen(false)
    setMobileSearchOpen(false)
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
    { name: 'Tutorials', href: '/tutorials', icon: BookOpen },
    { name: 'Exercises', href: '/exercises', icon: FileText },
    { name: 'Certificates', href: '/certificates', icon: Award },
  ]

  const secondaryNavigation = [
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Teachers', href: '/teachers', icon: GraduationCap },
    { name: 'Premium', href: '/premium', icon: Sparkles },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50'
            : 'bg-background/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <div className="flex items-center gap-3">
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

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-200">
                <span className="text-sm font-bold text-white">BL</span>
              </div>
              <span className="hidden sm:block font-bold text-lg tracking-tight">
                Bluelearnerhub
              </span>
            </Link>

            <nav className="hidden lg:flex items-center ml-6 gap-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="hidden xl:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                type="text"
                placeholder="Search courses, tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-full border-border/50 bg-muted/30 pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/50 hover:bg-muted/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="xl:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-muted/50 active:scale-95 transition-all"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-foreground/70" />
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:block h-6 w-px bg-border/50 mx-1" />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-1.5 py-1.5 rounded-xl hover:bg-muted/50 focus:outline-none transition-all group">
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-transparent group-hover:border-primary/50 transition-all">
                        <AvatarImage src={user.profilePicture} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                          {user.fullName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
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
                  <DropdownMenuItem className="rounded-lg focus:bg-primary/10 focus:text-primary cursor-pointer" asChild>
                    <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
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
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="hidden sm:inline-flex text-sm font-medium hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="bg-primary text-white hover:bg-primary/90 font-semibold px-5 h-9 text-sm rounded-lg shadow-md shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all">
                  <Link href="/select-role">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div
          className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search courses, tutorials, hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-xl border-border/50 bg-muted/30 pl-10 pr-4 text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                autoFocus={mobileSearchOpen}
              />
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] max-w-[85vw] bg-background shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
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
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${
                      isActive
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

            <div className="px-3 mb-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Explore</p>
              {secondaryNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all ${
                      isActive
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
                <Button asChild className="w-full bg-primary text-white hover:bg-primary/90 font-semibold h-11 rounded-xl shadow-md shadow-primary/20">
                  <Link href="/select-role" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full h-11 rounded-xl border-border/50">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
