'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Trophy,
    BarChart3,
    Search,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hrNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function HRLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const iconMap: Record<string, any> = {
        dashboard: LayoutDashboard,
        users: Users,
        flag: Trophy,
        trophy: BarChart3,
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground overflow-hidden font-sans">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:sticky top-0 h-screen w-72 flex-col border-r border-border bg-background z-50 transition-transform duration-300",
                mobileOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 md:flex hidden md:flex"
            )}>
                <div className="flex h-20 items-center justify-between border-b border-border px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-sm font-black tracking-tight text-white uppercase">
                            HR <span className="text-cyan-400">Portal</span>
                        </h2>
                    </div>
                    <button
                        className="md:hidden text-muted-foreground hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10">
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">Recruitment Hub</p>
                        {hrNav.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = iconMap[item.icon as string] || LayoutDashboard

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 relative',
                                        isActive
                                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                                            : 'text-muted-foreground hover:bg-card hover:text-white border border-transparent'
                                    )}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <Icon className={cn(
                                            "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                            isActive ? "text-cyan-400" : "text-muted-foreground group-hover:text-cyan-400"
                                        )} />
                                        <span>{item.title}</span>
                                    </div>
                                    {isActive && (
                                        <ChevronRight className="w-3 h-3 text-cyan-400 animate-pulse" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="px-4">
                        <div className="p-5 rounded-2xl bg-card/50 border border-border relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Pipeline Active</h4>
                            <p className="text-[10px] text-muted-foreground font-medium mt-2">12 candidates in final stage</p>
                            <Link href="/candidates" className="inline-block text-[10px] font-bold text-cyan-400 mt-4 hover:underline">
                                View Pipeline →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-background/20">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-cyan-500/20 text-cyan-400 font-bold">HR</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">HR Manager</p>
                            <p className="text-[10px] text-muted-foreground truncate">Recruitment Team</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background/20 via-background to-background">
                <header className="h-16 md:h-20 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-muted-foreground hover:text-white"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Search className="w-4 h-4 text-muted-foreground hover:text-cyan-400 transition-colors cursor-pointer" />
                        <div className="hidden md:block h-4 w-[1px] bg-secondary" />
                        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/10 text-foreground/70 text-[10px] font-bold">System Online</span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative cursor-pointer group">
                            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-500 border-2 border-background rounded-full" />
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
