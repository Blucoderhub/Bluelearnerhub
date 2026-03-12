'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    CheckCircle2,
    GraduationCap,
    Users,
    Building2,
    Rocket,
    BarChart3,
    ShieldCheck,
    Clock,
    Zap,
    ChevronRight,
    PlayCircle,
    Star,
    Award,
    TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

const ACADEMY_FEATURES = [
    {
        title: 'Admin Dashboard',
        description: 'Powerful control panel to manage students, groups, and assignments in one place.',
        icon: Users,
        color: 'text-foreground/70',
        bgColor: 'bg-primary/10'
    },
    {
        title: 'Custom Learning Paths',
        description: 'Tailor modules, quizzes, and exams to match your organization\'s specific needs.',
        icon: Rocket,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10'
    },
    {
        title: 'Real-Time Analytics',
        description: 'Measure performance and track progress with detailed reporting and data insights.',
        icon: BarChart3,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10'
    },
    {
        title: 'Certified Mastery',
        description: 'Official Bluelearner certificates and badges for every student who completes a path.',
        icon: Award,
        color: 'text-foreground/70',
        bgColor: 'bg-primary/10'
    }
]

const SECTORS = [
    {
        title: 'Schools & Universities',
        description: 'Supplement your curriculum with industry-standard labs and real-time tracking.',
        icon: GraduationCap,
        link: '#contact'
    },
    {
        title: 'Businesses & Teams',
        description: 'Upskill your workforce with specialized tracks in Engineering and Management.',
        icon: Building2,
        link: '#contact'
    },
    {
        title: 'Bootcamps',
        description: 'Accelerate student learning with pre-built projects and automated assessments.',
        icon: Zap,
        link: '#contact'
    }
]

