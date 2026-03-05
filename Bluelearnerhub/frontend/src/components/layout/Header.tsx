'use client'

import { useState } from 'react'
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
  MoreVertical,
  User,
  Settings,
  LogOut,
  Trophy,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const mainNavigation = [
    { name: 'References', href: '/references' },
    { name: 'Exercises', href: '/exercises' },
    { name: 'Certificates', href: '/certificates' },
  ]

  const rightNavigation = [
    { name: 'Spaces', href: '/spaces' },
    { name: 'Teachers', href: '/teachers' },
    { name: 'Upgrade', href: '/upgrade' },
    { name: 'Get Certified', href: '/get-certified' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border text-foreground shadow-lg">
      <div className="mx-auto flex h-14 items-center justify-between px-4 lg:px-6 max-w-[1600px]">
        {/* Left Section: Logo & Tutorials */}
        <div className="flex h-full items-center gap-2">
          <Link href="/" className="flex items-center gap-2 mr-4 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-105 transition-all">
              <span className="text-sm font-bold text-white font-heading">BL</span>
            </div>
            <span className="hidden leading-none md:block font-heading font-bold text-lg tracking-tight">
              Bluelearnerhub
            </span>
          </Link>

          <Button
            className="flex items-center gap-2 rounded-lg bg-primary px-5 h-10 text-[15px] font-bold text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all font-heading shadow-md shadow-primary/10"
          >
            Tutorials
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center ml-2 h-full">
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 h-full text-[15px] font-medium transition-all hover:text-primary relative group ${isActive ? 'text-primary' : 'text-foreground/70'
                    }`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform ${isActive ? 'scale-x-100' : ''}`} />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Center Section: Search Bar (Pill shaped, elegant) */}
        <div className="flex-1 max-w-xl mx-8 hidden xl:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              type="text"
              placeholder="Search for courses, tutorials, or hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-full border-muted bg-muted/30 pl-10 pr-4 text-[14px] focus-visible:ring-primary/20 focus-visible:border-primary transition-all bg-muted/10 hover:bg-muted/20"
            />
          </div>
        </div>

        {/* Right Section: Mobile & Auth Actions */}
        <div className="flex items-center gap-3">
          <nav className="hidden 2xl:flex items-center gap-2">
            {rightNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-3 py-1.5 text-[14px] font-medium transition-colors hover:text-primary text-foreground/70"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="h-6 w-px bg-border mx-2 hidden lg:block" />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 pl-2 py-1.5 focus:outline-none group">
                  <div className="relative">
                    <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary transition-all">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.fullName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-morphism border-border">
                <DropdownMenuLabel className="font-heading font-semibold text-primary">Account</DropdownMenuLabel>
                <div className="px-2 pb-2">
                  <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" asChild>
                  <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" asChild>
                  <Link href="/dashboard"><Trophy className="mr-2 h-4 w-4" />Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors"
                >
                  <LogOut className="mr-2 h-4 w-4" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden md:inline-flex hover:text-primary hover:bg-primary/5 transition-all font-semibold">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-primary text-white hover:bg-primary/90 font-bold px-5 h-10 transition-all shadow-md shadow-primary/20">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
