'use client';

import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  Calendar,
  ArrowRight,
  Filter,
  Cpu,
  Settings,
  Zap,
  Building2,
  Briefcase,
  Star,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const hackathons = [
  {
    id: 1,
    title: 'AI_REVOLUTION_2026',
    domain: 'Computer Science',
    type: 'Software',
    status: 'OPEN',
    prize: '$10,000',
    participants: 1240,
    daysLeft: 5,
    icon: Cpu,
    gradient: 'from-blue-600/20 to-purple-600/20',
  },
  {
    id: 2,
    title: 'AUTO_SIM_CHALLENGE',
    domain: 'Automotive',
    type: 'Mechanical',
    status: 'OPEN',
    prize: '$5,000',
    participants: 450,
    daysLeft: 12,
    icon: Settings,
    gradient: 'from-primary/90/20 to-red-600/20',
  },
  {
    id: 3,
    title: 'FINANCE_X_HACK',
    domain: 'Finance',
    type: 'Management',
    status: 'OPEN',
    prize: '$7,500',
    participants: 890,
    daysLeft: 3,
    icon: Briefcase,
    gradient: 'from-primary/90/20 to-cyan-600/20',
  },
  {
    id: 4,
    title: 'GREEN_CIVIL_STRUCTURES',
    domain: 'Civil',
    type: 'Design',
    status: 'CLOSED',
    prize: '$3,000',
    participants: 600,
    daysLeft: 0,
    icon: Building2,
    gradient: 'from-blue-600/20 to-blue-600/20',
  },
];

export default function HackathonsPage() {
  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
            COMPETE <span className="text-primary ai-glow">GLOBALLY</span>
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Join domain-specific hackathons, build innovative solutions, and get noticed by top mechanical, electrical, and tech companies.
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-card border-border text-white hover:bg-secondary h-12 px-6 font-bold italic">
            YOUR_SUBMISSIONS
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-black italic tracking-widest shadow-[0_0_20px_rgba(var(--primary),0.3)]">
            HOST_A_HACKATHON
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-900/40 p-2 rounded-2xl border border-border">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by domain, tech, or theme..."
            className="pl-12 bg-transparent border-none text-white placeholder:text-muted-foreground h-12 focus-visible:ring-0"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto p-1">
          <Button variant="ghost" className="text-xs font-bold text-muted-foreground hover:text-white h-10 px-4">
            <Filter className="w-3.5 h-3.5 mr-2" /> Filter By Domain
          </Button>
          <div className="h-10 w-px bg-secondary hidden md:block" />
          <Badge className="bg-primary/10 text-primary border-primary/20 h-10 px-4 rounded-lg hidden md:flex">
            All Categories
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hack, i) => (
          <motion.div
            key={hack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/40 border-border hover:bg-card/60 transition-all group relative overflow-hidden h-full flex flex-col">
              <div className={`absolute top-0 left-0 w-full h-[120px] bg-gradient-to-br ${hack.gradient} blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />

              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-background/80 border border-border group-hover:scale-110 transition-transform duration-500">
                    <hack.icon className="w-5 h-5 text-primary" />
                  </div>
                  {hack.status === 'OPEN' ? (
                    <Badge className="bg-primary/10 text-foreground/70 border-border text-[10px] items-center gap-1.5 flex uppercase font-black italic">
                      <Zap className="w-2.5 h-2.5 fill-current" /> Registration Open
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-secondary text-muted-foreground border-none text-[10px] uppercase font-black italic">
                      COMPLETED
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-black italic tracking-tighter text-white group-hover:text-primary transition-colors">
                  {hack.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-xs font-bold uppercase tracking-widest pt-1">
                  {hack.domain} • {hack.type}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 flex-1">
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Prize Pool</p>
                    <p className="text-lg font-black text-white">{hack.prize}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Participants</p>
                    <p className="text-lg font-black text-white">{hack.participants}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="relative z-10 p-6 border-t border-border bg-background/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={hack.daysLeft < 5 ? 'text-red-400' : 'text-muted-foreground'}>
                    {hack.daysLeft > 0 ? `${hack.daysLeft} DAYS LEFT` : 'ENDED'}
                  </span>
                </div>
                <Button size="sm" asChild className="bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 font-black italic rounded-lg group/btn">
                  <Link href={`/hackathons/${hack.id}`}>
                    {hack.status === 'OPEN' ? 'JOIN HACK' : 'VIEW RECAP'}
                    <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}

        {/* Create Custom Hackathon CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="h-full"
        >
          <div className="h-full bg-background/40 border border-dashed border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:border-border transition-all">
            <div className="w-16 h-16 rounded-3xl bg-card border border-border flex items-center justify-center group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
              <Star className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-all" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground/80 group-hover:text-white">HOST_YOUR_OWN</h4>
              <p className="text-xs text-muted-foreground max-w-[200px] mt-2 group-hover:text-muted-foreground">
                Organize a specialized competition for your institution or company.
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-[10px] font-black uppercase italic tracking-widest border-border hover:bg-card">
              LEARN MORE
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
