'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Zap, Trophy, ChevronRight, Star, Clock, LayoutGrid, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { exercisesAPI, gamificationAPI } from '@/lib/api-civilization'
import { useAuth } from '@/hooks/useAuth'

// ─── Fallback static challenges (shown when API is unavailable) ──────────────

const FALLBACK_CHALLENGES = [
  {
    id: 'c1',
    title: 'Self-Attention Mechanisms',
    domain: 'Computer Science',
    subDomain: 'Machine Learning',
    difficulty: 'Hard',
    points: 120,
    successRate: '68%',
    solved: true,
  },
  {
    id: 'c2',
    title: 'Equilibrium of Rigid Bodies',
    domain: 'Mechanical',
    subDomain: 'Statics',
    difficulty: 'Medium',
    points: 60,
    successRate: '82%',
    solved: false,
  },
  {
    id: 'c3',
    title: 'Operational Amplifiers Analysis',
    domain: 'Electrical',
    subDomain: 'Circuit Theory',
    difficulty: 'Hard',
    points: 120,
    successRate: '45%',
    solved: false,
  },
  {
    id: 'c4',
    title: 'Supply Chain Optimization',
    domain: 'Management',
    subDomain: 'Operations',
    difficulty: 'Medium',
    points: 60,
    successRate: '75%',
    solved: true,
  },
  {
    id: 'c5',
    title: 'Reinforced Concrete Design',
    domain: 'Civil',
    subDomain: 'Structures',
    difficulty: 'Hard',
    points: 150,
    successRate: '32%',
    solved: false,
  },
]

const FALLBACK_DOMAINS = [
  'All Domains',
  'Computer Science',
  'Mechanical',
  'Electrical',
  'Civil',
  'Management',
]

// ─── Skeleton card ────────────────────────────────────────────────────────────

function ExerciseSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-[2rem] border border-border bg-card p-6">
      <div className="flex items-center gap-6">
        <div className="h-14 w-14 rounded-3xl bg-secondary" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-secondary" />
          <div className="h-5 w-56 rounded bg-secondary" />
          <div className="h-3 w-40 rounded bg-secondary" />
        </div>
      </div>
      <div className="h-16 w-16 rounded-3xl bg-secondary" />
    </div>
  )
}

// ─── Difficulty badge colours ─────────────────────────────────────────────────

