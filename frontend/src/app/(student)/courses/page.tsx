'use client';

import { motion } from 'framer-motion';
import {
    Cpu,
    Settings,
    Zap,
    Building2,
    Rocket,
    Bot,
    Car,
    FlaskConical,
    HeartPulse,
    Factory,
    BarChart3,
    DollarSign,
    Target,
    Truck,
    Users,
    Briefcase,
    Lightbulb,
    Container,
    PieChart
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const engineeringDomains = [
    { name: 'Computer Science', icon: Cpu, color: 'text-blue-400', border: 'border-blue-500/20' },
    { name: 'Mechanical', icon: Settings, color: 'text-foreground/70', border: 'border-border' },
    { name: 'Electrical', icon: Zap, color: 'text-yellow-400', border: 'border-yellow-500/20' },
    { name: 'Civil', icon: Building2, color: 'text-foreground/70', border: 'border-border' },
    { name: 'Aerospace', icon: Rocket, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { name: 'Robotics', icon: Bot, color: 'text-purple-400', border: 'border-purple-500/20' },
    { name: 'Automotive', icon: Car, color: 'text-red-400', border: 'border-red-500/20' },
    { name: 'Chemical', icon: FlaskConical, color: 'text-blue-400', border: 'border-blue-500/20' },
    { name: 'Biomedical', icon: HeartPulse, color: 'text-pink-400', border: 'border-pink-500/20' },
    { name: 'Industrial', icon: Factory, color: 'text-indigo-400', border: 'border-indigo-500/20' },
];

const managementDomains = [
    { name: 'MBA', icon: GraduationCapIcon, color: 'text-foreground/70', border: 'border-border' },
    { name: 'Finance', icon: DollarSign, color: 'text-foreground/70', border: 'border-border' },
    { name: 'Marketing', icon: Target, color: 'text-pink-400', border: 'border-pink-500/20' },
    { name: 'Operations', icon: Truck, color: 'text-blue-400', border: 'border-blue-500/20' },
    { name: 'HR', icon: Users, color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { name: 'Product Management', icon: Lightbulb, color: 'text-yellow-400', border: 'border-yellow-500/20' },
    { name: 'Entrepreneurship', icon: Briefcase, color: 'text-purple-400', border: 'border-purple-500/20' },
    { name: 'Supply Chain', icon: Container, color: 'text-indigo-400', border: 'border-indigo-500/20' },
    { name: 'Business Analytics', icon: PieChart, color: 'text-red-400', border: 'border-red-500/20' },
];

function GraduationCapIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

export default function CoursesPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in duration-1000">
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl md:text-6xl font-black italic tracking-tighter text-white"
                >
                    EXPLORE <span className="text-primary ai-glow">DOMAINS</span>
                </motion.h1>
                <p className="text-muted-foreground text-lg">
                    Select your field of expertise and unlock specialized learning paths, labs, and career opportunities.
                </p>
            </div>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white whitespace-nowrap">Engineering Tracks</h2>
                    <div className="h-px w-full bg-gradient-to-r from-slate-800 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {engineeringDomains.map((domain, i) => (
                        <DomainCard key={domain.name} domain={domain} index={i} category="engineering" />
                    ))}
                </div>
            </section>

            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white whitespace-nowrap">Management Tracks</h2>
                    <div className="h-px w-full bg-gradient-to-r from-slate-800 to-transparent" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {managementDomains.map((domain, i) => (
                        <DomainCard key={domain.name} domain={domain} index={i} category="management" />
                    ))}
                </div>
            </section>
        </div>
    );
}

function DomainCard({ domain, index, category }: { domain: any, index: number, category: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link href={`/courses/domain/${domain.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <Card className={`group relative bg-card/30 border ${domain.border} hover:bg-card/60 hover:border-primary/50 transition-all duration-300 overflow-hidden cursor-pointer h-full`}>
                    <div className="absolute top-0 right-0 p-2">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground group-hover:text-primary transition-colors">
                            {category}
                        </Badge>
                    </div>
                    <CardHeader className="pt-8">
                        <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 border border-slate-800`}>
                            <domain.icon className={`w-6 h-6 ${domain.color}`} />
                        </div>
                        <CardTitle className="text-lg text-white group-hover:text-primary transition-colors font-bold">
                            {domain.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            Advanced curriculum, simulated labs, and certification paths.
                        </p>
                        <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] font-black italic text-primary">ENTER DOMAIN</span>
                            <div className="w-10 h-px bg-primary" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
