'use client';

import { motion } from 'framer-motion';
import {
    BookOpen,
    Users,
    FileText,
    TrendingUp,
    Plus,
    Clock,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const stats = [
    { title: 'Active Courses', value: '4', icon: BookOpen, color: 'text-emerald-400' },
    { title: 'Total Students', value: '452', icon: Users, color: 'text-blue-400' },
    { title: 'Pending Grades', value: '28', icon: FileText, color: 'text-orange-400' },
    { title: 'Average Progress', value: '78%', icon: TrendingUp, color: 'text-purple-400' },
];

export default function FacultyDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Faculty <span className="text-emerald-400">Academic Hub</span>
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Manage your curriculum, monitor student performance, and evaluate progress.
                    </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] transform transition-transform hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Module
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                        <Card className="bg-slate-900/40 border-slate-800 hover:border-emerald-500/30 transition-all">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Course Management Section */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-emerald-400 px-1">Active Specializations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Computer Science & AI', 'Mechanical Simulation'].map((course, i) => (
                            <Card key={i} className="bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-all cursor-pointer group">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">{course}</CardTitle>
                                    <CardDescription>Advanced Engineering Track • Semester 4</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs text-slate-400">
                                            <span>Curriculum Completion</span>
                                            <span>85%</span>
                                        </div>
                                        <Progress value={85} className="h-1.5 bg-slate-800" />
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 128 Students</span>
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> 12 Modules</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800/50">
                            <CardTitle className="text-lg">Student Performance Alerts</CardTitle>
                            <Button variant="ghost" className="text-xs text-emerald-400 hover:bg-emerald-400/10">View Analysis</Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-800">
                                {[1, 2, 3].map((alert) => (
                                    <div key={alert} className="flex items-center justify-between p-4 hover:bg-slate-800/20 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                                            <div>
                                                <p className="text-sm font-medium text-white">Critical Drop in Quiz Scores</p>
                                                <p className="text-xs text-slate-500">Thermodynamics Module • 12 students affected</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="text-[10px] h-7 border-slate-700">Address Issues</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-slate-950/40 border-slate-800 relative overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-400" /> Upcoming Tasks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { title: 'Review Mech Lab Submissions', time: 'Today, 5:00 PM', urgency: 'high' },
                                { title: 'Finalize Mid-term Quiz', time: 'Tomorrow', urgency: 'medium' }
                            ].map((task, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`w-1 h-10 rounded-full ${task.urgency === 'high' ? 'bg-red-500' : 'bg-orange-500'}`} />
                                    <div>
                                        <h5 className="text-sm font-bold">{task.title}</h5>
                                        <p className="text-[10px] text-slate-500 mt-1 uppercase leading-none">{task.time}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-emerald-950/20 border-emerald-500/20">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-emerald-400">Gemini Faculty AI</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-400 mb-4">
                                Use AI to generate lesson plans, grade assignments, and identify learning gaps automatically.
                            </p>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-5 h-auto font-black italic">
                                OPEN AI ASSISTANT
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Academic Excellence</h5>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-white uppercase font-black italic">Accreditation Ready</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
