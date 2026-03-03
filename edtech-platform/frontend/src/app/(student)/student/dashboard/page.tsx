// src/app/(student)/dashboard/page.tsx

'use client'

import { useAuth } from '@/hooks/useAuth'
import StatsCard from '@/components/dashboard/StatsCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import ProgressChart from '@/components/dashboard/ProgressChart'
import UpcomingEvents from '@/components/dashboard/UpcomingEvents'
import QuickActions from '@/components/dashboard/QuickActions'
import StreakCounter from '@/components/dashboard/StreakCounter'
import { GamificationSidebar } from '@/components/dashboard/GamificationSidebar'
import { Button } from '@/components/ui/button' // Assuming this import is needed for the new Button component

export default function StudentDashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">
            Welcome back, <span className="text-primary">{user?.fullName?.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-lg text-muted-foreground mt-3 font-medium max-w-2xl">
            You're currently in the top <span className="text-primary font-bold">5%</span> of learners this week. Keep up the momentum!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 pr-6">
          <StreakCounter currentStreak={user?.currentStreak || 0} />
          <div className="h-10 w-px bg-primary/20" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Level</span>
            <span className="text-xl font-black font-heading text-primary">05</span>
          </div>
        </div>
      </div>

      {/* Ultra-Modern Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total XP"
          value={user?.totalPoints || 0}
          icon="⚡"
          trend={{ value: 12, isPositive: true }}
          className="glass-morphism border-primary/10 hover:border-primary/30 transition-all"
        />
        <StatsCard
          title="Solved"
          value="145"
          icon="✅"
          trend={{ value: 8, isPositive: true }}
          className="glass-morphism border-primary/10 hover:border-primary/30 transition-all"
        />
        <StatsCard
          title="Hackathons"
          value="7"
          icon="🏆"
          trend={{ value: 2, isPositive: true }}
          className="glass-morphism border-primary/10 hover:border-primary/30 transition-all"
        />
        <StatsCard
          title="Certificates"
          value="3"
          icon="📜"
          trend={{ value: 1, isPositive: true }}
          className="glass-morphism border-primary/10 hover:border-primary/30 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl glass-morphism border-primary/10 ai-glow">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold font-heading">Learning Velocity</h3>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View Detailed Analytics</Button>
            </div>
            <div className="h-[300px]">
              <ProgressChart />
            </div>
          </div>

          {/* Activity Feed with refined list */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-heading px-2">Recent Synchronizations</h3>
            <div className="rounded-3xl border border-border/50 overflow-hidden">
              <ActivityFeed />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <GamificationSidebar />

          {/* Quick Action Pills */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-heading px-2">Quick Navigation</h3>
            <QuickActions
              actions={[
                { label: 'Resume Learning', icon: '📚', href: '/courses', color: 'primary' },
                { label: 'Daily Quiz', icon: '🎯', href: '/quiz', color: 'primary' },
                { label: 'Join Hackathon', icon: '🏆', href: '/hackathons', color: 'primary' },
                { label: 'Browse Jobs', icon: '💼', href: '/jobs', color: 'primary' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
