'use client';

import { motion } from 'framer-motion';
import {
    Trophy,
    Zap,
    Target,
    Award,
    ChevronRight,
    Star,
    Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function GamificationSidebar() {
    const leaderboard = [
        { name: 'Alex Riverside', xp: '12,450', level: 42, role: 'STUDENT' },
        { name: 'Sarah Chen', xp: '11,200', level: 38, role: 'CANDIDATE' },
        { name: 'Marcus Vane', xp: '9,800', level: 35, role: 'STUDENT' },
    ];

    return (
        <div className="space-y-6">
            {/* Player Stats */}
            <Card className="bg-slate-900/40 border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-16 h-16 text-primary rotate-12" />
                </div>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black italic">LEVEL 12</Badge>
                        <div className="flex items-center gap-1 text-orange-400">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-black">5 DAY STREAK</span>
                        </div>
                    </div>
                    <CardTitle className="text-xl font-black italic tracking-tight pt-2">SPECIALIST_II</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold">
                            <span>XP PROGRESS</span>
                            <span>2,450 / 3,000</span>
                        </div>
                        <Progress value={82} className="h-1.5 bg-slate-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                            <p className="text-[8px] text-slate-500 uppercase font-black">Global Rank</p>
                            <p className="text-sm font-bold text-white">#1,284</p>
                        </div>
                        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                            <p className="text-[8px] text-slate-500 uppercase font-black">Badges</p>
                            <p className="text-sm font-bold text-white">14</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Global Leaderboard */}
            <Card className="bg-slate-950/40 border-slate-800">
                <CardHeader className="pb-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" /> GLOBAL_LEADERBOARD
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-800/50">
                        {leaderboard.map((user, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-900/40 transition-colors group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-black ${i === 0 ? 'text-yellow-500' : 'text-slate-600'}`}>{i + 1}</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-200 group-hover:text-white">{user.name}</p>
                                        <p className="text-[9px] text-slate-500 uppercase font-black">{user.role} • LVL {user.level}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-primary italic">{user.xp}</p>
                                    <p className="text-[8px] text-slate-600 uppercase font-bold">XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="ghost" className="w-full text-[10px] font-black italic tracking-widest text-slate-500 hover:text-primary py-4 uppercase">
                        View Full Rankings <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                </CardContent>
            </Card>

            {/* Recent Achievements */}
            <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-3 h-3 text-emerald-400" /> Recent Unlock
                </h4>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold text-white uppercase italic">CODE_WARRIOR</h5>
                        <p className="text-[9px] text-slate-500">Completed 10 daily quizzes in a row.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
