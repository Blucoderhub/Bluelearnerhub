"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";
import { Users, GraduationCap } from "lucide-react";

export default function LoginPortal() {
    const handleSubmit = async (data: any) => {
        console.log("General Login:", data);
    };

    return (
        <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-background">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl"
            >
                <div className="flex justify-center mb-10">
                    <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
                        <GraduationCap className="w-10 h-10 text-primary-foreground" />
                    </div>
                </div>

                <StudentLoginForm onSubmit={handleSubmit} />

                {/* Secondary Access */}
                <div className="mt-12 pt-8 border-t border-border/50">
                    <div className="flex flex-col gap-4">
                        <Link 
                            href="/login/mentor" 
                            className="group flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-primary">Specialized Access</div>
                                    <div className="text-sm font-bold text-foreground">Mentor Mode</div>
                                </div>
                            </div>
                            <div className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                    
                    <p className="mt-8 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                        Corporate & University portals accessible via footer
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative z-10 mt-12"
            >
                <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}
