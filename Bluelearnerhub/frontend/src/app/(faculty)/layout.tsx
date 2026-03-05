'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { facultyNav } from '@/config/nav'
import { cn } from '@/lib/utils'

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="flex min-h-screen bg-[#020617] text-white overflow-hidden">
            <aside className="hidden md:flex w-72 flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 h-screen z-40">
                <div className="flex h-16 items-center border-b border-slate-800 px-8">
                    <h2 className="text-xl font-bold tracking-tight text-emerald-400">Faculty Portal</h2>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    <div className="space-y-1.5">
                        <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Academic Center</p>
                        {facultyNav.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] font-semibold transition-all duration-300 relative',
                                        isActive
                                            ? 'bg-emerald-500/10 text-emerald-400'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    )}
                                >
                                    {isActive && (
                                        <span className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <main className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
