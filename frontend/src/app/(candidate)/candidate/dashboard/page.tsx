'use client';

import { motion } from 'framer-motion';
import {
    Briefcase,
    Video,
    FileText,
    CheckCircle2,
    Clock,
    TrendingUp,
    Star,
    ChevronRight,
    Upload,
    Eye,
    Calendar,
    MapPin,
    Building2,
    Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const stats = [
    { title: 'Active Applications', value: '8', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10', change: '+3 this week' },
    { title: 'Upcoming Interviews', value: '3', icon: Video, color: 'text-purple-400', bg: 'bg-purple-500/10', change: 'Next: Tomorrow' },
    { title: 'Profile Completion', value: '95%', icon: CheckCircle2, color: 'text-foreground/70', bg: 'bg-primary/10', change: 'Almost done' },
    { title: 'Profile Views', value: '142', icon: Eye, color: 'text-foreground/70', bg: 'bg-primary/10', change: '+28% this month' },
];

const applications = [
    { company: 'TechCorp Global', role: 'Senior Frontend Engineer', status: 'Interview', date: '2 days ago', location: 'Remote' },
    { company: 'InnovateLabs', role: 'Full Stack Developer', status: 'Applied', date: '5 days ago', location: 'San Francisco' },
    { company: 'QuantumAI', role: 'ML Engineer', status: 'Shortlisted', date: '1 week ago', location: 'Bangalore' },
];

const interviews = [
    { company: 'TechCorp Global', role: 'Senior Frontend Engineer', time: 'Tomorrow, 2:00 PM', type: 'Technical Round' },
    { company: 'DataStream Inc.', role: 'Software Architect', time: 'Dec 15, 10:00 AM', type: 'HR Round' },
];

export default function CandidateDashboardPage() {
    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Candidate <span className="text-blue-400">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground max-w-xl">
                        Track your applications, prepare for interviews, and manage your professional profile.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-border bg-card/50 hover:bg-secondary text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Update Resume
                    </Button>
                    <Button className="bg-primary hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Browse Jobs
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className="bg-slate-900/40 border-border hover:border-blue-500/30 transition-all group">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-medium">{stat.change}</span>
                                </div>
                                <p className="text-2xl font-black text-white">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/40 border-border overflow-hidden">
                        <CardHeader className="border-b border-slate-800/50 bg-background/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Recent Applications</CardTitle>
                                    <CardDescription>Track the status of your job applications</CardDescription>
                                </div>
                                <Briefcase className="w-5 h-5 text-muted-foreground" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-800/50">
                                {applications.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between p-5 hover:bg-card/30 transition-all cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-blue-400 font-bold border border-border">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{app.role}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs text-muted-foreground">{app.company}</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {app.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden md:block text-right">
                                                <Badge className={`text-[10px] font-bold border-none ${
                                                    app.status === 'Interview' ? 'bg-purple-500/10 text-purple-400' :
                                                    app.status === 'Shortlisted' ? 'bg-primary/10 text-foreground/70' :
                                                    'bg-blue-500/10 text-blue-400'
                                                }`}>
                                                    {app.status}
                                                </Badge>
                                                <div className="text-[10px] text-muted-foreground mt-1">{app.date}</div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-slate-800/50">
                                <Button variant="link" className="w-full text-blue-400 hover:text-blue-300 text-sm">
                                    View All Applications
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900/40 border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Star className="w-4 h-4 text-foreground/70" />
                                    Skills Snapshot
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { skill: 'React / Next.js', level: 92 },
                                    { skill: 'System Design', level: 78 },
                                    { skill: 'TypeScript', level: 88 },
                                ].map((s) => (
                                    <div key={s.skill} className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-foreground/80">{s.skill}</span>
                                            <span className="text-blue-400 font-bold">{s.level}%</span>
                                        </div>
                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${s.level}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-border">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-foreground/70" />
                                    Activity Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { label: 'Applications sent', value: '24', period: 'this month' },
                                    { label: 'Interviews completed', value: '6', period: 'this month' },
                                    { label: 'Offers received', value: '2', period: 'total' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">{item.label}</span>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-white">{item.value}</span>
                                            <span className="text-[10px] text-muted-foreground ml-2">{item.period}</span>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="bg-background/40 border-border border-t-2 border-t-purple-500">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                Upcoming Interviews
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {interviews.map((interview, i) => (
                                <div key={i} className="p-4 rounded-xl bg-card/50 border border-border space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{interview.time}</span>
                                        <div className="w-2 h-2 rounded-full bg-primary/70 animate-pulse" />
                                    </div>
                                    <p className="text-sm font-bold text-white">{interview.role}</p>
                                    <p className="text-xs text-muted-foreground">{interview.company}</p>
                                    <Badge className="bg-secondary text-foreground/80 text-[10px] border-none">{interview.type}</Badge>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full text-xs border-border hover:bg-secondary">
                                View Full Schedule
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-900/20 to-background/40 border-border relative overflow-hidden group">
                        <div className="relative z-10 p-6">
                            <Zap className="w-8 h-8 text-primary/80/50 mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg font-black text-white">AI Interview Prep</h4>
                            <p className="text-xs text-muted-foreground mt-2 mb-4 leading-relaxed">
                                Practice with AI-powered mock interviews tailored to your upcoming sessions.
                            </p>
                            <Button size="sm" className="bg-primary hover:bg-blue-500 text-white text-xs px-6 py-4 h-auto font-bold shadow-lg shadow-blue-900/50">
                                Start Practice
                            </Button>
                        </div>
                        <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    </Card>
                </div>
            </div>
        </div>
    );
}
