'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  Video,
  ClipboardList,
  ArrowUpRight,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'

interface DashboardStats {
  totalClasses: number
  totalStudents: number
  upcomingSessions: number
  pendingSubmissions: number
}

const recentClasses = [
  { id: '1', name: 'Data Structures & Algorithms', students: 45, sessions: 12, progress: 65 },
  { id: '2', name: 'Database Management', students: 38, sessions: 10, progress: 40 },
  { id: '3', name: 'Web Development', students: 52, sessions: 15, progress: 80 },
]

const upcomingSessions = [
  { id: '1', title: 'Binary Trees Discussion', class: 'Data Structures', time: 'Today, 2:00 PM', attendees: 40 },
  { id: '2', title: 'SQL Joins Deep Dive', class: 'Database Management', time: 'Tomorrow, 11:00 AM', attendees: 35 },
  { id: '3', title: 'React Hooks Workshop', class: 'Web Development', time: 'Wed, 3:00 PM', attendees: 48 },
]

const pendingGrading = [
  { id: '1', student: 'Priya Sharma', assignment: 'Binary Tree Implementation', submittedAt: '2 hours ago' },
  { id: '2', student: 'Rahul Verma', assignment: 'SQL Query Optimization', submittedAt: '4 hours ago' },
  { id: '3', student: 'Ananya Patel', assignment: 'REST API Project', submittedAt: '1 day ago' },
]

function MentorDashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalStudents: 0,
    upcomingSessions: 0,
    pendingSubmissions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/mentor/dashboard/stats')
        if (response.data?.success) {
          setStats(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: 'Total Classes', value: stats.totalClasses, icon: BookOpen, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', trend: '+2 this semester' },
    { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10', trend: '+15 new enrollments' },
    { title: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Video, color: 'text-amber-500', bgColor: 'bg-amber-500/10', trend: 'This week' },
    { title: 'Pending Grading', value: stats.pendingSubmissions, icon: ClipboardList, color: 'text-red-500', bgColor: 'bg-red-500/10', trend: 'Needs attention' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Professor</h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening in your classes.</p>
        </div>
        <Link href="/mentor/classes/new">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <BookOpen className="h-4 w-4" />
            Create Class
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-10 w-10 rounded-lg bg-muted mb-4" />
                <div className="h-4 w-20 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, i) => (
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
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xs text-emerald-500 mt-1">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Your Classes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Your Classes</CardTitle>
              <Link href="/mentor/classes">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClasses.map((cls) => (
                  <Link
                    key={cls.id}
                    href={`/mentor/classes/${cls.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                        <BookOpen className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {cls.students} students
                          </span>
                          <span className="flex items-center gap-1">
                            <Video className="h-3 w-3" />
                            {cls.sessions} sessions
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-secondary">
                          <div
                            className="h-2 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${cls.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{cls.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
              <Link href="/mentor/sessions">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Video className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{session.title}</p>
                      <p className="text-xs text-muted-foreground">{session.class}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{session.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Grading */}
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Pending Grading</CardTitle>
              <Link href="/mentor/assignments">
                <Button variant="ghost" size="sm" className="gap-1 text-red-500 hover:text-red-600">
                  View all
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingGrading.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <ClipboardList className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.student}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.assignment}</p>
                      <p className="text-xs text-amber-600 mt-1">{item.submittedAt}</p>
                    </div>
                    <Badge variant="outline" className="text-amber-500 border-amber-500/20">
                      Review
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MentorDashboardPage() {
  return <MentorDashboardContent />
}
