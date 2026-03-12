'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Building2,
    Trophy,
    Briefcase,
    Video,
    Search,
    TrendingUp,
    Settings,
    ChevronRight,
    LogOut,
    Bell,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { corporateNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function CorporateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const iconMap: Record<string, any> = {
        dashboard: LayoutDashboard,
        building: Building2,
        flag: Trophy,
        briefcase: Briefcase,
        video: Video,
        search: Search,
        analytics: TrendingUp,
    };

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
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h2 className="text-sm font-black italic tracking-tighter text-white uppercase">
                            BLUE_CORP <span className="text-primary ai-glow">OS</span>
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
                    {/* Main Navigation */}
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Operations Center</p>
                        {corporateNav.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = iconMap[item.icon as string] || LayoutDashboard

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'group flex items-center justify-between rounded-xl px-4 py-3.5 text-[12px] font-black uppercase italic tracking-widest transition-all duration-300 relative',
                                        isActive
                                            ? 'bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.05)] border border-primary/20'
                                            : 'text-muted-foreground hover:bg-card hover:text-white border border-transparent'
                                    )}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <Icon className={cn(
                                            "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                            isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                                        )} />
                                        <span>{item.title}</span>
                                    </div>
                                    {isActive && (
                                        <ChevronRight className="w-3 h-3 text-primary animate-pulse" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* HR Segment Placeholder */}
                    <div className="px-4">
                        <div className="p-5 rounded-2xl bg-card/50 border border-border relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                            <h4 className="text-[10px] font-black italic text-white uppercase tracking-widest">Active Recruiting</h4>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase mt-2">3 New Matches Found</p>
                            <Link href="/candidates" className="inline-block text-[9px] font-black uppercase tracking-widest text-primary mt-4 hover:underline">
                                Launch Talent Search →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* User Account / Organization Footer */}
                <div className="p-6 border-t border-border bg-background/20">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/20 text-primary font-black italic">BC</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black italic text-white truncate uppercase tracking-tight">Bluecoderhub</p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase truncate">Level 5 Enterprise</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-background/20 via-background to-background">
                {/* Top Header Barra */}
                <header className="h-16 md:h-20 border-b border-border flex items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-muted-foreground hover:text-white"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Search className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                        <div className="h-4 w-[1px] bg-secondary" />
                        <Badge variant="outline" className="bg-primary/10 text-foreground/70 border-none text-[8px] font-black uppercase italic">Network Status: Stable</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative cursor-pointer group">
                            <Bell className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-background rounded-full animate-bounce" />
                        </div>
                        <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-xl border border-border">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Org_Credit:</span>
                            <span className="text-xs font-black text-white">$12,450.00</span>
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full relative">
                    {/* Subtle Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={cn("px-2 py-0.5 rounded-full", className)}>
            {children}
        </span>
    )
}
