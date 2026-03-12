'use client'

import React, { useState } from 'react'
import {
    Calculator,
    FileJson,
    Hash,
    Binary,
    Ruler,
    Cpu,
    Zap,
    Clipboard,
    Check,
    RotateCcw
} from 'lucide-react'

const DOMAIN_TOOLS = [
    {
        id: 'cs',
        name: 'Computer Science',
        icon: <Cpu className="w-5 h-5" />,
        tools: [
            { id: 'json', name: 'JSON Formatter', icon: <FileJson className="w-4 h-4" /> },
            { id: 'base64', name: 'Base64 Tool', icon: <Hash className="w-4 h-4" /> },
            { id: 'binary', name: 'Binary Converter', icon: <Binary className="w-4 h-4" /> },
        ]
    },
    {
        id: 'mech',
        name: 'Mechanical',
        icon: <Zap className="w-5 h-5" />,
        tools: [
            { id: 'unit', name: 'Unit Converter', icon: <Ruler className="w-4 h-4" /> },
            { id: 'stress', name: 'Stress Calculator', icon: <Calculator className="w-4 h-4" /> },
        ]
    },
]

export default function DomainTools() {
    const [activeTab, setActiveTab] = useState('json')
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(output)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatJson = () => {
        try {
            const parsed = JSON.parse(input)
            setOutput(JSON.stringify(parsed, null, 2))
        } catch (err) {
            setOutput('Invalid JSON Input')
        }
    }

    const convertBase64 = (mode: 'encode' | 'decode') => {
        try {
            if (mode === 'encode') setOutput(btoa(input))
            else setOutput(atob(input))
        } catch (err) {
            setOutput('Base64 Conversion Error')
        }
    }

    return (
        <div className="flex flex-col h-full gap-8">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white/90">Domain Engineering Tools</h2>
                <p className="text-sm text-white/40 font-medium tracking-wide">High-precision utilities for active engineering workflows.</p>
            </div>

            <div className="flex gap-10 h-full min-h-0">
                {/* Sidebar Navigation */}
                <div className="w-64 space-y-6">
                    {DOMAIN_TOOLS.map((domain) => (
                        <div key={domain.id} className="space-y-2">
                            <div className="flex items-center gap-2.5 px-3 py-1 text-[11px] font-black text-white/30 uppercase tracking-[0.2em]">
                                {domain.icon}
                                {domain.name}
                            </div>
                            <div className="space-y-1">
                                {domain.tools.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => { setActiveTab(tool.id); setInput(''); setOutput(''); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tool.id
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                                : 'text-white/50 hover:bg-white/5 hover:text-white/80'
                                            }`}
                                    >
                                        {tool.icon}
                                        {tool.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Workspace */}
                <div className="flex-1 flex flex-col bg-[#111111] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-white/[0.02]">
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{activeTab.replace('-', ' ')} Workspace</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => { setInput(''); setOutput(''); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/80 transition-all">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                {copied ? <Check className="w-3 h-3 text-foreground/70" /> : <Clipboard className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-[1px] bg-white/5 min-h-0">
                        <div className="bg-[#111111] p-8 flex flex-col gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Input Area</span>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={`Paste your ${activeTab} here...`}
                                className="flex-1 bg-transparent text-white/80 font-mono text-sm leading-relaxed outline-none resize-none placeholder:text-white/10"
                            />
                            <div className="flex justify-end pt-4">
                                {activeTab === 'json' && (
                                    <button onClick={formatJson} className="px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all">Format JSON</button>
                                )}
                                {activeTab === 'base64' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => convertBase64('encode')} className="px-6 py-2.5 bg-white/5 text-white border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-white/10 transition-all">Encode</button>
                                        <button onClick={() => convertBase64('decode')} className="px-6 py-2.5 bg-primary/10 text-foreground/80 border border-border rounded-xl text-[11px] font-black uppercase tracking-wider hover:bg-primary/15 transition-all">Decode</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-[#0c0c0c] p-8 flex flex-col gap-4">
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Output Preview</span>
                            <div className="flex-1 font-mono text-sm text-primary/80 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                                {output || <span className="text-white/5 italic">Result will appear here...</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