export default function AcademyPage() {
    const [selectedSubject, setSelectedSubject] = useState('HTML & CSS')

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        <Badge variant="outline" className="px-4 py-1.5 border-border text-foreground/70 bg-primary/5 font-bold uppercase tracking-widest text-[11px] rounded-full">
                            Bluelearner Academy
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
                            The Complete Platform to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-blue-200">Train Your Team</span>
                        </h1>
                        <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed">
                            Manage learning, track progress, and upskill your organization with the world's most trusted engineering content.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-primary/15 active:scale-[0.98] transition-all">
                                Get Started Free
                            </Button>
                            <Button variant="outline" className="h-14 px-10 border-border bg-card/50 hover:bg-secondary text-white font-bold text-lg rounded-2xl transition-all">
                                View Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Organizations Grid */}
            <section className="py-20 border-y border-slate-800/50 bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-4">Built for Organizations That Train</h2>
                        <p className="text-muted-foreground">Everything you need to deliver world-class technical education.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {SECTORS.map((sector) => (
                            <div key={sector.title} className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-border hover:border-border transition-all group">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-foreground/70 mb-6 group-hover:scale-110 transition-transform">
                                    <sector.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{sector.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{sector.description}</p>
                                <Link href={sector.link} className="inline-flex items-center gap-2 text-foreground/70 font-bold text-sm hover:underline">
                                    Learn More <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Set Up Semester Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                                Set Up a Semester <span className="text-foreground/70 underline decoration-border">in Seconds</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                Pick a subject, and your learning path is ready. Modules, quizzes, and a final exam, all built in. Fully customizable for your team.
                            </p>
                            <div className="space-y-4">
                                {['HTML & CSS', 'Python Mastery', 'Data Analytics', 'Management 101'].map((sub) => (
                                    <button 
                                        key={sub}
                                        onClick={() => setSelectedSubject(sub)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedSubject === sub ? 'bg-primary/10 border-primary/40 text-foreground/70' : 'bg-card/50 border-border text-muted-foreground hover:border-border'}`}
                                    >
                                        <span className="font-bold">{sub}</span>
                                        <CheckCircle2 className={`w-5 h-5 transition-opacity ${selectedSubject === sub ? 'opacity-100' : 'opacity-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="relative rounded-[3rem] overflow-hidden border border-border bg-card/50 p-8 pt-12 shadow-2xl">
                                <div className="absolute top-4 left-8 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-primary/50" />
                                    <div className="w-3 h-3 rounded-full bg-blue-500/50" />
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white text-lg">{selectedSubject} Academy Track</h4>
                                            <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">Enrollment: 124 Students</p>
                                        </div>
                                        <Badge className="bg-primary/10 text-foreground/70 border-none">Active Hub</Badge>
                                    </div>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5">
                                            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-foreground/70">
                                                <PlayCircle className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="h-2 w-24 bg-muted rounded-full mb-2" />
                                                <div className="h-1.5 w-40 bg-secondary rounded-full" />
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-slate-700" />
                                        </div>
                                    ))}
                                    <div className="mt-8 pt-8 border-t border-border flex justify-between items-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                        <span>Progress: 68%</span>
                                        <span>Average: 84%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Everything You Need */}
            <section className="py-24 bg-primary/5 border-y border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl font-extrabold text-white">Everything You Need</h2>
                        <p className="text-muted-foreground text-lg">Powerful features to manage learning at any scale.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {ACADEMY_FEATURES.map((feature) => (
                            <div key={feature.title} className="p-6 rounded-3xl bg-card/60 border border-border space-y-4">
                                <div className={`w-12 h-12 ${feature.bgColor} ${feature.color} rounded-xl flex items-center justify-center`}>
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results You Can Measure */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900/40 border border-border rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] -mr-64 -mt-64" />
                        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 space-y-6">
                                <h2 className="text-4xl font-black text-white">Results You Can <span className="text-foreground/70">Measure</span></h2>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Show leadership exactly what training delivers. Track individual performance, identify skill gaps, and celebrate mastery.
                                </p>
                                <div className="grid grid-cols-2 gap-6 pt-6">
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-white">92%</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Completion Rate</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-3xl font-black text-white">4.8/5</p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Student Rating</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 w-full bg-secondary/50 rounded-3xl p-8 border border-white/5 space-y-8">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">Monthly Skills Growth</span>
                                    <TrendingUp className="text-foreground/70 w-5 h-5" />
                                </div>
                                <div className="h-48 flex items-end gap-3 px-4">
                                    {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary/15 rounded-t-lg transition-all hover:bg-primary/40 relative group" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                {h}%
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-24 bg-card/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tight">Simple Seat-Based Pricing</h2>
                        <p className="text-muted-foreground">Scalable training for any size. No long-term commitment required.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-10 rounded-[2.5rem] bg-card/60 border border-border space-y-8">
                            <h3 className="text-2xl font-bold text-white">Self-Service</h3>
                            <div className="space-y-2">
                                <p className="text-5xl font-black text-white">$5.99<span className="text-sm text-muted-foreground font-bold ml-2">/ seat per month</span></p>
                                <p className="text-sm text-foreground/70 font-bold">Standard Platform Access</p>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Access to all 45+ Technologies',
                                    'Admin Dashboard',
                                    'Real-time Progress Tracking',
                                    'Official Certificates'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                                        <CheckCircle2 className="w-5 h-5 text-foreground/70" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-black rounded-xl transition-all">
                                Try Academy Free
                            </Button>
                        </div>
                        <div className="p-10 rounded-[2.5rem] bg-primary/10 border-2 border-border space-y-8 relative overflow-hidden">
                            <div className="absolute top-5 right-5">
                                <Badge className="bg-primary text-white border-none uppercase text-[10px] font-black tracking-widest">Scale</Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-white">Organizations</h3>
                            <div className="space-y-2">
                                <p className="text-5xl font-black text-white">Custom</p>
                                <p className="text-sm text-foreground/70 font-bold text-center">Volume Discounts Available</p>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'Everything in Self-Service',
                                    'Custom Learning Paths',
                                    'Bulk User Enrollment',
                                    'Dedicated Account Support',
                                    'SSO & API Access'
                                ].map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm text-foreground/80">
                                        <CheckCircle2 className="w-5 h-5 text-foreground/70" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-black rounded-xl transition-all shadow-lg shadow-primary/15">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-primary/90 to-blue-600 rounded-[3rem] p-12 md:p-20 text-center space-y-8 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                        <motion.div 
                            animate={{ scale: [1, 1.02, 1] }} 
                            transition={{ duration: 4, repeat: Infinity }}
                            className="relative z-10 space-y-6"
                        >
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Ready to Train Your Team?</h2>
                            <p className="text-foreground text-xl max-w-2xl mx-auto font-medium">
                                Join thousands of organizations building the next generation of engineers with Bluelearner Academy.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                                <Button className="h-16 px-12 bg-white text-foreground/90 hover:bg-secondary font-black text-xl rounded-2xl shadow-xl active:scale-[0.95] transition-all">
                                    Start Free Trial
                                </Button>
                                <Button variant="outline" className="h-16 px-12 border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-2xl backdrop-blur-md transition-all">
                                    Contact Sales
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
