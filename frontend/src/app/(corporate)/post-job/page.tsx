'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const steps = [
  { id: 'basics', title: 'ROLE_VECTORS', icon: Briefcase },
  { id: 'skills', title: 'TECH_REQUISITION', icon: Cpu },
  { id: 'rewards', title: 'COMPENSATION', icon: DollarSign },
  { id: 'visibility', title: 'NETWORK_REACH', icon: Target },
]

export default function PostJobPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salaryRange: '',
    description: '',
    requiredSkills: [],
    experienceLevel: 'Mid-Level',
  })

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-32">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Badge className="border-purple-500/20 bg-purple-500/20 px-4 py-1 text-[10px] font-black uppercase italic tracking-widest text-purple-400">
          Hiring_Module_v2.0
        </Badge>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
          REQUISITIONING_TOP_TALENT
        </h1>
        <p className="mx-auto max-w-lg text-xs font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
          Define your technical and strategic requirements. Our engine matches you with candidates
          based on <span className="font-black italic text-primary">Verified_Proof_Of_Work</span>.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="relative flex items-center justify-between px-4">
        <div className="absolute left-0 top-1/2 -z-10 h-[1px] w-full bg-secondary" />
        {steps.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
                i <= currentStep
                  ? 'border-purple-600 bg-purple-600 shadow-[0_0_20px_rgba(var(--purple-600),0.3)]'
                  : 'border-border bg-background text-muted-foreground'
              }`}
            >
              <step.icon
                className={`h-5 w-5 ${i <= currentStep ? 'text-white' : 'text-muted-foreground'}`}
              />
            </div>
            <span
              className={`text-[9px] font-black uppercase italic tracking-widest ${i <= currentStep ? 'text-white' : 'text-muted-foreground'}`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card className="glass-morphism group relative overflow-hidden border-border bg-card/60 p-8">
        <div className="absolute right-0 top-0 p-4">
          <Target className="h-5 w-5 text-purple-500/20 transition-colors group-hover:text-purple-500" />
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
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Designation_Vector
                    </label>
                    <Input
                      placeholder="E.g., Senior Systems Architect"
                      className="h-14 border-border bg-background/50 italic text-white"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Department_ID
                    </label>
                    <Input
                      placeholder="E.g., R&D - Propulsion Systems"
                      className="h-14 border-border bg-background/50 italic text-white"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Geographic_Lock
                    </label>
                    <Input
                      placeholder="E.g., Bangalore, India (Remote Op.)"
                      className="h-14 border-border bg-background/50 italic text-white"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Operational_Type
                    </label>
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
                  <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                    Requisition_Parameters (Proof of Work Required)
                  </label>
                  <Textarea
                    placeholder="List the specific technical or management milestones the candidate must have achieved (e.g., Led 3+ high-fidelity BIM projects)..."
                    className="min-h-[150px] border-border bg-background/50 italic text-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {[
                    { n: 'AUTOCAD_PRO', v: 'L8' },
                    { n: 'NANO_CIRCUITRY', v: 'L6' },
                    { n: 'STRATEGIC_ROI', v: 'L9' },
                    { n: 'STRESS_ANALYSIS', v: 'L7' },
                  ].map((skill) => (
                    <div
                      key={skill.n}
                      className="flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-all group-hover:border-purple-500/30"
                    >
                      <span className="text-[9px] font-black uppercase italic tracking-tighter text-muted-foreground">
                        {skill.n}
                      </span>
                      <Badge className="border-none bg-purple-600/10 text-[8px] text-purple-400">
                        {skill.v}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                    Annual_Token_Yield (Salary Range)
                  </label>
                  <Input
                    placeholder="E.g., $120k - $180k USD / Ann."
                    className="h-14 border-border bg-background/50 italic text-white"
                    value={formData.salaryRange}
                    onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-6 transition-all hover:border-border">
                    <div className="rounded-xl bg-primary/10 p-3">
                      <ShieldCheck className="h-6 w-6 text-foreground/80" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic text-white">
                        Health_Protection_v1
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                        Full Global Medical Coverage
                      </p>
                    </div>
                    <Input
                      type="checkbox"
                      defaultChecked
                      className="ml-auto h-5 w-5 accent-primary"
                    />
                  </div>
                  <div className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-6 transition-all hover:border-blue-500/30">
                    <div className="rounded-xl bg-blue-500/10 p-3">
                      <Zap className="h-6 w-6 text-primary/80" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase italic text-white">
                        Equity_Stock_Options
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase text-muted-foreground">
                        Early Stage Token Allocation
                      </p>
                    </div>
                    <Input type="checkbox" className="ml-auto h-5 w-5 accent-blue-500" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 py-8 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-purple-600/20 bg-purple-600/10">
                  <Target className="h-12 w-12 text-purple-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                    NETWORK_MAX_REACH
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Targeting 50,000 Verified Engineers in the BLUELEARNERHUB Ecosystem
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <Badge
                    variant="outline"
                    className="border-border bg-background px-4 py-1.5 text-[10px] font-black uppercase text-muted-foreground"
                  >
                    LinkedIn_Sync: [ACTIVE]
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-border bg-background px-4 py-1.5 text-[10px] font-black uppercase text-muted-foreground"
                  >
                    Global_Boards: [READY]
                  </Badge>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between rounded-2xl border border-border bg-background p-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-white"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> REVERT_STEP
          </Button>

          <div className="flex gap-4">
            {currentStep === steps.length - 1 ? (
              <Button className="h-14 bg-purple-600 px-12 font-black uppercase italic tracking-widest text-white shadow-[0_0_30px_rgba(var(--purple-600),0.4)] hover:bg-purple-500">
                PUBLISH_REQUISITION
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="h-12 bg-secondary px-8 font-black uppercase italic tracking-widest text-white hover:bg-muted"
              >
                PROCEED_SEQUENCE <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="flex justify-center gap-12 py-8">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-purple-500" />
          <span className="text-[10px] font-black uppercase italic text-muted-foreground">
            Enterprise_Branding_Active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase italic text-muted-foreground">
            Matching_Engine_Calibrated
          </span>
        </div>
      </div>
    </div>
  )
}
