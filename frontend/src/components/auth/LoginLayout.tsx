'use client';

import React from 'react';

interface LoginLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  role?: string;
  accentColor?: string;
  icon?: React.ReactNode;
}

export const LoginLayout: React.FC<LoginLayoutProps> = ({ children, title, subtitle, icon }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          {icon && (
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                {icon}
              </div>
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tighter text-foreground uppercase">{title}</h1>
          {subtitle && <p className="mt-3 text-muted-foreground text-sm font-medium tracking-tight uppercase tracking-widest">{subtitle}</p>}
        </div>
        
        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-300">
          {children}
        </div>

        <div className="mt-12 text-center">
          <a href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};
