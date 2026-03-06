'use client'

import React, { useState } from 'react'
import {
    Search,
    Filter,
    Star,
    MessageSquare,
    Calendar,
    CheckCircle2,
    GraduationCap,
    Globe,
    Award,
    TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const MENTORS = [
    {
        id: 1,
        name: 'Dr. Sarah Chen',
        role: 'Senior AI Research Engineer',
        company: 'Google DeepMind',
        expertise: ['Artificial Intelligence', 'Machine Learning', 'Python'],
        rating: 4.9,
        reviews: 124,
        image: '',
        status: 'Available',
        price: '$50/hr'
    },
    {
        id: 2,
        name: 'James Wilson',
        role: 'Staff Software Architect',
        company: 'Microsoft',
        expertise: ['System Design', 'Cloud Architecture', 'Go'],
        rating: 4.8,
        reviews: 89,
        image: '',
        status: 'Busy',
        price: '$75/hr'
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'Lead Data Scientist',
        company: 'Meta',
        expertise: ['Data Science', 'Statistics', 'R'],
        rating: 5.0,
        reviews: 56,
        image: '',
        status: 'Available',
        price: '$60/hr'
    },
    {
        id: 4,
        name: 'Alex Kumar',
        role: 'Full Stack Tech Lead',
        company: 'Netflix',
        expertise: ['React', 'Node.js', 'Next.js'],
        rating: 4.9,
        reviews: 210,
        image: '',
        status: 'Available',
        price: '$45/hr'
    }
]

export default function MentorsPage() {
    const [searchQuery, setSearchQuery] = useState('')

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <Badge variant="outline" className="px-4 py-1.5 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 font-bold uppercase tracking-widest text-[10px]">
                        Elite Mentorship
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Best in Industry</span>
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Connect with top-tier engineers, designers, and managers from world-leading tech companies. Accelerate your career with personalized guidance.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-12">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                            placeholder="Search by expertise, company, or name..."
                            className="w-full pl-12 h-14 bg-slate-900/50 border-slate-800 focus:border-emerald-500/50 rounded-2xl text-white placeholder:text-slate-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-14 px-8 bg-slate-900/50 border-slate-800 hover:bg-slate-800 rounded-2xl flex items-center gap-3 group">
                        <Filter className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        <span className="font-bold text-slate-300">Filters</span>
                    </Button>
                </div>

                {/* Mentor Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MENTORS.map((mentor) => (
                        <div key={mentor.id} className="group relative bg-slate-900/40 border border-slate-800/60 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2">
                            {/* Card Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <Avatar className="h-20 w-20 border-2 border-slate-800 group-hover:border-emerald-500/30 transition-all duration-500">
                                            <AvatarImage src={mentor.image} />
                                            <AvatarFallback className="bg-slate-800 text-emerald-400 font-black text-xl">
                                                {mentor.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-[#020617] ${mentor.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{mentor.rating}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{mentor.reviews} Reviews</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{mentor.name}</h3>
                                    <p className="text-sm text-slate-400 font-medium">{mentor.role}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Globe className="w-3 h-3 text-slate-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{mentor.company}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {mentor.expertise.map(skill => (
                                        <Badge key={skill} variant="secondary" className="bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border-none px-3 py-1 text-[11px] font-bold transition-all">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-800/50">
                                    <span className="text-xl font-black text-white">{mentor.price}<span className="text-xs text-slate-500 font-bold ml-1">/ session</span></span>
                                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all">
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Benefits Section */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-800/40 pt-20">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                            <Award className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white">Certified Experts</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Every mentor undergoes a rigorous vetting process to ensure high-quality guidance.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white">Flexible Scheduling</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Book sessions that fit your time zone and schedule with our automated system.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h4 className="text-lg font-bold text-white">Career Growth</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Get internal referrals, resume reviews, and interview prep for top tech companies.</p>
                    </div>
                </div>

                {/* Call To Action */}
                <div className="mt-32 relative group overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-600 to-cyan-600 p-12 text-center">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl font-black text-white tracking-tight">Become a Mentor Yourself?</h2>
                        <p className="text-emerald-50 max-w-xl mx-auto text-lg">
                            Share your expertise with the next generation of engineers and build your personal brand in the tech community.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-black px-10 h-14 rounded-2xl shadow-xl active:scale-[0.98] transition-all text-lg">
                                Apply to Mentor
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
