'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';

interface StudentLoginFormProps {
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export const StudentLoginForm: React.FC<StudentLoginFormProps> = ({ onSubmit }) => {
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
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Log in</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">to Bluelearnerhub Academy</p>
      </div>

      {/* Social Logins (Mocked for style) */}
      <div className="grid grid-cols-1 gap-4">
        <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>
        <Button variant="outline" className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex gap-3">
          <Github className="w-5 h-5" />
          Continue with GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-black tracking-widest">OR</span>
        </div>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Email address</label>
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-emerald-500 ring-offset-emerald-500"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Password</label>
            <a href="#" className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Forgot?</a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 focus:ring-emerald-500"
            required
          />
        </div>
        
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account? <a href="/signup" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};
