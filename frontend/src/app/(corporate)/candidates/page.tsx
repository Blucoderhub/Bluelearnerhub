'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Users,
  Trophy,
  Zap,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Building2,
  Code,
  Cpu,
  LineChart,
  Star,
  ChevronRight,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const candidates = [
  {
    id: 1,
    name: 'Dr. Aris Varma',
    role: 'Aeronautical Engineer',
    domain: 'Aerospace',
    level: 'L9',
    proofScore: 98,
    location: 'Munich, Germany',
    skills: ['Avionics', 'Fluid Dynamics', 'Propulsion'],
    achievements: ['NASA Challenge Winner', 'Top Contributor'],
    university: 'TUM Munich',
    xp: 124500,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Full Stack Engineer',
    domain: 'Computer Science',
    level: 'L8',
    proofScore: 95,
    location: 'San Francisco, USA',
    skills: ['Next.js', 'Distributed Systems', 'Web3'],
    achievements: ['EthGlobal 1st Place', 'OS Contributor'],
    university: 'MIT',
    xp: 98200,
  },
  {
    id: 3,
    name: 'Marcus Rashford',
    role: 'Business Analyst',
    domain: 'Management',
    level: 'L7',
    proofScore: 92,
    location: 'London, UK',
    skills: ['Agile', 'Market Strategy', 'ROI Analytics'],
    achievements: ['MBA Gold Medalist', 'Strategy Lead'],
    university: 'LSE London',
    xp: 75600,
  },
  {
    id: 4,
    name: 'Elena Petrov',
    role: 'Structural Engineer',
    domain: 'Civil',
    level: 'L8',
    proofScore: 94,
    location: 'Moscow, Russia',
    skills: ['BIM', 'Load Analysis', 'Sustainable Design'],
    achievements: ['Green Building Award', 'Steel Structure Pro'],
    university: 'MSTU Moscow',
    xp: 89000,
  },
]

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All')

  const domains = [
    'All',
    'Aerospace',
    'Computer Science',
    'Management',
    'Mechanical',
    'Electrical',
    'Civil',
  ]

  return (
    <div className="space-y-10 pb-32">
      {/* Header & Controls */}
      <div className="glass-morphism relative flex flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-border bg-slate-900/40 p-10 md:flex-row md:items-end">
        <div className="absolute right-0 top-0 p-8 opacity-5">
          <Search className="h-32 w-32" />
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
            TALENT_DISCOVERY <span className="ai-glow text-primary">HUB</span>
          </h1>
          <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
            Query 500,000+ verified engineering and management experts based on real-world
            performance benchmarks.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {domains.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`rounded-full px-4 py-1.5 text-[9px] font-black uppercase italic tracking-widest transition-all ${
                  selectedDomain === d
                    ? 'ai-glow bg-primary text-primary-foreground'
                    : 'border border-border bg-background text-muted-foreground hover:border-slate-600 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex w-full gap-4 md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Query by skill, role or name..."
              className="h-12 border-border bg-background/80 pl-12 font-medium italic text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-12 w-12 border border-border bg-background text-white hover:bg-card">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Talent Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {candidates.map((candidate, i) => (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-primary/30">
              <div className="absolute right-0 top-0 flex flex-col items-end gap-2 p-6">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-black uppercase italic text-primary">
                    {candidate.level}
                  </span>
                </div>
                <div className="rounded-full border border-border bg-background/80 px-3 py-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                    {candidate.xp.toLocaleString()} XP
                  </span>
                </div>
              </div>

              <CardHeader className="flex flex-row items-center gap-6 border-b border-slate-800/50 p-8">
                <Avatar className="h-20 w-20 border-2 border-border transition-colors group-hover:border-primary/50">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-secondary text-2xl font-black italic text-white">
                    {candidate.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-black uppercase italic tracking-tight text-white">
                    {candidate.name}
                  </CardTitle>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {candidate.role}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                      <MapPin className="h-3 w-3 text-red-500/50" /> {candidate.location}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                      <Building2 className="text-primary/80/50 h-3 w-3" /> {candidate.university}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 p-8">
                {/* Skill Vectors */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground">
                      Skill_Efficiency_Vectors
                    </h4>
                    <span className="text-[10px] font-bold uppercase italic tracking-widest text-white">
                      {candidate.proofScore}% Proof_Score
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 transition-all group-hover:border-primary/20"
                      >
                        <Code className="h-3 w-3 text-primary/50" />
                        <span className="text-[9px] font-black uppercase text-muted-foreground">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Accomplishments */}
                <div className="grid grid-cols-2 gap-4">
                  {candidate.achievements.map((acc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-border bg-primary/5 p-4"
                    >
                      <div className="rounded-lg bg-primary/10 p-2">
                        <CheckCircle2 className="h-4 w-4 text-foreground/70" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-foreground/40">
                        {acc}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex gap-4 p-8 pt-0">
                <Button className="h-12 flex-1 bg-primary font-black uppercase italic tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.2)] hover:bg-primary/90">
                  INITIATE_CONTACT
                </Button>
                <Button className="h-12 flex-1 border border-border bg-background font-black uppercase italic tracking-widest text-white hover:bg-card">
                  DEEP_PROFILE_V3
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Talent Advisory Info */}
      <div className="group relative mt-20 overflow-hidden rounded-3xl border border-primary/20 bg-background p-10">
        <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]" />
        <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/20">
            <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">
              AI_TALENT_ADVISORY
            </h3>
            <p className="max-w-2xl text-xs font-medium leading-relaxed text-muted-foreground">
              Our neural engine suggests focusing your evaluation on{' '}
              <span className="font-bold italic text-white">Verification_Vectors</span> (Proof Score
              &gt; 90%). Candidates like{' '}
              <span className="font-bold text-primary">Dr. Aris Varma</span> show exceptional
              alignment with your recent 'Propulsion Systems' challenge requirements.
            </p>
            <Button className="h-10 border border-primary/30 bg-background px-8 text-[10px] font-black uppercase italic tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-white">
              RUN_MATCH_SIMULATION
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
