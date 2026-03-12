'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface W3TryItProps {
  title?: string;
  code: string;
  language?: string;
  onTryIt?: () => void;
}

export const W3TryIt: React.FC<W3TryItProps> = ({
  title = "Interactive Example",
  code,
  language = "python",
  onTryIt
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-2xl shadow-primary/5 group"
    >
      <div className="px-8 py-5 border-b border-border/40 bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-lg font-heading font-black text-foreground m-0 tracking-tight">
                {title}
            </h3>
        </div>
        <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-amber-500/50" />
            <div className="w-3 h-3 rounded-full bg-blue-500/50" />
        </div>
      </div>
      
      <div className="p-8 bg-black/20 font-mono text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed relative flex flex-col gap-6">
        <div className="absolute top-4 right-6 pointer-events-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">{language}</span>
        </div>
        <code className="block">{code}</code>
      </div>

      <div className="px-8 py-6 bg-secondary/20 border-t border-border/10 flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            <span>Interactive Environment Ready</span>
        </div>
        <Button 
          onClick={onTryIt}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-3"
        >
          Try it Yourself <Play size={18} fill="currentColor" />
        </Button>
      </div>
    </motion.div>
  );
};
