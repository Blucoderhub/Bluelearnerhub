'use client';

import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    GraduationCap,
    BarChart3,
    PieChart,
    Settings,
    ArrowUpRight,
    ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const stats = [
    { title: 'Total Enrollment', value: '4,820', icon: GraduationCap, color: 'text-orange-400' },
    { title: 'Faculty Members', value: '156', icon: Users, color: 'text-blue-400' },
    { title: 'Average CGPA', value: '3.4', icon: BarChart3, color: 'text-emerald-400' },
    { title: 'Placement Rate', value: '88%', icon: PieChart, color: 'text-purple-400' },
];

export default function InstitutionDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                        Institution <span className="text-orange-400">Headquarters</span>
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Global overview of academic performance, faculty activity, and institutional growth.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Institution Settings
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                        <PieChart className="w-4 h-4 mr-2" />
                        Generate Annual Report
                    </Button>
                </div>
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
                        <Card className="bg-slate-900/40 border-slate-800 border-b-2 border-b-transparent hover:border-b-orange-500 transition-all group">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.title}</CardTitle>
                                <stat.icon className={`w-4 h-4 ${stat.color} group-hover:rotate-12 transition-transform`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-white">{stat.value}</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analytics Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Domain Growth Analytics</CardTitle>
                                <CardDescription>Enrollment and performance trends across different domains.</CardDescription>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] flex items-center justify-center text-slate-600 border border-slate-800/50 rounded-xl bg-slate-950/20 italic">
                                Growth visualization would render here
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-slate-900/40 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-base font-bold">Top Performing Faculty</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[1, 2, 3].map((f) => (
                                    <div key={f} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700" />
                                            <span className="text-sm font-medium">Faculty Member {f}</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400">9.2 Rating</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-base font-bold">Student Success Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[
                                    { domain: 'Engineering', rate: 94 },
                                    { domain: 'Management', rate: 89 }
                                ].map((d, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span>{d.domain}</span>
                                            <span className="text-orange-400 font-bold">{d.rate}%</span>
                                        </div>
                                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-orange-500" style={{ width: `${d.rate}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-slate-950/40 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">Governance & Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                <ShieldCheck className="w-4 h-4 text-orange-400 mt-1 shrink-0" />
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    All academic records for <span className="text-white font-medium">Winter 2026</span> are synchronized and secured.
                                </p>
                            </div>
                            <Button variant="outline" className="w-full text-xs border-slate-800 h-10 hover:bg-slate-800">
                                Audit Registry
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-t from-orange-900/20 to-slate-950/40 border-slate-800 overflow-hidden group">
                        <div className="p-6">
                            <Building2 className="w-10 h-10 text-orange-500/50 mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg font-black italic tracking-tight">INSTITUTIONAL AI</h4>
                            <p className="text-xs text-slate-400 mt-2 mb-4">
                                Leverage predictive analytics to forecast enrollment trends and student success bottlenecks.
                            </p>
                            <Button size="sm" className="w-full bg-slate-100 hover:bg-white text-black text-[10px] font-black tracking-widest h-10">
                                LAUNCH ANALYTICS ENGINE
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
