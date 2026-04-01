'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
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
  Info,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { hackathonsAPI } from '@/lib/api-civilization'

const steps = [
  { id: 'basics', title: 'MISSION_DATA', icon: Rocket },
  { id: 'domain', title: 'DOMAIN_VECTORS', icon: Cpu },
  { id: 'prizes', title: 'REWARD_STAKES', icon: Trophy },
  { id: 'timeline', title: 'TEMPORAL_WINDOW', icon: Calendar },
]

export default function HostHackathonPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    prizePool: '',
    startDate: '',
    endDate: '',
    participantType: 'all',
    rules: '',
    teamSize: '4',
  })

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const result = await hackathonsAPI.create({
        title: formData.title,
        description: formData.description,
        domain: formData.domain.toUpperCase() || 'GENERAL',
        prizePool: formData.prizePool,
        startDate: formData.startDate,
        endDate: formData.endDate,
        rules: formData.rules || 'Open to all participants. Teams of up to ' + formData.teamSize + ' members.',
        teamSize: parseInt(formData.teamSize) || 4,
        maxParticipants: 500,
      })

      if (result.error) {
        throw new Error(result.error.message || 'Failed to create hackathon')
      }

      toast.success('Hackathon created successfully!')
      router.push('/corporate/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create hackathon')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-12 pb-32">
      {/* Header */}
      <div className="space-y-4 text-center">
        <Badge className="border-primary/20 bg-primary/20 px-4 py-1 text-[10px] font-black uppercase italic tracking-widest text-primary">
          Hackathon_Engine_v1.5
        </Badge>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
          INITIATING_GLOBAL_CHALLENGE
        </h1>
        <p className="mx-auto max-w-lg text-xs font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
          Configure your innovation parameters to attract the world's most elite engineering and
          management talent.
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
                  ? 'border-primary bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]'
                  : 'border-border bg-background text-muted-foreground'
              }`}
            >
              <step.icon
                className={`h-5 w-5 ${i <= currentStep ? 'text-primary-foreground' : 'text-muted-foreground'}`}
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
          <Zap className="h-5 w-5 text-primary/20 transition-colors group-hover:text-primary" />
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
                  <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                    Challenge_Identification
                  </label>
                  <Input
                    placeholder="E.g., Sustainable Urban Grid Optima 2026"
                    className="h-14 border-border bg-background/50 italic text-white"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                    Mission_Briefing
                  </label>
                  <Textarea
                    placeholder="Synthesize the core problem statement and innovation goals..."
                    className="min-h-[150px] border-border bg-background/50 italic text-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                  <Sparkles className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[10px] font-black uppercase italic text-white">
                      AI_Brief_Optimizer_Active
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">
                      Our neural engine is analyzing your brief to suggest high-impact problem
                      vectors.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
                    className={`flex flex-col items-center gap-4 rounded-2xl border-2 p-6 transition-all ${
                      formData.domain === d.id
                        ? 'ai-glow border-primary bg-primary/10 text-white'
                        : 'border-border bg-background/50 text-muted-foreground hover:border-border'
                    }`}
                  >
                    <d.icon className="h-8 w-8" />
                    <span className="text-[10px] font-black uppercase italic tracking-tighter">
                      {d.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                    Total_Incentive_Value
                  </label>
                  <Input
                    placeholder="$ 50,000.00"
                    type="number"
                    className="h-14 border-border bg-background/50 italic text-white"
                    value={formData.prizes}
                    onChange={(e) => setFormData({ ...formData, prizes: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                    <span className="text-[10px] font-black uppercase italic text-muted-foreground">
                      Interview_Garantees
                    </span>
                    <Input type="checkbox" className="h-5 w-5 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-4">
                    <span className="text-[10px] font-black uppercase italic text-muted-foreground">
                      Digital_Badges
                    </span>
                    <Input type="checkbox" defaultChecked className="h-5 w-5 accent-primary" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Launch_Point
                    </label>
                    <Input
                      type="date"
                      className="h-14 border-border bg-background/50 italic text-white"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                      Terminal_Entry
                    </label>
                    <Input
                      type="date"
                      className="h-14 border-border bg-background/50 italic text-white"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6 rounded-2xl border border-blue-500/30 bg-background p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10">
                    <Info className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase italic tracking-widest text-white">
                      Temporal_Check
                    </h4>
                    <p className="max-w-md text-xs font-medium text-muted-foreground">
                      Ensure your submission window allows for complex multi-physics or
                      high-fidelity management analysis.
                    </p>
                  </div>
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
              <Button 
                onClick={handleSubmit}
                disabled={submitting}
                className="h-14 bg-primary px-12 font-black uppercase italic tracking-widest text-primary-foreground shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:bg-primary/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    DEPLOYING...
                  </>
                ) : (
                  'DEPLOY_HACKATHON_V1'
                )}
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
          <Shield className="h-4 w-4 text-foreground/80" />
          <span className="text-[10px] font-black uppercase italic text-muted-foreground">
            Enterprise_Security_Locked
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-black uppercase italic text-muted-foreground">
            Talent_Matching_Enabled
          </span>
        </div>
      </div>
    </div>
  )
}
