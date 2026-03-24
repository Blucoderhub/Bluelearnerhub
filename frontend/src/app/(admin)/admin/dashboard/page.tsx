'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  ShieldAlert,
  Globe,
  Terminal,
  Zap,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { analyticsAPI } from '@/lib/api-civilization'

interface PlatformStats {
  users: { total_users: number; new_users_last_30_days: number }
  quizzes: { total_quizzes: number; active_quizzes: number }
  learning: { total_learning_paths: number; published_learning_paths: number; total_enrollments: number }
  hackathons: { total_hackathons: number; upcoming_hackathons: number; ongoing_hackathons: number; completed_hackathons: number }
  totalXpAwarded: number
}

const FALLBACK: PlatformStats = {
  users: { total_users: 0, new_users_last_30_days: 0 },
  quizzes: { total_quizzes: 0, active_quizzes: 0 },
  learning: { total_learning_paths: 0, published_learning_paths: 0, total_enrollments: 0 },
  hackathons: { total_hackathons: 0, upcoming_hackathons: 0, ongoing_hackathons: 0, completed_hackathons: 0 },
  totalXpAwarded: 0,
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<PlatformStats>(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsAPI.platform()
      .then((d) => setStats(d?.data ?? d ?? FALLBACK))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n)

  const metrics = [
    {
      label: 'Total_Users_Live',
      value: loading ? '...' : fmt(stats.users.total_users),
      change: loading ? '' : `+${stats.users.new_users_last_30_days} this month`,
      icon: Users,
      color: 'text-primary/80',
    },
    {
      label: 'Course_Engagements',
      value: loading ? '...' : fmt(stats.learning.total_enrollments),
      change: loading ? '' : `${stats.learning.published_learning_paths} active paths`,
      icon: BookOpen,
      color: 'text-purple-500',
    },
    {
      label: 'Hackathons_Hosted',
      value: loading ? '...' : fmt(stats.hackathons.total_hackathons),
      change: loading ? '' : `${stats.hackathons.ongoing_hackathons} live now`,
      icon: Trophy,
      color: 'text-foreground/80',
    },
    {
      label: 'Total_XP_Awarded',
      value: loading ? '...' : fmt(stats.totalXpAwarded),
      change: loading ? '' : `${stats.quizzes.active_quizzes} active quizzes`,
      icon: Zap,
      color: 'text-foreground/80',
    },
  ]

  const systemVitals = [
    { label: 'CPU_LOAD', value: '42%', status: 'nominal', color: 'text-foreground/80' },
    { label: 'MEMORY_USAGE', value: '8.4GB', status: 'optimal', color: 'text-primary/80' },
    { label: 'NET_THROUGHPUT', value: '1.2GB/s', status: 'peak', color: 'text-purple-500' },
    { label: 'LATENCY_GLOBAL', value: '24ms', status: 'ultra-low', color: 'text-foreground/80' },
  ]

  return (
    <div className="space-y-12 pb-32 font-mono">
      {/* Welcome Header */}
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
        <div className="space-y-2">
          <h1 className="flex items-center gap-4 text-5xl font-black uppercase italic tracking-tighter text-white">
            SYS_MASTER <span className="ai-glow text-red-600">ONLINE</span>
          </h1>
          <p className="max-w-xl text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
            Centralized Command for BLUELEARNERHUB Global Infrastructure.
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="h-14 border border-border bg-card px-8 font-black uppercase italic tracking-tight text-white hover:bg-secondary">
            SECURITY_LOGS
          </Button>
          <Button className="h-14 bg-red-600 px-10 font-black uppercase italic tracking-widest text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:bg-red-700">
            INIT_MAINTENANCE_MODE
          </Button>
        </div>
      </div>

      {/* Global Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="group relative overflow-hidden border-slate-900 bg-background/60 p-8 transition-all hover:border-red-600/30">
              <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-100">
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {metric.label}
              </p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-white">{metric.value}</span>
                <span className={`text-[10px] font-black ${metric.color} mb-1 italic`}>
                  {metric.change}
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Real-time System Vitals */}
        <div className="space-y-6 lg:col-span-2">
          <h3 className="flex items-center gap-3 text-xl font-black uppercase italic tracking-tighter text-white">
            <Activity className="h-5 w-5 text-red-600" /> INFRASTRUCTURE_PULSE_v4.2.1
          </h3>
          <Card className="grid grid-cols-2 gap-8 border border-slate-900 bg-background/40 p-8 md:grid-cols-4">
            {systemVitals.map((vital) => (
              <div key={vital.label} className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {vital.label}
                </p>
                <p className={`text-2xl font-black ${vital.color}`}>{vital.value}</p>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[8px] font-black uppercase text-muted-foreground">
                    {vital.status}
                  </span>
                </div>
              </div>
            ))}
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { name: 'EDGE_01_MUNICH', status: 'Online', load: '12%' },
              { name: 'EDGE_02_BANGALORE', status: 'Online', load: '65%' },
              { name: 'EDGE_03_NYC', status: 'Online', load: '24%' },
            ].map((edge) => (
              <div
                key={edge.name}
                className="cursor-pointer space-y-3 rounded-xl border border-slate-900 bg-background p-4 transition-all hover:border-red-600/20"
              >
                <div className="flex items-center justify-between">
                  <Globe className="h-3.5 w-3.5 text-primary/80" />
                  <span className="text-[8px] font-black uppercase text-foreground/80">
                    {edge.status}
                  </span>
                </div>
                <p className="text-[9px] font-black uppercase text-white">{edge.name}</p>
                <div className="h-1 w-full overflow-hidden rounded-full bg-card">
                  <div
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: edge.load }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Alerts Section */}
        <div className="space-y-6">
          <h3 className="flex items-center gap-3 text-xl font-black uppercase italic tracking-tighter text-white">
            <ShieldAlert className="h-5 w-5 text-red-600" /> SECURITY_VECTORS
          </h3>
          <Card className="relative space-y-6 overflow-hidden border-red-600/20 bg-background p-8">
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-600 to-transparent" />
            <div className="space-y-4">
              {[
                { msg: 'Abnormal Login Origin: XYZ_882', time: '2m ago', type: 'warn' },
                { msg: 'DDoS Mitigation Level 2 Engaged', time: '14m ago', type: 'critical' },
                { msg: 'New Root Key Generated by S_01', time: '1h ago', type: 'info' },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex gap-4 rounded-xl border border-border bg-card/50 p-4 transition-all hover:border-red-600/30"
                >
                  <AlertTriangle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${alert.type === 'critical' ? 'text-red-500' : 'text-foreground/80'}`}
                  />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase italic leading-tight text-white">
                      {alert.msg}
                    </p>
                    <p className="text-[8px] font-bold uppercase text-muted-foreground">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="h-12 w-full border border-red-600/30 bg-red-600/10 text-[10px] font-black uppercase italic tracking-widest text-red-500 transition-all hover:bg-red-600 hover:text-white">
              VIEW_FULL_SECURITY_STACK
            </Button>
          </Card>
        </div>
      </div>

      {/* Admin Quick Commands */}
      <div className="space-y-6">
        <h3 className="flex items-center gap-3 text-xl font-black uppercase italic tracking-tighter text-white">
          <Terminal className="h-5 w-5 text-red-600" /> QUICK_COMMAND_EXECUTOR
        </h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {[
            { n: 'SYNCHRONIZE_DB', c: 'database' },
            { n: 'CLEAR_CACHES', c: 'activity' },
            { n: 'REFRESH_ASSETS', c: 'file-text' },
            { n: 'VERIFY_TOKENS', c: 'shield' },
            { n: 'EXPORT_ANALYTICS', c: 'trending' },
          ].map((cmd) => (
            <button
              key={cmd.n}
              className="space-y-2 rounded-xl border border-border bg-slate-900/40 p-4 text-center transition-all hover:border-red-600/20 hover:bg-card"
            >
              <p className="text-[9px] font-black uppercase italic tracking-tighter text-white">
                {cmd.n}
              </p>
              <ChevronRight className="mx-auto h-3 w-3 text-red-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
