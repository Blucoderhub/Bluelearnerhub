'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
  Database,
  Lock,
  LogOut,
  Bell,
  Search,
  Terminal,
  Server,
  Code,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const iconMap: Record<string, any> = {
    dashboard: LayoutDashboard,
    edit: FileText,
    activity: Activity,
    'file-text': Database,
    users: Users,
    settings: Settings,
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
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border/40 bg-muted">
              <Shield className="h-5 w-5 text-foreground" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-tight text-foreground">
              Admin <span className="opacity-70">Console</span>
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
              System Access
            </p>
            {adminNav.map((item) => {
              const isActive = pathname === item.href
              const Icon = iconMap[item.icon as string] || Terminal

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex items-center gap-3.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 transition-colors',
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>

          <div className="space-y-4 px-4">
            <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-foreground/70" />
                  <span className="text-[10px] font-bold text-muted-foreground">Main Server</span>
                </div>
                <span className="text-[10px] font-bold text-foreground">99.9%</span>
              </div>
              <div className="h-1 w-full rounded-full bg-border/40">
                <div className="h-1 w-[99%] rounded-full bg-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Admin Credentials Footer */}
        <div className="border-t border-border/40 bg-muted/10 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border/40 bg-muted">
              <Lock className="h-5 w-5 text-foreground/70" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">Administrator</p>
              <p className="truncate text-[10px] text-muted-foreground">Superuser Access</p>
            </div>
            <Link
              href="/"
              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/40 bg-background px-4 md:h-20 md:px-8">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className="text-muted-foreground hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                Access Level:
              </span>
              <span className="rounded border border-border/40 bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                Root
              </span>
            </div>
          </div>
        </header>

        <main className="relative mx-auto w-full max-w-[1700px] p-4 md:p-8 lg:p-12">
          <div className="relative z-10 text-foreground">{children}</div>
        </main>
      </div>
    </div>
  )
}
