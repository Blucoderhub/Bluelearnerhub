'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { PoweredByBadge } from '@/components/branding/Logo';

interface StudentLoginLayoutProps {
  children: React.ReactNode;
}

export const StudentLoginLayout: React.FC<StudentLoginLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-[#020617] p-6">
      {/* Top Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <GraduationCap size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Bluelearnerhub</span>
        </div>
        <PoweredByBadge />
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[450px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-10 md:p-12"
      >
        {children}
      </motion.div>

      {/* Bottom links */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Not a student? <a href="/login" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Switch role</a>
        </p>
      </motion.div>
    </div>
  );
};
