'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token') ?? '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setError('No reset token found. Please request a new password reset link.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setDone(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid or expired token. Please request a new reset link.');
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
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg shadow-primary/10">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                </div>

                {done ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6 text-center"
                    >
                        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Access_Restored</h2>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider leading-relaxed">
                                Password updated successfully. Redirecting to login...
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">New_Access_Code</h2>
                            <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                                Enter your new password below
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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                                    New_Password
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono pr-10"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
                                    Confirm_Password
                                </label>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Repeat password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading || !token}
                                    className="w-full h-12 bg-white text-black font-mono font-black uppercase tracking-widest text-[12px] hover:bg-black hover:text-white border-2 border-white transition-none"
                                >
                                    {loading ? 'Updating...' : 'Set_New_Password'}
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
