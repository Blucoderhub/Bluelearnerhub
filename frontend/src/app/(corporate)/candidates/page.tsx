'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Users,
    Trophy,
    Zap,
    CheckCircle2,
    ExternalLink,
    MapPin,
    Building2,
    Code,
    Cpu,
    LineChart,
    Star,
    ChevronRight,
    ShieldCheck,
    Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const candidates = [
    {
        id: 1,
        name: 'Dr. Aris Varma',
        role: 'Aeronautical Engineer',
        domain: 'Aerospace',
        level: 'L9',
        proofScore: 98,
        location: 'Munich, Germany',
        skills: ['Avionics', 'Fluid Dynamics', 'Propulsion'],
        achievements: ['NASA Challenge Winner', 'Top Contributor'],
        university: 'TUM Munich',
        xp: 124500,
    },
    {
        id: 2,
        name: 'Sarah Chen',
        role: 'Full Stack Engineer',
        domain: 'Computer Science',
        level: 'L8',
        proofScore: 95,
        location: 'San Francisco, USA',
        skills: ['Next.js', 'Distributed Systems', 'Web3'],
        achievements: ['EthGlobal 1st Place', 'OS Contributor'],
        university: 'MIT',
        xp: 98200,
    },
    {
        id: 3,
        name: 'Marcus Rashford',
        role: 'Business Analyst',
        domain: 'Management',
        level: 'L7',
        proofScore: 92,
        location: 'London, UK',
        skills: ['Agile', 'Market Strategy', 'ROI Analytics'],
        achievements: ['MBA Gold Medalist', 'Strategy Lead'],
        university: 'LSE London',
        xp: 75600,
    },
    {
        id: 4,
        name: 'Elena Petrov',
        role: 'Structural Engineer',
        domain: 'Civil',
        level: 'L8',
        proofScore: 94,
        location: 'Moscow, Russia',
        skills: ['BIM', 'Load Analysis', 'Sustainable Design'],
        achievements: ['Green Building Award', 'Steel Structure Pro'],
        university: 'MSTU Moscow',
        xp: 89000,
    },
];

export default function CandidatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('All');

    const domains = ['All', 'Aerospace', 'Computer Science', 'Management', 'Mechanical', 'Electrical', 'Civil'];

    return (
        <div className="space-y-10 pb-32">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-slate-900/40 p-10 rounded-3xl border border-slate-800 glass-morphism relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Search className="w-32 h-32" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                        TALENT_DISCOVERY <span className="text-primary ai-glow">HUB</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        Query 500,000+ verified engineering and management experts based on real-world performance benchmarks.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {domains.map(d => (
                            <button
                                key={d}
                                onClick={() => setSelectedDomain(d)}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest italic transition-all ${selectedDomain === d ? 'bg-primary text-primary-foreground ai-glow' : 'bg-slate-950 text-slate-500 hover:text-white border border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Query by skill, role or name..."
                            className="bg-slate-950/80 border-slate-800 text-white h-12 pl-12 font-medium italic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="h-12 w-12 bg-slate-950 border border-slate-800 text-white hover:bg-slate-900">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Talent Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                {candidates.map((candidate, i) => (
                    <motion.div
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-slate-900 border-slate-800 hover:border-primary/30 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                                    <Zap className="w-3 h-3 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase italic">{candidate.level}</span>
                                </div>
                                <div className="bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{candidate.xp.toLocaleString()} XP</span>
                                </div>
                            </div>

                            <CardHeader className="flex flex-row items-center gap-6 p-8 border-b border-slate-800/50">
                                <Avatar className="h-20 w-20 border-2 border-slate-800 group-hover:border-primary/50 transition-colors">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-slate-800 text-white text-2xl font-black italic">
                                        {candidate.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black italic text-white uppercase tracking-tight">{candidate.name}</CardTitle>
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest">{candidate.role}</p>
                                    <div className="flex items-center gap-4 pt-2">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                                            <MapPin className="w-3 h-3 text-red-500/50" /> {candidate.location}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                                            <Building2 className="w-3 h-3 text-blue-500/50" /> {candidate.university}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                {/* Skill Vectors */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Skill_Efficiency_Vectors</h4>
                                        <span className="text-[10px] font-bold text-white uppercase tracking-widest italic">{candidate.proofScore}% Proof_Score</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map(skill => (
                                            <div key={skill} className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center gap-2 group-hover:border-primary/20 transition-all">
                                                <Code className="w-3 h-3 text-primary/50" />
                                                <span className="text-[9px] font-black uppercase text-slate-400">{skill}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Accomplishments */}
                                <div className="grid grid-cols-2 gap-4">
                                    {candidate.achievements.map((acc, idx) => (
                                        <div key={idx} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                                            </div>
                                            <span className="text-[9px] font-black text-amber-200/80 uppercase tracking-tighter">{acc}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="p-8 pt-0 flex gap-4">
                                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black italic uppercase tracking-widest h-12 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                                    INITIATE_CONTACT
                                </Button>
                                <Button className="flex-1 bg-slate-950 border border-slate-800 text-white hover:bg-slate-900 font-black italic uppercase tracking-widest h-12">
                                    DEEP_PROFILE_V3
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* AI Talent Advisory Info */}
            <div className="mt-20 p-10 bg-[#020617] border border-primary/20 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />
                <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">AI_TALENT_ADVISORY</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-2xl">
                            Our neural engine suggests focusing your evaluation on <span className="text-white font-bold italic">Verification_Vectors</span> (Proof Score &gt; 90%).
                            Candidates like <span className="text-primary font-bold">Dr. Aris Varma</span> show exceptional alignment with your recent 'Propulsion Systems' challenge requirements.
                        </p>
                        <Button className="bg-slate-950 border border-primary/30 text-primary hover:bg-primary hover:text-white font-black italic uppercase tracking-[0.2em] text-[10px] h-10 px-8 transition-all">
                            RUN_MATCH_SIMULATION
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
