'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Layers,
    Box,
    Map,
    Thermometer,
    ShieldCheck,
    Wind,
    Hash,
    ArrowUpRight,
    Zap,
    ChevronRight,
    MousePointer2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CivilLabPage() {
    const [load, setLoad] = useState(500);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <div className="h-[90vh] flex flex-col gap-4 -mt-6">
            {/* Simulation Header */}
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-3 rounded-xl backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-emerald-400" />
                        <h2 className="text-sm font-black italic tracking-widest text-white uppercase text-emerald-400">STRUCTURE_LAB_v0.5</h2>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-black italic uppercase">
                        BIM_SYNC: ESTABLISHED
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-8 px-3">
                        Environment Wind: 12 km/h
                    </Button>
                    <div className="w-px h-4 bg-slate-800 mx-1" />
                    <Button
                        onClick={() => setIsAnalyzing(!isAnalyzing)}
                        size="sm"
                        className={`${isAnalyzing ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-slate-800 hover:bg-slate-700'} text-white font-bold h-8 px-4 rounded-lg transition-all`}
                    >
                        {isAnalyzing ? 'LIVE_ANALYSIS_ON' : 'RUN_STRUCTURAL_LOAD'}
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* BIM Data Sidebar */}
                <div className="w-80 bg-slate-950/40 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-800 bg-slate-900/20">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">BIM_DATA_STACK</h3>
                    </div>
                    <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                        <div className="space-y-3">
                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Structural Members</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Box className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] text-white font-bold">REINFORCED_CONCRETE_P1</span>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black">PASS</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <Box className="w-4 h-4 text-emerald-500" />
                                        <span className="text-[10px] text-white font-bold">STEEL_BEAM_W12x65</span>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[8px] font-black">PASS</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase">Live Load (kN)</h4>
                                <span className="text-xl font-black text-white">{load}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="2000"
                                value={load}
                                onChange={(e) => setLoad(parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>

                        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 space-y-2">
                            <h5 className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Telemetry Report</h5>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500">Deflection</span>
                                <span className="text-white">4.2 mm</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-slate-500">Soil Condition</span>
                                <span className="text-emerald-400">STABLE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Structural Viewport */}
                <div className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl relative overflow-hidden flex flex-col p-6">
                    <div className="flex-1 rounded-2xl flex items-center justify-center relative flex-col group">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.5)_1px,transparent_1px)] [background-size:100px_100px] opacity-20" />

                        {/* Theoretical Structure */}
                        <motion.div
                            animate={isAnalyzing ? { scale: [1, 1.01, 1], y: [0, 1, 0] } : {}}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="w-96 h-[500px] border-4 border-slate-800 relative z-10 flex flex-col justify-between"
                        >
                            <div className="h-4 w-full bg-slate-800" />
                            <div className="flex-1 flex justify-evenly">
                                <div className={`w-8 h-full transition-colors duration-500 ${load > 1500 ? 'bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 border-slate-700'} border-x-4`} />
                                <div className={`w-8 h-full transition-colors duration-500 ${load > 1500 ? 'bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 border-slate-700'} border-x-4`} />
                                <div className={`w-8 h-full transition-colors duration-500 ${load > 1500 ? 'bg-red-500/30 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-slate-900 border-slate-700'} border-x-4`} />
                            </div>
                            <div className="h-8 w-full bg-slate-950 border-t-4 border-slate-800" />

                            {/* Stress Points UI */}
                            {isAnalyzing && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-8">
                                    <div className="bg-red-500 w-2 h-2 rounded-full animate-ping mx-auto" />
                                    <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse border-2 border-red-200" />
                                    <div className="bg-emerald-500 w-2 h-2 rounded-full animate-ping mx-auto" />
                                </div>
                            )}
                        </motion.div>

                        {/* AI Engineering Insights */}
                        <div className={`absolute bottom-8 right-8 w-80 bg-slate-900/90 border border-emerald-500/20 p-5 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-500 ${isAnalyzing ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
                                <h4 className="text-[10px] font-black text-white uppercase italic tracking-widest">Structural_Alert_System</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-bold">Column stability under <span className="text-emerald-400">{load}kN</span> load is within the 1.5x safety factor margin. <span className="text-emerald-400 font-black">CLEAR_TO_PROCEED</span>.</p>
                            <Button variant="ghost" className="w-full mt-4 h-9 text-[10px] font-black uppercase text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/10">
                                Export Load Case <ChevronRight className="w-3.5 h-3.5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
