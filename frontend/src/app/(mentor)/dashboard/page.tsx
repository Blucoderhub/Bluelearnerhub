'use client'

import React from 'react'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    CheckSquare,
    TrendingUp,
    Clock,
    Star,
    ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MentorDashboard() {
    return (
        <div className="space-y-10">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Welcome back, <span className="text-foreground/70">Elite Mentor</span></h1>
                    <p className="text-muted-foreground mt-1 font-medium">Your teaching impact is increasing. Keep up the great work!</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-card/50 border-border text-foreground/80 hover:bg-secondary rounded-xl px-6 font-bold">
                        Edit Profile
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-white font-black rounded-xl px-6 shadow-lg shadow-primary/15">
                        View Public Page
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Active Students', value: '12', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                    { label: 'Avg. Rating', value: '4.95', icon: Star, color: 'text-foreground/70', bg: 'bg-primary/70/10' },
                    { label: 'Hours Taught', value: '156h', icon: Clock, color: 'text-foreground/70', bg: 'bg-primary/70/10' },
                    { label: 'Earnings', value: '$2,450', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
                ].map((stat) => (
                    <Card key={stat.label} className="bg-slate-900/40 border-border rounded-3xl overflow-hidden group">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className={stat.bg + " p-3 rounded-2xl group-hover:scale-110 transition-transform"}>
                                    <stat.icon className={"w-5 h-5 " + stat.color} />
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-black text-foreground/70 uppercase tracking-widest bg-primary/70/10 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3" />
                                    12%
                                </div>
                            </div>
                            <div className="mt-6">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-slate-900/40 border-border rounded-[2rem]">
                    <CardHeader className="p-8 border-b border-border">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-white">Recent Student Submissions</CardTitle>
                            <Button variant="ghost" className="text-foreground/70 hover:text-foreground/60 font-bold text-xs uppercase">View All</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-8 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-foreground/70">JD</div>
                                    <div>
                                        <h4 className="font-bold text-white">System Design Exercise #12</h4>
                                        <p className="text-xs text-muted-foreground mt-1">Submitted by <span className="text-foreground/80 font-bold text-[11px]">John Doe</span> • 2 hours ago</p>
                                    </div>
                                </div>
                                <Button className="bg-secondary hover:bg-primary hover:text-white text-foreground/80 font-bold rounded-xl h-10 px-6 transition-all">
                                    Grade
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Upcoming Sessions */}
                <Card className="bg-slate-900/40 border-border rounded-[2rem]">
                    <CardHeader className="p-8 border-b border-border">
                        <CardTitle className="text-xl font-bold text-white">Upcoming Sessions</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="relative pl-6 border-l-2 border-border">
                                <div className="absolute top-0 left-[-5px] w-2 h-2 rounded-full bg-primary" />
                                <p className="text-[10px] font-black text-foreground/70 uppercase tracking-widest">Tomorrow, 10:00 AM</p>
                                <h4 className="font-bold text-white text-sm mt-1">1-on-1 Mentorship Session</h4>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="h-5 w-5 rounded-full bg-secondary text-[10px] flex items-center justify-center font-bold text-foreground/80">AS</div>
                                    <span className="text-xs text-muted-foreground">Alice Smith</span>
                                </div>
                                <Button className="w-full mt-4 bg-primary/10 hover:bg-primary text-foreground/70 hover:text-white border border-border font-bold rounded-xl h-9 text-xs transition-all">
                                    Join Zoom
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full border-border text-muted-foreground font-bold py-6 rounded-2xl">
                            Manage Calendar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
