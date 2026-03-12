'use client'

import React, { useState } from 'react'
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
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { adminNav } from '@/config/nav'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    const iconMap: Record<string, any> = {
        dashboard: LayoutDashboard,
        edit: FileText,
        activity: Activity,
        'file-text': Database,
        users: Users,
        settings: Settings,
    };

    return (
        <div className="flex min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-mono text-sm uppercase tracking-tighter">
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside className={cn(
                "fixed md:sticky top-0 h-screen w-72 flex-col border-r border-[#1e293b] bg-[#020617] z-50 transition-transform duration-300",
                mobileOpen ? "translate-x-0 flex" : "-translate-x-full md:translate-x-0 md:flex hidden md:flex"
            )}>
                <div className="flex h-20 items-center justify-between border-b border-[#1e293b] px-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-xs font-black italic tracking-tighter text-white uppercase">
                            ROOT_ADMIN <span className="text-red-600 ai-glow">BHL_v4</span>
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
                    {/* System Control Navigation */}
                    <div className="space-y-2">
                        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">System Access Vectors</p>
                        {adminNav.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = iconMap[item.icon as string] || Terminal

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'group flex items-center gap-3.5 rounded-lg px-4 py-3 transition-all duration-300 relative',
                                        isActive
                                            ? 'bg-red-600/10 text-red-500 border border-red-600/20'
                                            : 'text-slate-500 hover:bg-slate-900 hover:text-white border border-transparent'
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-red-500" : "text-slate-600 group-hover:text-red-500"
                                    )} />
                                    <span className="font-bold">{item.title}</span>
                                    {isActive && (
                                        <span className="absolute right-0 w-1 h-4 bg-red-600 rounded-l-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>

                    {/* Infrastructure Health */}
                    <div className="px-4 space-y-4">
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Server className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[9px] font-black text-slate-400">Mainframe_Core</span>
                                </div>
                                <span className="text-[9px] font-black text-amber-500">99.9%</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1">
                                <div className="bg-amber-500 h-1 rounded-full w-[99%]" />
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-900">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Code className="w-3.5 h-3.5 text-purple-500" />
                                    <span className="text-[9px] font-black text-slate-400">API_Throughput</span>
                                </div>
                                <span className="text-[9px] font-black text-red-500">Peak_Load</span>
                            </div>
                            <div className="w-full bg-slate-900 rounded-full h-1">
                                <div className="bg-red-500 h-1 rounded-full w-[85%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Credentials Footer */}
                <div className="p-6 border-t border-[#1e293b] bg-slate-950/40">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded bg-red-600/10 flex items-center justify-center border border-red-600/30">
                            <Lock className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black italic text-white truncate uppercase tracking-tight">Superuser_01</p>
                            <p className="text-[9px] text-red-600 font-bold uppercase truncate animate-pulse">Access_Tier_Elite</p>
                        </div>
                        <Link href="/" className="h-8 w-8 flex items-center justify-center text-slate-600 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Command Center View */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                {/* Superior Barra */}
                <header className="h-16 md:h-20 border-b border-[#1e293b] flex items-center justify-between px-4 md:px-8 bg-[#020617]/50 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            className="md:hidden text-slate-400 hover:text-white"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">Security_Key:</span>
                            <span className="text-[10px] font-black text-red-500 font-mono tracking-widest px-3 py-1 bg-red-600/5 rounded border border-red-600/20">XYZ_772_BHL</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Gateway_01</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]" />
                                <span className="text-[9px] font-black text-slate-500 uppercase">Gateway_02</span>
                            </div>
                        </div>
                        <div className="relative group cursor-pointer">
                            <Bell className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 border-2 border-[#020617] rounded-full animate-pulse" />
                        </div>
                    </div>
                </header>

                <main className="p-4 md:p-8 lg:p-12 max-w-[1700px] mx-auto w-full relative">
                    {/* Subtle Cyber Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b1a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b1a_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
