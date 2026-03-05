'use client'

import React from 'react'
import DomainTools from '@/components/tools/DomainTools'
import {
    Puzzle,
    Settings2,
    Sparkles
} from 'lucide-react'

export default function ToolsPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase">
                        <Settings2 className="w-4 h-4" />
                        Engineering Utilities
                    </div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Domain-Specific Tools
                        <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-primary rounded-md border border-primary/20">
                            Pro Suite
                        </span>
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        Essential tools for modern engineers. From signal processing to data formatting.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10 text-primary">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold">New Tools Added Weekly</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <DomainTools />
            </div>
        </div>
    )
}
