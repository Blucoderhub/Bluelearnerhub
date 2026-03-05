'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BarChart3,
    Users,
    Settings,
    Search,
    Bell,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { institutionNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function InstitutionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const iconMap: Record<string, any> = {
        dashboard: LayoutDashboard,
        'bar-chart': BarChart3,
        users: Users,
        settings: Settings,
    }

    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:sticky top-0 h-screen w-72 flex-col border-r border-slate-800/60 bg-[#020617] z-50 transition-transform duration-300",
                mobileOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 md:flex hidden md:flex"
            )}>
                <div className="flex h-20 items-center justify-between border-b border-slate-800/60 px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-sm font-black tracking-tight text-white uppercase">
                            Institution <span className="text-orange-400">HQ</span>
                        </h2>
                    </div>
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-8 px-4 space-y-10">
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Command Center</p>
                        {institutionNav.map((item) => {
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
                                            ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent'
                                    )}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <Icon className={cn(
                                            "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                            isActive ? "text-orange-400" : "text-slate-500 group-hover:text-orange-400"
                                        )} />
                                        <span>{item.title}</span>
                                    </div>
                                    {isActive && (
                                        <ChevronRight className="w-3 h-3 text-orange-400 animate-pulse" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="px-4">
                        <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Accreditation Status</h4>
                            <p className="text-[10px] text-slate-500 font-medium mt-2">All departments compliant</p>
                            <Link href="/analytics" className="inline-block text-[10px] font-bold text-orange-400 mt-4 hover:underline">
                                View Report →
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800/60 bg-slate-950/20">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border border-slate-800">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-orange-500/20 text-orange-400 font-bold">IN</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">Institution Admin</p>
                            <p className="text-[10px] text-slate-500 truncate">Academic Governance</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-400">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/20 via-[#020617] to-[#020617]">
                <header className="h-16 md:h-20 border-b border-slate-800/40 flex items-center justify-between px-4 md:px-8 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Search className="w-4 h-4 text-slate-500 hover:text-orange-400 transition-colors cursor-pointer" />
                        <div className="hidden md:block h-4 w-[1px] bg-slate-800" />
                        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">All Systems Operational</span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative cursor-pointer group">
                            <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 border-2 border-[#020617] rounded-full" />
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full relative">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
