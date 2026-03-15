'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CodePlayground from '@/components/tutorials/CodePlayground';
import { tutorialsAPI } from '@/lib/api-civilization';
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight, BookOpen,
  FileText, MessageSquare, Lightbulb, Menu, X, Play, Clock,
  BarChart3, Bookmark, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// ─── Fallback static lesson (used when API is unavailable) ───────────────────

const FALLBACK_LESSON_CONTENT = `
Control flow in Python allows you to make decisions and repeat actions based on conditions.
It's the backbone of any non-trivial program — without it, code would execute
line-by-line with no ability to branch or repeat.

## Conditional Statements

Python uses \`if\`, \`elif\`, and \`else\` for branching logic.
Unlike many other languages, Python uses indentation to define code blocks — no curly braces needed.

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

print(f"Your grade: {grade}")  # Output: Your grade: B
\`\`\`

## For Loops

\`for\` loops in Python iterate over any iterable — lists, strings, ranges, and more.

\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

for i in range(1, 6):
    print(f"Count: {i}")  # 1, 2, 3, 4, 5
\`\`\`

## While Loops

\`while\` loops continue executing as long as a condition is \`True\`.

\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1  # Important: always update the condition

# Output: 0, 1, 2, 3, 4
\`\`\`
`;

const FALLBACK_LESSONS = [
  { id: '1', title: 'Introduction to Python',      completed: true,  duration: '8 min',  type: 'article' },
  { id: '2', title: 'Variables & Data Types',       completed: true,  duration: '12 min', type: 'article' },
  { id: '3', title: 'Control Flow & Loops',         completed: false, duration: '15 min', type: 'article', active: true },
  { id: '4', title: 'Functions in Python',          completed: false, duration: '18 min', type: 'video'   },
  { id: '5', title: 'Lists & Tuples',               completed: false, duration: '14 min', type: 'article' },
  { id: '6', title: 'Dictionaries',                 completed: false, duration: '10 min', type: 'article' },
  { id: '7', title: 'File I/O',                     completed: false, duration: '16 min', type: 'article' },
  { id: '8', title: 'OOP Basics',                   completed: false, duration: '20 min', type: 'video'   },
  { id: '9', title: 'Modules & Packages',           completed: false, duration: '12 min', type: 'article' },
  { id: '10', title: 'Mini Project: Todo App',      completed: false, duration: '35 min', type: 'project' },
];

const STATIC_RESOURCES = [
  { title: 'Python Official Docs',     type: 'Link'     },
  { title: 'Control Flow Cheat Sheet', type: 'PDF'      },
  { title: 'Practice Problems',        type: 'Exercise' },
];

type SideTab = 'notes' | 'resources' | 'discussion';

const typeIcon = (type: string) => {
  if (type === 'video')   return <Play className="w-3 h-3" />;
  if (type === 'project') return <BarChart3 className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
};

