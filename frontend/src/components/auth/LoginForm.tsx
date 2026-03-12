'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Email address</label>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/30 font-medium"
          required
        />
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center ml-2">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Password</label>
          <a href="#" className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline">Forgot?</a>
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/30 font-medium"
          required
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-14 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 shimmer"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </Button>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground font-medium">
          Need access? <a href="/get-started" className="text-primary font-black uppercase tracking-widest ml-1 hover:underline">Register</a>
        </p>
      </div>
    </form>
  );
};
