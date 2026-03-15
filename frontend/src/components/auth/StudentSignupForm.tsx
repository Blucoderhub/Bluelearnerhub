'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
        <Button variant="outline" className="h-11 border-white/20 bg-black text-white font-mono font-bold uppercase tracking-wider text-[10px] hover:bg-white hover:text-black transition-none flex gap-2.5 justify-center">
          Register with Google
        </Button>
      </div>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
          <span className="bg-black px-3 text-white/20">OR</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">User_Identity</label>
          <Input
            type="text"
            placeholder="ID_DESC"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Terminal_ID</label>
          <Input
            type="email"
            placeholder="SYSTEM_ID@"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] ml-1">Access_Code</label>
          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 border-white/20 bg-black focus:border-white transition-none placeholder:text-white/10 text-xs font-mono"
            required
          />
        </div>
        
        <div className="py-2 ml-1">
          <span className="text-[10px] font-mono font-medium text-white/20 uppercase tracking-widest">Initialization_Agreement_Active</span>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-12 bg-white text-black font-mono font-black uppercase tracking-widest text-[12px] hover:bg-black hover:text-white border-2 border-white transition-none"
        >
          {loading ? 'Initializing...' : 'Exec_Join'}
        </Button>
      </form>

      <div className="text-center pt-2">
        <p className="text-[10px] text-white/30 font-bold uppercase tracking-wide">
          Known system user? <Link href="/login" className="text-primary hover:text-primary/80 transition-colors ml-1">Auth_Login</Link>
        </p>
      </div>
    </div>
  );
};
