'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2,
  Users,
  GraduationCap,
  BarChart3,
  PieChart,
  Settings,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { tracksAPI, gamificationAPI } from '@/lib/api-civilization'
import { LearningTrack } from '@/types'

interface LeaderboardEntry {
  userId?: number
  fullName?: string
  totalPoints?: number
  level?: number
}

interface Track {
  id: number
  title: string
  domain?: string
  enrollmentCount?: number
}

export default function InstitutionDashboard() {
  const [topStudents, setTopStudents] = useState<{ userId: number; fullName: string; totalPoints: number; level: number }[]>([])
  const [tracks, setTracks] = useState<{ id: number; title: string; domain: string; enrollmentCount: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      gamificationAPI.leaderboard(5),
      tracksAPI.list(),
    ]).then(([lb, tr]) => {
      if (lb.status === 'fulfilled') {
        const data = lb.value?.data ?? lb.value ?? []
        const entries = Array.isArray(data) ? data : []
        setTopStudents((entries as any[]).map((e) => ({
          userId: Number(e.rank) || 0,
          fullName: e.name,
          totalPoints: e.xp || e.totalPoints || 0,
          level: e.level ?? 1,
        })))
      }
      if (tr.status === 'fulfilled') {
        const data = tr.value?.data ?? tr.value ?? []
        const trackData = Array.isArray(data) ? data : []
        setTracks(trackData.slice(0, 5).map((t: any) => ({
          id: t.id,
          title: t.title,
          domain: t.slug || '',
          enrollmentCount: t.enrollmentCount,
        })))
      }
      setLoading(false)
    })
  }, [])

  const totalEnrolled = tracks.reduce((s, t) => s + (t.enrollmentCount ?? 0), 0)

  const stats = [
    { title: 'Total Enrollment', value: loading ? '...' : totalEnrolled.toLocaleString(), icon: GraduationCap, color: 'text-foreground/70' },
    { title: 'Active Tracks', value: loading ? '...' : String(tracks.length), icon: BarChart3, color: 'text-blue-400' },
    { title: 'Top Learners', value: loading ? '...' : String(topStudents.length), icon: Users, color: 'text-foreground/70' },
    { title: 'Placement Rate', value: '88%', icon: PieChart, color: 'text-purple-400' },
  ]

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Institution <span className="text-foreground/70">Headquarters</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Global overview of academic performance, faculty activity, and institutional growth.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border bg-card/50 text-white hover:bg-secondary">
            <Settings className="mr-2 h-4 w-4" />
            Institution Settings
          </Button>
          <Button className="bg-primary text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:bg-primary">
            <PieChart className="mr-2 h-4 w-4" />
            Generate Annual Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="group border-b-2 border-border border-b-transparent bg-slate-900/40 transition-all hover:border-b-primary">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color} transition-transform group-hover:rotate-12`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-white">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Analytics Section */}
        <div className="space-y-6 lg:col-span-2">
          {/* Track Enrollment Chart */}
          <Card className="border-border bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Track Enrollment Overview</CardTitle>
                <CardDescription>Enrollment counts across active learning tracks.</CardDescription>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : tracks.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
                  No tracks available
                </div>
              ) : (
                <div className="space-y-3">
                  {tracks.map((track) => {
                    const max = Math.max(...tracks.map((t) => t.enrollmentCount ?? 0), 1)
                    const pct = Math.round(((track.enrollmentCount ?? 0) / max) * 100)
                    return (
                      <div key={track.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="truncate font-medium text-white">{track.title}</span>
                          <span className="ml-2 shrink-0 font-bold text-foreground/70">
                            {track.enrollmentCount ?? 0} enrolled
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Students */}
          <Card className="border-border bg-slate-900/40">
            <CardHeader>
              <CardTitle className="text-base font-bold">Top Performing Students</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-secondary" />
                  ))
                : topStudents.slice(0, 5).map((s, idx) => (
                    <div key={s.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary text-xs font-bold text-primary">
                          #{idx + 1}
                        </div>
                        <span className="text-sm font-medium text-white">{s.fullName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground/70">
                          {s.totalPoints.toLocaleString()} XP
                        </span>
                        <span className="ml-2 text-[10px] text-muted-foreground">Lv.{s.level}</span>
                      </div>
                    </div>
                  ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-border bg-background/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold">Governance & Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-primary/10 bg-primary/5 p-3">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-foreground/70" />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  All academic records for{' '}
                  <span className="font-medium text-white">Winter 2026</span> are synchronized and secured.
                </p>
              </div>
              <Button variant="outline" className="h-10 w-full border-border text-xs hover:bg-secondary">
                Audit Registry
              </Button>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border bg-gradient-to-t from-muted/20 to-background/40">
            <div className="p-6">
              <Building2 className="mb-4 h-10 w-10 text-foreground/80 transition-transform group-hover:scale-110" />
              <h4 className="text-lg font-black italic tracking-tight">INSTITUTIONAL AI</h4>
              <p className="mb-4 mt-2 text-xs text-muted-foreground">
                Leverage predictive analytics to forecast enrollment trends and student success bottlenecks.
              </p>
              <Button size="sm" className="h-10 w-full bg-slate-100 text-[10px] font-black tracking-widest text-black hover:bg-white">
                LAUNCH ANALYTICS ENGINE
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
