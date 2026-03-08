'use client';

import React from 'react';
import { TutorialMasteryLayout } from '@/components/tutorials/TutorialMasteryLayout';
import CodePlayground from '@/components/tutorials/CodePlayground';

const lessons = [
  { id: '1', title: 'Introduction to Python', completed: true, active: true },
  { id: '2', title: 'Python Syntax & Variables', completed: false },
  { id: '3', title: 'Data Types', completed: false },
  { id: '4', title: 'Control Flow', completed: false },
  { id: '5', title: 'Functions', completed: false },
];

export default function LessonPage() {
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

      <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 my-8">
        <h3 className="text-emerald-500 mt-0">🚀 Mastery Tip</h3>
        <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-0">
          Try changing the text inside the <code>print()</code> function in the playground on the right! 
          Hit "Run" to see your code come to life instantly.
        </p>
      </div>

    </TutorialMasteryLayout>
  );
}