// Render Markdown-ish content without a heavy dependency
function LessonContent({ content }: { content: string }) {
  // Split into paragraphs / code blocks for rendering
  const sections: { type: 'code' | 'heading2' | 'heading3' | 'paragraph'; value: string; lang?: string }[] = [];
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim() || 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      sections.push({ type: 'code', value: codeLines.join('\n'), lang });
    } else if (line.startsWith('## ')) {
      sections.push({ type: 'heading2', value: line.slice(3) });
    } else if (line.startsWith('### ')) {
      sections.push({ type: 'heading3', value: line.slice(4) });
    } else if (line.trim()) {
      // Inline code: replace `code` with styled span
      sections.push({ type: 'paragraph', value: line });
    }
    i++;
  }

  return (
    <div className="space-y-4">
      {sections.map((s, idx) => {
        if (s.type === 'heading2') {
          return <h2 key={idx} className="text-2xl font-black tracking-tight text-white mt-8 mb-3">{s.value}</h2>;
        }
        if (s.type === 'heading3') {
          return <h3 key={idx} className="text-xl font-bold text-white mt-6 mb-2">{s.value}</h3>;
        }
        if (s.type === 'code') {
          return (
            <pre key={idx} className="bg-card border border-border rounded-2xl overflow-x-auto p-5">
              <code className="text-sm font-mono text-foreground/90 leading-relaxed">{s.value}</code>
            </pre>
          );
        }
        // Render inline backtick code
        const parts = s.value.split(/`([^`]+)`/);
        return (
          <p key={idx} className="text-base leading-relaxed text-muted-foreground">
            {parts.map((part, pi) =>
              pi % 2 === 1
                ? <code key={pi} className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">{part}</code>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [sideTab, setSideTab]               = useState<SideTab>('notes');
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);
  const [adaptiveGuidance, setAdaptiveGuidance] = useState<string[]>([]);
  const [noteValue, setNoteValue]           = useState('');
  const [completing, setCompleting]         = useState(false);

  // ── API data ────────────────────────────────────────────────────────────
  const [tutorialTitle, setTutorialTitle]   = useState('');
  const [lessons, setLessons]               = useState(FALLBACK_LESSONS);
  const [content, setContent]               = useState('');
  const [starterCode, setStarterCode]       = useState('');
  const [loadingContent, setLoadingContent] = useState(true);

  const tutorialId = useMemo(() => {
    const raw = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : null;
  }, [params.courseId]);

  // Derive active lesson index from URL param (lesson-1 = index 0, etc.)
  const activeLessonIndex = useMemo(() => {
    const raw = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId ?? '1';
    const n = parseInt(raw.toString().replace(/\D/g, ''), 10);
    return Number.isFinite(n) && n > 0 ? n - 1 : 0;
  }, [params.lessonId]);

  // ── Fetch tutorial + sections ─────────────────────────────────────────
  useEffect(() => {
    if (!tutorialId) {
      setContent(FALLBACK_LESSON_CONTENT);
      setLoadingContent(false);
      return;
    }

    tutorialsAPI.get(String(tutorialId))
      .then((data: any) => {
        const tut = data?.tutorial ?? data;
        const sections: any[] = data?.sections ?? tut?.sections ?? [];

        if (tut?.title) setTutorialTitle(tut.title);

        if (sections.length > 0) {
          // Build lesson list from sections
          const built = sections.map((s: any, i: number) => ({
            id: String(i + 1),
            title: s.title ?? `Lesson ${i + 1}`,
            completed: s.completed ?? false,
            duration: s.estimatedMinutes ? `${s.estimatedMinutes} min` : '10 min',
            type: s.hasExercise ? 'project' : 'article',
            active: i === activeLessonIndex,
            dbId: s.id,
          }));
          setLessons(built);

          const activeSection = sections[activeLessonIndex] ?? sections[0];
          if (activeSection) {
            setContent(activeSection.content ?? FALLBACK_LESSON_CONTENT);
            setStarterCode(activeSection.starterCode ?? '');
          } else {
            setContent(FALLBACK_LESSON_CONTENT);
          }
        } else {
          setContent(FALLBACK_LESSON_CONTENT);
        }
      })
      .catch(() => {
        setContent(FALLBACK_LESSON_CONTENT);
      })
      .finally(() => setLoadingContent(false));
  }, [tutorialId, activeLessonIndex]);

  // ── Adaptive guidance ─────────────────────────────────────────────────
  useEffect(() => {
    if (!tutorialId) return;

    void tutorialsAPI.trackBehavior(tutorialId, 'lesson_opened', {
      lessonId: params.lessonId, pathId: params.pathId,
    }).catch(() => undefined);

    void tutorialsAPI.adaptiveGuidance(tutorialId)
      .then((data: any) => {
        const guidance = Array.isArray(data?.guidance)
          ? data.guidance.filter((g: unknown) => typeof g === 'string')
          : [];
        setAdaptiveGuidance(guidance.slice(0, 3));
      })
      .catch(() => setAdaptiveGuidance([]));
  }, [tutorialId, params.lessonId, params.pathId]);

  const activeLesson = lessons[activeLessonIndex] ?? lessons[0];
  const completedCount = lessons.filter(l => l.completed).length;
  const progress = Math.round((completedCount / lessons.length) * 100);

  const handleMarkComplete = async () => {
    if (lessonComplete) return;
    setCompleting(true);
    try {
      const sectionId = (activeLesson as any).dbId;
      if (tutorialId && sectionId) {
        await tutorialsAPI.complete(tutorialId, sectionId);
      }
      setLessonComplete(true);
      setLessons(prev =>
        prev.map((l, i) => i === activeLessonIndex ? { ...l, completed: true } : l)
      );
      toast.success('Lesson complete! +30 XP earned!');
    } catch {
      // Mark locally even if API fails
      setLessonComplete(true);
      toast.success('Lesson complete! +30 XP earned!');
    } finally {
      setCompleting(false);
    }
  };

  const navigateLesson = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' ? activeLessonIndex + 1 : activeLessonIndex - 1;
    if (newIndex < 0 || newIndex >= lessons.length) return;
    const pathId = Array.isArray(params.pathId) ? params.pathId[0] : params.pathId;
    const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
    router.push(`/tutorials/${pathId}/${courseId}/lesson-${newIndex + 1}`);
  };

  const playgroundCode = starterCode || 'score = 85\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "F"\n\nprint(f"Grade: {grade}")';

  return (
    <div className="flex h-[calc(100vh-64px)] -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden bg-background">

      {/* ─── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 288, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col border-r border-border bg-card/50 shrink-0 overflow-hidden"
          >
            <div className="p-5 border-b border-border space-y-3 shrink-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Course</p>
                  <h2 className="text-sm font-bold text-white leading-snug mt-0.5">
                    {tutorialTitle || 'Python Basics'}
                  </h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors p-1 rounded-lg hover:bg-muted/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Progress</span>
                  <span className="font-bold text-primary">{completedCount}/{lessons.length} · {progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-muted/40" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {lessons.map((lesson, i) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    const pathId = Array.isArray(params.pathId) ? params.pathId[0] : params.pathId;
                    const courseId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
                    router.push(`/tutorials/${pathId}/${courseId}/lesson-${i + 1}`);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                    i === activeLessonIndex
                      ? 'bg-primary text-white shadow-sm shadow-primary/20'
                      : 'hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <div className="shrink-0">
                    {lesson.completed ? (
                      <CheckCircle2 className={`w-4 h-4 ${i === activeLessonIndex ? 'text-white' : 'text-emerald-400'}`} />
                    ) : i === activeLessonIndex ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-border" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold leading-snug truncate ${i === activeLessonIndex ? 'text-white' : 'group-hover:text-foreground'}`}>
                      {lesson.title}
                    </p>
                    <div className={`flex items-center gap-1.5 mt-0.5 ${i === activeLessonIndex ? 'text-white/60' : 'text-muted-foreground/70'}`}>
                      {typeIcon(lesson.type)}
                      <span className="text-[10px]">{lesson.duration}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ─── CENTER CONTENT ───────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Content header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-5 bg-background/80 backdrop-blur-md shrink-0 z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-white">
                <Menu className="w-4 h-4" />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <span>{tutorialTitle || 'Python Basics'}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium">{activeLesson?.title ?? 'Lesson'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={playgroundOpen ? 'default' : 'outline'}
              onClick={() => setPlaygroundOpen(!playgroundOpen)}
              className={`h-8 px-3 rounded-xl text-xs font-bold gap-1.5 border-border ${playgroundOpen ? 'bg-primary text-white' : ''}`}
            >
              <Play className="w-3.5 h-3.5" />
              {playgroundOpen ? 'Close' : 'Try it'}
            </Button>
            <button
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`p-2 rounded-lg transition-colors text-muted-foreground hover:text-white hover:bg-muted/50 ${rightPanelOpen ? 'bg-muted/50 text-white' : ''}`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-white hover:bg-muted/50">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main content split */}
        <div className="flex-1 flex min-h-0">
          {/* Article content */}
          <div className={`overflow-y-auto ${playgroundOpen ? 'w-1/2' : 'flex-1'} transition-all duration-300`}>
            <div className="max-w-2xl mx-auto py-10 px-6 sm:px-10 pb-24">

              {/* Lesson header */}
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                    {tutorialTitle || 'Python Basics'}
                  </Badge>
                  <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                    <Clock className="w-2.5 h-2.5 mr-1" />
                    {activeLesson?.duration ?? '10 min'}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white">
                  {activeLesson?.title ?? 'Lesson'}
                </h1>
              </div>

              {/* Content */}
              {loadingContent ? (
                <div className="flex items-center justify-center py-20 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Loading lesson content...</span>
                </div>
              ) : (
                <>
                  <LessonContent content={content} />

                  {adaptiveGuidance.length > 0 && (
                    <div className="my-8 p-5 rounded-2xl bg-blue-500/8 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-blue-400" />
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Adaptive Guidance</p>
                      </div>
                      <ul className="space-y-1.5">
                        {adaptiveGuidance.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {/* Lesson footer */}
              <div className="mt-12 pt-8 border-t border-border space-y-4">
                {!lessonComplete ? (
                  <button
                    onClick={handleMarkComplete}
                    disabled={completing || loadingContent}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-sm hover:bg-emerald-500/20 transition-colors disabled:opacity-60"
                  >
                    {completing
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <CheckCircle2 className="w-5 h-5" />
                    }
                    {completing ? 'Saving...' : 'Mark as Complete (+30 XP)'}
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    Lesson completed · +30 XP earned!
                  </div>
                )}

                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigateLesson('prev')}
                    disabled={activeLessonIndex === 0}
                    className="border-border rounded-2xl h-12 px-6 gap-2 font-bold flex-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateLesson('next')}
                    disabled={activeLessonIndex === lessons.length - 1}
                    className="bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 px-8 gap-2 font-bold flex-1"
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Code playground */}
          <AnimatePresence>
            {playgroundOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="border-l border-border bg-[#0a0f1e] flex flex-col"
              >
                <div className="h-11 border-b border-white/5 flex items-center justify-between px-5 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Live Playground</span>
                  </div>
                  <button onClick={() => setPlaygroundOpen(false)} className="text-white/30 hover:text-white/70 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodePlayground initialCode={playgroundCode} language="python" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ─── RIGHT PANEL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {rightPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col border-l border-border bg-card/50 shrink-0 overflow-hidden"
          >
            <div className="flex border-b border-border shrink-0">
              {(['notes', 'resources', 'discussion'] as SideTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSideTab(tab)}
                  className={`flex-1 py-3 text-[11px] font-bold capitalize transition-colors ${
                    sideTab === tab ? 'text-white border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {sideTab === 'notes' && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Your private notes for this lesson.</p>
                  <textarea
                    value={noteValue}
                    onChange={(e) => setNoteValue(e.target.value)}
                    placeholder="Write your notes here..."
                    className="w-full h-48 bg-background/60 border border-border rounded-xl p-3 text-sm text-foreground/90 resize-none focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/50"
                  />
                  <Button size="sm" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold h-8">
                    Save Note
                  </Button>
                </div>
              )}

              {sideTab === 'resources' && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">Supplementary materials for this lesson.</p>
                  {STATIC_RESOURCES.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors cursor-pointer group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground/90 group-hover:text-white transition-colors truncate">{r.title}</p>
                        <p className="text-[10px] text-muted-foreground">{r.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sideTab === 'discussion' && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <MessageSquare className="w-10 h-10 text-muted-foreground opacity-30" />
                  <p className="text-xs text-muted-foreground">Ask questions, share insights, and learn from others.</p>
                  <Button size="sm" variant="outline" className="border-border rounded-xl text-xs">
                    Open Discussion
                  </Button>
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
