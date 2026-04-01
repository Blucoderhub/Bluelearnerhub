'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Calendar,
  ArrowRight,
  Search,
  Cpu,
  Settings,
  Zap,
  Building2,
  Briefcase,
  Users,
  Clock,
  Filter,
  Globe,
  Star,
  PlusCircle,
  ChevronRight,
  Flame,
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { hackathonsAPI } from '@/lib/api-civilization'

interface HackathonItem {
  id: number
  title: string
  domain: string
  type: string
  status: 'OPEN' | 'UPCOMING' | 'CLOSED'
  prize: string
  participants: number
  daysLeft: number
  icon: LucideIcon
  gradient: string
  description: string
}

const DOMAIN_META: Record<string, { icon: LucideIcon; gradient: string }> = {
  'computer science': { icon: Cpu, gradient: 'from-blue-600 to-indigo-600' },
  software: { icon: Cpu, gradient: 'from-blue-600 to-violet-600' },
  automotive: { icon: Settings, gradient: 'from-red-600 to-orange-600' },
  mechanical: { icon: Settings, gradient: 'from-orange-600 to-amber-600' },
  finance: { icon: Briefcase, gradient: 'from-emerald-600 to-teal-600' },
  management: { icon: Briefcase, gradient: 'from-cyan-600 to-blue-600' },
  civil: { icon: Building2, gradient: 'from-yellow-600 to-orange-600' },
  electrical: { icon: Zap, gradient: 'from-yellow-500 to-amber-500' },
}
const DEFAULT_META = { icon: Trophy, gradient: 'from-primary to-violet-600' }

function getMeta(domain: string) {
  return DOMAIN_META[domain?.toLowerCase()] ?? DEFAULT_META
}

const MOCK_HACKATHONS: HackathonItem[] = [
  {
    id: 1,
    title: 'AI Revolution 2026',
    domain: 'Computer Science',
    type: 'Software',
    status: 'OPEN',
    prize: '$10,000',
    participants: 1240,
    daysLeft: 5,
    icon: Cpu,
    gradient: 'from-blue-600 to-indigo-600',
    description:
      'Build the next generation of AI-powered tools that reshape how humans interact with technology.',
  },
  {
    id: 2,
    title: 'Auto Sim Challenge',
    domain: 'Automotive',
    type: 'Mechanical',
    status: 'OPEN',
    prize: '$5,000',
    participants: 450,
    daysLeft: 12,
    icon: Settings,
    gradient: 'from-red-600 to-orange-600',
    description:
      'Design an autonomous driving simulation using physics engines and real-world sensor data.',
  },
  {
    id: 3,
    title: 'FinTech Hack X',
    domain: 'Finance',
    type: 'Management',
    status: 'OPEN',
    prize: '$7,500',
    participants: 890,
    daysLeft: 3,
    icon: Briefcase,
    gradient: 'from-emerald-600 to-teal-600',
    description: 'Create innovative financial products that promote financial inclusion globally.',
  },
  {
    id: 4,
    title: 'GreenBuild Challenge',
    domain: 'Civil',
    type: 'Design',
    status: 'UPCOMING',
    prize: '$4,000',
    participants: 0,
    daysLeft: 30,
    icon: Building2,
    gradient: 'from-lime-600 to-green-600',
    description: 'Design sustainable structural solutions for the cities of the future.',
  },
  {
    id: 5,
    title: 'ElectroPulse Hack',
    domain: 'Electrical',
    type: 'Hardware',
    status: 'UPCOMING',
    prize: '$3,500',
    participants: 0,
    daysLeft: 21,
    icon: Zap,
    gradient: 'from-yellow-500 to-amber-500',
    description: 'Engineer next-gen power electronics and smart grid solutions.',
  },
  {
    id: 6,
    title: 'Green Civil Structures',
    domain: 'Civil',
    type: 'Design',
    status: 'CLOSED',
    prize: '$3,000',
    participants: 600,
    daysLeft: 0,
    icon: Building2,
    gradient: 'from-slate-600 to-gray-600',
    description: 'Past hackathon on sustainable civil engineering structures.',
  },
]

const TABS = ['All', 'Active', 'Upcoming', 'Past']

