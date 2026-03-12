"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    ShieldCheck,
    GraduationCap,
    Briefcase,
    Users,
    UserCircle,
    School,
    ArrowRight
} from "lucide-react";

const roles = [
    {
        id: "student",
        title: "Student",
        description: "Start your learning journey",
        icon: <GraduationCap size={32} />,
        color: "#3b82f6",
        href: "/auth/login/student",
    },
    {
        id: "candidate",
        title: "Candidate",
        description: "Find your dream job",
        icon: <UserCircle size={32} />,
        color: "#0ea5e9",
        href: "/auth/login/candidate",
    },
    {
        id: "corporate",
        title: "Corporate",
        description: "Hire and manage talent",
        icon: <Briefcase size={32} />,
        color: "#6366f1",
        href: "/auth/login/corporate",
    },
    {
        id: "hr",
        title: "HR Portal",
        description: "Optimize hiring pipelines",
        icon: <Users size={32} />,
        color: "#f59e0b",
        href: "/auth/login/hr",
    },
    {
        id: "university",
        title: "University",
        description: "Academic management",
        icon: <School size={32} />,
        color: "#8b5cf6",
        href: "/auth/login/university",
    },
    {
        id: "admin",
        title: "Admin",
        description: "System administration",
        icon: <ShieldCheck size={32} />,
        color: "#ef4444",
        href: "/auth/login/admin",
    },
];

export default function LoginPortal() {
    return (
        <div className="relative w-full py-12 px-6 overflow-hidden">
            {/* Background Decor */}
            <div className="liquid-bg-container overflow-hidden">
                <div className="liquid-blob w-[600px] h-[600px] -top-40 -left-40 opacity-10 bg-blue-500" />
                <div className="liquid-blob w-[500px] h-[500px] -bottom-20 -right-20 opacity-10 bg-purple-500" style={{ animationDelay: "-7s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-4xl text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                    Welcome to <span className="text-blue-600">Bluelearnerhub</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-zinc-400">
                    Please select your portal to continue
                </p>
            </motion.div>

            <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role, index) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={role.href} className="group">
                            <div className="h-full p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 relative overflow-hidden">
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: role.color, borderRadius: '50%' }}
                                />

                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: role.color }}
                                >
                                    {role.icon}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{role.title}</h3>
                                <p className="text-slate-500 dark:text-zinc-400 mb-6">{role.description}</p>

                                <div className="flex items-center text-sm font-bold group-hover:gap-2 transition-all" style={{ color: role.color }}>
                                    Enter Portal <ArrowRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <p className="relative z-10 mt-12 text-slate-500 dark:text-zinc-500 text-sm">
                Need help accessing your account? <a href="#" className="text-blue-600 font-semibold hover:underline">Contact Support</a>
            </p>
        </div>
    );
}
