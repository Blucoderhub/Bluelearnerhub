'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy,
    Calendar,
    Users,
    Target,
    Cpu,
    Briefcase,
    Globe,
    Shield,
    Rocket,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Zap,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steps = [
    { id: 'basics', title: 'MISSION_DATA', icon: Rocket },
    { id: 'domain', title: 'DOMAIN_VECTORS', icon: Cpu },
    { id: 'prizes', title: 'REWARD_STAKES', icon: Trophy },
    { id: 'timeline', title: 'TEMPORAL_WINDOW', icon: Calendar },
];

export default function HostHackathonPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: '',
        prizes: '',
        startDate: '',
        endDate: '',
        participantType: 'all',
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
            {/* Header */}
            <div className="space-y-4 text-center">
                <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase italic px-4 py-1">
                    Hackathon_Engine_v1.5
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                    INITIATING_GLOBAL_CHALLENGE
                </h1>
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest max-w-lg mx-auto leading-relaxed">
                    Configure your innovation parameters to attract the world's most elite engineering and management talent.
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-secondary -z-10" />
                {steps.map((step, i) => (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${i <= currentStep ? 'bg-primary border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'bg-background border-border text-muted-foreground'
                            }`}>
                            <step.icon className={`w-5 h-5 ${i <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                        </div>
                        <span className={`text-[9px] font-black uppercase italic tracking-widest ${i <= currentStep ? 'text-white' : 'text-muted-foreground'}`}>
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <Card className="bg-card/60 border-border p-8 glass-morphism relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                    <Zap className="w-5 h-5 text-primary/20 group-hover:text-primary transition-colors" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {currentStep === 0 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Challenge_Identification</label>
                                    <Input
                                        placeholder="E.g., Sustainable Urban Grid Optima 2026"
                                        className="bg-background/50 border-border text-white h-14 italic"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Mission_Briefing</label>
                                    <Textarea
                                        placeholder="Synthesize the core problem statement and innovation goals..."
                                        className="bg-background/50 border-border text-white min-h-[150px] italic"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-start gap-4">
                                    <Sparkles className="w-5 h-5 text-primary shrink-0 mt-1" />
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase italic">AI_Brief_Optimizer_Active</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Our neural engine is analyzing your brief to suggest high-impact problem vectors.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'soft', name: 'Software_Force', icon: Cpu },
                                    { id: 'mech', name: 'Mech_Structural', icon: Shield },
                                    { id: 'elec', name: 'Nano_Electrical', icon: Zap },
                                    { id: 'mgmt', name: 'Admin_Scalability', icon: Target },
                                    { id: 'fin', name: 'Quant_Financial', icon: Briefcase },
                                    { id: 'aero', name: 'Aero_Avionics', icon: Globe },
                                ].map((d) => (
                                    <button
                                        key={d.id}
                                        onClick={() => setFormData({ ...formData, domain: d.id })}
                                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${formData.domain === d.id ? 'bg-primary/10 border-primary text-white ai-glow' : 'bg-background/50 border-border text-muted-foreground hover:border-border'
                                            }`}
                                    >
                                        <d.icon className="w-8 h-8" />
                                        <span className="text-[10px] font-black uppercase italic tracking-tighter">{d.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Total_Incentive_Value</label>
                                    <Input
                                        placeholder="$ 50,000.00"
                                        type="number"
                                        className="bg-background/50 border-border text-white h-14 italic"
                                        value={formData.prizes}
                                        onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase italic">Interview_Garantees</span>
                                        <Input type="checkbox" className="w-5 h-5 accent-primary" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase italic">Digital_Badges</span>
                                        <Input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Launch_Point</label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 border-border text-white h-14 italic"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Terminal_Entry</label>
                                        <Input
                                            type="date"
                                            className="bg-background/50 border-border text-white h-14 italic"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="p-6 bg-background border border-blue-500/30 rounded-2xl flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Info className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black italic text-white uppercase tracking-widest">Temporal_Check</h4>
                                        <p className="text-xs text-muted-foreground font-medium max-w-md">Ensure your submission window allows for complex multi-physics or high-fidelity management analysis.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                <div className="mt-12 flex justify-between items-center bg-background p-6 rounded-2xl border border-border">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="text-muted-foreground hover:text-white font-black italic uppercase text-[10px] tracking-widest"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> REVERT_STEP
                    </Button>

                    <div className="flex gap-4">
                        {currentStep === steps.length - 1 ? (
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black italic uppercase tracking-widest px-12 h-14 shadow-[0_0_30px_rgba(var(--primary),0.4)]">
                                DEPLOY_HACKATHON_V1
                            </Button>
                        ) : (
                            <Button
                                onClick={nextStep}
                                className="bg-secondary hover:bg-muted text-white font-black italic uppercase tracking-widest px-8 h-12"
                            >
                                PROCEED_SEQUENCE <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Footer Info */}
            <div className="flex justify-center gap-12 py-8">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-foreground/80" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase italic">Enterprise_Security_Locked</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase italic">Talent_Matching_Enabled</span>
                </div>
            </div>
        </div>
    );
}
