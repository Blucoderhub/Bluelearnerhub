'use client'

import React from 'react'
import { Users, Sparkles, MessageSquare, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-3xl space-y-8">
                <div className="relative inline-block">
                    <div className="absolute -inset-4 bg-primary/15 blur-3xl rounded-full" />
                    <div className="relative h-24 w-24 bg-card border border-border rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <Users className="h-12 w-12 text-foreground/70" />
                    </div>
                </div>

                <div className="space-y-4">
                    <Badge variant="outline" className="px-4 py-1 border-border text-foreground/70 bg-primary/5 font-bold uppercase tracking-[0.3em] text-[10px]">
                        Coming Soon
                    </Badge>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                        The Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-cyan-400">Ecosystem</span>
                    </h1>
                    <p className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
                        We're building a world-class space for developers to connect, share knowledge, and build the future together.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="p-6 rounded-2xl bg-card/50 border border-border space-y-3">
                        <MessageSquare className="h-6 w-6 text-foreground/70" />
                        <h3 className="font-bold text-white">Direct Access</h3>
                        <p className="text-sm text-muted-foreground">Chat with experts and peers in real-time across specialized channels.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/50 border border-border space-y-3">
                        <ShieldCheck className="h-6 w-6 text-cyan-400" />
                        <h3 className="font-bold text-white">Verified Roles</h3>
                        <p className="text-sm text-muted-foreground">Earn badges and reputation based on your contributions and skills.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/50 border border-border space-y-3">
                        <Zap className="h-6 w-6 text-purple-400" />
                        <h3 className="font-bold text-white">Live Events</h3>
                        <p className="text-sm text-muted-foreground">Weekly tech talks, workshops, and exclusive community hackathons.</p>
                    </div>
                </div>

                <div className="pt-8">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-14 rounded-2xl shadow-xl shadow-primary/15 active:scale-95 transition-all text-lg group">
                        Notify Me When Ready
                        <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
