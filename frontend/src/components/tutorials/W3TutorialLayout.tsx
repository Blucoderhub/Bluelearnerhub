'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronLeft, ChevronRight, ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  completed: boolean;
  active?: boolean;
}

interface W3TutorialLayoutProps {
  children: React.ReactNode;
  sidebarTitle: string;
  lessons: Lesson[];
  progress: number;
  currentLessonTitle?: string;
  prevLesson?: string;
  nextLesson?: string;
}

export const W3TutorialLayout: React.FC<W3TutorialLayoutProps> = ({
  children,
  sidebarTitle,
  lessons,
  progress,
  currentLessonTitle,
  prevLesson,
  nextLesson
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-56 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      </div>
      {/* Premium Sticky Header */}
      <div className="sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <BookOpen className="text-primary-foreground w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-black tracking-tighter text-foreground m-0 leading-tight">
                {sidebarTitle} <span className="text-primary font-medium">Tutorial</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Mastery Path</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col gap-1.5 min-w-[140px]">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>Course Logic</span>
                    <span className="text-primary">{progress}%</span>
                </div>
                <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden border border-border/20 p-[1px]">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                {prevLesson && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="border-border/60 hover:bg-secondary/80 text-foreground rounded-lg"
                    >
                        <Link href={prevLesson}><ChevronLeft size={16} /></Link>
                    </Button>
                )}
                {nextLesson && (
                    <Button 
                        asChild
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg px-6 h-10 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                    >
                        <Link href={nextLesson} className="flex items-center gap-2">
                            Next Section <ArrowRight size={16} />
                        </Link>
                    </Button>
                )}
            </div>
        </div>
      </div>

      <div className="flex flex-1 relative min-h-0">
        {/* Elite Dark Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="w-[280px] bg-card border-r border-border/40 overflow-y-auto sticky top-[73px] h-[calc(100vh-73px)] hidden md:flex flex-col z-50 scrollbar-hide py-8"
            >
              <div className="px-6 mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Table of Logic</h2>
                  <div className="h-0.5 w-8 bg-primary/40 rounded-full mt-1.5" />
                </div>
              </div>
              
              <nav className="flex-1 px-3 space-y-1">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/tutorials/python/basics/${lesson.id}`}
                    className={cn(
                      "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative",
                      lesson.active 
                        ? "bg-primary/10 text-primary font-bold shadow-sm reflective-glaze translate-x-1" 
                        : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all shrink-0",
                        lesson.active ? "bg-primary scale-125 shadow-[0_0_8px_var(--primary)]" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                    )} />
                    <span className="text-sm font-heading tracking-tight truncate">{lesson.title}</span>
                    {lesson.completed && !lesson.active && (
                        <div className="ml-auto w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary/40 rounded-full" />
                        </div>
                    )}
                    {lesson.active && (
                        <motion.div 
                            layoutId="active-marker"
                            className="absolute left-0 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_var(--primary)]"
                        />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="px-6 mt-12 py-6 border-t border-border/30">
                 <div className="glass-card p-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">Pro Benefit</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">Master this domain to unlock <strong>Verified Badges</strong>.</p>
                 </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Mastery Content */}
        <main className="flex-1 overflow-y-auto bg-background/70 min-w-0">
          <div className="max-w-4xl mx-auto py-16 md:py-24 px-8 md:px-16 lg:px-24">
            
            <header className="mb-16">
                <div className="flex items-center gap-3 mb-6 opacity-60">
                    <span className="px-2 py-0.5 bg-secondary border border-border/50 text-foreground text-[10px] font-black rounded uppercase tracking-wider">
                        Domain: {sidebarTitle}
                    </span>
                    <ChevronRight size={12} className="text-muted-foreground" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                        Step {lessons.findIndex(l => l.active) + 1}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tighter text-foreground mb-8 leading-[1.05] text-gradient">
                    {currentLessonTitle}
                </h1>
                <div className="h-1.5 w-24 bg-primary rounded-full mb-12 shadow-[0_0_12px_rgba(59,130,246,0.35)]" />
            </header>
            
            <div className="prose prose-invert prose-blue max-w-none 
              prose-h2:text-4xl prose-h2:font-heading prose-h2:font-black prose-h2:tracking-tight prose-h2:mt-16 prose-h2:mb-8
              prose-h3:text-2xl prose-h3:font-heading prose-h3:font-bold prose-h3:text-foreground/90
              prose-p:text-xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:tracking-tight
              prose-li:text-lg prose-li:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-black
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:bg-secondary/30 prose-blockquote:p-6 prose-blockquote:rounded-xl prose-blockquote:italic
              prose-code:bg-secondary/80 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:text-primary prose-code:font-mono prose-code:before:content-none prose-code:after:content-none"
            >
              {children}
            </div>

            {/* Premium Section Navigation */}
            <div className="mt-24 pt-12 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-heading font-black tracking-tight text-foreground m-0">Engineering Next Steps</h3>
                    <p className="text-muted-foreground text-sm">Prepare your cognitive framework for the next challenge.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                    {prevLesson && (
                        <Button 
                            variant="outline"
                            asChild
                            size="lg"
                            className="flex-1 md:flex-none h-14 px-8 rounded-xl font-black text-foreground border-border/60 hover:bg-secondary/80 transition-all active:scale-95"
                        >
                            <Link href={prevLesson} className="flex items-center gap-2">
                                <ChevronLeft size={20} /> Back
                            </Link>
                        </Button>
                    )}
                    
                    {nextLesson && (
                        <Button 
                            asChild
                            size="lg"
                            className="flex-1 md:flex-none h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-black group transition-all shadow-xl shadow-primary/20 active:scale-95"
                        >
                            <Link href={nextLesson} className="flex items-center gap-3">
                                Advance <ArrowRight className="transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
          </div>
          
          <footer className="bg-card/50 border-t border-border/30 py-16 px-6 md:px-12 mt-24">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-black text-xs text-primary">BL</div>
                    <p className="text-sm font-heading font-bold text-muted-foreground tracking-tight">Mastery Platform <span className="opacity-40 ml-1">v2.0</span></p>
                </div>
                <div className="flex items-center gap-8">
                    <Link href="#" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Curriculum</Link>
                    <Link href="#" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Research</Link>
                    <Link href="#" className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
                </div>
            </div>
          </footer>
        </main>

        {/* Dynamic Mobile Sidebar Trigger */}
        <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-primary shadow-2xl text-primary-foreground z-[100] p-0 shadow-primary/40 hover:scale-110 active:scale-90 transition-all"
        >
            {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </Button>
      </div>
    </div>
  );
};
