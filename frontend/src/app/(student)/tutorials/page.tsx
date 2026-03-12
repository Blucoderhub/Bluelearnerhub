'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ChevronRight, 
  Zap, 
  Star,
  Cpu,
  Settings,
  Building2,
  Briefcase
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const tutorialTracks = [
  {
    category: 'Engineering & Technology',
    icon: Cpu,
    color: 'text-primary/80',
    tutorials: [
      { id: 't1', title: 'Python for AI Mastery', lessons: 24, level: 'Advanced', progress: 45, icon: Zap },
      { id: 't2', title: 'Machine Learning Fundamentals', lessons: 18, level: 'Intermediate', progress: 10, icon: Star },
      { id: 't3', title: 'Mechatronics Systems', lessons: 32, level: 'Expert', progress: 0, icon: Settings },
    ]
  },
  {
    category: 'Architecture & Civil',
    icon: Building2,
    color: 'text-foreground/80',
    tutorials: [
      { id: 't4', title: 'Structural Engineering Basics', lessons: 15, level: 'Beginner', progress: 80, icon: BookOpen },
      { id: 't5', title: 'Modern Urban Planning', lessons: 20, level: 'Intermediate', progress: 0, icon: Building2 },
    ]
  },
  {
    category: 'Business & Management',
    icon: Briefcase,
    color: 'text-foreground/80',
    tutorials: [
      { id: 't6', title: 'Corporate Strategy 101', lessons: 12, level: 'Intermediate', progress: 5, icon: Briefcase },
      { id: 't7', title: 'Financial Modeling', lessons: 28, level: 'Expert', progress: 0, icon: Star },
    ]
  }
];

export default function TutorialsLibrary() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20 relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-44 right-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>
      {/* Search Header */}
      <div className="space-y-8 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
          LIBRARY_OF <span className="text-foreground/80 ai-glow">MASTERY</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Access the world's most comprehensive educational resources across all domains. From Mechanical Engineering to Corporate Finance.
        </p>
        
        <div className="relative group max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground/80 group-focus-within:text-foreground/80 transition-colors" />
          <Input 
            placeholder="Search thousands of tutorials..." 
            className="h-20 pl-16 pr-8 rounded-[2.5rem] border-2 border-border dark:border-border bg-white dark:bg-card text-lg shadow-2xl shadow-slate-200/50 dark:shadow-none focus-visible:ring-primary/50 focus-visible:border-primary transition-all font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-20">
        {tutorialTracks.map((track, i) => (
          <motion.section 
            key={track.category}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b-2 border-border dark:border-border/50 pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white dark:bg-card border border-slate-200 dark:border-border shadow-lg ${track.color}`}>
                  <track.icon size={24} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight text-slate-900 dark:text-white uppercase">{track.category}</h2>
              </div>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-foreground/90 hover:text-foreground">
                Explore All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {track.tutorials.map((tutorial) => (
                <Link key={tutorial.id} href={`/tutorials/domain/${tutorial.id}/lesson-1`}>
                  <motion.div 
                    whileHover={{ y: -6 }}
                    className="p-8 rounded-[2.5rem] bg-white/95 dark:bg-card border border-slate-200 dark:border-border shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/80/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-secondary dark:bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <tutorial.icon size={28} />
                      </div>
                      <Badge variant="outline" className="border-slate-200 text-muted-foreground font-black uppercase text-[10px] tracking-widest rounded-lg">
                        {tutorial.level}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-foreground/80 transition-colors">
                      {tutorial.title}
                    </h3>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                          <span>{tutorial.lessons} Lessons</span>
                          <span className="text-foreground/80">{tutorial.progress}% Complete</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 dark:bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.45)]" 
                            style={{ width: `${tutorial.progress}%` }} 
                          />
                       </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">
                       Continue Learning <ChevronRight size={14} />
                    </div>

                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="p-16 rounded-[4rem] bg-background text-center space-y-8 relative overflow-hidden border border-border shadow-[0_20px_80px_rgba(2,6,23,0.45)]">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
         <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-4xl font-black italic tracking-tighter text-white">READY_FOR_CERTIFICATION?</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Complete any track to earn industry-recognized credentials verified on the blockchain.
            </p>
         </div>
         <Button className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-black italic tracking-tighter text-xl rounded-[2rem] shadow-2xl shadow-primary/15 active:scale-95 transition-all">
            GET_CERTIFIED_NOW
         </Button>
      </div>
    </div>
  );
}