const statusConfig = {
  OPEN: {
    label: 'Registration Open',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  UPCOMING: {
    label: 'Coming Soon',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  CLOSED: {
    label: 'Completed',
    color: 'bg-muted/50 text-muted-foreground border-border',
    dot: 'bg-muted-foreground',
  },
}

function HackathonCard({ hack, index }: { hack: HackathonItem; index: number }) {
  const config = statusConfig[hack.status]
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
    >
      {/* Gradient banner */}
      <div className={`relative h-2 bg-gradient-to-r ${hack.gradient}`} />

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={`h-11 w-11 rounded-xl bg-gradient-to-br ${hack.gradient} flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-110`}
          >
            <hack.icon className="h-5 w-5 text-white" />
          </div>
          <Badge
            className={`flex items-center gap-1.5 border text-[10px] font-semibold ${config.color}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${config.dot} ${hack.status === 'OPEN' ? 'animate-pulse' : ''}`}
            />
            {config.label}
          </Badge>
        </div>

        {/* Title + meta */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold leading-snug text-white transition-colors group-hover:text-primary">
            {hack.title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {hack.domain} · {hack.type}
          </p>
        </div>

        <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
          {hack.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
            <div className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
              Prize Pool
            </div>
            <div className="text-base font-black text-white">{hack.prize}</div>
          </div>
          <div className="rounded-xl border border-border bg-background/50 p-3 text-center">
            <div className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
              {hack.status === 'UPCOMING' ? 'Opens In' : 'Participants'}
            </div>
            <div className="text-base font-black text-white">
              {hack.status === 'UPCOMING'
                ? `${hack.daysLeft}d`
                : hack.participants.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 pb-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {hack.status === 'OPEN' && (
            <span className={hack.daysLeft <= 5 ? 'font-semibold text-red-400' : ''}>
              {hack.daysLeft} days left
            </span>
          )}
          {hack.status === 'UPCOMING' && <span>Starts in {hack.daysLeft} days</span>}
          {hack.status === 'CLOSED' && <span>Ended</span>}
        </div>
        <Link href={`/hackathons/${hack.id}`}>
          <Button
            size="sm"
            className={`h-8 gap-1.5 rounded-xl px-4 text-xs font-bold transition-all ${
              hack.status === 'OPEN'
                ? 'bg-primary text-white hover:bg-primary/90'
                : hack.status === 'UPCOMING'
                  ? 'border border-blue-500/20 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  : 'border border-border bg-muted/50 text-muted-foreground hover:bg-muted'
            }`}
          >
            {hack.status === 'OPEN'
              ? 'Join Hackathon'
              : hack.status === 'UPCOMING'
                ? 'Get Notified'
                : 'View Results'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card">
      <div className="h-2 bg-muted" />
      <div className="space-y-4 p-6">
        <div className="flex justify-between">
          <div className="h-11 w-11 rounded-xl bg-muted" />
          <div className="h-6 w-28 rounded-full bg-muted" />
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
      <div className="flex justify-between px-6 pb-6">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-8 w-28 rounded-xl bg-muted" />
      </div>
    </div>
  )
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<HackathonItem[]>(MOCK_HACKATHONS)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    hackathonsAPI
      .list()
      .then((result: any) => {
        const response = result?.data
        const hackathons = Array.isArray(response) ? response : (response?.data || [])
        
        if (hackathons.length > 0) {
          setHackathons(
            hackathons.map((h: any) => {
              const meta = getMeta(h.domain)
              const deadline = h.registration_deadline || h.registration_end
              const daysLeft = deadline
                ? Math.max(0, Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000))
                : 0
              const statusRaw = (h.status || '').toUpperCase()
              const status =
                statusRaw === 'OPEN' ? 'OPEN' : statusRaw === 'UPCOMING' ? 'UPCOMING' : 'CLOSED'
              return {
                id: h.id,
                title: h.title || 'Untitled Hackathon',
                domain: h.domain || 'Technology',
                type: h.type || 'General',
                status,
                prize: h.total_prize_pool || h.prize || 'N/A',
                participants: h.total_participants || h.participants || 0,
                daysLeft,
                icon: meta.icon,
                gradient: meta.gradient,
                description: h.description || 'Participate and innovate.',
              } satisfies HackathonItem
            })
          )
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = hackathons.filter((h) => {
    const matchSearch =
      !search ||
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      h.domain.toLowerCase().includes(search.toLowerCase())
    const matchTab =
      activeTab === 'All' ||
      (activeTab === 'Active' && h.status === 'OPEN') ||
      (activeTab === 'Upcoming' && h.status === 'UPCOMING') ||
      (activeTab === 'Past' && h.status === 'CLOSED')
    return matchSearch && matchTab
  })

  const openCount = hackathons.filter((h) => h.status === 'OPEN').length
  const totalPrize = hackathons
    .filter((h) => h.status === 'OPEN')
    .reduce((acc, h) => {
      const num = parseInt(h.prize.replace(/\D/g, ''))
      return acc + (isNaN(num) ? 0 : num)
    }, 0)

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-3">
          <h1 className="font-heading text-3xl font-black tracking-tight text-white">Hackathons</h1>
          <p className="max-w-xl text-muted-foreground">
            Compete globally, build innovative solutions, and get recognized by top companies. Real
            problems, real prizes.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            className="h-10 gap-2 rounded-xl border-border px-5 text-sm font-bold"
          >
            <Star className="h-4 w-4" />
            My Registrations
          </Button>
          <Button className="h-10 gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-white hover:bg-primary/90">
            <PlusCircle className="h-4 w-4" />
            Host a Hackathon
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Hackathons', value: openCount, icon: Flame, color: 'text-orange-400' },
          {
            label: 'Total Prize Pool',
            value: `$${(totalPrize / 1000).toFixed(0)}K+`,
            icon: Trophy,
            color: 'text-amber-400',
          },
          { label: 'Global Participants', value: '3.2K+', icon: Globe, color: 'text-blue-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card/50 p-5 text-center">
            <Icon className={`h-5 w-5 ${color} mx-auto mb-2`} />
            <div className="text-xl font-black text-white">{value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      {/* Search + tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by domain, theme, or technology..."
            className="h-11 rounded-xl border-border bg-card pl-11 text-sm focus-visible:ring-primary/30"
          />
        </div>

        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl border px-5 py-2 text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'border-primary bg-primary text-white'
                  : 'border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:text-white'
              }`}
            >
              {tab}
              {tab === 'Active' && openCount > 0 && (
                <span className="ml-2 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  {openCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="space-y-3 py-24 text-center">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No hackathons found.</p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearch('')
              setActiveTab('All')
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
              <div className="group flex h-full min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border p-8 text-center transition-all duration-300 hover:border-primary/30 hover:bg-primary/5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card transition-all group-hover:border-primary/20 group-hover:bg-primary/10">
                  <PlusCircle className="h-7 w-7 text-muted-foreground transition-colors group-hover:text-primary" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-foreground/80 transition-colors group-hover:text-white">
                    Host Your Own
                  </h4>
                  <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
                    Organize a specialized competition for your institution or company.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Get Started <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  )
}
