'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileCode,
    Files,
    Terminal,
    Play,
    Save,
    Bug,
    Settings,
    Layout,
    ChevronRight,
    ChevronDown,
    Search,
    Cpu,
    Zap,
    Bot
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function SoftwareLabPage() {
    const [activeFile, setActiveFile] = useState('main.py');
    const [terminalOutput, setTerminalOutput] = useState(['$ python main.py', 'Initializing environment...', 'Syncing with BlueCloud...', 'Ready.']);

    const files = [
        { name: 'main.py', icon: FileCode, color: 'text-blue-400' },
        { name: 'utils.py', icon: FileCode, color: 'text-blue-400' },
        { name: 'requirements.txt', icon: Files, color: 'text-slate-400' },
    ];

    return (
        <div className="h-[90vh] flex flex-col gap-4 -mt-6">
            {/* IDE Header */}
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-black italic tracking-widest text-white uppercase">SOFTWARE_LAB_v2.0</h2>
                    </div>
                    <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-black italic uppercase">
                        Connected: BlueNode-Mumbai-01
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 px-3">
                        <Save className="w-3.5 h-3.5 mr-2" /> Save
                    </Button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white font-bold h-8 px-4 rounded-lg">
                        <Play className="w-3.5 h-3.5 mr-2 fill-current" /> RUN_PROJECT
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/20 bg-primary/5 text-primary font-bold h-8 px-4 rounded-lg">
                        <Bug className="w-3.5 h-3.5 mr-2" /> AI_DEBUG
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* File Explorer Sidebar */}
                <div className="w-64 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            PROJECT_EXPLORER <Search className="w-3 h-3" />
                        </h3>
                    </div>
                    <div className="flex-1 p-2 space-y-1">
                        <div className="flex items-center p-2 text-xs font-bold text-slate-400 gap-2 cursor-default">
                            <ChevronDown className="w-3 h-3" /> <Layout className="w-3.5 h-3.5 mr-1" /> SRC
                        </div>
                        {files.map(file => (
                            <div
                                key={file.name}
                                onClick={() => setActiveFile(file.name)}
                                className={`flex items-center gap-2 p-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${activeFile === file.name ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-200'}`}
                            >
                                <div className="w-3 h-3 shrink-0" />
                                <file.icon className={`w-3.5 h-3.5 ${file.color}`} />
                                {file.name}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-slate-900/40 border-t border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Synced with GitHub</p>
                        </div>
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-8 bg-slate-900/60 border-b border-slate-800 flex items-center px-4 justify-between">
                            <div className="flex items-center gap-2">
                                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-xs font-bold text-slate-300 uppercase">{activeFile}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[10px] text-slate-600 font-mono">UTF-8</Badge>
                                <Badge variant="outline" className="text-[10px] text-slate-600 font-mono">Python 3.11</Badge>
                            </div>
                        </div>
                        <div className="mt-8 p-6 font-mono text-sm leading-relaxed text-slate-300 overflow-y-auto h-full scrollbar-hide">
                            <div className="flex gap-4">
                                <div className="text-slate-700 select-none text-right w-8 border-r border-slate-800 pr-4">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <div key={i}>{i + 1}</div>
                                    ))}
                                </div>
                                <div className="flex-1">
                                    <pre className="text-blue-200"><span className="text-purple-400">import</span> tensorflow <span className="text-purple-400">as</span> tf</pre>
                                    <pre className="text-blue-200"><span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np</pre>
                                    <pre className="text-slate-500 italic mt-2"># Bluelearner-AI specialized agent initialization</pre>
                                    <pre className="text-blue-200">model = tf.keras.Sequential([</pre>
                                    <pre className="text-blue-200">    tf.keras.layers.Dense(<span className="text-yellow-400">128</span>, activation=<span className="text-amber-400">'relu'</span>),</pre>
                                    <pre className="text-blue-200">    tf.keras.layers.Dropout(<span className="text-yellow-400">0.2</span>),</pre>
                                    <pre className="text-blue-200">    tf.keras.layers.Dense(<span className="text-yellow-400">10</span>)</pre>
                                    <pre className="text-blue-200">])</pre>
                                    <pre className="text-blue-200 mt-4"><span className="text-purple-400">def</span> <span className="text-yellow-400">train_cycle</span>(data):</pre>
                                    <pre className="text-blue-200">    <span className="text-slate-500">...</span></pre>
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Overlay */}
                        <div className="absolute right-4 bottom-4 w-64 bg-slate-900/90 border border-primary/20 rounded-2xl p-4 backdrop-blur-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-2 mb-2">
                                <Bot className="w-4 h-4 text-primary" />
                                <h4 className="text-[10px] font-black text-white uppercase italic">AI_AUTO_PILOT</h4>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight">I noticed a potential optimization in your model layers. Should I refactor?</p>
                            <div className="flex gap-2 mt-3">
                                <Button size="sm" className="bg-primary/10 text-primary border-primary/20 h-7 text-[9px] font-black">REFACTOR</Button>
                                <Button size="sm" variant="secondary" className="h-7 text-[9px] font-bold text-slate-500">DISMISS</Button>
                            </div>
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="h-48 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                            <div className="flex items-center gap-2 ml-2">
                                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">TERMINAL_01</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                            </div>
                        </div>
                        <div className="flex-1 p-4 font-mono text-xs text-slate-400 overflow-y-auto">
                            {terminalOutput.map((line, i) => (
                                <div key={i} className="mb-1 leading-relaxed">
                                    <span className="text-amber-500 mr-2">➜</span>
                                    {line}
                                </div>
                            ))}
                            <div className="flex mt-1">
                                <span className="text-amber-500 mr-2">➜</span>
                                <input className="bg-transparent border-none outline-none flex-1 text-slate-200" autoFocus />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
