'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import {
  User,
  Shield,
  Bell,
  CreditCard,
  MapPin,
  Calendar,
  Edit2,
  Code2,
  Trophy,
  BookOpen,
  Award,
  Star,
  Flame,
  Zap,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  GitBranch,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { generateAvatarURL } from '@/utils/generateAvatar'

const SKILLS = [
  { name: 'Python', level: 88, color: 'bg-blue-500' },
  { name: 'Data Structures', level: 74, color: 'bg-violet-500' },
  { name: 'Algorithms', level: 65, color: 'bg-purple-500' },
  { name: 'JavaScript', level: 80, color: 'bg-amber-500' },
  { name: 'System Design', level: 45, color: 'bg-emerald-500' },
  { name: 'Machine Learning', level: 52, color: 'bg-cyan-500' },
]

const COMPLETED_COURSES = [
  {
    title: 'Python for Beginners',
    category: 'CS',
    grade: 'A+',
    date: 'Dec 2025',
    color: 'bg-blue-500/10 text-blue-400',
  },
  {
    title: 'DSA Mastery — Part I',
    category: 'CS',
    grade: 'A',
    date: 'Jan 2026',
    color: 'bg-violet-500/10 text-violet-400',
  },
  {
    title: 'Product Management Essentials',
    category: 'Management',
    grade: 'A+',
    date: 'Feb 2026',
    color: 'bg-pink-500/10 text-pink-400',
  },
]

const ACHIEVEMENTS = [
  { title: 'First Steps', desc: 'Complete first lesson', icon: '🎯', unlocked: true },
  { title: 'Code Ninja', desc: 'Solve 50 challenges', icon: '🥷', unlocked: true },
  { title: 'Week Warrior', desc: '7-day streak', icon: '🔥', unlocked: true },
  { title: 'AI Explorer', desc: 'Use AI companion 10×', icon: '🤖', unlocked: true },
  { title: 'Hackathon Hero', desc: 'Win a hackathon', icon: '🏆', unlocked: false },
  { title: 'Certified Pro', desc: 'Earn a certificate', icon: '📜', unlocked: false },
  { title: 'Team Player', desc: 'Join 3 teams', icon: '🤝', unlocked: false },
  { title: 'Speed Demon', desc: 'Quiz in under 60s', icon: '⚡', unlocked: false },
]

const LEADERBOARD = [
  { rank: 1, name: 'Alex Chen', xp: 12450, trend: 'up' },
  { rank: 2, name: 'Priya Sharma', xp: 11200, trend: 'same' },
  { rank: 3, name: 'Jordan Lee', xp: 10800, trend: 'up' },
  { rank: 42, name: 'You', xp: 2450, isUser: true, trend: 'up' },
]

const ACTIVITY = [
  {
    type: 'solved',
    text: 'Solved "Two Sum Optimization"',
    xp: '+50 XP',
    time: '2h ago',
    icon: Code2,
    color: 'text-blue-400',
  },
  {
    type: 'completed',
    text: 'Completed "Intro to Python" lesson',
    xp: '+30 XP',
    time: '1d ago',
    icon: BookOpen,
    color: 'text-emerald-400',
  },
  {
    type: 'streak',
    text: 'Maintained 12-day streak',
    xp: '+25 XP',
    time: '1d ago',
    icon: Flame,
    color: 'text-orange-400',
  },
  {
    type: 'hackathon',
    text: 'Joined AI Revolution 2026',
    xp: '+100 XP',
    time: '3d ago',
    icon: Trophy,
    color: 'text-amber-400',
  },
  {
    type: 'badge',
    text: 'Earned "AI Explorer" badge',
    xp: '+75 XP',
    time: '5d ago',
    icon: Award,
    color: 'text-pink-400',
  },
]

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'skills', label: 'Skills', icon: TrendingUp },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'settings', label: 'Settings', icon: Shield },
]

