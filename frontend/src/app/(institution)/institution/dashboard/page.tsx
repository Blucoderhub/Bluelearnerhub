'use client'

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

const stats = [
  { title: 'Total Enrollment', value: '4,820', icon: GraduationCap, color: 'text-foreground/70' },
  { title: 'Faculty Members', value: '156', icon: Users, color: 'text-blue-400' },
  { title: 'Average CGPA', value: '3.4', icon: BarChart3, color: 'text-foreground/70' },
  { title: 'Placement Rate', value: '88%', icon: PieChart, color: 'text-purple-400' },
]

export default function InstitutionDashboard() {
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
          <Button
            variant="outline"
            className="border-border bg-card/50 text-white hover:bg-secondary"
          >
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
                <stat.icon
                  className={`h-4 w-4 ${stat.color} transition-transform group-hover:rotate-12`}
                />
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
          <Card className="border-border bg-slate-900/40">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Domain Growth Analytics</CardTitle>
                <CardDescription>
                  Enrollment and performance trends across different domains.
                </CardDescription>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-xl border border-slate-800/50 bg-background/20 italic text-muted-foreground">
                Growth visualization would render here
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-border bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-base font-bold">Top Performing Faculty</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((f) => (
                  <div key={f} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg border border-border bg-secondary" />
                      <span className="text-sm font-medium">Faculty Member {f}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground/70">9.2 Rating</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border bg-slate-900/40">
              <CardHeader>
                <CardTitle className="text-base font-bold">Student Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { domain: 'Engineering', rate: 94 },
                  { domain: 'Management', rate: 89 },
                ].map((d, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{d.domain}</span>
                      <span className="font-bold text-foreground/70">{d.rate}%</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary" style={{ width: `${d.rate}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
                  <span className="font-medium text-white">Winter 2026</span> are synchronized and
                  secured.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-10 w-full border-border text-xs hover:bg-secondary"
              >
                Audit Registry
              </Button>
            </CardContent>
          </Card>

          <Card className="group overflow-hidden border-border bg-gradient-to-t from-muted/20 to-background/40">
            <div className="p-6">
              <Building2 className="text-foreground/80/50 mb-4 h-10 w-10 transition-transform group-hover:scale-110" />
              <h4 className="text-lg font-black italic tracking-tight">INSTITUTIONAL AI</h4>
              <p className="mb-4 mt-2 text-xs text-muted-foreground">
                Leverage predictive analytics to forecast enrollment trends and student success
                bottlenecks.
              </p>
              <Button
                size="sm"
                className="h-10 w-full bg-slate-100 text-[10px] font-black tracking-widest text-black hover:bg-white"
              >
                LAUNCH ANALYTICS ENGINE
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
