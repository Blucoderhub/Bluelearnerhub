'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, Calendar, ArrowRight, Search, Cpu, Settings,
  Zap, Building2, Briefcase, Users, Clock, Filter, Globe,
  Star, PlusCircle, ChevronRight, Flame,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { hackathonsAPI } from '@/lib/api-civilization';

interface HackathonItem {
  id: number;
  title: string;
  domain: string;
  type: string;
  status: 'OPEN' | 'UPCOMING' | 'CLOSED';
  prize: string;
  participants: number;
  daysLeft: number;
  icon: LucideIcon;
  gradient: string;
  description: string;
}

const DOMAIN_META: Record<string, { icon: LucideIcon; gradient: string }> = {
  'computer science': { icon: Cpu,       gradient: 'from-blue-600 to-indigo-600' },
  'software':         { icon: Cpu,       gradient: 'from-blue-600 to-violet-600' },
  'automotive':       { icon: Settings,  gradient: 'from-red-600 to-orange-600' },
  'mechanical':       { icon: Settings,  gradient: 'from-orange-600 to-amber-600' },
  'finance':          { icon: Briefcase, gradient: 'from-emerald-600 to-teal-600' },
  'management':       { icon: Briefcase, gradient: 'from-cyan-600 to-blue-600' },
  'civil':            { icon: Building2, gradient: 'from-yellow-600 to-orange-600' },
  'electrical':       { icon: Zap,       gradient: 'from-yellow-500 to-amber-500' },
};
const DEFAULT_META = { icon: Trophy, gradient: 'from-primary to-violet-600' };

function getMeta(domain: string) {
  return DOMAIN_META[domain?.toLowerCase()] ?? DEFAULT_META;
}

const MOCK_HACKATHONS: HackathonItem[] = [
  {
    id: 1, title: 'AI Revolution 2026', domain: 'Computer Science', type: 'Software',
    status: 'OPEN', prize: '$10,000', participants: 1240, daysLeft: 5,
    icon: Cpu, gradient: 'from-blue-600 to-indigo-600',
    description: 'Build the next generation of AI-powered tools that reshape how humans interact with technology.',
  },
  {
    id: 2, title: 'Auto Sim Challenge', domain: 'Automotive', type: 'Mechanical',
    status: 'OPEN', prize: '$5,000', participants: 450, daysLeft: 12,
    icon: Settings, gradient: 'from-red-600 to-orange-600',
    description: 'Design an autonomous driving simulation using physics engines and real-world sensor data.',
  },
  {
    id: 3, title: 'FinTech Hack X', domain: 'Finance', type: 'Management',
    status: 'OPEN', prize: '$7,500', participants: 890, daysLeft: 3,
    icon: Briefcase, gradient: 'from-emerald-600 to-teal-600',
    description: 'Create innovative financial products that promote financial inclusion globally.',
  },
  {
    id: 4, title: 'GreenBuild Challenge', domain: 'Civil', type: 'Design',
    status: 'UPCOMING', prize: '$4,000', participants: 0, daysLeft: 30,
    icon: Building2, gradient: 'from-lime-600 to-green-600',
    description: 'Design sustainable structural solutions for the cities of the future.',
  },
  {
    id: 5, title: 'ElectroPulse Hack', domain: 'Electrical', type: 'Hardware',
    status: 'UPCOMING', prize: '$3,500', participants: 0, daysLeft: 21,
    icon: Zap, gradient: 'from-yellow-500 to-amber-500',
    description: 'Engineer next-gen power electronics and smart grid solutions.',
  },
  {
    id: 6, title: 'Green Civil Structures', domain: 'Civil', type: 'Design',
    status: 'CLOSED', prize: '$3,000', participants: 600, daysLeft: 0,
    icon: Building2, gradient: 'from-slate-600 to-gray-600',
    description: 'Past hackathon on sustainable civil engineering structures.',
  },
];

const TABS = ['All', 'Active', 'Upcoming', 'Past'];

