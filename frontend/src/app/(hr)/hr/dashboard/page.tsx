'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Search,
    TrendingUp,
    Calendar,
    Plus,
    ChevronRight,
    Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const stats = [
    { title: 'Total Candidates', value: '1,248', icon: Users, color: 'text-cyan-400' },
    { title: 'New Applications', value: '84', icon: Calendar, color: 'text-purple-400' },
    { title: 'Interviews Today', value: '12', icon: Search, color: 'text-blue-400' },
    { title: 'Placement Rate', value: '92%', icon: TrendingUp, color: 'text-emerald-400' },
];

export default function HRDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        HR <span className="text-cyan-400">Command Center</span>
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Monitor recruitment pipelines and discover top engineering & management talent.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] transform transition-transform hover:scale-105 active:scale-95">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className="bg-slate-900/40 border-slate-800 hover:border-cyan-500/30 transition-all group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                                <stat.icon className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1">
                                    <span className="text-emerald-400 text-xs font-medium">+14% </span>
                                    from last month
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/40 border-slate-800 overflow-hidden">
                        <CardHeader className="border-b border-slate-800/50 bg-slate-950/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Talent Search</CardTitle>
                                    <CardDescription>Find candidates based on skills, domain, and performance.</CardDescription>
                                </div>
                                <Search className="w-5 h-5 text-slate-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    placeholder="Search by name, skill (e.g., React, Finance), or role..."
                                    className="pl-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-600 focus:ring-cyan-500/50"
                                />
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((candidate) => (
                                    <div key={candidate} className="flex items-center justify-between p-4 rounded-xl bg-slate-950/30 border border-slate-800/50 hover:border-cyan-500/20 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-slate-700">
                                                C
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">Top Candidate {candidate}</h4>
                                                <p className="text-xs text-slate-400">Full-Stack Engineer • Level 8</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:block text-right">
                                                <div className="text-xs font-bold text-cyan-400">92% Match</div>
                                                <div className="text-[10px] text-slate-500">Active 2h ago</div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="link" className="w-full mt-4 text-cyan-400 hover:text-cyan-300">
                                View All Candidates
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <Card className="bg-slate-950/40 border-slate-800 border-t-2 border-t-cyan-500">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">Upcoming Interviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[1, 2].map((interview) => (
                                <div key={interview} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Today, 2:00 PM</span>
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    </div>
                                    <p className="text-sm font-bold">Project Manager Interview</p>
                                    <p className="text-xs text-slate-500 mt-1">Candidate: Shankar R.</p>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full text-xs border-slate-800 hover:bg-slate-800">
                                Full Schedule
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-cyan-900/20 to-slate-950/40 border-slate-800 relative overflow-hidden group">
                        <div className="relative z-10 p-6">
                            <h4 className="text-lg font-black text-white italic">AI TALENT ANALYTICS</h4>
                            <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                                Unlock deep insights into candidate performance across hackathons and projects.
                            </p>
                            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs px-6 py-4 h-auto font-black italic tracking-tighter shadow-lg shadow-cyan-900/50">
                                RUN FULL REPORT
                            </Button>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
