'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    ShieldCheck,
    GraduationCap,
    Briefcase,
    Users,
    UserCircle,
    School,
    ArrowRight,
    UserCheck,
    Building2,
    Lock,
    UserPlus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const roles = [
    {
        id: 'STUDENT',
        title: 'Student',
        description: 'Access courses, labs, and track your learning progress.',
        icon: GraduationCap,
        color: 'text-blue-400',
        borderColor: 'border-blue-500/20',
        hoverColor: 'hover:border-blue-500/50',
        bgGradient: 'from-blue-500/10 to-transparent',
        loginHref: '/login/student',
        signupHref: '/select-role',
    },
    {
        id: 'CANDIDATE',
        title: 'Candidate',
        description: 'Showcase your skills, join hackathons, and get hired.',
        icon: UserCheck,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/20',
        hoverColor: 'hover:border-purple-500/50',
        bgGradient: 'from-purple-500/10 to-transparent',
        loginHref: '/login/candidate',
        signupHref: '/select-role',
    },
    {
        id: 'FACULTY',
        title: 'Mentor',
        description: 'Guided learning, student management, and academic tracks.',
        icon: Users,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        hoverColor: 'hover:border-emerald-500/50',
        bgGradient: 'from-emerald-500/10 to-transparent',
        loginHref: '/login/mentor',
        signupHref: '/select-role',
    },
    {
        id: 'INSTITUTION',
        title: 'Institution',
        description: 'Monitor overall performance and manage institutional data.',
        icon: Building2,
        color: 'text-orange-400',
        borderColor: 'border-orange-500/20',
        hoverColor: 'hover:border-orange-500/50',
        bgGradient: 'from-orange-500/10 to-transparent',
        loginHref: '/login/university',
        signupHref: '/select-role',
    },
    {
        id: 'CORPORATE',
        title: 'Corporate',
        description: 'Host hackathons, view talent analytics, and judge projects.',
        icon: Briefcase,
        color: 'text-pink-400',
        borderColor: 'border-pink-500/20',
        hoverColor: 'hover:border-pink-500/50',
        bgGradient: 'from-pink-500/10 to-transparent',
        loginHref: '/login/corporate',
        signupHref: '/select-role',
    },
    {
        id: 'HR',
        title: 'HR',
        description: 'Search candidates, recruit talent, and manage hiring.',
        icon: UserCircle,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/20',
        hoverColor: 'hover:border-cyan-500/50',
        bgGradient: 'from-cyan-500/10 to-transparent',
        loginHref: '/login/hr',
        signupHref: '/select-role',
    },
    {
        id: 'ADMIN',
        title: 'Admin',
        description: 'Full system management and monitoring capabilities.',
        icon: ShieldCheck,
        color: 'text-red-400',
        borderColor: 'border-red-500/20',
        hoverColor: 'hover:border-red-500/50',
        bgGradient: 'from-red-500/10 to-transparent',
        loginHref: '/login/admin',
        signupHref: '/select-role',
    }
];

export default function GetStartedPage() {
    return (
        <div className="min-h-screen bg-[#020617] text-white py-16 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-purple-400">
                        Join the Ecosystem
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Select your specialized portal to continue your journey.
                    </p>
                </motion.div>

                <Tabs defaultValue="login" className="w-full">
                    <div className="flex justify-center mb-12">
                        <TabsList className="bg-slate-900/50 border border-slate-800 p-1.5 h-14 rounded-2xl">
                            <TabsTrigger
                                value="login"
                                className="px-8 flex items-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold"
                            >
                                <Lock className="w-4 h-4" />
                                Log In
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="px-8 flex items-center gap-2 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold"
                            >
                                <UserPlus className="w-4 h-4" />
                                Create Account
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="login" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.map((role, index) => (
                                <RoleCard key={role.id} role={role} index={index} type="login" />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="signup" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.map((role, index) => (
                                <RoleCard key={role.id} role={role} index={index} type="signup" />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function RoleCard({ role, index, type }: { role: any, index: number, type: 'login' | 'signup' }) {
    const href = type === 'login' ? role.loginHref : role.signupHref;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
            <Link href={href}>
                <Card
                    className={`group cursor-pointer bg-slate-900/40 border ${role.borderColor} ${role.hoverColor} transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] h-full overflow-hidden relative shadow-2xl rounded-[2rem]`}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <CardHeader className="relative z-10 p-8 pb-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-800/50 border ${role.borderColor} group-hover:scale-110 group-hover:bg-primary transition-all duration-500`}>
                            <role.icon className={`w-7 h-7 ${role.color} group-hover:text-white transition-colors duration-500`} />
                        </div>
                        <CardTitle className="text-2xl font-black group-hover:text-primary transition-colors duration-500">
                            {role.title}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 p-8 pt-4">
                        <CardDescription className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
                            {role.description}
                        </CardDescription>

                        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-primary/70 group-hover:text-primary transition-colors">
                            <span>{type === 'login' ? 'Access Portal' : 'Select Path'}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    );
}
