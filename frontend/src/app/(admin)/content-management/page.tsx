'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Search,
    Filter,
    Edit3,
    Trash2,
    Eye,
    Layers,
    Cpu,
    Database,
    Globe,
    FileText,
    ChevronRight,
    Sparkles,
    Zap,
    MoreVertical,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const courses = [
    {
        id: 'C-001',
        title: 'Advanced AI & Machine Learning for Engineers',
        domain: 'Computer Science',
        modules: 12,
        lessons: 84,
        status: 'Published',
        difficulty: 'Advanced',
        lastUpdated: '2h ago',
        xpValue: 12500,
    },
    {
        id: 'C-002',
        title: 'Precision Mechanical Design & FEA Analysis',
        domain: 'Mechanical',
        modules: 8,
        lessons: 42,
        status: 'In Review',
        difficulty: 'Intermediate',
        lastUpdated: '1d ago',
        xpValue: 8400,
    },
    {
        id: 'C-003',
        title: 'Micro-Grid Management & Renewable Energy',
        domain: 'Electrical',
        modules: 10,
        lessons: 56,
        status: 'Published',
        difficulty: 'Expert',
        lastUpdated: '5h ago',
        xpValue: 15600,
    },
    {
        id: 'C-004',
        title: 'Strategic ROI & Multi-National Operations',
        domain: 'Management',
        modules: 6,
        lessons: 30,
        status: 'Draft',
        difficulty: 'Intermediate',
        lastUpdated: '4d ago',
        xpValue: 6200,
    },
];

export default function ContentManagementPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [view, setView] = useState<'list' | 'grid'>('list');

    return (
        <div className="space-y-10 pb-32 font-mono">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-slate-900/40 p-10 rounded-3xl border border-slate-800 glass-morphism relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Layers className="w-32 h-32" />
                </div>

                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                        CONTENT_OPS <span className="text-red-600 ai-glow">LEVEL_SYNC</span>
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        Architect, edit, and deploy global learning pathways. Manage domain-specific skill vectors and XP rewards.
                    </p>
                </div>

                <div className="flex gap-4 w-full md:w-auto relative z-10">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            placeholder="Query content by title or ID..."
                            className="bg-slate-950/80 border-slate-800 text-white h-12 pl-12 font-medium italic"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button className="h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                        <Plus className="w-4 h-4 mr-2" /> NEW_COURSE_V4
                    </Button>
                </div>
            </div>

            {/* Course List / Table View */}
            <Card className="bg-slate-950/60 border-slate-900 overflow-hidden group">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 border-b border-slate-800/50">
                            <tr>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Course_Entity</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Domain_Vector</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Inventory</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">XP_Stake</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Status_Flag</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-right">Access_Control</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-900/30 transition-all group/row">
                                    <td className="px-6 py-6">
                                        <div className="space-y-1">
                                            <p className="text-[11px] font-black text-white uppercase italic tracking-tight">{course.title}</p>
                                            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">ID: {course.id} • Updated: {course.lastUpdated}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-medium italic">
                                        <Badge variant="outline" className="bg-slate-900 border-slate-800 text-[8px] font-black uppercase text-slate-400">
                                            {course.domain}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-white tracking-widest">{course.modules}</p>
                                                <p className="text-[7px] font-black text-slate-600 uppercase">MODS</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] font-black text-white tracking-widest">{course.lessons}</p>
                                                <p className="text-[7px] font-black text-slate-600 uppercase">LESSONS</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-[10px] font-black text-orange-500 italic tracking-widest">{course.xpValue.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full",
                                                course.status === 'Published' ? 'bg-amber-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]' :
                                                    course.status === 'In Review' ? 'bg-orange-500' : 'bg-slate-700'
                                            )} />
                                            <span className="text-[9px] font-black uppercase italic text-slate-300 tracking-tighter">{course.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-row-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white hover:bg-slate-800">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10">
                                                <Eye className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-500/10">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* AI Content Support */}
            <div className="p-8 bg-red-600/5 border border-red-600/20 rounded-3xl flex flex-col md:flex-row items-center gap-8 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4">
                    <Sparkles className="w-8 h-8 text-red-600/10 group-hover:text-red-600/20 transition-all border-none" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-red-600/10 flex items-center justify-center shrink-0">
                    <Cpu className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-black italic text-white uppercase tracking-widest">AI_CURATOR_SYNC_REQD</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest max-w-2xl leading-relaxed">
                        3 New course blueprints are pending Neural Review for domain-accuracy.
                        Recommended Action: Execute <span className="text-red-500">INIT_AI_VALIDATION_SEQUENCE</span> for all draft entities.
                    </p>
                </div>
                <Button className="ml-auto bg-slate-950 border border-slate-800 text-white hover:bg-slate-900 font-black italic uppercase text-[10px] h-12 px-8 tracking-[0.2em] transition-all">
                    LAUNCH_SYNC
                </Button>
            </div>
        </div>
    );
}
