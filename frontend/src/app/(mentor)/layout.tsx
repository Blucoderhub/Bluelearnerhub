'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mentorNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function FacultyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const iconMap: Record<string, any> = {
    dashboard: LayoutDashboard,
    book: BookOpen,
    users: Users,
    'file-text': FileText,
  }

  return (
    <div className="flex min-h-screen overflow-hidden bg-background font-sans text-foreground">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 z-50 h-screen w-72 flex-col border-r border-border/40 bg-background transition-transform duration-300 md:sticky',
          mobileOpen
            ? 'flex translate-x-0'
            : 'hidden -translate-x-full md:flex md:flex md:translate-x-0'
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-border/40 px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-muted">
              <GraduationCap className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-tight text-foreground">
              Mentor <span className="opacity-70">Portal</span>
            </h2>
          </div>
          <button
            className="text-muted-foreground hover:text-white md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-10 overflow-y-auto px-4 py-8">
          <div className="space-y-2">
            <p className="mb-6 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Mentoring Center
            </p>
            {mentorNav.map((item) => {
              const isActive = pathname === item.href
              const Icon = iconMap[item.icon as string] || LayoutDashboard

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{item.title}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 text-foreground" />}
                </Link>
              )
            })}
          </div>

          <div className="px-4">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-muted/50 p-5">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                Pending Reviews
              </h4>
              <p className="mt-2 text-[10px] font-medium text-muted-foreground">
                5 assignments awaiting grading
              </p>
              <Link
                href="/assignments"
                className="mt-4 inline-block text-[10px] font-bold text-foreground hover:underline"
              >
                Review Now →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-border/40">
              <AvatarImage src="" />
              <AvatarFallback className="bg-muted font-bold text-foreground">FC</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">Elite Mentor</p>
              <p className="truncate text-[10px] text-muted-foreground">Department Head</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-4">
            <button
              className="text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Search className="h-4 w-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
            <div className="hidden h-4 w-[1px] bg-border/40 md:block" />
            <span className="hidden items-center rounded-sm border border-border/40 bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground md:inline-flex">
              Academic Session Active
            </span>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1600px] p-4 md:p-8 lg:p-12">
          <div className="relative z-10 text-foreground">{children}</div>
        </main>
      </div>
    </div>
  )
}
