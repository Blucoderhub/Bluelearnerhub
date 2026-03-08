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
    color: 'text-blue-500',
    tutorials: [
      { id: 't1', title: 'Python for AI Mastery', lessons: 24, level: 'Advanced', progress: 45, icon: Zap },
      { id: 't2', title: 'Machine Learning Fundamentals', lessons: 18, level: 'Intermediate', progress: 10, icon: Star },
      { id: 't3', title: 'Mechatronics Systems', lessons: 32, level: 'Expert', progress: 0, icon: Settings },
    ]
  },
  {
    category: 'Architecture & Civil',
    icon: Building2,
    color: 'text-emerald-500',
    tutorials: [
      { id: 't4', title: 'Structural Engineering Basics', lessons: 15, level: 'Beginner', progress: 80, icon: BookOpen },
      { id: 't5', title: 'Modern Urban Planning', lessons: 20, level: 'Intermediate', progress: 0, icon: Building2 },
    ]
  },
  {
    category: 'Business & Management',
    icon: Briefcase,
    color: 'text-orange-500',
    tutorials: [
      { id: 't6', title: 'Corporate Strategy 101', lessons: 12, level: 'Intermediate', progress: 5, icon: Briefcase },
      { id: 't7', title: 'Financial Modeling', lessons: 28, level: 'Expert', progress: 0, icon: Star },
    ]
  }
];

export default function TutorialsLibrary() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-20">
      {/* Search Header */}
      <div className="space-y-8 text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
          LIBRARY_OF <span className="text-emerald-500 ai-glow">MASTERY</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium">
          Access the world's most comprehensive educational resources across all domains. From Mechanical Engineering to Corporate Finance.
        </p>
        
        <div className="relative group max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
          <Input 
            placeholder="Search thousands of tutorials..." 
            className="h-20 pl-16 pr-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-lg shadow-2xl shadow-slate-200/50 dark:shadow-none focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all font-medium"
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
            <div className="flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800/50 pb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg ${track.color}`}>
                  <track.icon size={24} />
                </div>
                <h2 className="text-2xl font-black italic tracking-tight text-slate-900 dark:text-white uppercase">{track.category}</h2>
              </div>
              <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">
                Explore All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {track.tutorials.map((tutorial) => (
                <Link key={tutorial.id} href={`/tutorials/domain/${tutorial.id}/lesson-1`}>
                  <motion.div 
                    whileHover={{ y: -6 }}
                    className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                        <tutorial.icon size={28} />
                      </div>
                      <Badge variant="outline" className="border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-lg">
                        {tutorial.level}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white leading-tight mb-4 group-hover:text-emerald-500 transition-colors">
                      {tutorial.title}
                    </h3>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                          <span>{tutorial.lessons} Lessons</span>
                          <span className="text-emerald-500">{tutorial.progress}% Complete</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                            style={{ width: `${tutorial.progress}%` }} 
                          />
                       </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                       Continue Learning <ChevronRight size={14} />
                    </div>

                    <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="p-16 rounded-[4rem] bg-slate-950 text-center space-y-8 relative overflow-hidden border border-emerald-500/20">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
         <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-4xl font-black italic tracking-tighter text-white">READY_FOR_CERTIFICATION?</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              Complete any track to earn industry-recognized credentials verified on the blockchain.
            </p>
         </div>
         <Button className="h-16 px-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black italic tracking-tighter text-xl rounded-[2rem] shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all">
            GET_CERTIFIED_NOW
         </Button>
      </div>
    </div>
  );
}
