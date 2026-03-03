'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { studentNav } from '@/config/nav'
import { cn } from '@/lib/utils'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Midnight Glass Design */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 h-screen z-40">
        <div className="flex h-16 items-center border-b border-border/50 px-8">
          <h2 className="text-xl font-bold font-heading tracking-tight text-primary">Student Portal</h2>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          {/* Main Navigation */}
          <div className="space-y-1.5">
            <p className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Command Center</p>
            {studentNav.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-300 relative',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                      : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                  <span className={cn(
                    "transition-transform duration-300 group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                  )}>
                    {/* Placeholder for icons - you might want to add them to studentNav config */}
                    {item.title}
                  </span>
                </Link>
              )
            })}
          </div>

          {/* Social/Community Placeholder */}
          <div className="px-4 py-4 rounded-2xl bg-primary/5 border border-primary/10">
            <h4 className="text-sm font-bold font-heading text-primary">Join the Community</h4>
            <p className="text-xs text-muted-foreground mt-1">Connect with 50k+ learners in our Discord.</p>
            <Button variant="link" className="p-0 h-auto text-xs mt-2 text-primary hover:text-primary/80">Connect Now →</Button>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-muted/20">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">Student Name</p>
              <p className="text-[11px] text-muted-foreground truncate">Level 5 Expert</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
