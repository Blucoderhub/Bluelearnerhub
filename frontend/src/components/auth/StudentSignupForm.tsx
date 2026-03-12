'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Github, Mail, User, ShieldCheck } from 'lucide-react';

interface StudentSignupFormProps {
  onSubmit: (userData: any) => Promise<void>;
}

export const StudentSignupForm: React.FC<StudentSignupFormProps> = ({ onSubmit }) => {
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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">Create Account</h2>
        <p className="text-muted-foreground font-medium tracking-tight">Join the Elite Engineering Ecosystem</p>
      </div>

      {/* Social Register */}
      <div className="grid grid-cols-1 gap-4">
        <Button variant="outline" className="h-14 rounded-2xl border-border/50 bg-card/50 font-black uppercase tracking-widest text-[11px] hover:bg-primary/5 hover:border-primary/30 transition-all duration-300 flex gap-3">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Register with Google
        </Button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-[10px] font-black tracking-[0.3em] uppercase">
          <span className="bg-background px-4 text-muted-foreground">OR</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Full Name</label>
          <Input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/30 font-medium"
            required
          />
        </div>
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
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Password</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl border-border/50 bg-muted/30 focus:bg-background focus:ring-primary/20 transition-all duration-300 placeholder:text-muted-foreground/30 font-medium"
            required
          />
        </div>
        
        <div className="flex items-center gap-2 ml-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-medium text-muted-foreground">By signing up, you agree to our Terms and Conditions.</span>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-15 bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all duration-300 shimmer h-14"
        >
          {loading ? 'Creating Account...' : 'Get Started'}
        </Button>
      </form>

      <div className="text-center pt-4">
        <p className="text-xs text-muted-foreground font-medium">
          Already have an account? <a href="/login" className="text-primary font-black uppercase tracking-widest ml-1 hover:underline">Log In</a>
        </p>
      </div>
    </div>
  );
};
