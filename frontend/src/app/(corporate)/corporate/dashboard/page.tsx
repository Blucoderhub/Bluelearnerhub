'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Trophy,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Star,
  Code,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const stats = [
  {
    title: 'Active Hackathons',
    value: '3',
    change: '+2',
    trend: 'up',
    icon: Trophy,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    title: 'Total Participants',
    value: '1,847',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Submissions',
    value: '423',
    change: '+8%',
    trend: 'up',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    title: 'Avg. Score',
    value: '76.4%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
]

const recentHackathons = [
  {
    id: '1',
    title: 'AI Innovators Challenge 2026',
    status: 'active',
    participants: 342,
    submissions: 89,
    deadline: '2 days left',
    prize: '$10,000',
  },
  {
    id: '2',
    title: 'Green Tech Sustainability',
    status: 'upcoming',
    participants: 156,
    submissions: 0,
    deadline: '14 days left',
    prize: '$5,000',
  },
  {
    id: '3',
    title: 'FinTech Revolution',
    status: 'completed',
    participants: 523,
    submissions: 156,
    deadline: 'Ended',
    prize: '$15,000',
  },
]

const topCandidates = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.s@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    score: 94,
    rank: 1,
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    hackathons: 5,
  },
  {
    id: '2',
    name: 'Rahul Verma',
    email: 'rahul.v@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    score: 91,
    rank: 2,
    skills: ['React', 'Node.js', 'TypeScript'],
    hackathons: 3,
  },
  {
    id: '3',
    name: 'Ananya Patel',
    email: 'ananya.p@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
    score: 88,
    rank: 3,
    skills: ['Java', 'Spring Boot', 'AWS'],
    hackathons: 4,
  },
  {
    id: '4',
    name: 'Vikram Singh',
    email: 'vikram.s@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
    score: 85,
    rank: 4,
    skills: ['Go', 'Kubernetes', 'Docker'],
    hackathons: 2,
  },
]

const recentActivity = [
  { type: 'submission', user: 'Priya Sharma', action: 'submitted solution for', target: 'AI Image Classifier', time: '2 min ago' },
  { type: 'register', user: 'New User', action: 'registered for', target: 'Green Tech Hackathon', time: '15 min ago' },
  { type: 'submission', user: 'Rahul Verma', action: 'submitted solution for', target: 'API Security Challenge', time: '1 hour ago' },
  { type: 'complete', user: 'Ananya Patel', action: 'completed', target: 'FinTech Hackathon', time: '2 hours ago' },
]

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    upcoming: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-muted text-muted-foreground border-muted',
  }
  return (
    <Badge variant="outline" className={styles[status as keyof typeof styles]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export default function CorporateDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link href="/corporate/hackathons/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Hackathon
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Hackathons */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Hackathons</CardTitle>
              <Link href="/corporate/hackathons">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentHackathons.map((hackathon) => (
                  <Link
                    key={hackathon.id}
                    href={`/corporate/hackathons/${hackathon.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{hackathon.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <StatusBadge status={hackathon.status} />
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {hackathon.participants}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Code className="h-3 w-3" />
                            {hackathon.submissions}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{hackathon.prize}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {hackathon.deadline}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Candidates */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Top Candidates</CardTitle>
              <Link href="/corporate/candidates">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCandidates.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/corporate/candidates/${candidate.id}`}
                    className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={candidate.avatar} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                        {candidate.rank}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{candidate.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-medium">{candidate.score}%</span>
                        <span className="text-xs text-muted-foreground">• {candidate.hackathons} hackathons</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full ${
                      activity.type === 'submission' ? 'bg-blue-500/10 text-blue-500' :
                      activity.type === 'register' ? 'bg-green-500/10 text-green-500' :
                      'bg-purple-500/10 text-purple-500'
                    }`}>
                      {activity.type === 'submission' ? <Code className="h-3 w-3" /> :
                       activity.type === 'register' ? <Users className="h-3 w-3" /> :
                       <CheckCircle2 className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p>
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium text-primary">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submission Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const values = [45, 67, 52, 78, 89, 34, 56]
                return (
                  <div key={day} className="flex items-center gap-3">
                    <span className="w-8 text-xs text-muted-foreground">{day}</span>
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-secondary">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${values[i]}%` }}
                        />
                      </div>
                    </div>
                    <span className="w-8 text-xs text-muted-foreground text-right">{values[i]}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Skills in Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: 'Python', percentage: 92, count: 423 },
                { skill: 'Machine Learning', percentage: 78, count: 312 },
                { skill: 'React', percentage: 65, count: 256 },
                { skill: 'Node.js', percentage: 58, count: 198 },
                { skill: 'AWS', percentage: 45, count: 156 },
              ].map((item) => (
                <div key={item.skill} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-muted-foreground">{item.count} candidates</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
