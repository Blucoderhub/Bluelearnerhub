'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Shield,
    Star,
    CheckCircle2,
    Crown,
    Cpu,
    Globe,
    Rocket,
    Trophy,
    CreditCard,
    ChevronRight,
    Sparkles,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

const tiers = [
    {
        name: 'EXPLORER',
        price: '$9',
        period: '/mo',
        description: 'Perfect for individual student innovators.',
        features: [
            '500 AI Generation Credits',
            'Standard Lab Access',
            'Course Completion Certificates',
            'Basic Performance Analytics'
        ],
        icon: Rocket,
        color: 'text-blue-400',
        border: 'border-blue-500/20',
        buttonColor: 'bg-primary hover:bg-primary/90',
    },
    {
        name: 'INNOVATOR',
        price: '$29',
        period: '/mo',
        description: 'For power users and elite engineers.',
        features: [
            'Unlimited AI Credits',
            'Priority Hackathon Entry',
            'Premium Lab Templates',
            'Deep Talent Analytics',
            'Verified Proof-Score Badge'
        ],
        icon: Sparkles,
        color: 'text-purple-400',
        border: 'border-purple-500/40',
        buttonColor: 'bg-purple-600 hover:bg-purple-700 shadow-[0_0_20px_rgba(147,51,234,0.3)]',
        popular: true,
    },
    {
        name: 'ENTERPRISE',
        price: '$199',
        period: '/mo',
        description: 'Complete OS for institutions and organizations.',
        features: [
            'Unlimited Organization Seats',
            'Custom Hackathon Hosting',
            'Full Talent Pipeline Access',
            'API Access for Custom Labs',
            'Dedicated Support Engineer'
        ],
        icon: Crown,
        color: 'text-foreground/70',
        border: 'border-border',
        buttonColor: 'bg-primary/90 hover:bg-primary/80',
    },
];

export default function PremiumHubPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (tier: string) => {
        setLoading(tier);
        try {
            const res = await fetch('/api/payments/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Simple auth for demo
                },
                body: JSON.stringify({ tier }),
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch (error) {
            console.error('Subscription error:', error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-16 pb-32 animate-in fade-in duration-1000">
            {/* Header */}
            <div className="text-center space-y-4">
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px] font-black tracking-widest uppercase italic px-6 py-1.5">
                    Bluelearner_Premium_Club_v2
                </Badge>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase leading-none">
                    UNLEASH_YOUR <span className="text-primary ai-glow">FULL_POTENTIAL</span>
                </h1>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest max-w-2xl mx-auto leading-relaxed">
                    Upgrade to the elite tier of engineering and management education. Get priority access to industry hackathons and unlimited AI mentorship.
                </p>
            </div>

            {/* Current Stats (If logged in) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/40 border-border p-6 flex items-center justify-between group">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">AI_Credits_Remaining</p>
                        <p className="text-3xl font-black text-white">100 / 100</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6 text-primary" />
                    </div>
                </Card>
                <Card className="bg-slate-900/40 border-border p-6 flex items-center justify-between group">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Current_Tier</p>
                        <p className="text-3xl font-black text-foreground/70 uppercase italic">Free_User</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Shield className="w-6 h-6 text-foreground/80" />
                    </div>
                </Card>
                <Card className="bg-slate-900/40 border-border p-6 flex items-center justify-between group">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Proof_Score_Boost</p>
                        <p className="text-3xl font-black text-blue-400">1.0x</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                </Card>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                    <motion.div
                        key={tier.name}
                        whileHover={{ y: -10 }}
                        className="flex flex-col h-full"
                    >
                        <Card className={`flex-1 bg-card/60 border-2 ${tier.border} relative overflow-hidden flex flex-col group`}>
                            {tier.popular && (
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge className="bg-purple-600 text-white font-black italic text-[8px] uppercase tracking-widest shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                                        Most_Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="space-y-4 p-8">
                                <div className={`p-4 w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center ${tier.color} group-hover:scale-110 transition-transform duration-500`}>
                                    <tier.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-black italic text-white uppercase tracking-tighter">{tier.name}</CardTitle>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white tracking-widest">{tier.price}</span>
                                        <span className="text-muted-foreground font-bold text-xs">{tier.period}</span>
                                    </div>
                                </div>
                                <CardDescription className="text-xs text-muted-foreground font-medium uppercase leading-relaxed">
                                    {tier.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 pt-0 space-y-4 flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] italic mb-6">Tier_Assets</p>
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className={`w-4 h-4 ${tier.color} shrink-0`} />
                                        <span className="text-xs text-foreground/80 font-bold uppercase tracking-tight">{feature}</span>
                                    </div>
                                ))}
                            </CardContent>

                            <CardFooter className="p-8">
                                <Button
                                    onClick={() => handleSubscribe(tier.name)}
                                    disabled={loading === tier.name}
                                    className={`w-full h-14 font-black italic uppercase tracking-[0.2em] text-[10px] ${tier.buttonColor} transition-all duration-300`}
                                >
                                    {loading === tier.name ? 'INITIALIZING_SESSION...' : `SELECT_${tier.name}_OPS`}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Security & FAQ Info */}
            <div className="p-12 bg-card border border-border rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-3">
                            <Info className="w-5 h-5 text-primary" /> MISSION_CRITICAL_INFO
                        </h3>
                        <div className="space-y-4">
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wide">
                                All subscriptions are encrypted via Stripe Military-Grade Layer. You can pause or terminate your sequence at any temporal point via the Portal.
                            </p>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed uppercase tracking-wide">
                                AI Credits reset every 30-day temporal cycle. Bonus credits earned via hackathons remain active indefinitely.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center md:items-end gap-6">
                        <div className="flex gap-4">
                            <div className="bg-background p-4 rounded-xl border border-border">
                                <CreditCard className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="bg-background p-4 rounded-xl border border-border">
                                <Globe className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <div className="bg-background p-4 rounded-xl border border-border">
                                <Trophy className="w-6 h-6 text-muted-foreground" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase italic tracking-widest">Global_Payment_Protocols_Active</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
