'use client'

import React, { useState } from 'react'
import CodeEditor from '@/components/ide/CodeEditor'
import {
  Trophy,
  Lightbulb,
  MessageSquare,
  ChevronRight,
  BookOpen,
  Code2,
  Play,
  RotateCcw,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ThumbsUp,
  ChevronDown,
  Terminal,
  Star,
  ListFilter,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'

const PROBLEM = {
  id: 1,
  title: 'Two Sum',
  difficulty: 'Easy',
  acceptance: '49.1%',
  likes: 52400,
  submissions: 98200,
  tags: ['Array', 'Hash Table'],
  description: `Given an array of integers <code class="font-mono bg-muted/50 px-1 rounded text-primary">nums</code> and an integer <code class="font-mono bg-muted/50 px-1 rounded text-primary">target</code>, return <em>indices of the two numbers such that they add up to</em> <code class="font-mono bg-muted/50 px-1 rounded text-primary">target</code>.`,
  note: 'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
    },
  ],
  constraints: [
    '2 ≤ nums.length ≤ 10⁴',
    '-10⁹ ≤ nums[i] ≤ 10⁹',
    '-10⁹ ≤ target ≤ 10⁹',
    'Only one valid answer exists.',
  ],
  hints: [
    'A really brute force way would be to search for all possible pairs of numbers but that would be O(n²).',
    'Try using a hash map to reduce the lookup time from O(n) to O(1).',
    'For each number, check if its complement (target - num) already exists in the map.',
  ],
}

const TEST_CASES = [
  { id: 1, input: 'nums = [2,7,11,15]\ntarget = 9', expected: '[0,1]', status: 'pass' as const },
  { id: 2, input: 'nums = [3,2,4]\ntarget = 6', expected: '[1,2]', status: 'pass' as const },
  { id: 3, input: 'nums = [3,3]\ntarget = 6', expected: '[0,1]', status: 'pending' as const },
]

const PROBLEM_LIST = [
  { id: 1, title: 'Two Sum', difficulty: 'Easy', status: 'active' },
  { id: 2, title: 'Valid Parentheses', difficulty: 'Easy', status: 'solved' },
  { id: 3, title: 'Merge Two Sorted Lists', difficulty: 'Easy', status: 'unsolved' },
  { id: 4, title: 'Maximum Subarray', difficulty: 'Medium', status: 'unsolved' },
  { id: 5, title: 'Binary Tree Level Order', difficulty: 'Medium', status: 'unsolved' },
  { id: 6, title: 'LRU Cache', difficulty: 'Hard', status: 'unsolved' },
]

const diffColors: Record<string, string> = {
  Easy: 'text-emerald-400',
  Medium: 'text-amber-400',
  Hard: 'text-red-400',
}

const statusIcon = (status: string) => {
  if (status === 'solved') return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
  if (status === 'active')
    return <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-primary" />
  return <div className="h-3.5 w-3.5 rounded-full border border-border" />
}

type PanelTab = 'description' | 'hints' | 'discussion'
type OutputTab = 'testcases' | 'output'

