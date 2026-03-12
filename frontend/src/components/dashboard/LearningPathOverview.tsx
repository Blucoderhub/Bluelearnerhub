'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Lesson {
  id: string;
  title: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface Path {
  id: string;
  title: string;
  domain: string;
  progress: number;
  totalLessons: number;
  currentLesson: string;
  lessons: Lesson[];
}

const activePaths: Path[] = [
  {
    id: '1',
    title: 'Advanced Machine Learning',
    domain: 'Computer Science',
    progress: 35,
    totalLessons: 12,
    currentLesson: 'Transformer Architecture',
    lessons: [
      { id: 'l1', title: 'Introduction to Transformers', isCompleted: true, isUnlocked: true },
      { id: 'l2', title: 'Self-Attention Mechanisms', isCompleted: true, isUnlocked: true },
      { id: 'l3', title: 'Transformer Architecture', isCompleted: false, isUnlocked: true },
      { id: 'l4', title: 'BERT vs GPT', isCompleted: false, isUnlocked: false },
    ]
  },
  {
    id: '2',
    title: 'Mechanical Statics & Dynamics',
    domain: 'Mechanical',
    progress: 15,
    totalLessons: 20,
    currentLesson: 'Vector Equilibrium',
    lessons: [
      { id: 'm1', title: 'Forces in 2D', isCompleted: true, isUnlocked: true },
      { id: 'm2', title: 'Vector Equilibrium', isCompleted: false, isUnlocked: true },
      { id: 'm3', title: 'Friction Analysis', isCompleted: false, isUnlocked: false },
    ]
  }
];

export const LearningPathOverview = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black font-heading flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          Active Mastery Tracks
        </h3>
        <Button variant="ghost" size="sm" className="text-xs font-bold text-amber-600 hover:text-amber-700 p-0 h-auto">
          View All Paths
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activePaths.map((path) => (
          <motion.div 
            key={path.id}
            whileHover={{ y: -2 }}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {path.domain} Mastery
                </span>
                <h4 className="font-black text-lg text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                  {path.title}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Play size={20} className="fill-current" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 italic">Progress: {path.progress}%</span>
                  <span className="text-slate-900 dark:text-white">{path.totalLessons} Lessons Total</span>
                </div>
                <Progress value={path.progress} className="h-2 bg-amber-500/10" />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Next Lesson</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{path.currentLesson}</span>
                  <Button size="sm" className="h-8 rounded-xl bg-amber-500 hover:bg-amber-600 font-black text-[10px] uppercase italic tracking-widest">
                    Resume
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
