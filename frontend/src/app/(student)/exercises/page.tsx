'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Zap,
  Trophy,
  ChevronRight,
  Star,
  Clock,
  LayoutGrid,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { exercisesAPI, gamificationAPI } from '@/lib/api-civilization';
import { useAuth } from '@/hooks/useAuth';

// ─── Fallback static challenges (shown when API is unavailable) ──────────────

const FALLBACK_CHALLENGES = [
  { id: 'c1', title: 'Self-Attention Mechanisms',      domain: 'Computer Science', subDomain: 'Machine Learning', difficulty: 'Hard',   points: 120, successRate: '68%', solved: true  },
  { id: 'c2', title: 'Equilibrium of Rigid Bodies',    domain: 'Mechanical',       subDomain: 'Statics',          difficulty: 'Medium', points: 60,  successRate: '82%', solved: false },
  { id: 'c3', title: 'Operational Amplifiers Analysis',domain: 'Electrical',       subDomain: 'Circuit Theory',   difficulty: 'Hard',   points: 120, successRate: '45%', solved: false },
  { id: 'c4', title: 'Supply Chain Optimization',      domain: 'Management',       subDomain: 'Operations',       difficulty: 'Medium', points: 60,  successRate: '75%', solved: true  },
  { id: 'c5', title: 'Reinforced Concrete Design',     domain: 'Civil',            subDomain: 'Structures',       difficulty: 'Hard',   points: 150, successRate: '32%', solved: false },
];

const FALLBACK_DOMAINS = ['All Domains', 'Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Management'];

// ─── Skeleton card ────────────────────────────────────────────────────────────

function ExerciseSkeleton() {
  return (
    <div className="p-6 rounded-[2rem] bg-card border border-border flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-6">
        <div className="w-14 h-14 rounded-3xl bg-secondary" />
        <div className="space-y-2">
          <div className="h-3 w-32 bg-secondary rounded" />
          <div className="h-5 w-56 bg-secondary rounded" />
          <div className="h-3 w-40 bg-secondary rounded" />
        </div>
      </div>
      <div className="h-16 w-16 rounded-3xl bg-secondary" />
    </div>
  );
}

// ─── Difficulty badge colours ─────────────────────────────────────────────────

