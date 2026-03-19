'use client'

import { motion } from 'framer-motion'
import { Users, Search, TrendingUp, Calendar, Plus, ChevronRight, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const stats = [
  { title: 'Total Candidates', value: '1,248', icon: Users, color: 'text-cyan-400' },
  { title: 'New Applications', value: '84', icon: Calendar, color: 'text-purple-400' },
  { title: 'Interviews Today', value: '12', icon: Search, color: 'text-blue-400' },
  { title: 'Placement Rate', value: '92%', icon: TrendingUp, color: 'text-foreground/70' },
]

export default function HRDashboard() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            HR <span className="text-cyan-400">Command Center</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Monitor recruitment pipelines and discover top engineering & management talent.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-border bg-card/50 text-white hover:bg-secondary"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button className="transform bg-cyan-600 text-white shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-transform hover:scale-105 hover:bg-cyan-500 active:scale-95">
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="group border-border bg-slate-900/40 transition-all hover:border-cyan-500/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${stat.color} transition-transform group-hover:scale-110`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  <span className="text-xs font-medium text-foreground/70">+14% </span>
                  from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="overflow-hidden border-border bg-slate-900/40">
            <CardHeader className="border-b border-slate-800/50 bg-background/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Talent Search</CardTitle>
                  <CardDescription>
                    Find candidates based on skills, domain, and performance.
                  </CardDescription>
                </div>
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, skill (e.g., React, Finance), or role..."
                  className="border-border bg-background/50 pl-10 text-white placeholder:text-muted-foreground focus:ring-cyan-500/50"
                />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((candidate) => (
                  <div
                    key={candidate}
                    className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-800/50 bg-background/30 p-4 transition-all hover:border-cyan-500/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary font-bold text-cyan-400">
                        C
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Top Candidate {candidate}</h4>
                        <p className="text-xs text-muted-foreground">
                          Full-Stack Engineer • Level 8
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="hidden text-right md:block">
                        <div className="text-xs font-bold text-cyan-400">92% Match</div>
                        <div className="text-[10px] text-muted-foreground">Active 2h ago</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="mt-4 w-full text-cyan-400 hover:text-cyan-300">
                View All Candidates
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <Card className="border-t-2 border-border border-t-cyan-500 bg-background/40">
            <CardHeader>
              <CardTitle className="text-base font-bold">Upcoming Interviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2].map((interview) => (
                <div key={interview} className="rounded-lg border border-border bg-card/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                      Today, 2:00 PM
                    </span>
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary/70" />
                  </div>
                  <p className="text-sm font-bold">Project Manager Interview</p>
                  <p className="mt-1 text-xs text-muted-foreground">Candidate: Shankar R.</p>
                </div>
              ))}
              <Button variant="outline" className="w-full border-border text-xs hover:bg-secondary">
                Full Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-border bg-gradient-to-br from-cyan-900/20 to-background/40">
            <div className="relative z-10 p-6">
              <h4 className="text-lg font-black italic text-white">AI TALENT ANALYTICS</h4>
              <p className="mb-4 mt-2 text-xs leading-relaxed text-muted-foreground">
                Unlock deep insights into candidate performance across hackathons and projects.
              </p>
              <Button
                size="sm"
                className="h-auto bg-cyan-600 px-6 py-4 text-xs font-black italic tracking-tighter text-white shadow-lg shadow-cyan-900/50 hover:bg-cyan-500"
              >
                RUN FULL REPORT
              </Button>
            </div>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl transition-transform duration-700 group-hover:scale-150" />
          </Card>
        </div>
      </div>
    </div>
  )
}
