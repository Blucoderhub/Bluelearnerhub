'use client'

import { motion } from 'framer-motion'
import {
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Eye,
  Clock,
  ChevronRight,
  Plus,
  Award,
  Zap,
  BarChart3,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

const MOCK_STATS = {
  totalStudents: 2847,
  totalViews: 128_420,
  avgRating: 4.8,
  totalTutorials: 14,
  xpAwarded: 48_200,
  publishedCount: 11,
  draftCount: 3,
  completionRate: 73,
}

const MOCK_TUTORIALS = [
  {
    id: 1,
    title: 'TypeScript Deep Dive: Generics & Utilities',
    domain: 'Software',
    status: 'published',
    views: 14_200,
    students: 892,
    rating: 4.9,
    completionRate: 78,
    updatedAt: '2026-03-05',
  },
  {
    id: 2,
    title: 'React 18 — Concurrent Features & Suspense',
    domain: 'Software',
    status: 'published',
    views: 11_800,
    students: 742,
    rating: 4.8,
    completionRate: 71,
    updatedAt: '2026-03-01',
  },
  {
    id: 3,
    title: 'PostgreSQL Performance Tuning',
    domain: 'Software',
    status: 'published',
    views: 8_400,
    students: 560,
    rating: 4.7,
    completionRate: 65,
    updatedAt: '2026-02-22',
  },
  {
    id: 4,
    title: 'Building ML Pipelines with PyTorch',
    domain: 'AI/ML',
    status: 'draft',
    views: 0,
    students: 0,
    rating: 0,
    completionRate: 0,
    updatedAt: '2026-03-09',
  },
]

const MOCK_RECENT_ACTIVITY = [
  { type: 'enroll', text: 'Priya N. enrolled in TypeScript Deep Dive', time: '2m ago' },
  { type: 'complete', text: 'Raj K. completed React 18 tutorial', time: '18m ago' },
  { type: 'review', text: 'New 5★ review on PostgreSQL Performance Tuning', time: '1h ago' },
  { type: 'enroll', text: 'Arjun M. enrolled in TypeScript Deep Dive', time: '2h ago' },
  { type: 'complete', text: 'Meera S. completed PostgreSQL tutorial', time: '3h ago' },
]

const ACTIVITY_ICONS = {
  enroll: { icon: Users, color: 'text-blue-400' },
  complete: { icon: CheckCircle2, color: 'text-foreground/70' },
  review: { icon: Star, color: 'text-foreground/70' },
}

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Creator Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">
              Track your content performance and student engagement
            </p>
          </div>
          <Link href="/teacher/studio">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90">
              <Plus className="h-4 w-4" /> New Tutorial
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* KPI Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            {
              label: 'Total Students',
              value: MOCK_STATS.totalStudents.toLocaleString(),
              icon: Users,
              color: 'text-blue-400',
              change: '+12%',
              up: true,
            },
            {
              label: 'Total Views',
              value: (MOCK_STATS.totalViews / 1000).toFixed(0) + 'K',
              icon: Eye,
              color: 'text-purple-400',
              change: '+8%',
              up: true,
            },
            {
              label: 'Avg Rating',
              value: MOCK_STATS.avgRating.toString(),
              icon: Star,
              color: 'text-foreground/70',
              change: '+0.1',
              up: true,
            },
            {
              label: 'XP Awarded',
              value: (MOCK_STATS.xpAwarded / 1000).toFixed(0) + 'K',
              icon: Zap,
              color: 'text-foreground/70',
              change: '+24%',
              up: true,
            },
          ].map(({ label, value, icon: Icon, color, change, up }) => (
            <Card key={label} className="border-gray-800 bg-gray-900">
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <span
                    className={`flex items-center text-xs font-medium ${up ? 'text-foreground/70' : 'text-red-400'}`}
                  >
                    {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Content list */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <BookOpen className="h-4 w-4 text-blue-400" />
                Your Content
              </h2>
              <div className="flex gap-2 text-xs">
                <Badge className="bg-muted text-foreground/70">
                  {MOCK_STATS.publishedCount} published
                </Badge>
                <Badge className="bg-gray-800 text-gray-400">{MOCK_STATS.draftCount} drafts</Badge>
              </div>
            </div>

            <div className="space-y-3">
              {MOCK_TUTORIALS.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Card className="border-gray-800 bg-gray-900 transition-all hover:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-white">{t.title}</h3>
                            <Badge
                              className={`shrink-0 text-[10px] ${
                                t.status === 'published'
                                  ? 'bg-muted text-foreground/70'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                            >
                              {t.status}
                            </Badge>
                          </div>
                          {t.status === 'published' && (
                            <>
                              <div className="mb-2 flex flex-wrap gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {t.views.toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {t.students}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-foreground/70" />
                                  {t.rating}
                                </span>
                              </div>
                              <div>
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-[10px] text-gray-600">Completion rate</span>
                                  <span className="text-[10px] text-gray-400">
                                    {t.completionRate}%
                                  </span>
                                </div>
                                <Progress value={t.completionRate} className="h-1" />
                              </div>
                            </>
                          )}
                          {t.status === 'draft' && (
                            <p className="text-xs text-gray-500">Draft — not yet published</p>
                          )}
                        </div>
                        <Link href="/teacher/studio">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="shrink-0 gap-1 text-xs text-gray-400 hover:text-white"
                          >
                            Edit <ChevronRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Completion rate card */}
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-semibold">Overall Performance</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-500">Avg Completion</span>
                      <span className="text-white">{MOCK_STATS.completionRate}%</span>
                    </div>
                    <Progress value={MOCK_STATS.completionRate} className="h-1.5" />
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-500">Content Published</span>
                      <span className="text-white">
                        {Math.round((MOCK_STATS.publishedCount / MOCK_STATS.totalTutorials) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (MOCK_STATS.publishedCount / MOCK_STATS.totalTutorials) * 100
                      )}
                      className="h-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent activity */}
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Clock className="h-4 w-4 text-purple-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {MOCK_RECENT_ACTIVITY.map((a, i) => {
                    const { icon: Icon, color } = ACTIVITY_ICONS[
                      a.type as keyof typeof ACTIVITY_ICONS
                    ] ?? { icon: Zap, color: 'text-gray-400' }
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <Icon className={`h-3.5 w-3.5 ${color} mt-0.5 shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs leading-relaxed text-gray-300">{a.text}</p>
                          <p className="text-[10px] text-gray-600">{a.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
