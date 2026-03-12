'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  active?: boolean;
}

interface TutorialMasteryLayoutProps {
  children: React.ReactNode;
  playground?: React.ReactNode;
  sidebarTitle: string;
  lessons: Lesson[];
  progress: number;
}

export const TutorialMasteryLayout: React.FC<TutorialMasteryLayoutProps> = ({ 
  children, 
  playground, 
  sidebarTitle, 
  lessons,
  progress 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(true);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#020617] overflow-hidden">
      {/* 1. Lesson Sidebar (HackerRank/W3Schools hybrid) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0"
          >
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-sm font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">Course Content</h2>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{sidebarTitle}</h3>
              <div className="mt-4 space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                  <span>Overall Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-amber-500/10" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-1">
                {lessons.map((lesson) => (
                  <button 
                    key={lesson.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all group ${
                      lesson.active 
                        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {lesson.completed ? (
                      <CheckCircle2 size={16} className={lesson.active ? 'text-white' : 'text-amber-500'} />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-2 ${lesson.active ? 'border-white' : 'border-slate-300 dark:border-slate-700'}`} />
                    )}
                    <span className="text-sm font-bold tracking-tight">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 2. Main content area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-slate-950 relative">
        {/* Sub-header */}
        <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={20} />
            </Button>
            <div className="h-4 w-px bg-slate-200 dark:border-slate-800" />
            <span className="text-xs font-bold text-slate-500">Current: {lessons.find(l => l.active)?.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl font-bold text-xs gap-2">
              <Share2 size={14} /> Share
            </Button>
            <Button 
              onClick={() => setIsPlaygroundOpen(!isPlaygroundOpen)}
              className={`rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 h-9 px-4 transition-all ${
                isPlaygroundOpen 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200' 
                : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <Play size={14} className={isPlaygroundOpen ? '' : 'fill-current'} />
              {isPlaygroundOpen ? 'Close Playground' : 'Try it Yourself'}
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto py-12 px-8">
              <motion.article 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose dark:prose-invert prose-blue max-w-none 
                  prose-headings:font-black prose-headings:tracking-tighter
                  prose-h1:text-4xl prose-h1:mb-8
                  prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300
                  prose-strong:text-slate-900 dark:prose-strong:text-white"
              >
                {children}
              </motion.article>

              {/* Lesson Nav Footer */}
              <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold gap-2">
                  <ChevronLeft size={18} /> Previous
                </Button>
                <Button className="h-12 px-10 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black italic tracking-tighter gap-2 shadow-lg shadow-amber-500/20">
                  Next Chapter <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          </div>

          {/* 3. Interactive Playground (HackerRank/W3Schools blend) */}
          <AnimatePresence>
            {isPlaygroundOpen && playground && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="border-l border-slate-200 dark:border-slate-800 bg-[#0f172a] flex flex-col"
              >
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#0f172a]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Live Playground</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white rounded-lg">
                        <Maximize2 size={14} />
                     </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={() => setIsPlaygroundOpen(false)}
                       className="h-8 w-8 text-white/40 hover:text-white rounded-lg"
                      >
                        <Minimize2 size={14} />
                     </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  {playground}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
