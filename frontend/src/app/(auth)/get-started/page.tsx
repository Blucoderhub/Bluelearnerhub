"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, UserPlus, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentSignupForm } from '@/components/auth/StudentSignupForm';
import { StudentLoginForm } from '@/components/auth/StudentLoginForm';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function GetStartedPage() {
    const { login, register, isAuthenticated } = useAuth();
    const router = useRouter();
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleAuth = async (data: any) => {
        setError(null);
        try {
            if (data.name) {
                // Register flow
                await register({ ...data, role: 'student' });
            } else {
                // Login flow
                await login(data.email, data.password);
            }
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Protocole initialization failed.");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 relative overflow-hidden flex items-center justify-center">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-[420px] w-full relative z-10 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 relative group">
                            <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
                            <GraduationCap className="w-8 h-8 text-primary-foreground relative z-10" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tighter uppercase font-mono">
                        Join System
                    </h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-loose">
                        Master Elite Engineering & Management
                    </p>
                </motion.div>

                <div className="w-full bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    
                    <Tabs defaultValue="signup" className="w-full relative z-10">
                        <div className="flex justify-center mb-8">
                            <TabsList className="bg-white/5 border border-white/10 p-1 h-12 rounded-xl">
                            <TabsTrigger
                                value="signup"
                                className="px-6 flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-bold uppercase tracking-widest text-[9px] font-mono"
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                Join
                            </TabsTrigger>
                            <TabsTrigger
                                value="login"
                                className="px-6 flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-bold uppercase tracking-widest text-[9px] font-mono"
                            >
                                <Lock className="w-3.5 h-3.5" />
                                Login
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
                        <StudentSignupForm onSubmit={handleAuth} error={error} />
                    </TabsContent>

                    <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                        <StudentLoginForm onSubmit={handleAuth} error={error} />
                    </TabsContent>
                </Tabs>
            </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
                        Back to Home
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
