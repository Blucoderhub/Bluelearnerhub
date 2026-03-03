'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LoginFormProps {
  role: 'student' | 'hr' | 'corporate' | 'admin' | 'candidate' | 'university';
  accentColor: string;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ role, accentColor, onSubmit }) => {
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
        style={{ backgroundColor: accentColor }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};
