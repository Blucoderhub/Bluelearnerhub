'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
    User,
    Briefcase,
    Users,
    GraduationCap,
    UserCheck,
    Building2,
    ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    },
    {
        id: 'FACULTY',
        title: 'Faculty',
        description: 'Manage courses, students, and academic tracks.',
        icon: Users,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        hoverColor: 'hover:border-emerald-500/50',
        bgGradient: 'from-emerald-500/10 to-transparent',
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
    },
    {
        id: 'HR',
        title: 'HR',
        description: 'Search candidates, recruit talent, and manage hiring.',
        icon: User,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/20',
        hoverColor: 'hover:border-cyan-500/50',
        bgGradient: 'from-cyan-500/10 to-transparent',
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
    }
];

export default function SelectRolePage() {
    const router = useRouter();

    const handleRoleSelect = (roleId: string) => {
        // In a real app, you'd call an API to update the user's role
        console.log(`Role selected: ${roleId}`);

        // Redirect to the appropriate dashboard group
        const pathMap: Record<string, string> = {
            STUDENT: '/student/dashboard',
            CANDIDATE: '/candidate/dashboard',
            FACULTY: '/faculty/dashboard',
            INSTITUTION: '/institution/dashboard',
            CORPORATE: '/corporate/dashboard',
            HR: '/hr/dashboard',
            ADMIN: '/admin/dashboard',
        };

        router.push(pathMap[roleId] || '/');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Welcome to BLUELEARNERHUB
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
                        Select your professional path to begin your specialized journey.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, index) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                            <Card
                                className={`group cursor-pointer bg-slate-900/50 border ${role.borderColor} ${role.hoverColor} transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] h-full overflow-hidden`}
                                onClick={() => handleRoleSelect(role.id)}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${role.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <CardHeader className="relative z-10">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-slate-800 border ${role.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                                        <role.icon className={`w-6 h-6 ${role.color}`} />
                                    </div>
                                    <CardTitle className="text-2xl group-hover:text-blue-400 transition-colors duration-300">
                                        {role.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="relative z-10">
                                    <CardDescription className="text-gray-400 text-base leading-relaxed">
                                        {role.description}
                                    </CardDescription>
                                    <Button
                                        className={`mt-6 w-full bg-transparent border ${role.borderColor} group-hover:bg-blue-600 group-hover:border-blue-500 text-white transition-all duration-300`}
                                    >
                                        Select Role
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
