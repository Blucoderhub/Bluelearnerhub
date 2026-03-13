'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Github, Mail, User, ShieldCheck } from 'lucide-react';

interface StudentSignupFormProps {
  onSubmit: (userData: any) => Promise<void>;
  error?: string | null;
}

export const StudentSignupForm: React.FC<StudentSignupFormProps> = ({ onSubmit, error }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono">Create Account</h2>
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

      {/* Social Register */}
      <div className="grid grid-cols-1 gap-3">
        <Button variant="outline" className="h-11 rounded-xl border-white/10 bg-white/[0.03] font-mono font-bold uppercase tracking-wider text-[10px] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 flex gap-2.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" className="opacity-50"/>
          </svg>
          Register with Google
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">User_Identity (Name)</label>
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-xl border-white/10 bg-black/40 focus:bg-black focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Terminal_ID (Email)</label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-xl border-white/10 bg-black/40 focus:bg-black focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Access_Code (Pass)</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-xl border-white/10 bg-black/40 focus:bg-black focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all duration-300 placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        
        <div className="flex items-center gap-2 py-1 ml-1">
            <ShieldCheck className="w-3 h-3 text-primary/60" />
            <span className="text-[8px] font-mono font-medium text-white/30 leading-tight">By initializing, you agree to System_Protocols.</span>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-11 bg-primary text-primary-foreground font-mono font-black uppercase tracking-widest text-[11px] rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] active:scale-[0.98] transition-all duration-300 shimmer"
        >
          {loading ? 'Initializing...' : 'Exec_Join'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wide">
          Known system user? <a href="/login" className="text-primary hover:text-primary/80 transition-colors ml-1">Auth_Login</a>
        </p>
      </div>
    </div>
  );
};
