'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Layers,
    Settings,
    Thermometer,
    Zap,
    RotateCw,
    Maximize2,
    MousePointer2,
    Cpu,
    ShieldCheck,
    ChevronRight,
    Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

export default function MechanicalLabPage() {
    const [rotation, setRotation] = useState(0);
    const [temperature, setTemperature] = useState(25);
    const [isSimulating, setIsSimulating] = useState(false);

    return (
        <div className="h-[90vh] flex flex-col gap-4 -mt-6">
            {/* Simulation Header */}
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Box className="w-5 h-5 text-orange-400" />
                        <h2 className="text-sm font-black italic tracking-widest text-white uppercase text-orange-400">MECH_SIM_CENTER_v1.2</h2>
                    </div>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-[10px] font-black italic uppercase">
                        GPU_ACCELERATION: ACTIVE
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 px-3">
                        <Layers className="w-3.5 h-3.5 mr-2" /> Viewport Layers
                    </Button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <Button
                        onClick={() => setIsSimulating(!isSimulating)}
                        size="sm"
                        className={`${isSimulating ? 'bg-red-600 hover:bg-red-500' : 'bg-orange-600 hover:bg-orange-500'} text-white font-bold h-8 px-4 rounded-lg`}
                    >
                        {isSimulating ? 'HALT_SIMULATION' : 'START_THERMAL_SIM'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Control & Properties Sidebar */}
                <div className="w-80 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROPERTIES_PANE</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                        {/* Material Selection */}
                        <div className="space-y-3">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Active Material</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" className="h-20 bg-slate-900 border-orange-500/20 text-[10px] flex flex-col gap-2 font-black italic">
                                    <div className="w-4 h-4 bg-orange-400 rounded-full" /> ALUMINUM_6061
                                </Button>
                                <Button variant="outline" className="h-20 bg-slate-900 border-slate-800 text-[10px] opacity-40 flex flex-col gap-2 font-black italic">
                                    <div className="w-4 h-4 bg-slate-500 rounded-full" /> STEEL_A36
                                </Button>
                            </div>
                        </div>

                        {/* Simulation Controls */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase">
                                <span>Ambient Temp</span>
                                <span className="text-orange-400">{temperature}°C</span>
                            </div>
                            <Slider
                                value={[temperature]}
                                onValueChange={(v: number[]) => setTemperature(v[0])}
                                max={150}
                                step={1}
                                className="py-1"
                            />
                        </div>

                        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
                            <h4 className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2">
                                <Info className="w-3 h-3" /> Live Telemetry
                            </h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">Torque</span>
                                    <span className="text-white">14.2 Nm</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">Stiffness</span>
                                    <span className="text-white">88%</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold">
                                    <span className="text-slate-500">Fatigue Life</span>
                                    <span className="text-emerald-400 font-black">EXCELLENT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Viewport Area */}
                <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col p-4 group">
                    {/* Viewport UI Overlays */}
                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
                        <Button size="icon" variant="outline" className="bg-slate-900/80 border-slate-800 h-10 w-10 rounded-xl">
                            <RotateCw className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button size="icon" variant="outline" className="bg-slate-900/80 border-slate-800 h-10 w-10 rounded-xl">
                            <Maximize2 className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>

                    <div className="absolute bottom-8 right-8 z-10 flex gap-4">
                        <div className="bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-white italic tracking-widest uppercase">STRESS_POINT_ALPHA_7</span>
                        </div>
                    </div>

                    {/* Theoretical 3D Model Placeholder */}
                    <div className="flex-1 rounded-2xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
                            {Array.from({ length: 144 }).map((_, i) => (
                                <div key={i} className="border-[0.5px] border-slate-500/30" />
                            ))}
                        </div>

                        <motion.div
                            animate={{
                                rotateY: isSimulating ? 360 : 0,
                                scale: isSimulating ? [1, 1.02, 1] : 1
                            }}
                            transition={{
                                rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                            className="w-80 h-80 relative flex items-center justify-center"
                        >
                            {/* High-end SVG based Engine Piston Placeholder */}
                            <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-[0_0_30px_rgba(251,146,60,0.2)] transition-colors duration-500 ${isSimulating ? 'fill-orange-500' : 'fill-slate-700'}`}>
                                <path d="M60,40 h80 v120 h-80 z M70,50 h60 v10 h-60 z M80,70 h40 v40 h-40 z" />
                                <circle cx="100" cy="130" r="15" fill="#334155" />
                                {isSimulating && (
                                    <motion.g animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                        <circle cx="100" cy="80" r="30" className="fill-red-500/20" />
                                        <circle cx="100" cy="80" r="10" className="fill-red-500" />
                                    </motion.g>
                                )}
                            </svg>
                        </motion.div>
                    </div>

                    {/* AI Insights Board */}
                    <div className="h-24 bg-slate-900/60 border border-slate-800 rounded-2xl mt-4 flex items-center px-6 gap-6 group/ai">
                        <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-1">
                            <h5 className="text-[10px] font-black text-orange-400 uppercase italic tracking-widest mb-1">Structural Optimizer</h5>
                            <p className="text-xs text-slate-400 font-medium leading-tight">Increasing wall thickness by 1.2mm in the crown region would reduce maximum stress by 18.5%.</p>
                        </div>
                        <Button variant="outline" className="border-orange-500/20 text-[10px] font-black italic tracking-widest text-orange-400 hover:bg-orange-500 hover:text-white transition-all uppercase">
                            Apply Fix <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