export default function CodingPracticePage() {
  const [leftPanel, setLeftPanel] = useState<PanelTab>('description')
  const [outputTab, setOutputTab] = useState<OutputTab>('testcases')
  const [activeCase, setActiveCase] = useState(0)
  const [running, setRunning] = useState(false)
  const [runResult, setRunResult] = useState<null | 'pass' | 'fail'>(null)
  const [showProblems, setShowProblems] = useState(false)

  const handleRun = () => {
    setRunning(true)
    setOutputTab('output')
    setTimeout(() => {
      setRunning(false)
      setRunResult('pass')
    }, 1800)
  }

  const handleSubmit = () => {
    setRunning(true)
    setTimeout(() => {
      setRunning(false)
      setRunResult('pass')
    }, 2000)
  }

  return (
    <div className="-mx-4 flex h-[calc(100vh-120px)] flex-col overflow-hidden sm:-mx-6 lg:-mx-8">
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 py-2 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Problem selector */}
          <button
            onClick={() => setShowProblems(!showProblems)}
            className="flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-primary"
          >
            <Code2 className="h-4 w-4 text-primary" />
            {PROBLEM.title}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${showProblems ? 'rotate-180' : ''}`}
            />
          </button>
          <div className="hidden items-center gap-2 sm:flex">
            <Badge
              className={`border-0 bg-emerald-500/10 text-[10px] font-bold ${diffColors[PROBLEM.difficulty]}`}
            >
              {PROBLEM.difficulty}
            </Badge>
            <Badge variant="outline" className="border-border text-[10px] text-muted-foreground">
              {PROBLEM.acceptance} acceptance
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold">+50 XP</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRun}
            disabled={running}
            className="h-8 gap-1.5 rounded-lg border-border px-4 text-xs font-bold hover:bg-muted/50"
          >
            <Play className="h-3.5 w-3.5" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={running}
            className="h-8 gap-1.5 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-600/90"
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Problem dropdown */}
      <AnimatePresence>
        {showProblems && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-4 top-[112px] z-50 w-72 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          >
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="Search problems..."
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {PROBLEM_LIST.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setShowProblems(false)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40"
                >
                  {statusIcon(p.status)}
                  <span
                    className={`flex-1 text-left text-sm ${p.status === 'active' ? 'font-bold text-primary' : 'text-foreground/80'}`}
                  >
                    {p.title}
                  </span>
                  <span className={`text-[10px] font-bold ${diffColors[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: left | center | right */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* LEFT PANEL — Problem */}
        <div className="hidden w-[380px] shrink-0 flex-col border-r border-border bg-card/30 xl:flex">
          {/* Panel tabs */}
          <div className="flex border-b border-border">
            {(['description', 'hints', 'discussion'] as PanelTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setLeftPanel(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
                  leftPanel === tab
                    ? 'border-b-2 border-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {leftPanel === 'description' && (
              <>
                <div className="space-y-3">
                  <p
                    className="text-sm leading-relaxed text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: PROBLEM.description }}
                  />
                  <p className="text-sm leading-relaxed text-muted-foreground">{PROBLEM.note}</p>
                </div>

                <div className="space-y-3">
                  {PROBLEM.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="space-y-2 rounded-xl border border-border bg-background/50 p-4"
                    >
                      <p className="text-xs font-bold text-white">Example {i + 1}</p>
                      <div className="space-y-1 font-mono text-xs">
                        <p>
                          <span className="text-muted-foreground">Input: </span>
                          <span className="text-foreground/90">{ex.input}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Output: </span>
                          <span className="text-foreground/90">{ex.output}</span>
                        </p>
                        {ex.explanation && (
                          <p>
                            <span className="text-muted-foreground">Explanation: </span>
                            <span className="text-foreground/70">{ex.explanation}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Constraints
                  </p>
                  <ul className="space-y-1">
                    {PROBLEM.constraints.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <code className="font-mono">{c}</code>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
                  <button className="flex items-center gap-1.5 transition-colors hover:text-white">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    {(PROBLEM.likes / 1000).toFixed(1)}K
                  </button>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {(PROBLEM.submissions / 1000).toFixed(1)}K submissions
                  </span>
                </div>
              </>
            )}

            {leftPanel === 'hints' && (
              <div className="space-y-3">
                {PROBLEM.hints.map((hint, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border bg-background/50 p-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground/90">
                      <span className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        Hint {i + 1}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{hint}</p>
                  </details>
                ))}
              </div>
            )}

            {leftPanel === 'discussion' && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-muted-foreground">
                <MessageSquare className="h-10 w-10 opacity-30" />
                <p className="text-sm">
                  Join the discussion to ask questions and share approaches.
                </p>
                <Button size="sm" variant="outline" className="rounded-xl border-border text-xs">
                  Open Discussion
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Code Editor */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Language selector */}
          <div className="flex shrink-0 items-center gap-3 border-b border-border bg-card/20 px-4 py-2">
            <select className="cursor-pointer border-none bg-transparent text-xs font-semibold text-foreground/80 focus:outline-none">
              <option>Python 3</option>
              <option>JavaScript</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>C++</option>
              <option>Go</option>
            </select>
            <div className="h-3 w-px bg-border" />
            <span className="text-xs text-muted-foreground">Auto-save enabled</span>
          </div>

          <div className="min-h-0 flex-1">
            <CodeEditor />
          </div>
        </div>

        {/* RIGHT PANEL — Test cases + Output */}
        <div className="hidden w-[320px] shrink-0 flex-col border-l border-border bg-card/30 lg:flex">
          {/* Output tabs */}
          <div className="flex border-b border-border">
            {(['testcases', 'output'] as OutputTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setOutputTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
                  outputTab === tab
                    ? 'border-b-2 border-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'testcases' ? 'Test Cases' : 'Output'}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {outputTab === 'testcases' && (
              <>
                <div className="flex gap-2">
                  {TEST_CASES.map((tc, i) => (
                    <button
                      key={tc.id}
                      onClick={() => setActiveCase(i)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                        activeCase === i
                          ? 'border-primary/30 bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:text-white'
                      }`}
                    >
                      Case {i + 1}
                    </button>
                  ))}
                  <button className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-all hover:border-border/80 hover:text-white">
                    + Add
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Input
                    </label>
                    <textarea
                      defaultValue={TEST_CASES[activeCase].input}
                      className="h-20 w-full resize-none rounded-xl border border-border bg-background/60 p-3 font-mono text-xs text-foreground/90 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Expected Output
                    </label>
                    <div className="w-full rounded-xl border border-border bg-background/60 p-3 font-mono text-xs text-foreground/90">
                      {TEST_CASES[activeCase].expected}
                    </div>
                  </div>
                </div>
              </>
            )}

            {outputTab === 'output' && (
              <div className="space-y-4">
                {running ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-12">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs text-muted-foreground">Running test cases...</p>
                  </div>
                ) : runResult === 'pass' ? (
                  <>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm font-bold text-emerald-400">All Tests Passed!</p>
                        <p className="text-xs text-muted-foreground">3 / 3 test cases accepted</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Runtime', value: '52 ms', beat: '87%' },
                        { label: 'Memory', value: '17.2 MB', beat: '72%' },
                      ].map(({ label, value, beat }) => (
                        <div
                          key={label}
                          className="rounded-xl border border-border bg-background/50 p-3"
                        >
                          <div className="mb-1.5 flex justify-between text-xs">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-bold text-white">{value}</span>
                          </div>
                          <Progress value={parseInt(beat)} className="h-1 bg-muted/40" />
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Beats {beat} of solutions
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                      <p className="text-xs font-bold text-amber-400">+50 XP Earned!</p>
                      <p className="text-[10px] text-muted-foreground">
                        Streak protected · Great work!
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <Terminal className="h-8 w-8 text-muted-foreground opacity-40" />
                    <p className="text-xs text-muted-foreground">
                      Run your code to see the output here.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
