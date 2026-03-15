'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RouteError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[RouteError]', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center space-y-8"
            >
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                        PAGE_ERROR
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                        This page encountered an unexpected error. Your data is safe.
                    </p>
                    {error.digest && (
                        <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-primary hover:bg-primary/90 font-black italic uppercase tracking-widest text-[11px] h-11 px-6"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try_Again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => (window.location.href = '/')}
                        className="border-border font-black italic uppercase tracking-widest text-[11px] h-11 px-6"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Go_Home
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