const trendIcon = (trend: string) => {
  if (trend === 'up') return <ArrowUp className="h-3 w-3 text-emerald-400" />
  if (trend === 'down') return <ArrowDown className="h-3 w-3 text-red-400" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) return null

  const avatarSrc = user.avatarConfig ? generateAvatarURL(user.avatarConfig) : user.profilePicture
  const initials = (user.fullName || user.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5" />

        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary to-blue-600 text-3xl font-black text-white sm:h-24 sm:w-24">
              {avatarSrc ? (
                <img src={avatarSrc} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 h-6 w-6 rounded-full border-2 border-background bg-emerald-500" />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-2xl font-black tracking-tight text-white sm:text-3xl">
                {user.fullName || user.email.split('@')[0]}
              </h1>
              <Badge className="border-primary/25 bg-primary/15 text-xs font-bold text-primary">
                Level 5
              </Badge>
              <Badge className="border-amber-500/20 bg-amber-500/10 text-xs text-amber-400">
                Pro Member
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                India
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Joined Jan 2025
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-400" />
                12-day streak
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {['Python', 'Algorithms', 'ML', 'Hackathons'].map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="border-border text-[10px] text-muted-foreground"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid shrink-0 grid-cols-3 gap-3">
            {[
              { label: 'XP', value: '2,450', icon: Zap, color: 'text-amber-400' },
              { label: 'Solved', value: '145', icon: Code2, color: 'text-blue-400' },
              { label: 'Rank', value: '#42', icon: Trophy, color: 'text-orange-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-background/50 p-3 text-center"
              >
                <Icon className={`h-4 w-4 ${color} mx-auto mb-1`} />
                <div className="text-lg font-black text-white">{value}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* XP bar */}
        <div className="relative z-10 mt-6 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Level 5 → Level 6</span>
            <span className="font-bold text-primary">2,450 / 3,000 XP</span>
          </div>
          <Progress value={82} className="h-2 bg-muted/50" />
        </div>

        {/* Links */}
        <div className="relative z-10 mt-5 flex items-center gap-2">
          {[
            { icon: Github, label: 'GitHub' },
            { icon: Linkedin, label: 'LinkedIn' },
            { icon: Globe, label: 'Portfolio' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-border/80 hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <ExternalLink className="h-3 w-3" />
            </button>
          ))}
          <div className="flex-1" />
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 rounded-xl border-border px-3 text-xs font-semibold"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-border bg-card/50 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
              activeTab === id
                ? 'border border-border bg-card text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="hidden h-4 w-4 sm:block" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Completed Courses */}
              <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Completed Courses
                  </h3>
                  <Badge className="border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-400">
                    {COMPLETED_COURSES.length} completed
                  </Badge>
                </div>
                <div className="space-y-3">
                  {COMPLETED_COURSES.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4 transition-colors hover:border-border/80"
                    >
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{c.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.category} · {c.date}
                        </p>
                      </div>
                      <Badge className={`border-0 text-xs font-bold ${c.color}`}>{c.grade}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Clock className="h-4 w-4 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-1">
                  {ACTIVITY.map((a, i) => {
                    const Icon = a.icon
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-3 border-b border-border/50 py-3 last:border-0"
                      >
                        <div
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted/30`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${a.color}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-foreground/90">{a.text}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
                        </div>
                        <Badge className="shrink-0 border-primary/20 bg-primary/10 text-[10px] font-bold text-primary">
                          {a.xp}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                    <Trophy className="h-4 w-4 text-amber-400" />
                    Leaderboard
                  </h3>
                  <span className="text-xs text-muted-foreground">of 50,000</span>
                </div>
                <div className="space-y-2">
                  {LEADERBOARD.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                        entry.isUser
                          ? 'border border-primary/20 bg-primary/10'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                          entry.rank === 1
                            ? 'bg-amber-500 text-white'
                            : entry.rank === 2
                              ? 'bg-slate-400 text-white'
                              : entry.rank === 3
                                ? 'bg-amber-700 text-white'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        #{entry.rank}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-xs font-bold ${entry.isUser ? 'text-primary' : 'text-foreground/90'}`}
                        >
                          {entry.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {entry.xp.toLocaleString()} XP
                        </p>
                      </div>
                      {trendIcon(entry.trend)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
                <h3 className="text-sm font-bold text-white">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    {
                      label: 'Hackathons Joined',
                      value: '7',
                      icon: Trophy,
                      color: 'text-amber-400',
                    },
                    {
                      label: 'Certificates Earned',
                      value: '3',
                      icon: Award,
                      color: 'text-violet-400',
                    },
                    {
                      label: 'Total Study Hours',
                      value: '124h',
                      icon: Clock,
                      color: 'text-blue-400',
                    },
                    {
                      label: 'Current Streak',
                      value: '12 days',
                      icon: Flame,
                      color: 'text-orange-400',
                    },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${color} shrink-0`} />
                      <span className="flex-1 text-xs text-muted-foreground">{label}</span>
                      <span className="text-xs font-bold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-6 rounded-2xl border border-border bg-card/50 p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <Target className="h-4 w-4 text-primary" />
                Skill Proficiency
              </h3>
              <div className="space-y-5">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground/90">{skill.name}</span>
                      <span className="font-bold text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className={`h-full rounded-full ${skill.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-border bg-card/50 p-6">
              <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                <GitBranch className="h-4 w-4 text-primary" />
                Coding Activity
              </h3>
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Code2 className="mx-auto mb-3 h-10 w-10 opacity-30" />
                Activity heatmap coming soon
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong className="text-white">
                  {ACHIEVEMENTS.filter((a) => a.unlocked).length}
                </strong>{' '}
                of {ACHIEVEMENTS.length} badges earned
              </p>
              <Progress
                value={(ACHIEVEMENTS.filter((a) => a.unlocked).length / ACHIEVEMENTS.length) * 100}
                className="h-1.5 w-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`space-y-2 rounded-2xl border p-5 text-center transition-all ${
                    a.unlocked
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-card/30 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl">{a.icon}</div>
                  <div className="text-xs font-bold text-white">{a.title}</div>
                  <div className="text-[10px] leading-tight text-muted-foreground">{a.desc}</div>
                  {a.unlocked && (
                    <Badge className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-400">
                      Unlocked
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                icon: User,
                title: 'Account Info',
                desc: 'Update your name, email, and profile picture',
              },
              {
                icon: Shield,
                title: 'Security',
                desc: 'Change password and enable two-factor authentication',
              },
              {
                icon: Bell,
                title: 'Notifications',
                desc: 'Manage email and push notification preferences',
              },
              {
                icon: CreditCard,
                title: 'Subscription',
                desc: 'View your plan, billing, and upgrade options',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group cursor-pointer space-y-3 rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
