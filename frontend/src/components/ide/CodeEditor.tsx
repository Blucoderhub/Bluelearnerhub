'use client'

import React, { useState, useRef } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import {
    Play,
    Settings,
    Terminal,
    RotateCcw,
    ChevronDown,
    Monitor,
    Cpu,
    Shield,
    Zap
} from 'lucide-react'
import axios from 'axios'

const LANGUAGES = [
    { id: 'python', name: 'Python 3', version: '3.10.0', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', version: '18.15.0', icon: 'JS' },
    { id: 'java', name: 'Java', version: '15.0.2', icon: '☕' },
    { id: 'cpp', name: 'C++', version: '10.2.0', icon: 'C++' },
]

export default function CodeEditor() {
    const [language, setLanguage] = useState(LANGUAGES[0])
    const [code, setCode] = useState('')
    const [output, setOutput] = useState('')
    const [isRunning, setIsRunning] = useState(false)
    const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')
    const editorRef = useRef<any>(null)

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
        editor.focus()
    }

    const runCode = async () => {
        setIsRunning(true)
        setOutput('Running...\n')

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: language.id === 'cpp' ? 'cpp' : language.id,
                version: language.version,
                files: [
                    {
                        content: editorRef.current?.getValue() || '',
                    },
                ],
            })

            const result = response.data.run
            if (result.stderr) {
                setOutput(`Error:\n${result.stderr}`)
            } else {
                setOutput(result.output || 'Program executed successfully with no output.')
            }
        } catch (err) {
            setOutput('Failed to execute code. Please check your internet connection and try again.')
        } finally {
            setIsRunning(false)
        }
    }

    const resetCode = () => {
        const confirm = window.confirm('Are you sure you want to reset the editor?')
        if (confirm) setCode('')
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Utility Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#252526] border-b border-white/5">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-white/80">
                        <span className="text-lg">{language.icon}</span>
                        {language.name}
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 mx-2" />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium tracking-wider uppercase">
                            <Cpu className="w-3.5 h-3.5" />
                            <span>Compiler v{language.version}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-white/40 font-medium tracking-wider uppercase">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Sandbox Secure</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={resetCode}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-all"
                        title="Reset Editor"
                    >
                        <RotateCcw className="w-4.5 h-4.5" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-all">
                        <Settings className="w-4.5 h-4.5" />
                    </button>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm transition-all ${isRunning
                                ? 'bg-primary/15 text-foreground/80 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/70 hover:shadow-lg hover:shadow-primary/15 active:scale-95'
                            }`}
                    >
                        {isRunning ? (
                            <Zap className="w-4 h-4 animate-pulse" />
                        ) : (
                            <Play className="w-4 h-4 fill-current" />
                        )}
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>
            </div>

            {/* Main IDE Area */}
            <div className="flex-1 flex min-h-0">
                <div className="flex-1 min-w-0">
                    <Editor
                        height="100%"
                        language={language.id}
                        theme={theme}
                        value={code}
                        onMount={handleEditorDidMount}
                        options={{
                            fontSize: 15,
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                            minimap: { enabled: false },
                            padding: { top: 20 },
                            smoothScrolling: true,
                            cursorBlinking: 'smooth',
                            cursorSmoothCaretAnimation: 'on',
                            lineHeight: 1.6,
                            scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden'
                            },
                            bracketPairColorization: { enabled: true }
                        }}
                    />
                </div>

                {/* Output Console */}
                <div className="w-1/3 border-l border-white/5 bg-[#1a1a1a] flex flex-col">
                    <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 text-xs font-bold text-white/40 tracking-[0.2em] uppercase">
                        <Terminal className="w-4 h-4" />
                        Console Output
                    </div>
                    <div className="flex-1 p-6 font-mono text-[13px] text-foreground/70/90 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                        {output || 'Run your code to see the result...'}
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-2 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                        <Monitor className="w-3 h-3" />
                        <span>Ready to debug</span>
                    </div>
                </div>
                <span className="text-[10px] text-white/10 font-medium">Built by Bluecoderhub for Elite Engineers</span>
            </div>
        </div>
    )
}
