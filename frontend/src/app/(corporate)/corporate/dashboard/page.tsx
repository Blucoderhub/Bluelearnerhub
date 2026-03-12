'use client';

import { motion } from 'framer-motion';
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
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CorporateDashboardPage() {
  const stats = [
    { label: 'Active Hackathons', value: '03', icon: Trophy, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Open Positions', value: '12', icon: Briefcase, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Applicants', value: '458', icon: Users, color: 'text-foreground/70', bg: 'bg-primary/10' },
    { label: 'Brand Reach', value: '12.4K', icon: LineChart, color: 'text-foreground/70', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
            ORG_DASHBOARD <span className="text-primary ai-glow">LEVEL_MAX</span>
          </h1>
          <p className="text-muted-foreground max-w-xl font-medium">
            Manage your corporate presence, evaluate top-tier engineering talent, and host industry-leading hackathons.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-card border-border text-white hover:bg-secondary h-12 px-6 font-bold italic">
            ORG_PROFILE
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-black italic tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            NEW_HACKATHON_CHALLENGE
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border-border hover:bg-card/60 transition-all group overflow-hidden relative">
              <div className="p-6 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Talent Analytics Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> TALENT_PIPELINE_ANALYTICS
            </h3>
            <Button variant="link" className="text-primary text-xs font-black uppercase tracking-widest italic group">
              View All Metrics <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <Card className="bg-background/40 border-border p-8 h-[400px] flex flex-col relative overflow-hidden group/chart">
            <div className="flex-1 flex items-end justify-between gap-4">
              {/* Theoretical Bar Chart */}
              {[
                { d: 'CS', v: '85%', color: 'bg-blue-500' },
                { d: 'MECH', v: '45%', color: 'bg-primary' },
                { d: 'ELEC', v: '62%', color: 'bg-yellow-500' },
                { d: 'CIVIL', v: '30%', color: 'bg-primary' },
                { d: 'FIN', v: '78%', color: 'bg-purple-500' },
                { d: 'MBA', v: '92%', color: 'bg-rose-500' },
              ].map((bar, i) => (
                <div key={bar.d} className="flex-1 flex flex-col items-center gap-3">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: bar.v }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className={`w-full max-w-[40px] ${bar.color} rounded-t-xl group-hover/chart:opacity-80 transition-opacity relative group/bar shadow-[0_0_20px_rgba(var(--primary),0.1)]`}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      {bar.v}
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{bar.d}</span>
                </div>
              ))}
            </div>
            <div className="absolute top-8 right-8 flex flex-col gap-2">
              <Badge variant="outline" className="bg-card border-border text-[9px] font-black uppercase text-muted-foreground">Monthly Growth: +12.4%</Badge>
            </div>
          </Card>
        </div>

        {/* AI Recommendations Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> AI_HIRING_COPILOT
          </h3>
          <Card className="bg-card border-primary/20 p-6 space-y-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-transparent" />
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-black text-white uppercase italic tracking-widest">Target Recommendations</span>
            </div>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
              Based on your current tech stack requirements, we recommend focusing your next hackathon on <span className="text-primary font-bold">Mechanical Design Automation</span>.
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-background border border-border rounded-xl flex items-center gap-3 hover:border-primary/20 transition-all cursor-pointer">
                <Target className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase leading-none italic">Top Domain</p>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase mt-1">Robotics & Control Systems</p>
                </div>
              </div>
              <div className="p-3 bg-background border border-border rounded-xl flex items-center gap-3 hover:border-primary/20 transition-all cursor-pointer">
                <Search className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] font-black text-white uppercase leading-none italic">Talent Hub</p>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase mt-1">IIT Madras - Mech Dept</p>
                </div>
              </div>
            </div>
            <Button className="w-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-black italic text-[10px] uppercase h-10 border border-primary/20 transition-all">
              GENERATE_HIRING_CAMPAIGN
            </Button>
          </Card>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-black italic text-white uppercase tracking-tighter flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> TOP_TALENT_FEED
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Dr. Aris Varma', domain: 'Aeronautical', score: '98', tag: 'PhD Scholar' },
            { name: 'Sarah Chen', domain: 'Software Eng', score: '95', tag: 'Full Stack Elite' },
            { name: 'Marcus Rashford', domain: 'Business Analyt.', score: '92', tag: 'MBA Topper' },
          ].map((talent, i) => (
            <Card key={talent.name} className="bg-card border-border hover:bg-secondary/40 transition-all group overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-secondary border border-border mb-2" />
                  <Badge className="bg-primary/10 text-foreground/70 border-none text-[8px] font-black italic">{talent.score} PROOF_SCORE</Badge>
                </div>
                <CardTitle className="text-lg font-black italic text-white">{talent.name}</CardTitle>
                <CardDescription className="text-[9px] text-muted-foreground font-bold uppercase">{talent.domain} • {talent.tag}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 flex gap-2">
                <Button variant="ghost" className="flex-1 h-9 text-[10px] font-black uppercase text-muted-foreground hover:text-white border border-border">VIEW_PROFILE</Button>
                <Button className="flex-1 h-9 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-[10px] font-black uppercase">SHORTLIST</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
