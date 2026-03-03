'use client'

import { useState } from 'react'
import Editor from '@monaco-editor/react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
    Play,
    Save,
    Terminal,
    Settings,
    Cpu,
    Layers,
    ChevronRight,
    Code2,
    Share2,
    Bug
} from 'lucide-react'

export default function IDEPage() {
    const [code, setCode] = useState('// Welcome to the Bluelearnerhub Cloud IDE\n\nfunction salute() {\n  console.log("Saluting the new Midnight & Mint design!");\n}\n\nsalute();')
    const [output, setOutput] = useState('Output will appear here after execution...')
    const [language, setLanguage] = useState('javascript')

    const handleRun = () => {
        setOutput('Running code...\n> Saluting the new Midnight & Mint design!\n\nExecution finished in 42ms.')
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* IDE Toolbar */}
            <header className="flex items-center justify-between bg-card/50 backdrop-blur-xl border border-border/50 p-3 rounded-[24px] shadow-lg shadow-black/5">
                <div className="flex items-center gap-4 px-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Code2 className="h-5 w-5" />
                        </div>
                        <span className="font-black font-heading tracking-tight">Cloud IDE</span>
                    </div>
                    <div className="h-6 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Language:</span>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-transparent text-sm font-bold text-primary focus:outline-none cursor-pointer"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="typescript">TypeScript</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-2 pr-2">
                    <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                        <Save className="h-4 w-4" /> Save
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-xl gap-2 font-bold text-muted-foreground hover:text-primary transition-colors">
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                    <div className="h-6 w-px bg-border/50 mx-2" />
                    <Button
                        onClick={handleRun}
                        className="bg-primary text-white h-10 px-6 rounded-xl font-black gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20 transition-all"
                    >
                        <Play className="h-4 w-4 fill-current" /> Run Code
                    </Button>
                </div>
            </header>

            {/* Main IDE Workspace */}
            <div className="flex-1 flex gap-4 min-h-0">
                {/* Editor Container */}
                <div className="flex-1 rounded-[32px] border border-border/50 bg-[#051922] overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent z-10" />
                    <Editor
                        height="100%"
                        defaultLanguage={language}
                        defaultValue={code}
                        theme="vs-dark"
                        onChange={(val) => setCode(val || '')}
                        options={{
                            fontSize: 16,
                            fontFamily: 'var(--font-jetbrains-mono)',
                            minimap: { enabled: false },
                            padding: { top: 24, bottom: 24 },
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            lineNumbers: 'on',
                            renderLineHighlight: 'all',
                        }}
                    />
                </div>

                {/* Console / Info Sidebar */}
                <div className="w-96 flex flex-col gap-4">
                    {/* Terminal Area */}
                    <div className="flex-1 rounded-[32px] border border-border/50 bg-card p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-border/30 pb-4">
                            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Terminal className="h-4 w-4 text-primary" /> System Console
                            </h4>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-md hover:bg-muted/50">
                                <Bug className="h-3 w-3" />
                            </Button>
                        </div>
                        <div className="flex-1 font-mono text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed overflow-y-auto custom-scrollbar">
                            {output}
                        </div>
                    </div>

                    {/* AI Recommendations / Snippets */}
                    <div className="h-64 rounded-[32px] bg-primary/5 border border-primary/20 p-6 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="relative z-10 flex flex-col gap-3">
                            <h4 className="text-sm font-black font-heading text-primary flex items-center gap-2">
                                <Cpu className="h-4 w-4" /> Smart Suggestions
                            </h4>
                            <div className="space-y-2">
                                {['Optimize for-loop', 'Add JSDoc comments', 'Implement Error Boundary'].map((s, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl bg-background/50 border border-primary/10 text-xs font-bold hover:border-primary/50 hover:bg-primary/5 transition-all">
                                        {s} <ChevronRight className="h-3 w-3 text-primary opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                    </div>
                </div>
            </div>
        </div>
    )
}
