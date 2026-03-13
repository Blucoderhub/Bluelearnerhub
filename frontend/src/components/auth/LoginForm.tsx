'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, error }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-mono leading-tight"
        >
          <span className="font-bold uppercase tracking-widest">[AUTH_ERROR]:</span> {error}
        </motion.div>
      )}

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
          Need access? <a href="/get-started" className="text-primary hover:text-primary/80 transition-colors ml-1">Initialize_Account</a>
        </p>
      </div>
    </div>
  );
};
