// src/app/(student)/tutorials/[pathId]/[courseId]/[lessonId]/page.tsx

'use client'

import { useState } from 'react'
import CodePlayground from '@/components/tutorials/CodePlayground'
import NextPrevButtons from '@/components/tutorials/NextPrevButtons'

export default function LessonPage() {
  const [showCode, setShowCode] = useState(true)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Panel - Content */}
      <div className={`${showCode ? 'w-1/2' : 'w-full'} overflow-y-auto bg-white dark:bg-gray-900 p-8`}>
        <article className="prose dark:prose-invert max-w-none">
          <h1>Introduction to Python</h1>
          
          <p>
            Python is a high-level, interpreted programming language known for its
            simplicity and readability.
          </p>

          <h2>Your First Python Program</h2>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <code className="text-sm">
              print("Hello, World!")
            </code>
          </div>

          <button 
            onClick={() => setShowCode(!showCode)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showCode ? 'Hide' : 'Show'} Code Editor
          </button>

          {/* Lesson content continues... */}
        </article>

        {/* Navigation */}
        <NextPrevButtons 
          prevLesson="/tutorials/python/basics/variables"
          nextLesson="/tutorials/python/basics/data-types"
        />
      </div>

      {/* Right Panel - Live Code Editor (W3Schools Style) */}
      {showCode && (
        <div className="w-1/2 border-l border-gray-200 dark:border-gray-700">
          <CodePlayground
            initialCode='print("Hello, World!")'
            language="python"
          />
        </div>
      )}
    </div>
  )
}
