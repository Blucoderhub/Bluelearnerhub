'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    UserPlus,
    Search,
    Sparkles,
    ShieldCheck,
    ArrowRight,
    Send,
    Code2,
    Briefcase,
    Zap,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function HackathonTeamPage({ params }: { params: Promise<{ hackathonId: string }> }) {
    const { hackathonId } = use(params);
    const [view, setView] = useState<'selection' | 'create' | 'match'>('selection');
    const [teamName, setTeamName] = useState('');

    const potentialMatches = [
        {
            name: 'Elena Rodriguez',
            domain: 'Mechanical Engineering',
            skills: ['CAD', 'Robotics', 'FEA'],
            matchScore: 94,
            role: 'Hardware Lead'
        },
        {
            name: 'Karan Singh',
            domain: 'Finance / MBA',
            skills: ['Market Analysis', 'Pitching', 'Valuation'],
            matchScore: 88,
            role: 'Business Strategist'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black italic text-white tracking-tighter">TEAM <span className="text-primary ai-glow">FORMATION</span></h1>
                <p className="text-slate-400 font-medium">Hackathon ID: #{hackathonId} • Build your dream squad.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    onClick={() => setView('create')}
                    className={`cursor-pointer transition-all border-slate-800 ${view === 'create' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-slate-900/40 hover:bg-slate-900/60'}`}
                >
                    <CardHeader>
                        <Plus className={`w-8 h-8 mb-2 ${view === 'create' ? 'text-primary' : 'text-slate-500'}`} />
                        <CardTitle className="text-lg font-bold text-white">CREATE_TEAM</CardTitle>
                        <CardDescription className="text-xs">Start a new squad from scratch.</CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    onClick={() => setView('selection')}
                    className={`cursor-pointer transition-all border-slate-800 ${view === 'selection' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-slate-900/40 hover:bg-slate-900/60'}`}
                >
                    <CardHeader>
                        <UserPlus className={`w-8 h-8 mb-2 ${view === 'selection' ? 'text-primary' : 'text-slate-500'}`} />
                        <CardTitle className="text-lg font-bold text-white">JOIN_TEAM</CardTitle>
                        <CardDescription className="text-xs">Enter a secret invite code.</CardDescription>
                    </CardHeader>
                </Card>

                <Card
                    onClick={() => setView('match')}
                    className={`cursor-pointer transition-all border-slate-800 ${view === 'match' ? 'bg-primary/5 border-primary ring-1 ring-primary/20' : 'bg-slate-900/40 hover:bg-slate-900/60'}`}
                >
                    <CardHeader className="relative">
                        <Sparkles className={`w-8 h-8 mb-2 ${view === 'match' ? 'text-primary' : 'text-slate-500'} animate-pulse`} />
                        <CardTitle className="text-lg font-bold text-white">AI_MATCHMAKER</CardTitle>
                        <CardDescription className="text-xs text-primary font-bold">Recommended for you.</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <AnimatePresence mode="wait">
                {view === 'create' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card className="bg-slate-950 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-black italic uppercase italic">Launch Squad</CardTitle>
                                <CardDescription>Once created, you'll get a unique invite code for your teammates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">SQUAD_NAME</label>
                                    <Input
                                        value={teamName}
                                        onChange={(e) => setTeamName(e.target.value)}
                                        placeholder="Enter a legendary team name..."
                                        className="bg-slate-900 border-slate-800 text-white h-12"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-primary text-primary-foreground font-black italic h-12 px-10">INITIALIZE_TEAM</Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}

                {view === 'selection' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <Card className="bg-slate-950 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-xl font-black italic uppercase italic">Enter Invite Code</CardTitle>
                                <CardDescription>Join an existing team organized by your peers.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input placeholder="E.g. BLUE-X92-2026" className="bg-slate-900 border-slate-800 text-white h-12 font-mono uppercase" />
                                    <Button className="bg-white text-black hover:bg-white/90 h-12 px-8 font-black">JOIN</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {view === 'match' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden group">
                            <Sparkles className="w-6 h-6 text-primary shrink-0" />
                            <div>
                                <h4 className="text-sm font-bold text-white uppercase italic">AI Matchmaker Active</h4>
                                <p className="text-xs text-slate-500">Scanning for cross-disciplinary partners based on your <span className="text-primary font-bold">Computer Science</span> profile.</p>
                            </div>
                            <div className="absolute right-0 bottom-0 p-2 opacity-5">
                                <ShieldCheck className="w-20 h-20 text-primary" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {potentialMatches.map((match, i) => (
                                <Card key={i} className="bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black italic">
                                            {match.matchScore}% MATCH
                                        </Badge>
                                    </div>
                                    <CardHeader>
                                        <div className="w-12 h-12 rounded-full bg-slate-800 mb-2 border border-slate-700" />
                                        <CardTitle className="text-lg font-bold text-white">{match.name}</CardTitle>
                                        <CardDescription className="text-xs text-slate-500 uppercase font-black">{match.domain}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {match.skills.map(s => (
                                                <Badge key={s} variant="secondary" className="bg-slate-950 text-slate-400 border-none text-[9px] uppercase font-black">{s}</Badge>
                                            ))}
                                        </div>
                                        <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Proposed Role</p>
                                            <p className="text-sm font-bold text-white italic text-primary">{match.role}</p>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-slate-950/20 p-4 border-t border-slate-800">
                                        <Button variant="ghost" className="w-full text-xs font-black italic text-slate-400 hover:text-primary group-hover:bg-primary/5 uppercase tracking-widest">
                                            SEND_INVITATION <Send className="w-3.5 h-3.5 ml-2" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>

                        <div className="flex justify-center pt-6">
                            <Button variant="link" className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-white">
                                <Info className="w-4 h-4 mr-2" /> How are match scores calculated?
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
