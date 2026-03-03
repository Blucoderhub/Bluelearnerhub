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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md space-y-8">
        {icon && <div className="flex justify-center text-primary">{icon}</div>}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
