'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Code,
  Trophy,
  MessageSquare,
  Briefcase,
  Award,
  Settings,
  FileText,
  Users,
  Zap,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  BookMarked,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

type SidebarSubItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type SidebarItem =
  | {
      name: string
      href: string
      icon: React.ComponentType<{ className?: string }>
    }
  | {
      name: string
      icon: React.ComponentType<{ className?: string }>
      section: string
      items: SidebarSubItem[]
    }

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [expandedSections, setExpandedSections] = useState<string[]>(['learn'])

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const studentNavigation: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/student/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Learn',
      icon: BookOpen,
      section: 'learn',
      items: [
        { name: 'Tutorials', href: '/tutorials', icon: BookOpen },
        { name: 'Learning Tracks', href: '/learning-tracks', icon: TrendingUp },
        { name: 'Daily Quiz', href: '/daily-quiz', icon: Zap },
      ],
    },
    {
      name: 'Practice',
      icon: Code,
      section: 'practice',
      items: [
        { name: 'Coding IDE', href: '/ide', icon: Code },
        { name: 'Exercises', href: '/exercises', icon: FileText },
        { name: 'Organizations', href: '/organizations', icon: Briefcase },
      ],
    },
    {
      name: 'Hackathons',
      icon: Trophy,
      section: 'hackathons',
      items: [
        { name: 'Browse', href: '/hackathons', icon: Trophy },
        { name: 'Leaderboard', href: '/hackathons/leaderboard', icon: TrendingUp },
      ],
    },
    {
      name: 'Community',
      icon: Users,
      section: 'community',
      items: [
        { name: 'Q&A Hub', href: '/qna', icon: MessageSquare },
        { name: 'Dev Portal', href: '/dev', icon: Code },
        { name: 'Study Notebooks', href: '/notebooks', icon: BookMarked },
      ],
    },
    {
      name: 'Certificates',
      href: '/certificates',
      icon: Award,
    },
    {
      name: 'Settings',
      href: '/student/profile',
      icon: Settings,
    },
  ]

  const corporateNavigation: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Post Job',
      href: '/jobs/create',
      icon: Briefcase,
    },
    {
      name: 'Host Hackathon',
      href: '/hackathons/create',
      icon: Trophy,
    },
    {
      name: 'Candidates',
      href: '/candidates',
      icon: Users,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: TrendingUp,
    },
  ]

  const navigation = user?.role === 'corporate' ? corporateNavigation : studentNavigation
  const userTotalPoints = user?.totalPoints ?? 0
  const userLevel = user?.level ?? 0
  const userStreak = user?.currentStreak ?? 0

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-border lg:bg-background lg:pt-16 shadow-card">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navigation.map((item) => (
            <div key={item.name}>
              {'items' in item ? (
                // Section with sub-items
                <>
                  <button
                    onClick={() => toggleSection(item.section)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-foreground/70 rounded-xl hover:bg-muted/60 hover:text-foreground transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4.5 h-4.5" />
                      {item.name}
                    </div>
                    {expandedSections.includes(item.section) ? (
                      <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </button>
                  
                  {expandedSections.includes(item.section) && (
                    <div className="ml-3 mt-0.5 space-y-0.5 pb-1">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200',
                                pathname === subItem.href
                                  ? 'bg-accent text-primary font-semibold'
                                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                            )}
                          >
                            <SubIcon className="w-4 h-4 shrink-0" />
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                // Single item
                <Link
                  href={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                    pathname === item.href
                      ? 'bg-accent text-primary font-semibold shadow-sm'
                      : 'text-foreground/70 hover:bg-muted/60 hover:text-foreground'
                  )}
                >
                  <item.icon className="w-4.5 h-4.5 shrink-0" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Stats in Sidebar */}
        {user && (
          <div className="p-4 border-t border-border">
            <div className="p-3 rounded-xl bg-muted/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Streak</span>
                <span className="font-bold text-foreground flex items-center gap-1">
                  🔥 {userStreak} days
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground font-medium">Total XP</span>
                <span className="font-bold text-primary">{userTotalPoints.toLocaleString()}</span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700"
                  style={{ width: `${Math.min((userTotalPoints % 1000) / 10, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {1000 - (userTotalPoints % 1000)} XP to Level {userLevel + 1}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
