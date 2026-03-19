'use client'

import React from 'react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CheckSquare,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function MentorDashboard() {
  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome back, <span className="text-foreground/70">Elite Mentor</span>
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            Your teaching impact is increasing. Keep up the great work!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-border bg-card/50 px-6 font-bold text-foreground/80 hover:bg-secondary"
          >
            Edit Profile
          </Button>
          <Button className="rounded-xl bg-primary px-6 font-black text-white shadow-lg shadow-primary/15 hover:bg-primary/90">
            View Public Page
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Active Students',
            value: '12',
            icon: Users,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
          },
          {
            label: 'Avg. Rating',
            value: '4.95',
            icon: Star,
            color: 'text-foreground/70',
            bg: 'bg-primary/70/10',
          },
          {
            label: 'Hours Taught',
            value: '156h',
            icon: Clock,
            color: 'text-foreground/70',
            bg: 'bg-primary/70/10',
          },
          {
            label: 'Earnings',
            value: '$2,450',
            icon: TrendingUp,
            color: 'text-cyan-400',
            bg: 'bg-cyan-400/10',
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="group overflow-hidden rounded-3xl border-border bg-slate-900/40"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div
                  className={
                    stat.bg + ' rounded-2xl p-3 transition-transform group-hover:scale-110'
                  }
                >
                  <stat.icon className={'h-5 w-5 ' + stat.color} />
                </div>
                <div className="bg-primary/70/10 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-black uppercase tracking-widest text-foreground/70">
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <h3 className="mt-1 text-2xl font-black text-white">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="rounded-[2rem] border-border bg-slate-900/40 lg:col-span-2">
          <CardHeader className="border-b border-border p-8">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-white">
                Recent Student Submissions
              </CardTitle>
              <Button
                variant="ghost"
                className="text-xs font-bold uppercase text-foreground/70 hover:text-foreground/60"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border p-8 transition-colors last:border-0 hover:bg-secondary/20"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary font-bold text-foreground/70">
                    JD
                  </div>
                  <div>
                    <h4 className="font-bold text-white">System Design Exercise #12</h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Submitted by{' '}
                      <span className="text-[11px] font-bold text-foreground/80">John Doe</span> • 2
                      hours ago
                    </p>
                  </div>
                </div>
                <Button className="h-10 rounded-xl bg-secondary px-6 font-bold text-foreground/80 transition-all hover:bg-primary hover:text-white">
                  Grade
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card className="rounded-[2rem] border-border bg-slate-900/40">
          <CardHeader className="border-b border-border p-8">
            <CardTitle className="text-xl font-bold text-white">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {[1, 2].map((i) => (
              <div key={i} className="relative border-l-2 border-border pl-6">
                <div className="absolute left-[-5px] top-0 h-2 w-2 rounded-full bg-primary" />
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                  Tomorrow, 10:00 AM
                </p>
                <h4 className="mt-1 text-sm font-bold text-white">1-on-1 Mentorship Session</h4>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-foreground/80">
                    AS
                  </div>
                  <span className="text-xs text-muted-foreground">Alice Smith</span>
                </div>
                <Button className="mt-4 h-9 w-full rounded-xl border border-border bg-primary/10 text-xs font-bold text-foreground/70 transition-all hover:bg-primary hover:text-white">
                  Join Zoom
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full rounded-2xl border-border py-6 font-bold text-muted-foreground"
            >
              Manage Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
