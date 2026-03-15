'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import {
  User, Shield, Bell, CreditCard, MapPin, Calendar, Edit2,
  Code2, Trophy, BookOpen, Award, Star, Flame, Zap, Target,
  TrendingUp, CheckCircle2, Clock, GitBranch, ArrowUp, ArrowDown,
  Minus, ExternalLink, Github, Linkedin, Globe,
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
  { title: 'Python for Beginners', category: 'CS', grade: 'A+', date: 'Dec 2025', color: 'bg-blue-500/10 text-blue-400' },
  { title: 'DSA Mastery — Part I', category: 'CS', grade: 'A', date: 'Jan 2026', color: 'bg-violet-500/10 text-violet-400' },
  { title: 'Product Management Essentials', category: 'Management', grade: 'A+', date: 'Feb 2026', color: 'bg-pink-500/10 text-pink-400' },
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
  { type: 'solved', text: 'Solved "Two Sum Optimization"', xp: '+50 XP', time: '2h ago', icon: Code2, color: 'text-blue-400' },
  { type: 'completed', text: 'Completed "Intro to Python" lesson', xp: '+30 XP', time: '1d ago', icon: BookOpen, color: 'text-emerald-400' },
  { type: 'streak', text: 'Maintained 12-day streak', xp: '+25 XP', time: '1d ago', icon: Flame, color: 'text-orange-400' },
  { type: 'hackathon', text: 'Joined AI Revolution 2026', xp: '+100 XP', time: '3d ago', icon: Trophy, color: 'text-amber-400' },
  { type: 'badge', text: 'Earned "AI Explorer" badge', xp: '+75 XP', time: '5d ago', icon: Award, color: 'text-pink-400' },
]

const TABS = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'skills', label: 'Skills', icon: TrendingUp },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'settings', label: 'Settings', icon: Shield },
]

