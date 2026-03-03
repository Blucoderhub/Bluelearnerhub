'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <Card className="max-w-md w-full bg-slate-900/60 border-emerald-500/30 p-10 text-center space-y-8 glass-morphism relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-4 border-emerald-500/20"
                >
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase font-mono">
                        PAYMENT_CONFIRMED
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        Your high-tier ops sequence has been initialized. All premium vectors are now online.
                    </p>
                </div>

                <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase italic">Status:</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black">ACTIVE_SUBSCRIPTION</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase italic">AI_Credits:</span>
                        <span className="text-xs font-black text-white">REGENERATING...</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Link href="/student/dashboard">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black italic uppercase tracking-widest h-12">
                            LAUNCH_DASHBOARD <Rocket className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/premium">
                        <Button variant="ghost" className="w-full text-slate-500 hover:text-white font-black italic uppercase text-[10px] tracking-widest h-12">
                            VIEW_PRICING_DETAILS
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
