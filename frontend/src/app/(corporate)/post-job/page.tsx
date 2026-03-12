'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Target,
    Cpu,
    Zap,
    ShieldCheck,
    MapPin,
    DollarSign,
    Clock,
    Sparkles,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steps = [
    { id: 'basics', title: 'ROLE_VECTORS', icon: Briefcase },
    { id: 'skills', title: 'TECH_REQUISITION', icon: Cpu },
    { id: 'rewards', title: 'COMPENSATION', icon: DollarSign },
    { id: 'visibility', title: 'NETWORK_REACH', icon: Target },
];

export default function PostJobPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'Full-time',
        salaryRange: '',
        description: '',
        requiredSkills: [],
        experienceLevel: 'Mid-Level',
    });

    const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-32">
            {/* Header */}
            <div className="space-y-4 text-center">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/20 text-[10px] font-black tracking-widest uppercase italic px-4 py-1">
                    Hiring_Module_v2.0
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                    REQUISITIONING_TOP_TALENT
                </h1>
                <p className="text-muted-foreground font-bold uppercase text-xs tracking-widest max-w-lg mx-auto leading-relaxed">
                    Define your technical and strategic requirements. Our engine matches you with candidates based on <span className="text-primary font-black italic">Verified_Proof_Of_Work</span>.
                </p>
            </div>

            {/* Progress Stepper */}
            <div className="flex justify-between items-center px-4 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-secondary -z-10" />
                {steps.map((step, i) => (
                    <div key={step.id} className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${i <= currentStep ? 'bg-purple-600 border-purple-600 shadow-[0_0_20px_rgba(var(--purple-600),0.3)]' : 'bg-background border-border text-muted-foreground'
                            }`}>
                            <step.icon className={`w-5 h-5 ${i <= currentStep ? 'text-white' : 'text-muted-foreground'}`} />
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
                    <Target className="w-5 h-5 text-purple-500/20 group-hover:text-purple-500 transition-colors" />
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Designation_Vector</label>
                                        <Input
                                            placeholder="E.g., Senior Systems Architect"
                                            className="bg-background/50 border-border text-white h-14 italic"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Department_ID</label>
                                        <Input
                                            placeholder="E.g., R&D - Propulsion Systems"
                                            className="bg-background/50 border-border text-white h-14 italic"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Geographic_Lock</label>
                                        <Input
                                            placeholder="E.g., Bangalore, India (Remote Op.)"
                                            className="bg-background/50 border-border text-white h-14 italic"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Operational_Type</label>
                                        <select className="flex h-14 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm italic text-white focus:outline-none">
                                            <option>Full-time_Elite</option>
                                            <option>Contract_Mission</option>
                                            <option>Apprenticeship_Level</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Requisition_Parameters (Proof of Work Required)</label>
                                    <Textarea
                                        placeholder="List the specific technical or management milestones the candidate must have achieved (e.g., Led 3+ high-fidelity BIM projects)..."
                                        className="bg-background/50 border-border text-white min-h-[150px] italic"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { n: 'AUTOCAD_PRO', v: 'L8' },
                                        { n: 'NANO_CIRCUITRY', v: 'L6' },
                                        { n: 'STRATEGIC_ROI', v: 'L9' },
                                        { n: 'STRESS_ANALYSIS', v: 'L7' }
                                    ].map(skill => (
                                        <div key={skill.n} className="p-3 bg-background border border-border rounded-xl flex items-center justify-between group-hover:border-purple-500/30 transition-all">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase italic tracking-tighter">{skill.n}</span>
                                            <Badge className="bg-purple-600/10 text-purple-400 border-none text-[8px]">{skill.v}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic ml-1">Annual_Token_Yield (Salary Range)</label>
                                    <Input
                                        placeholder="E.g., $120k - $180k USD / Ann."
                                        className="bg-background/50 border-border text-white h-14 italic"
                                        value={formData.salaryRange}
                                        onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-6 bg-background rounded-2xl border border-border flex items-center gap-4 group hover:border-border transition-all">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <ShieldCheck className="w-6 h-6 text-foreground/80" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase italic">Health_Protection_v1</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Full Global Medical Coverage</p>
                                        </div>
                                        <Input type="checkbox" defaultChecked className="ml-auto w-5 h-5 accent-primary" />
                                    </div>
                                    <div className="p-6 bg-background rounded-2xl border border-border flex items-center gap-4 group hover:border-blue-500/30 transition-all">
                                        <div className="p-3 bg-blue-500/10 rounded-xl">
                                            <Zap className="w-6 h-6 text-primary/80" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase italic">Equity_Stock_Options</p>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Early Stage Token Allocation</p>
                                        </div>
                                        <Input type="checkbox" className="ml-auto w-5 h-5 accent-blue-500" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-8 text-center py-8">
                                <div className="w-24 h-24 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto border-4 border-purple-600/20">
                                    <Target className="w-12 h-12 text-purple-500" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">NETWORK_MAX_REACH</h3>
                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Targeting 50,000 Verified Engineers in the BLUELEARNERHUB Ecosystem</p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <Badge variant="outline" className="border-border text-[10px] font-black uppercase text-muted-foreground py-1.5 px-4 bg-background">LinkedIn_Sync: [ACTIVE]</Badge>
                                    <Badge variant="outline" className="border-border text-[10px] font-black uppercase text-muted-foreground py-1.5 px-4 bg-background">Global_Boards: [READY]</Badge>
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
                            <Button className="bg-purple-600 hover:bg-purple-500 text-white font-black italic uppercase tracking-widest px-12 h-14 shadow-[0_0_30px_rgba(var(--purple-600),0.4)]">
                                PUBLISH_REQUISITION
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
                    <Building2 className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase italic">Enterprise_Branding_Active</span>
                </div>
                <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase italic">Matching_Engine_Calibrated</span>
                </div>
            </div>
        </div>
    );
}
