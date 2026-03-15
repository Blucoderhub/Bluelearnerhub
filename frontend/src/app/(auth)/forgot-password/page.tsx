'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-background">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-[400px] bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10 relative">
                        <KeyRound className="w-8 h-8 text-primary relative z-10" />
                    </div>
                </div>

                {sent ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 text-center"
                    >
                        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Check_Inbox</h2>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider leading-relaxed">
                                If <span className="text-white">{email}</span> is registered, a reset link has been dispatched.
                            </p>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono leading-relaxed">
                            Didn&apos;t receive it? Check your spam folder or wait a few minutes before requesting again.
                        </p>
                        <Button
                            variant="outline"
                            className="w-full h-11 border-white/20 bg-transparent text-white font-mono font-bold uppercase tracking-widest text-[10px] hover:bg-white/5"
                            onClick={() => { setSent(false); setEmail(''); }}
                        >
                            Send_Again
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Reset_Access</h2>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                                Enter your registered email to receive a reset link
                            </p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono leading-tight"
                            >
                                <span className="font-bold uppercase tracking-widest">[ERROR]:</span> {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                                    Registered_Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="SYSTEM_ID@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-12 bg-white text-black font-mono font-black uppercase tracking-widest text-[12px] hover:bg-black hover:text-white border-2 border-white transition-none"
                                >
                                    {loading ? 'Dispatching...' : 'Send_Reset_Link'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-white/30 uppercase hover:text-white tracking-[0.2em] transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back_To_Login
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
