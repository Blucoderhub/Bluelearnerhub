'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { TutorialMasteryLayout } from '@/components/tutorials/TutorialMasteryLayout';
import CodePlayground from '@/components/tutorials/CodePlayground';
import { tutorialsAPI } from '@/lib/api-civilization';

const lessons = [
  { id: '1', title: 'Introduction to Python', completed: true, active: true },
  { id: '2', title: 'Python Syntax & Variables', completed: false },
  { id: '3', title: 'Data Types', completed: false },
  { id: '4', title: 'Control Flow', completed: false },
  { id: '5', title: 'Functions', completed: false },
];

export default function LessonPage() {
  const params = useParams();
  const [adaptiveGuidance, setAdaptiveGuidance] = useState<string[]>([]);

  const tutorialId = useMemo(() => {
    const rawId = Array.isArray(params.courseId) ? params.courseId[0] : params.courseId;
    const parsed = Number(rawId);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [params.courseId]);

  useEffect(() => {
    if (!tutorialId) return;

    void tutorialsAPI.trackBehavior(tutorialId, 'lesson_opened', {
      lessonId: params.lessonId,
      pathId: params.pathId,
    }).catch(() => undefined);

    void tutorialsAPI.adaptiveGuidance(tutorialId)
      .then((data) => {
        const guidance = Array.isArray(data?.guidance) ? data.guidance.filter((item: unknown) => typeof item === 'string') : [];
        setAdaptiveGuidance(guidance.slice(0, 3));
      })
      .catch(() => setAdaptiveGuidance([]));
  }, [tutorialId, params.lessonId, params.pathId]);

  return (
    <TutorialMasteryLayout
      sidebarTitle="Python Basics"
      lessons={lessons}
      progress={20}
      playground={
        <div className="h-full">
          <CodePlayground 
            initialCode='print("Hello, World!")'
            language="python"
          />
        </div>
      }
    >
      <h1>Introduction to Python</h1>
      
      <p>
        Python is a high-level, interpreted programming language known for its
        simplicity and readability. It was created by Guido van Rossum and first released in 1991.
      </p>

      <blockquote>
        "Python is an experiment in how much freedom programmers need. Too much freedom and nobody can read another's code; too little and expressiveness is endangered." 
        <cite>— Guido van Rossum</cite>
      </blockquote>

      <h2>Why Python?</h2>
      <p>
        Python's design philosophy emphasizes code readability with its use of significant indentation. Its language constructs and object-oriented approach aim to help programmers write clear, logical code for small and large-scale projects.
      </p>

      <ul>
        <li><strong>Readability</strong>: Python's syntax is nearly as easy to read as English.</li>
        <li><strong>Versatile</strong>: Used in Web Dev, AI, Data Science, and Engineering simulations.</li>
        <li><strong>Large Community</strong>: Millions of developers and massive library support (PyPI).</li>
      </ul>

      <div className="bg-secondary dark:bg-primary/10 p-6 rounded-3xl border border-border my-8">
        <h3 className="text-foreground/80 mt-0">🚀 Mastery Tip</h3>
        <p className="text-sm text-foreground dark:text-foreground/70 mb-0">
          Try changing the text inside the <code>print()</code> function in the playground on the right! 
          Hit "Run" to see your code come to life instantly.
        </p>
      </div>

      {adaptiveGuidance.length > 0 && (
        <div className="my-8 rounded-3xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-500/30 dark:bg-blue-500/10">
          <h3 className="mt-0 text-blue-700 dark:text-blue-300">Adaptive Guidance</h3>
          <ul className="mb-0 list-disc pl-6 text-sm text-blue-800 dark:text-blue-200">
            {adaptiveGuidance.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

    </TutorialMasteryLayout>
  );
}
