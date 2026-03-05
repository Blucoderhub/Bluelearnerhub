'use client';

import { motion } from 'framer-motion';
import {
    Code2,
    Settings,
    Zap,
    Building2,
    FlaskConical,
    Blocks,
    Cpu,
    MousePointer2,
    Box,
    Layers,
    ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const labCategories = [
    {
        title: 'SOFTWARE_ENGINEERING',
        description: 'Cloud-based IDE with integrated AI debugging, containers, and real-time collaboration.',
        icon: Code2,
        domain: 'CS / IT',
        status: 'ACTIVE',
        href: '/labs/software',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10'
    },
    {
        title: 'MECHANICAL_SIMULATOR',
        description: '3D CAD viewer, FEA analysis tools, and thermal fluid dynamics simulation environments.',
        icon: Settings,
        domain: 'MECHANICAL / AUTO',
        status: 'ACTIVE',
        href: '/labs/mechanical',
        color: 'text-orange-400',
        bg: 'bg-orange-500/10'
    },
    {
        title: 'ELECTRICAL_CIRCUITS',
        description: 'Virtual breadboards, SPICE simulation, and PCB design verification lab.',
        icon: Zap,
        domain: 'ELECTRICAL / EC',
        status: 'ACTIVE',
        href: '/labs/electrical',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10'
    },
    {
        title: 'CIVIL_DESIGN_HUB',
        description: 'Building Information Modeling (BIM) tools and structural integrity simulators.',
        icon: Building2,
        domain: 'CIVIL / ARCH',
        status: 'BETA',
        href: '/labs/civil',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        title: 'BIOMEDICAL_ANALYTICS',
        description: 'Medical imaging processing, prosthetic design, and bioinformatics lab.',
        icon: FlaskConical,
        domain: 'BIO / CHEM',
        status: 'BETA',
        href: '/labs/biomedical',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10'
    }
];

export default function LabsPage() {
    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                        VIRTUAL <span className="text-primary ai-glow">SIM_CENTER</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl font-medium">
                        Interact with industry-standard tools and environments without any hardware limitations. Low-latency, high-performance simulations.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-3">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Active Sessions</p>
                        <p className="text-xl font-black text-white">02</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {labCategories.map((lab, i) => (
                    <motion.div
                        key={lab.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-all group overflow-hidden h-full flex flex-col cursor-pointer ring-1 ring-white/5 hover:ring-primary/20">
                            <CardHeader className="relative">
                                <div className={`w-12 h-12 rounded-2xl ${lab.bg} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                                    <lab.icon className={`w-6 h-6 ${lab.color}`} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-800 font-bold tracking-widest uppercase">
                                        {lab.domain}
                                    </Badge>
                                    {lab.status === 'BETA' && (
                                        <Badge className="bg-orange-500/10 text-orange-400 border-none text-[9px] uppercase font-black italic">
                                            BETA_ACCESS
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-2xl font-black italic tracking-tight text-white group-hover:text-primary transition-colors pt-4">
                                    {lab.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                    {lab.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-6 bg-slate-950/20 border-t border-slate-800 flex justify-between items-center group/footer">
                                <div className="flex gap-2">
                                    <MousePointer2 className="w-3.5 h-3.5 text-slate-600" />
                                    <p className="text-[10px] text-slate-600 uppercase font-black">Browser-Based</p>
                                </div>
                                <Button size="sm" asChild className="bg-white text-black hover:bg-white/90 font-black italic tracking-widest group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                    <Link href={lab.href}>
                                        ENTER_LAB <ArrowRight className="w-4 h-4 ml-2 group-hover/footer:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}

                {/* Custom Project Placeholder */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="h-full"
                >
                    <div className="h-full bg-slate-950/40 border border-dashed border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-6 group cursor-pointer hover:border-primary/20 transition-all group">
                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                            <Blocks className="w-10 h-10 text-slate-700 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black italic text-slate-300 group-hover:text-white uppercase tracking-tighter">CREATE_SANDBOX</h4>
                            <p className="text-xs text-slate-600 max-w-[200px] mt-2 font-medium">
                                Setup a custom multi-domain environment for your team's specific project.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-slate-900 text-slate-500 border-none text-[8px] uppercase font-black">MULTI_MODAL</Badge>
                            <Badge variant="secondary" className="bg-slate-900 text-slate-500 border-none text-[8px] uppercase font-black">AI_ASSISTED</Badge>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
