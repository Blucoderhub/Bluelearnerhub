'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Star } from 'lucide-react';

interface DomainSkill {
  name: string;
  rank: number;
  total: number;
  percentile: number;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  color: string;
}

const domainSkills: DomainSkill[] = [
  { name: 'Computer Science', rank: 42, total: 15400, percentile: 99.7, icon: Zap, color: 'text-foreground/80' },
  { name: 'Mechanical', rank: 890, total: 8200, percentile: 89.1, icon: Star, color: 'text-foreground/80' },
  { name: 'Data Science', rank: 120, total: 12000, percentile: 99.0, icon: TrendingUp, color: 'text-primary/80' },
];

export const SkillProficiency = () => {
  return (
    <div className="p-6 rounded-[2.5rem] bg-background border border-border shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-[var(--xp-gold)]" />
        <h3 className="text-lg font-black font-heading text-white italic tracking-tight">GLOBAL_STANDING</h3>
      </div>

      <div className="space-y-6">
        {domainSkills.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${skill.color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white/40 uppercase tracking-widest">{skill.name}</p>
                    <p className="text-sm font-bold text-white tracking-tight">Rank #{skill.rank} of {skill.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-foreground/70">{skill.percentile}%</p>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-tight">Percentile</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.percentile}%` }}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-primary to-primary/80 shadow-[0_0_10px_rgba(59,130,246,0.35)]"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-white uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
        VIEW_ALL_DOMAINS
      </button>
    </div>
  );
};
