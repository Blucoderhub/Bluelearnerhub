'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RotateCcw, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentCancelPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <Card className="max-w-md w-full bg-card/60 border-red-500/30 p-10 text-center space-y-8 glass-morphism relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto border-4 border-red-600/20"
                >
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase font-mono">
                        SEQUENCE_ABORTED
                    </h1>
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest leading-relaxed">
                        The payment transaction was cancelled. No charges were processed.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Link href="/premium">
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest h-12">
                            RETRY_ACQUISITION <RotateCcw className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Link href="/student/dashboard">
                        <Button variant="ghost" className="w-full text-muted-foreground hover:text-white font-black italic uppercase text-[10px] tracking-widest h-12">
                            RETURN_TO_BASE
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