const DIFF_COLOUR: Record<string, string> = {
  Easy:   'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard:   'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ChallengeHub() {
  const { user } = useAuth();

  const [challenges,    setChallenges]    = useState(FALLBACK_CHALLENGES as any[]);
  const [domains,       setDomains]       = useState(FALLBACK_DOMAINS);
  const [activeDomain,  setActiveDomain]  = useState('All Domains');
  const [search,        setSearch]        = useState('');
  const [sort,          setSort]          = useState('newest');
  const [loading,       setLoading]       = useState(true);
  const [userXP,        setUserXP]        = useState(user?.totalPoints ?? 0);
  const [userLevel,     setUserLevel]     = useState(user?.level ?? 1);

  // ── Fetch exercises ────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    exercisesAPI
      .list({ sort })
      .then((d: any) => {
        const list = d?.data ?? d;
        if (Array.isArray(list) && list.length > 0) {
          setChallenges(list);
          // Extract unique domains from API data
          const unique = ['All Domains', ...Array.from(new Set<string>(list.map((c: any) => c.domain).filter(Boolean)))];
          setDomains(unique);
        }
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLoading(false));
  }, [sort]);

  // ── Fetch leaderboard rank for sidebar ────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    gamificationAPI
      .leaderboard(50)
      .then((d: any) => {
        const list: any[] = d?.data ?? d ?? [];
        const me = list.find((u: any) => u.id === user.id);
        if (me) { setUserXP(me.xp); setUserLevel(me.level); }
      })
      .catch(() => {});
  }, [user?.id]);

  // ── Filtered view ─────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = challenges;
    if (activeDomain !== 'All Domains') list = list.filter((c) => c.domain === activeDomain);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.domain?.toLowerCase().includes(q) ||
          c.subDomain?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [challenges, activeDomain, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] bg-background p-12 md:p-16 border border-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-primary/15 text-foreground/70 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
            Mastery Practice
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight">
            PREPARE_FOR <span className="text-foreground/80 ai-glow">WORLD_CLASS</span> DOMAIN_MASTERY
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed">
            Solve world-class challenges across all engineering and management disciplines. Gain points, climb the global leaderboard, and get certified by the industry's best.
          </p>
          <div className="flex gap-4 pt-4">
            <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black italic tracking-tighter rounded-2xl shadow-xl shadow-primary/15">
              START_ASSESSMENT
            </Button>
            <Link href="/hackathons">
              <Button variant="outline" className="h-14 px-8 border-border text-white font-black italic tracking-tighter rounded-2xl hover:bg-card">
                VIEW_HACKATHONS
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6 p-4 rounded-[2rem] bg-white dark:bg-card border border-slate-200 dark:border-border shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges (e.g. 'Thermodynamics', 'React', 'Equity Financing')"
            className="h-16 pl-14 pr-6 rounded-2xl border-none bg-secondary dark:bg-secondary/50 text-base font-medium focus-visible:ring-primary/50"
          />
        </div>
        <div className="h-10 w-px bg-slate-200 dark:bg-secondary hidden lg:block" />
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto px-2 lg:px-0 scrollbar-none">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeDomain === domain
                  ? 'bg-primary text-white shadow-lg shadow-primary/15'
                  : 'text-muted-foreground hover:text-foreground/80 hover:bg-primary/5'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black font-heading flex items-center gap-2 italic">
              <LayoutGrid size={20} className="text-foreground/80" />
              TOP_CHALLENGES
              {!loading && (
                <span className="text-xs font-bold text-muted-foreground normal-case italic-none">
                  ({visible.length})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent text-xs font-black text-foreground/90 focus:outline-none"
              >
                <option value="newest">NEWEST</option>
                <option value="points">POINTS</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ExerciseSkeleton key={i} />)
            ) : visible.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground font-bold">
                No challenges match your filters.
              </div>
            ) : (
              visible.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ x: 6 }}
                  className="group p-6 rounded-[2rem] bg-white dark:bg-card border border-slate-200 dark:border-border shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`p-4 rounded-3xl ${
                        challenge.solved
                          ? 'bg-primary text-white shadow-lg shadow-primary/15'
                          : 'bg-slate-100 dark:bg-secondary text-muted-foreground'
                      }`}
                    >
                      {challenge.solved ? <Trophy size={24} /> : <Star size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                          {challenge.domain}
                        </span>
                        {challenge.subDomain && (
                          <>
                            <span className="text-[10px] text-foreground/80">•</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {challenge.subDomain}
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-foreground/80 transition-colors uppercase italic tracking-tighter">
                        {challenge.title}
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Zap size={14} className="text-foreground/80" /> {challenge.points} Points
                        </div>
                        <Badge
                          className={`text-[10px] font-black px-2 py-0.5 border ${
                            DIFF_COLOUR[challenge.difficulty] ?? 'bg-secondary text-foreground/70'
                          }`}
                        >
                          {challenge.difficulty}
                        </Badge>
                        {challenge.successRate && challenge.successRate !== null && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Star size={14} className="text-primary/80" /> {challenge.successRate} Success
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/exercises/${challenge.id}`}>
                    <Button
                      variant="ghost"
                      className="h-16 w-16 rounded-3xl bg-secondary dark:bg-secondary/50 hover:bg-primary hover:text-white transition-all"
                    >
                      <ChevronRight size={24} />
                    </Button>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
            <h3 className="text-xl font-black italic mb-6 tracking-tight">YOUR_STATS</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase mb-2">Current Level</p>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/15">
                    <Trophy size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black italic tracking-tighter">LEVEL_{userLevel}</p>
                    <p className="text-xs font-bold text-foreground/70">{userXP.toLocaleString()} Total XP</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white/40 uppercase">Challenges Available</span>
                  <span className="text-foreground/70 tracking-widest uppercase">{challenges.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white/40 uppercase">Solved</span>
                  <span className="text-white">{challenges.filter((c) => c.solved).length} / {challenges.length}</span>
                </div>
              </div>

              <Link href="/student/dashboard">
                <Button className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest">
                  VIEW_DASHBOARD
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-border space-y-4 text-center group cursor-pointer hover:bg-primary/10 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-foreground/80 mx-auto group-hover:scale-110 transition-transform">
              <Clock size={32} />
            </div>
            <h4 className="text-xl font-black italic tracking-tight text-white/90">COMING_SOON</h4>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest leading-tight">
              Real-time Multiplayer Battles
            </p>
            <Button variant="ghost" className="text-xs font-black text-foreground/80 hover:text-foreground/70">
              GET_NOTIFIED
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