const statusConfig = {
  OPEN: { label: 'Registration Open', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
  UPCOMING: { label: 'Coming Soon', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', dot: 'bg-blue-400' },
  CLOSED: { label: 'Completed', color: 'bg-muted/50 text-muted-foreground border-border', dot: 'bg-muted-foreground' },
};

function HackathonCard({ hack, index }: { hack: HackathonItem; index: number }) {
  const config = statusConfig[hack.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Gradient banner */}
      <div className={`relative h-2 bg-gradient-to-r ${hack.gradient}`} />

      <div className="p-6 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${hack.gradient} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <hack.icon className="w-5 h-5 text-white" />
          </div>
          <Badge className={`text-[10px] border font-semibold flex items-center gap-1.5 ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${hack.status === 'OPEN' ? 'animate-pulse' : ''}`} />
            {config.label}
          </Badge>
        </div>

        {/* Title + meta */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors leading-snug">
            {hack.title}
          </h3>
          <p className="text-xs text-muted-foreground">{hack.domain} · {hack.type}</p>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {hack.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-background/50 border border-border text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Prize Pool</div>
            <div className="text-base font-black text-white">{hack.prize}</div>
          </div>
          <div className="p-3 rounded-xl bg-background/50 border border-border text-center">
            <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
              {hack.status === 'UPCOMING' ? 'Opens In' : 'Participants'}
            </div>
            <div className="text-base font-black text-white">
              {hack.status === 'UPCOMING' ? `${hack.daysLeft}d` : hack.participants.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="w-3.5 h-3.5" />
          {hack.status === 'OPEN' && (
            <span className={hack.daysLeft <= 5 ? 'text-red-400 font-semibold' : ''}>
              {hack.daysLeft} days left
            </span>
          )}
          {hack.status === 'UPCOMING' && <span>Starts in {hack.daysLeft} days</span>}
          {hack.status === 'CLOSED' && <span>Ended</span>}
        </div>
        <Link href={`/hackathons/${hack.id}`}>
          <Button
            size="sm"
            className={`rounded-xl text-xs font-bold h-8 px-4 gap-1.5 transition-all ${
              hack.status === 'OPEN'
                ? 'bg-primary hover:bg-primary/90 text-white'
                : hack.status === 'UPCOMING'
                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20'
                : 'bg-muted/50 hover:bg-muted text-muted-foreground border border-border'
            }`}
          >
            {hack.status === 'OPEN' ? 'Join Hackathon' : hack.status === 'UPCOMING' ? 'Get Notified' : 'View Results'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-2 bg-muted" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <div className="w-11 h-11 rounded-xl bg-muted" />
          <div className="w-28 h-6 rounded-full bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
        <div className="h-8 rounded bg-muted" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-16 rounded-xl bg-muted" />
          <div className="h-16 rounded-xl bg-muted" />
        </div>
      </div>
      <div className="px-6 pb-6 flex justify-between">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-8 w-28 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<HackathonItem[]>(MOCK_HACKATHONS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    hackathonsAPI.list()
      .then((d) => {
        if (d?.length) {
          setHackathons(d.map((h: any) => {
            const meta = getMeta(h.domain);
            const deadline = h.registrationDeadline || h.deadline;
            const daysLeft = deadline
              ? Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000))
              : 0;
            const statusRaw = (h.status || '').toUpperCase();
            const status = statusRaw === 'OPEN' ? 'OPEN' : statusRaw === 'UPCOMING' ? 'UPCOMING' : 'CLOSED';
            return {
              id: h.id, title: h.title || 'Untitled Hackathon',
              domain: h.domain || 'Technology', type: h.type || 'General',
              status, prize: h.prizePool || h.prize || 'N/A',
              participants: h.participantCount ?? h.participants ?? 0,
              daysLeft, icon: meta.icon, gradient: meta.gradient,
              description: h.description || 'Participate and innovate.',
            } satisfies HackathonItem;
          }));
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filtered = hackathons.filter((h) => {
    const matchSearch = !search || h.title.toLowerCase().includes(search.toLowerCase()) || h.domain.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All' ||
      (activeTab === 'Active' && h.status === 'OPEN') ||
      (activeTab === 'Upcoming' && h.status === 'UPCOMING') ||
      (activeTab === 'Past' && h.status === 'CLOSED');
    return matchSearch && matchTab;
  });

  const openCount = hackathons.filter(h => h.status === 'OPEN').length;
  const totalPrize = hackathons.filter(h => h.status === 'OPEN').reduce((acc, h) => {
    const num = parseInt(h.prize.replace(/\D/g, ''));
    return acc + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-black font-heading tracking-tight text-white">Hackathons</h1>
          <p className="text-muted-foreground max-w-xl">
            Compete globally, build innovative solutions, and get recognized by top companies. Real problems, real prizes.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" className="h-10 px-5 rounded-xl border-border text-sm font-bold gap-2">
            <Star className="w-4 h-4" />
            My Registrations
          </Button>
          <Button className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold gap-2">
            <PlusCircle className="w-4 h-4" />
            Host a Hackathon
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Hackathons', value: openCount, icon: Flame, color: 'text-orange-400' },
          { label: 'Total Prize Pool', value: `$${(totalPrize / 1000).toFixed(0)}K+`, icon: Trophy, color: 'text-amber-400' },
          { label: 'Global Participants', value: '3.2K+', icon: Globe, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl border border-border bg-card/50 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
            <div className="text-xl font-black text-white">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Search + tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by domain, theme, or technology..."
            className="pl-11 bg-card border-border h-11 rounded-xl text-sm focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold border transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-muted-foreground hover:text-white hover:border-border/80 bg-card/50'
              }`}
            >
              {tab}
              {tab === 'Active' && openCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 rounded-full font-bold">{openCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <Trophy className="w-12 h-12 text-muted-foreground opacity-30 mx-auto" />
          <p className="text-muted-foreground">No hackathons found.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setActiveTab('All'); }}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hack, i) => (
            <HackathonCard key={hack.id} hack={hack} index={i} />
          ))}

          {/* Host CTA card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/corporate/host-hackathon">
              <div className="h-full min-h-[280px] border border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <PlusCircle className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground/80 group-hover:text-white transition-colors">Host Your Own</h4>
                  <p className="text-xs text-muted-foreground max-w-[200px] mt-2 leading-relaxed">
                    Organize a specialized competition for your institution or company.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Get Started <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
