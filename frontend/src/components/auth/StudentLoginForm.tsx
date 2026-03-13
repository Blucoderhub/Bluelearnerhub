'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

interface StudentLoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  error?: string | null;
}

export const StudentLoginForm: React.FC<StudentLoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Log in</h2>
        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">Elite Engineering Ecosystem</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono leading-tight"
        >
          <span className="font-bold uppercase tracking-widest">[AUTH_ERROR]:</span> {error}
        </motion.div>
      )}

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-2.5">
        <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.03] font-mono font-bold uppercase tracking-wider text-[9px] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex gap-2 justify-center px-2">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="opacity-50"/>
          </svg>
          Google
        </Button>
        <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.03] font-mono font-bold uppercase tracking-wider text-[9px] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex gap-2 justify-center px-2">
          <Github className="w-3.5 h-3.5 text-white/70" />
          GitHub
        </Button>
        <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.03] font-mono font-bold uppercase tracking-wider text-[9px] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex gap-2 justify-center px-2">
          <svg className="w-3.5 h-3.5 fill-current text-white/80" viewBox="0 0 384 512">
            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-53.8-24.3-89.8-23.6-47.5 1-89.9 27.6-114.6 70.3-49.7 85.8-12.7 213.6 35.1 283.1 23.3 33.7 51 71.4 87.5 70 34.4-1.4 47.5-22.3 89.1-22.3 41.9 0 53.8 22.3 89.8 21.6 36.7-.7 61-34.1 84.3-67.9 26.9-39.1 37.9-77 38.3-79l-.8-.4c-1.3-.7-74.2-28.5-74.5-113.8zM249.1 82c16.2-19.4 27.1-46.3 24.1-73.1-23.2 1-51.3 15.5-67.9 34.9-14.9 17.2-27.9 44.2-24.4 70.3 26.1 2 52.1-12.7 68.2-32.1z"/>
          </svg>
          Apple
        </Button>
        <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.03] font-mono font-bold uppercase tracking-wider text-[9px] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex gap-2 justify-center px-2">
          <Mail className="w-3.5 h-3.5 text-white/70" />
          Email
        </Button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center text-[9px] font-mono font-bold tracking-[0.2em] uppercase">
          <span className="bg-transparent px-3 text-white/20">OR</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Terminal_ID (Email)</label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 rounded-xl border-white/10 bg-black/40 focus:bg-black focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em]">Access_Code (Pass)</label>
            <a href="#" className="text-[9px] text-primary/60 font-mono font-bold uppercase hover:text-primary transition-colors">Forgot?</a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl border-white/10 bg-black/40 focus:bg-black focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-primary text-primary-foreground font-mono font-black uppercase tracking-widest text-[11px] rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] active:scale-[0.98] transition-all duration-300 shimmer"
          >
            {loading ? 'Authenticating...' : 'Exec_Login'}
          </Button>
        </div>
      </form>

      <div className="text-center pt-2">
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wide">
          New system user? <a href="/signup" className="text-primary hover:text-primary/80 transition-colors ml-1">Initialize_Account</a>
        </p>
      </div>
    </div>
  );
};
