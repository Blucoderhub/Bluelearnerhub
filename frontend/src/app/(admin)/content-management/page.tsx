'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Layers,
  Cpu,
  Database,
  Globe,
  FileText,
  ChevronRight,
  Sparkles,
  Zap,
  MoreVertical,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const courses = [
  {
    id: 'C-001',
    title: 'Advanced AI & Machine Learning for Engineers',
    domain: 'Computer Science',
    modules: 12,
    lessons: 84,
    status: 'Published',
    difficulty: 'Advanced',
    lastUpdated: '2h ago',
    xpValue: 12500,
  },
  {
    id: 'C-002',
    title: 'Precision Mechanical Design & FEA Analysis',
    domain: 'Mechanical',
    modules: 8,
    lessons: 42,
    status: 'In Review',
    difficulty: 'Intermediate',
    lastUpdated: '1d ago',
    xpValue: 8400,
  },
  {
    id: 'C-003',
    title: 'Micro-Grid Management & Renewable Energy',
    domain: 'Electrical',
    modules: 10,
    lessons: 56,
    status: 'Published',
    difficulty: 'Expert',
    lastUpdated: '5h ago',
    xpValue: 15600,
  },
  {
    id: 'C-004',
    title: 'Strategic ROI & Multi-National Operations',
    domain: 'Management',
    modules: 6,
    lessons: 30,
    status: 'Draft',
    difficulty: 'Intermediate',
    lastUpdated: '4d ago',
    xpValue: 6200,
  },
]

export default function ContentManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [view, setView] = useState<'list' | 'grid'>('list')

  return (
    <div className="space-y-10 pb-32 font-mono">
      {/* Header & Controls */}
      <div className="glass-morphism relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-border bg-slate-900/40 p-10 md:flex-row md:items-end">
        <div className="absolute right-0 top-0 p-8 opacity-5">
          <Layers className="h-32 w-32" />
        </div>

        <div className="relative z-10 space-y-4">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white md:text-5xl">
            CONTENT_OPS <span className="ai-glow text-red-600">LEVEL_SYNC</span>
          </h1>
          <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
            Architect, edit, and deploy global learning pathways. Manage domain-specific skill
            vectors and XP rewards.
          </p>
        </div>

        <div className="relative z-10 flex w-full gap-4 md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Query content by title or ID..."
              className="h-12 border-border bg-background/80 pl-12 font-medium italic text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-12 bg-red-600 px-8 font-black uppercase italic tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" /> NEW_COURSE_V4
          </Button>
        </div>
      </div>

      {/* Course List / Table View */}
      <Card className="group overflow-hidden border-slate-900 bg-background/60">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800/50 bg-card/50">
              <tr>
                <th className="px-6 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  Course_Entity
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  Domain_Vector
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  Inventory
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  XP_Stake
                </th>
                <th className="px-6 py-6 text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  Status_Flag
                </th>
                <th className="px-6 py-6 text-right text-[10px] font-black uppercase italic tracking-widest text-muted-foreground">
                  Access_Control
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {courses.map((course) => (
                <tr key={course.id} className="group/row transition-all hover:bg-card/30">
                  <td className="px-6 py-6">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black uppercase italic tracking-tight text-white">
                        {course.title}
                      </p>
                      <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">
                        ID: {course.id} • Updated: {course.lastUpdated}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-medium italic">
                    <Badge
                      variant="outline"
                      className="border-border bg-card text-[8px] font-black uppercase text-muted-foreground"
                    >
                      {course.domain}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-black tracking-widest text-white">
                          {course.modules}
                        </p>
                        <p className="text-[7px] font-black uppercase text-muted-foreground">
                          MODS
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black tracking-widest text-white">
                          {course.lessons}
                        </p>
                        <p className="text-[7px] font-black uppercase text-muted-foreground">
                          LESSONS
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-[10px] font-black italic tracking-widest text-foreground/80">
                      {course.xpValue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          course.status === 'Published'
                            ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.45)]'
                            : course.status === 'In Review'
                              ? 'bg-primary'
                              : 'bg-muted'
                        )}
                      />
                      <span className="text-[9px] font-black uppercase italic tracking-tighter text-foreground/80">
                        {course.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="group-row-hover:opacity-100 flex items-center justify-end gap-2 opacity-0 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-secondary hover:text-white"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-blue-500/10 hover:text-primary/80"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Content Support */}
      <div className="group relative flex flex-col items-center gap-8 overflow-hidden rounded-3xl border border-red-600/20 bg-red-600/5 p-8 md:flex-row">
        <div className="absolute right-0 top-0 p-4">
          <Sparkles className="h-8 w-8 border-none text-red-600/10 transition-all group-hover:text-red-600/20" />
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-600/10">
          <Cpu className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-black uppercase italic tracking-widest text-white">
            AI_CURATOR_SYNC_REQD
          </h4>
          <p className="max-w-2xl text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
            3 New course blueprints are pending Neural Review for domain-accuracy. Recommended
            Action: Execute <span className="text-red-500">INIT_AI_VALIDATION_SEQUENCE</span> for
            all draft entities.
          </p>
        </div>
        <Button className="ml-auto h-12 border border-border bg-background px-8 text-[10px] font-black uppercase italic tracking-[0.2em] text-white transition-all hover:bg-card">
          LAUNCH_SYNC
        </Button>
      </div>
    </div>
  )
}