const DIFF_COLOUR: Record<string, string> = {
  Easy: 'bg-green-500/10 text-green-400 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function ChallengeHub() {
  const { user } = useAuth()

  const [challenges, setChallenges] = useState(FALLBACK_CHALLENGES as any[])
  const [domains, setDomains] = useState(FALLBACK_DOMAINS)
  const [activeDomain, setActiveDomain] = useState('All Domains')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [userXP, setUserXP] = useState(user?.totalPoints ?? 0)
  const [userLevel, setUserLevel] = useState(user?.level ?? 1)

  // ── Fetch exercises ────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    exercisesAPI
      .list({ sort })
      .then((d: any) => {
        const list = d?.data ?? d
        if (Array.isArray(list) && list.length > 0) {
          setChallenges(list)
          // Extract unique domains from API data
          const unique = [
            'All Domains',
            ...Array.from(new Set<string>(list.map((c: any) => c.domain).filter(Boolean))),
          ]
          setDomains(unique)
        }
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => setLoading(false))
  }, [sort])

  // ── Fetch leaderboard rank for sidebar ────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    gamificationAPI
      .leaderboard(50)
      .then((d: any) => {
        const list: any[] = d?.data ?? d ?? []
        const me = list.find((u: any) => u.id === user.id)
        if (me) {
          setUserXP(me.xp)
          setUserLevel(me.level)
        }
      })
      .catch(() => {})
  }, [user?.id])

  // ── Filtered view ─────────────────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = challenges
    if (activeDomain !== 'All Domains') list = list.filter((c) => c.domain === activeDomain)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.domain?.toLowerCase().includes(q) ||
          c.subDomain?.toLowerCase().includes(q)
      )
    }
    return list
  }, [challenges, activeDomain, search])

  return (
    <div className="mx-auto max-w-6xl space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[3rem] border border-border bg-background p-12 md:p-16">
        <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="border-none bg-primary/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-foreground/70">
            Mastery Practice
          </Badge>
          <h1 className="text-4xl font-black italic leading-tight tracking-tighter text-white md:text-6xl">
            PREPARE_FOR <span className="ai-glow text-foreground/80">WORLD_CLASS</span>{' '}
            DOMAIN_MASTERY
          </h1>
          <p className="text-lg font-medium leading-relaxed text-muted-foreground">
            Solve world-class challenges across all engineering and management disciplines. Gain
            points, climb the global leaderboard, and get certified by the industry's best.
          </p>
          <div className="flex gap-4 pt-4">
            <Button className="h-14 rounded-2xl bg-primary px-8 font-black italic tracking-tighter text-white shadow-xl shadow-primary/15 hover:bg-primary/90">
              START_ASSESSMENT
            </Button>
            <Link href="/hackathons">
              <Button
                variant="outline"
                className="h-14 rounded-2xl border-border px-8 font-black italic tracking-tighter text-white hover:bg-card"
              >
                VIEW_HACKATHONS
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-border dark:bg-card dark:shadow-none lg:flex-row">
        <div className="relative w-full flex-1">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search challenges (e.g. 'Thermodynamics', 'React', 'Equity Financing')"
            className="h-16 rounded-2xl border-none bg-secondary pl-14 pr-6 text-base font-medium focus-visible:ring-primary/50 dark:bg-secondary/50"
          />
        </div>
        <div className="hidden h-10 w-px bg-slate-200 dark:bg-secondary lg:block" />
        <div className="scrollbar-none flex w-full items-center gap-2 overflow-x-auto px-2 pb-2 lg:w-auto lg:px-0 lg:pb-0">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`whitespace-nowrap rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
                activeDomain === domain
                  ? 'bg-primary text-white shadow-lg shadow-primary/15'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground/80'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* Main List */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-4">
            <h3 className="flex items-center gap-2 font-heading text-xl font-black italic">
              <LayoutGrid size={20} className="text-foreground/80" />
              TOP_CHALLENGES
              {!loading && (
                <span className="italic-none text-xs font-bold normal-case text-muted-foreground">
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
              <div className="py-16 text-center font-bold text-muted-foreground">
                No challenges match your filters.
              </div>
            ) : (
              visible.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ x: 6 }}
                  className="group flex items-center justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 transition-all dark:border-border dark:bg-card dark:shadow-none"
                >
                  <div className="flex items-center gap-6">
                    <div
                      className={`rounded-3xl p-4 ${
                        challenge.solved
                          ? 'bg-primary text-white shadow-lg shadow-primary/15'
                          : 'bg-slate-100 text-muted-foreground dark:bg-secondary'
                      }`}
                    >
                      {challenge.solved ? <Trophy size={24} /> : <Star size={24} />}
                    </div>
                    <div>
                      <div className="mb-1 flex items-center gap-2">
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
                      <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 transition-colors group-hover:text-foreground/80 dark:text-white">
                        {challenge.title}
                      </h4>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                          <Zap size={14} className="text-foreground/80" /> {challenge.points} Points
                        </div>
                        <Badge
                          className={`border px-2 py-0.5 text-[10px] font-black ${
                            DIFF_COLOUR[challenge.difficulty] ?? 'bg-secondary text-foreground/70'
                          }`}
                        >
                          {challenge.difficulty}
                        </Badge>
                        {challenge.successRate && challenge.successRate !== null && (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <Star size={14} className="text-primary/80" /> {challenge.successRate}{' '}
                            Success
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <Link href={`/exercises/${challenge.id}`}>
                    <Button
                      variant="ghost"
                      className="h-16 w-16 rounded-3xl bg-secondary transition-all hover:bg-primary hover:text-white dark:bg-secondary/50"
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
          <div className="relative overflow-hidden rounded-[2.5rem] bg-card p-8 text-white">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-primary" />
            <h3 className="mb-6 text-xl font-black italic tracking-tight">YOUR_STATS</h3>
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase text-white/40">Current Level</p>
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/15">
                    <Trophy size={28} />
                  </div>
                  <div>
                    <p className="text-2xl font-black italic tracking-tighter">LEVEL_{userLevel}</p>
                    <p className="text-xs font-bold text-foreground/70">
                      {userXP.toLocaleString()} Total XP
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-white/40">Challenges Available</span>
                  <span className="uppercase tracking-widest text-foreground/70">
                    {challenges.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="uppercase text-white/40">Solved</span>
                  <span className="text-white">
                    {challenges.filter((c) => c.solved).length} / {challenges.length}
                  </span>
                </div>
              </div>

              <Link href="/student/dashboard">
                <Button className="h-12 w-full rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/10">
                  VIEW_DASHBOARD
                </Button>
              </Link>
            </div>
          </div>

          <div className="group cursor-pointer space-y-4 rounded-[2.5rem] border border-border bg-primary/5 p-8 text-center transition-colors hover:bg-primary/10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-foreground/80 transition-transform group-hover:scale-110">
              <Clock size={32} />
            </div>
            <h4 className="text-xl font-black italic tracking-tight text-white/90">COMING_SOON</h4>
            <p className="text-sm font-bold uppercase leading-tight tracking-widest text-muted-foreground">
              Real-time Multiplayer Battles
            </p>
            <Button
              variant="ghost"
              className="text-xs font-black text-foreground/80 hover:text-foreground/70"
            >
              GET_NOTIFIED
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
