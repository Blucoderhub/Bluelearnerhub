'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Cpu,
    Settings,
    Plus,
    Eraser,
    Play,
    RefreshCcw,
    Activity,
    Waves,
    Layout,
    MousePointer2,
    Lock,
    ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

export default function ElectricalLabPage() {
    const [voltage, setVoltage] = useState(5.0);
    const [isPowerOn, setIsPowerOn] = useState(false);

    const components = [
        { name: 'RESISTOR_10K', icon: Plus, color: 'text-orange-400' },
        { name: 'CAPACITOR_100uF', icon: Plus, color: 'text-blue-400' },
        { name: 'NPN_TRANSISTOR', icon: Plus, color: 'text-slate-400' },
        { name: 'MCU_BLUE_X1', icon: Cpu, color: 'text-primary' },
    ];

    return (
        <div className="h-[90vh] flex flex-col gap-4 -mt-6">
            {/* Circuit Header */}
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-sm font-black italic tracking-widest text-white uppercase text-yellow-400">CIRCUIT_DESIGN_v0.8</h2>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px] font-black italic uppercase">
                        POWER_RAIL: {isPowerOn ? 'STABLE' : 'HIGH_Z'}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 px-3">
                        <Eraser className="w-3.5 h-3.5 mr-2" /> Clear Canvas
                    </Button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <Button
                        onClick={() => setIsPowerOn(!isPowerOn)}
                        size="sm"
                        className={`${isPowerOn ? 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-yellow-600 hover:bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]'} text-white font-bold h-8 px-4 rounded-lg transition-all`}
                    >
                        {isPowerOn ? 'HALT_VCC' : 'ENABLE_PWR'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Component Toolbox */}
                <div className="w-64 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            COMPONENT_LIB <Plus className="w-3 h-3" />
                        </h3>
                    </div>
                    <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                        {components.map(comp => (
                            <div
                                key={comp.name}
                                className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl cursor-grab active:cursor-grabbing hover:border-yellow-500/30 transition-all group"
                            >
                                <div className={`w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0 border border-slate-800`}>
                                    <comp.icon className={`w-4 h-4 ${comp.color}`} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[9px] font-black text-slate-300 truncate uppercase leading-none">{comp.name}</p>
                                    <p className="text-[7px] text-slate-600 font-bold uppercase mt-1">SMD_ACTIVE</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Schematic Canvas */}
                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden group">
                        {/* Grid Pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />

                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                            <Badge className="bg-slate-900/90 text-slate-400 border-slate-800 font-mono text-[9px] px-2 py-1">X: 124 Y: 88</Badge>
                        </div>

                        {/* Theoretical Circuit Sketch */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <svg viewBox="0 0 600 400" className="w-full h-full stroke-slate-700 stroke-[1.5] fill-none opacity-40">
                                <path d="M100,200 h100 v-50 h50 v100 h-50 M300,200 h100 v50 h50 v-100 h-50" />
                                <circle cx="100" cy="200" r="4" className="fill-slate-700" />
                                <circle cx="300" cy="200" r="4" className="fill-slate-700" />
                                <circle cx="500" cy="200" r="4" className="fill-slate-700" />
                            </svg>
                            {isPowerOn && (
                                <motion.div
                                    animate={{ x: [100, 500], opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_8px_#fbbf24]"
                                />
                            )}
                        </div>

                        {/* Pro Floating Toolbar */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-1 flex items-center gap-1 backdrop-blur-xl shadow-2xl">
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"><MousePointer2 className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"><Plus className="w-4 h-4" /></Button>
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"><Activity className="w-4 h-4" /></Button>
                            <div className="w-px h-6 bg-slate-800 mx-1" />
                            <Button size="icon" variant="ghost" className="h-10 w-10 text-yellow-400 hover:bg-yellow-400/10 rounded-xl"><Zap className="w-4 h-4 fill-current" /></Button>
                        </div>
                    </div>

                    {/* Oscilloscope / Analyzer */}
                    <div className="h-56 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-2 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                            <div className="flex items-center gap-2 ml-2">
                                <Waves className="w-3.5 h-3.5 text-yellow-500" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">DIGITAL_OSCILLOSCOPE_CH1</span>
                            </div>
                            <div className="flex items-center gap-3 pr-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                    <span className="text-[9px] font-mono text-amber-500">5.02V</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    <span className="text-[9px] font-mono text-blue-500">120 Hz</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-0 relative overflow-hidden flex">
                            {/* Scope Grid */}
                            <div className="absolute inset-0 grid grid-cols-[repeat(10,minmax(0,1fr))] grid-rows-[repeat(6,minmax(0,1fr))] opacity-10 pointer-events-none">
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-amber-500/50" />
                                ))}
                            </div>

                            {/* Waveform Visualization */}
                            <div className="flex-1 flex items-center justify-center p-4">
                                <svg viewBox="0 0 600 100" className="w-full h-full overflow-visible">
                                    <motion.path
                                        d="M0,50 Q15,10 30,50 T60,50 T90,50 T120,50 T150,50 T180,50 T210,50 T240,50 T270,50 T300,50 T330,50 T360,50 T390,50 T420,50 T450,50 T480,50 T510,50 T540,50 T570,50 T600,50"
                                        className={`stroke-amber-400 stroke-[2] fill-none drop-shadow-[0_0_8px_rgba(59,130,246,0.35)] transition-all ${isPowerOn ? 'opacity-100' : 'opacity-20'}`}
                                        animate={isPowerOn ? {
                                            d: [
                                                "M0,50 Q15,10 30,50 T60,50 T90,50 T120,50 T150,50 T180,50 T210,50 T240,50 T270,50 T300,50 T330,50 T360,50 T390,50 T420,50 T450,50 T480,50 T510,50 T540,50 T570,50 T600,50",
                                                "M0,50 Q15,90 30,50 T60,50 T90,50 T120,50 T150,50 T180,50 T210,50 T240,50 T270,50 T300,50 T330,50 T360,50 T390,50 T420,50 T450,50 T480,50 T510,50 T540,50 T570,50 T600,50"
                                            ]
                                        } : {}}
                                        transition={{ duration: 0.1, repeat: Infinity, ease: "linear" }}
                                    />
                                </svg>
                            </div>

                            {/* Scope Controls Sidebar */}
                            <div className="w-48 bg-slate-900/60 border-l border-slate-800 p-4 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Timebase</p>
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="outline" className="h-6 w-full text-[9px] font-black italic bg-slate-950 border-slate-800">10ms</Button>
                                        <Button size="icon" variant="outline" className="h-6 w-full text-[9px] font-black italic bg-yellow-500 text-black border-none shadow-[0_0_10px_rgba(234,179,8,0.2)]">1ms</Button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[8px] text-slate-600 font-black uppercase">
                                        <span>Trigger</span>
                                        <span className="text-amber-400">AUTO</span>
                                    </div>
                                    <Progress value={65} className="h-1 bg-slate-950" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
