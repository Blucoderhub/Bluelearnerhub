"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock, UserPlus, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentSignupForm } from '@/components/auth/StudentSignupForm';
import { StudentLoginForm } from '@/components/auth/StudentLoginForm';

export default function GetStartedPage() {
    const handleAuth = async (data: any) => {
        console.log("Auth Action:", data);
    };

    return (
        <div className="min-h-screen bg-background text-foreground py-20 px-4 relative overflow-hidden flex items-center justify-center">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-[500px] w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                            <GraduationCap className="w-10 h-10 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
                        Join the Ecosystem
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
                        Master Elite Engineering & Management
                    </p>
                </motion.div>

                <Tabs defaultValue="signup" className="w-full bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                    <div className="flex justify-center mb-10">
                        <TabsList className="bg-muted/50 border border-border/30 p-1.5 h-14 rounded-2xl">
                            <TabsTrigger
                                value="signup"
                                className="px-8 flex items-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-black uppercase tracking-widest text-[10px]"
                            >
                                <UserPlus className="w-4 h-4" />
                                Join
                            </TabsTrigger>
                            <TabsTrigger
                                value="login"
                                className="px-8 flex items-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all font-black uppercase tracking-widest text-[10px]"
                            >
                                <Lock className="w-4 h-4" />
                                Login
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
                        <StudentSignupForm onSubmit={handleAuth} />
                    </TabsContent>

                    <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                        <StudentLoginForm onSubmit={handleAuth} />
                    </TabsContent>


                </Tabs>

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
