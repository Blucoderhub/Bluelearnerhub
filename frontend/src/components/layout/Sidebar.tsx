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
  GraduationCap
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
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Academy',
      href: '/mentors',
      icon: GraduationCap,
    },
    {
      name: 'Learn',
      icon: BookOpen,
      section: 'learn',
      items: [
        { name: 'Tutorials', href: '/learn', icon: BookOpen },
        { name: 'References', href: '/references', icon: FileText },
        { name: 'My Progress', href: '/learn/progress', icon: TrendingUp },
      ],
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: Award,
    },
    {
      name: 'Practice',
      icon: Code,
      section: 'practice',
      items: [
        { name: 'Problems', href: '/practice', icon: Code },
        { name: 'Daily Quest', href: '/quests', icon: Zap },
        { name: 'Assessments', href: '/practice/assessments', icon: FileText },
      ],
    },
    {
      name: 'Hackathons',
      icon: Trophy,
      section: 'hackathons',
      items: [
        { name: 'Browse', href: '/hackathons', icon: Trophy },
        { name: 'My Hackathons', href: '/hackathons/mine', icon: Calendar },
        { name: 'Leaderboard', href: '/hackathons/leaderboard', icon: TrendingUp },
      ],
    },
    {
      name: 'Community',
      icon: Users,
      section: 'community',
      items: [
        { name: 'Q&A', href: '/community', icon: MessageSquare },
        { name: 'Discussions', href: '/community/discussions', icon: Users },
        { name: 'Spaces', href: '/community/spaces', icon: Users },
      ],
    },
    {
      name: 'Industry Connect',
      icon: Briefcase,
      section: 'industry',
      items: [
        { name: 'Opportunities', href: '/careers/jobs', icon: Briefcase },
        { name: 'My Submissions', href: '/careers/applications', icon: FileText },
        { name: 'Interview Invites', href: '/careers/interviews', icon: Calendar },
      ],
    },
    {
      name: 'Certificates',
      href: '/certificates',
      icon: Award,
    },
    {
      name: 'Settings',
      href: '/profile/settings',
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-neutral-800 lg:bg-neutral-950 lg:pt-16">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {'items' in item ? (
                // Section with sub-items
                <>
                  <button
                    onClick={() => toggleSection(item.section)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    {expandedSections.includes(item.section) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedSections.includes(item.section) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors',
                                pathname === subItem.href
                                  ? 'bg-green-600 text-white'
                                  : 'text-gray-400 hover:bg-neutral-800 hover:text-white'
                            )}
                          >
                            <SubIcon className="w-4 h-4" />
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
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    pathname === item.href
                      ? 'bg-green-600 text-white'
                      : 'text-gray-300 hover:bg-neutral-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* User Stats in Sidebar */}
        {user && (
          <div className="p-4 border-t border-gray-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Current Streak</span>
                <span className="font-bold text-orange-400 flex items-center gap-1">
                  🔥 {userStreak} days
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Total XP</span>
                <span className="font-bold text-green-400">{userTotalPoints}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full"
                  style={{ width: `${(userTotalPoints % 1000) / 10}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 text-center">
                {1000 - (userTotalPoints % 1000)} XP to Level {userLevel + 1}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
