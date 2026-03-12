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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      {/* Top Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex flex-col items-center gap-4 relative z-10"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
            <GraduationCap size={28} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-foreground uppercase">Bluelearnerhub</span>
        </div>
        <PoweredByBadge />
      </motion.div>

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[500px] bg-card/30 backdrop-blur-xl rounded-[2.5rem] border border-border/50 shadow-2xl p-8 md:p-12 relative z-10"
      >
        {children}
      </motion.div>

      {/* Bottom links */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center relative z-10"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          Need help? <a href="/help" className="text-primary hover:underline">Support Center</a>
        </p>
      </motion.div>
    </div>
  );
};
