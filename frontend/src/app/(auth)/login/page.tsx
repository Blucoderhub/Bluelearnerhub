"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StudentLoginForm } from "@/components/auth/StudentLoginForm";
import { GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPortal() {
    const { login, isAuthenticated } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/student/dashboard");
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (data: any) => {
        setError(null);
        try {
            await login(data.email, data.password);
            router.push("/student/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Failed to initialize secure session.");
        }
    };

    return (
        <div className="relative min-h-[90vh] w-full flex flex-col items-center justify-center py-12 px-4 overflow-hidden bg-background">
            {/* Premium Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[400px] sm:max-w-[380px] bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Refined Card Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 relative group">
                        <div className="absolute inset-0 rounded-2xl bg-primary animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
                        <GraduationCap className="w-8 h-8 text-primary-foreground relative z-10" />
                    </div>
                </div>

                <StudentLoginForm onSubmit={handleSubmit} error={error} />

                <p className="mt-8 text-center text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">
                    Don&apos;t have an account?{" "}
                    <Link href="/get-started" className="text-primary hover:text-primary/80 transition-colors font-bold">Sign up</Link>
                </p>
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
