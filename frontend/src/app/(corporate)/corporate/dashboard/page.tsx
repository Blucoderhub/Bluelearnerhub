'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  Trophy,
  Briefcase,
  LineChart,
  Plus,
  ExternalLink,
  Search,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Target,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function CorporateDashboardPage() {
  const stats = [
    {
      label: 'Active Hackathons',
      value: '03',
      icon: Trophy,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Open Positions',
      value: '12',
      icon: Briefcase,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Applicants',
      value: '458',
      icon: Users,
      color: 'text-foreground/70',
      bg: 'bg-primary/10',
    },
    {
      label: 'Brand Reach',
      value: '12.4K',
      icon: LineChart,
      color: 'text-foreground/70',
      bg: 'bg-primary/10',
    },
  ]

  return (
    <div className="animate-in fade-in space-y-8 pb-20 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
            ORG_DASHBOARD <span className="ai-glow text-primary">LEVEL_MAX</span>
          </h1>
          <p className="max-w-xl font-medium text-muted-foreground">
            Manage your corporate presence, evaluate top-tier engineering talent, and host
            industry-leading hackathons.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="h-12 border-border bg-card px-6 font-bold italic text-white hover:bg-secondary">
            ORG_PROFILE
          </Button>
          <Button className="h-12 bg-primary px-8 font-black italic tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:bg-primary/90">
            NEW_HACKATHON_CHALLENGE
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group relative overflow-hidden border-border bg-slate-900/40 transition-all hover:bg-card/60">
              <div className="relative z-10 flex items-center justify-between p-6">
                <div>
                  <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div
                  className={`rounded-2xl p-3 ${stat.bg} ${stat.color} transition-transform duration-500 group-hover:scale-110`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Talent Analytics Section */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter text-white">
              <TrendingUp className="h-5 w-5 text-primary" /> TALENT_PIPELINE_ANALYTICS
            </h3>
            <Button
              variant="link"
              className="group text-xs font-black uppercase italic tracking-widest text-primary"
            >
              View All Metrics{' '}
              <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <Card className="group/chart relative flex h-[400px] flex-col overflow-hidden border-border bg-background/40 p-8">
            <div className="flex flex-1 items-end justify-between gap-4">
              {/* Theoretical Bar Chart */}
              {[
                { d: 'CS', v: '85%', color: 'bg-blue-500' },
                { d: 'MECH', v: '45%', color: 'bg-primary' },
                { d: 'ELEC', v: '62%', color: 'bg-yellow-500' },
                { d: 'CIVIL', v: '30%', color: 'bg-primary' },
                { d: 'FIN', v: '78%', color: 'bg-purple-500' },
                { d: 'MBA', v: '92%', color: 'bg-rose-500' },
              ].map((bar, i) => (
                <div key={bar.d} className="flex flex-1 flex-col items-center gap-3">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: bar.v }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`w-full max-w-[40px] ${bar.color} group/bar relative rounded-t-xl shadow-[0_0_20px_rgba(var(--primary),0.1)] transition-opacity group-hover/chart:opacity-80`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-secondary px-2 py-1 text-[10px] font-black text-white opacity-0 transition-opacity group-hover/bar:opacity-100">
                      {bar.v}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {bar.d}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute right-8 top-8 flex flex-col gap-2">
              <Badge
                variant="outline"
                className="border-border bg-card text-[9px] font-black uppercase text-muted-foreground"
              >
                Monthly Growth: +12.4%
              </Badge>
            </div>
          </Card>
        </div>

        {/* AI Recommendations Section */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter text-white">
            <Zap className="h-5 w-5 text-primary" /> AI_HIRING_COPILOT
          </h3>
          <Card className="group relative space-y-4 overflow-hidden border-primary/20 bg-card p-6">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary/50 to-transparent" />
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase italic tracking-widest text-white">
                Target Recommendations
              </span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-muted-foreground">
              Based on your current tech stack requirements, we recommend focusing your next
              hackathon on{' '}
              <span className="font-bold text-primary">Mechanical Design Automation</span>.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20">
                <Target className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] font-black uppercase italic leading-none text-white">
                    Top Domain
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
                    Robotics & Control Systems
                  </p>
                </div>
              </div>
              <div className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 transition-all hover:border-primary/20">
                <Search className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-[10px] font-black uppercase italic leading-none text-white">
                    Talent Hub
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase text-muted-foreground">
                    IIT Madras - Mech Dept
                  </p>
                </div>
              </div>
            </div>
            <Button className="h-10 w-full border border-primary/20 bg-primary/10 text-[10px] font-black uppercase italic text-primary transition-all hover:bg-primary hover:text-primary-foreground">
              GENERATE_HIRING_CAMPAIGN
            </Button>
          </Card>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-2 text-xl font-black uppercase italic tracking-tighter text-white">
          <Users className="h-5 w-5 text-primary" /> TOP_TALENT_FEED
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Dr. Aris Varma', domain: 'Aeronautical', score: '98', tag: 'PhD Scholar' },
            { name: 'Sarah Chen', domain: 'Software Eng', score: '95', tag: 'Full Stack Elite' },
            { name: 'Marcus Rashford', domain: 'Business Analyt.', score: '92', tag: 'MBA Topper' },
          ].map((talent, i) => (
            <Card
              key={talent.name}
              className="group overflow-hidden border-border bg-card transition-all hover:bg-secondary/40"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="mb-2 h-12 w-12 rounded-2xl border border-border bg-secondary" />
                  <Badge className="border-none bg-primary/10 text-[8px] font-black italic text-foreground/70">
                    {talent.score} PROOF_SCORE
                  </Badge>
                </div>
                <CardTitle className="text-lg font-black italic text-white">
                  {talent.name}
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-muted-foreground">
                  {talent.domain} • {talent.tag}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex gap-2 pt-0">
                <Button
                  variant="ghost"
                  className="h-9 flex-1 border border-border text-[10px] font-black uppercase text-muted-foreground hover:text-white"
                >
                  VIEW_PROFILE
                </Button>
                <Button className="h-9 flex-1 bg-primary/10 text-[10px] font-black uppercase text-primary hover:bg-primary hover:text-primary-foreground">
                  SHORTLIST
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
