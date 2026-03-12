'use client'

import React from 'react'
import CodeEditor from '@/components/ide/CodeEditor'
import {
    Trophy,
    Lightbulb,
    MessageSquare,
    ChevronRight,
    BookOpen,
    Code2
} from 'lucide-react'

export default function IDEPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-6">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-widest uppercase">
                        <Code2 className="w-4 h-4" />
                        Specialized Practice
                    </div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        Elite Coding Sandbox
                        <span className="px-2 py-0.5 text-[10px] bg-primary/10 text-foreground/80 rounded-md border border-border">
                            v1.0 Beta
                        </span>
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium">
                        HackerRank-level environment for algorithm mastery and system design practice.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-border text-foreground/80">
                        <Trophy className="w-4 h-4" />
                        <span className="text-xs font-bold">+500 XP Available</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Problem Description Panel (Mocked) */}
                <div className="w-[380px] flex flex-col gap-4 overflow-y-auto pr-2 scrollbar-hide hidden xl:flex">
                    <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-1 rounded-md bg-primary/10 text-foreground/80 text-[10px] font-bold uppercase tracking-wider">Easy</span>
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                Algorithm
                            </span>
                        </div>
                        <h3 className="text-lg font-bold tracking-tight">Two Sum Optimization</h3>
                        <div className="space-y-3 text-[13.5px] text-muted-foreground leading-relaxed">
                            <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>
                            <p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p>
                            <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2">
                                <p className="font-bold text-foreground text-xs uppercase tracking-wider">Example 1:</p>
                                <code className="block text-[12px] opacity-80 leading-normal">
                                    Input: nums = [2,7,11,15], target = 9 <br />
                                    Output: [0,1] <br />
                                    Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                        <h4 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                            <Lightbulb className="w-4 h-4 text-foreground/80" />
                            Pro Tips
                        </h4>
                        <ul className="space-y-2.5">
                            {[
                                'Use a Hash Map for O(n) time complexity.',
                                'Check for edge cases like empty arrays.',
                                'The sandbox supports real-time stdout/stderr capture.'
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-2 text-[12.5px] text-muted-foreground leading-relaxed">
                                    <ChevronRight className="w-3 h-3 text-primary mt-1 shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-muted/50 border border-border text-xs font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all uppercase tracking-widest group">
                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Discuss with Mentors
                    </button>
                </div>

                {/* Right: Actual Editor */}
                <div className="flex-1 min-w-0">
                    <CodeEditor />
                </div>
            </div>
        </div>
    )
}