const trendIcon = (trend: string) => {
  if (trend === 'up') return <ArrowUp className="w-3 h-3 text-emerald-400" />
  if (trend === 'down') return <ArrowDown className="w-3 h-3 text-red-400" />
  return <Minus className="w-3 h-3 text-muted-foreground" />
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')

  if (!user) return null

  const avatarSrc = user.avatarConfig ? generateAvatarURL(user.avatarConfig) : user.profilePicture
  const initials = (user.fullName || user.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Profile Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 sm:p-8 rounded-2xl border border-border bg-card/50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-violet-500/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-black overflow-hidden">
              {avatarSrc ? <img src={avatarSrc} alt={user.fullName} className="w-full h-full object-cover" /> : initials}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-background" />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
                {user.fullName || user.email.split('@')[0]}
              </h1>
              <Badge className="bg-primary/15 text-primary border-primary/25 text-xs font-bold">Level 5</Badge>
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">Pro Member</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />India</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Joined Jan 2025</span>
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" />12-day streak</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {['Python', 'Algorithms', 'ML', 'Hackathons'].map(t => (
                <Badge key={t} variant="outline" className="border-border text-muted-foreground text-[10px]">{t}</Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            {[
              { label: 'XP', value: '2,450', icon: Zap, color: 'text-amber-400' },
              { label: 'Solved', value: '145', icon: Code2, color: 'text-blue-400' },
              { label: 'Rank', value: '#42', icon: Trophy, color: 'text-orange-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-background/50 border border-border">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <div className="text-lg font-black text-white">{value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* XP bar */}
        <div className="relative z-10 mt-6 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="font-semibold">Level 5 → Level 6</span>
            <span className="text-primary font-bold">2,450 / 3,000 XP</span>
          </div>
          <Progress value={82} className="h-2 bg-muted/50" />
        </div>

        {/* Links */}
        <div className="relative z-10 flex items-center gap-2 mt-5">
          {[
            { icon: Github, label: 'GitHub' },
            { icon: Linkedin, label: 'LinkedIn' },
            { icon: Globe, label: 'Portfolio' },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-white hover:border-border/80 transition-colors">
              <Icon className="w-3.5 h-3.5" />
              {label}
              <ExternalLink className="w-3 h-3" />
            </button>
          ))}
          <div className="flex-1" />
          <Button size="sm" variant="outline" className="border-border rounded-xl h-8 px-3 text-xs font-semibold gap-1.5">
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-card/50 border border-border rounded-xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
              activeTab === id ? 'bg-card text-white shadow-sm border border-border' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4 hidden sm:block" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Completed Courses */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Completed Courses
                  </h3>
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{COMPLETED_COURSES.length} completed</Badge>
                </div>
                <div className="space-y-3">
                  {COMPLETED_COURSES.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-background/50 border border-border hover:border-border/80 transition-colors">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.category} · {c.date}</p>
                      </div>
                      <Badge className={`text-xs font-bold border-0 ${c.color}`}>{c.grade}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Recent Activity
                </h3>
                <div className="space-y-1">
                  {ACTIVITY.map((a, i) => {
                    const Icon = a.icon
                    return (
                      <div key={i} className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
                        <div className={`w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 mt-0.5`}>
                          <Icon className={`w-3.5 h-3.5 ${a.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground/90">{a.text}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold shrink-0">{a.xp}</Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Leaderboard
                  </h3>
                  <span className="text-xs text-muted-foreground">of 50,000</span>
                </div>
                <div className="space-y-2">
                  {LEADERBOARD.map((entry, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        entry.isUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                        entry.rank === 1 ? 'bg-amber-500 text-white' :
                        entry.rank === 2 ? 'bg-slate-400 text-white' :
                        entry.rank === 3 ? 'bg-amber-700 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        #{entry.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${entry.isUser ? 'text-primary' : 'text-foreground/90'}`}>
                          {entry.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                      </div>
                      {trendIcon(entry.trend)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
                <h3 className="text-sm font-bold text-white">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Hackathons Joined', value: '7', icon: Trophy, color: 'text-amber-400' },
                    { label: 'Certificates Earned', value: '3', icon: Award, color: 'text-violet-400' },
                    { label: 'Total Study Hours', value: '124h', icon: Clock, color: 'text-blue-400' },
                    { label: 'Current Streak', value: '12 days', icon: Flame, color: 'text-orange-400' },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${color} shrink-0`} />
                      <span className="text-xs text-muted-foreground flex-1">{label}</span>
                      <span className="text-xs font-bold text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Skill Proficiency
              </h3>
              <div className="space-y-5">
                {SKILLS.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-foreground/90">{skill.name}</span>
                      <span className="text-muted-foreground font-bold">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
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

            <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Coding Activity
              </h3>
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Code2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                Activity heatmap coming soon
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <strong className="text-white">{ACHIEVEMENTS.filter(a => a.unlocked).length}</strong> of {ACHIEVEMENTS.length} badges earned
              </p>
              <Progress value={(ACHIEVEMENTS.filter(a => a.unlocked).length / ACHIEVEMENTS.length) * 100} className="w-32 h-1.5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {ACHIEVEMENTS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-5 rounded-2xl border text-center space-y-2 transition-all ${
                    a.unlocked
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10'
                      : 'border-border bg-card/30 opacity-50 grayscale'
                  }`}
                >
                  <div className="text-3xl">{a.icon}</div>
                  <div className="text-xs font-bold text-white">{a.title}</div>
                  <div className="text-[10px] text-muted-foreground leading-tight">{a.desc}</div>
                  {a.unlocked && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">Unlocked</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: User, title: 'Account Info', desc: 'Update your name, email, and profile picture' },
              { icon: Shield, title: 'Security', desc: 'Change password and enable two-factor authentication' },
              { icon: Bell, title: 'Notifications', desc: 'Manage email and push notification preferences' },
              { icon: CreditCard, title: 'Subscription', desc: 'View your plan, billing, and upgrade options' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/30 transition-colors cursor-pointer space-y-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
