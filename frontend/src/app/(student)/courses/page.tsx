'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  SlidersHorizontal,
  Star,
  Clock,
  Users,
  BookOpen,
  ChevronRight,
  Filter,
  X,
  Cpu,
  Zap,
  Building2,
  Settings,
  Rocket,
  Bot,
  HeartPulse,
  Factory,
  FlaskConical,
  Car,
  DollarSign,
  Target,
  Briefcase,
  BarChart3,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

const CATEGORIES = ['All', 'Computer Science', 'Electrical', 'Mechanical', 'Civil', 'Management', 'AI & ML']
const DIFFICULTIES = ['All Levels', 'Beginner', 'Intermediate', 'Advanced']
const DURATIONS = ['Any Duration', 'Under 5 hours', '5–20 hours', '20+ hours']
const SORT_OPTIONS = ['Most Popular', 'Latest', 'Highest Rated', 'Shortest First']

const COURSES = [
  {
    id: 1, slug: 'python-fundamentals',
    title: 'Python for Beginners', category: 'Computer Science', icon: Cpu,
    difficulty: 'Beginner', duration: '8 hrs', lessons: 48, enrolled: 32400,
    rating: 4.9, reviews: 2840, progress: 0,
    tags: ['Python', 'Programming'], color: 'from-blue-600/20 to-indigo-600/20', iconColor: 'text-blue-400',
    instructor: 'Dr. Ravi Kumar', thumbnail: 'bg-gradient-to-br from-blue-900 to-indigo-900',
  },
  {
    id: 2, slug: 'dsa-mastery',
    title: 'Data Structures & Algorithms', category: 'Computer Science', icon: BarChart3,
    difficulty: 'Intermediate', duration: '24 hrs', lessons: 120, enrolled: 18700,
    rating: 4.8, reviews: 1950, progress: 35,
    tags: ['DSA', 'Algorithms'], color: 'from-violet-600/20 to-purple-600/20', iconColor: 'text-violet-400',
    instructor: 'Prof. Ananya Sen', thumbnail: 'bg-gradient-to-br from-violet-900 to-purple-900',
  },
  {
    id: 3, slug: 'machine-learning',
    title: 'Machine Learning Fundamentals', category: 'AI & ML', icon: Bot,
    difficulty: 'Intermediate', duration: '20 hrs', lessons: 64, enrolled: 14500,
    rating: 4.9, reviews: 1200, progress: 0,
    tags: ['ML', 'Python', 'AI'], color: 'from-emerald-600/20 to-teal-600/20', iconColor: 'text-emerald-400',
    instructor: 'Dr. Sanjana Rao', thumbnail: 'bg-gradient-to-br from-emerald-900 to-teal-900',
  },
  {
    id: 4, slug: 'circuit-design',
    title: 'Circuit Design Essentials', category: 'Electrical', icon: Zap,
    difficulty: 'Intermediate', duration: '14 hrs', lessons: 52, enrolled: 8200,
    rating: 4.7, reviews: 670, progress: 72,
    tags: ['Circuits', 'EE'], color: 'from-yellow-600/20 to-amber-600/20', iconColor: 'text-yellow-400',
    instructor: 'Prof. Arjun Mehta', thumbnail: 'bg-gradient-to-br from-yellow-900 to-amber-900',
  },
  {
    id: 5, slug: 'structural-engineering',
    title: 'Structural Engineering Basics', category: 'Civil', icon: Building2,
    difficulty: 'Beginner', duration: '12 hrs', lessons: 40, enrolled: 6400,
    rating: 4.6, reviews: 480, progress: 0,
    tags: ['Structures', 'Civil'], color: 'from-orange-600/20 to-red-600/20', iconColor: 'text-orange-400',
    instructor: 'Dr. Priya Iyer', thumbnail: 'bg-gradient-to-br from-orange-900 to-red-900',
  },
  {
    id: 6, slug: 'mechanical-design',
    title: 'CAD & Mechanical Design', category: 'Mechanical', icon: Settings,
    difficulty: 'Intermediate', duration: '18 hrs', lessons: 58, enrolled: 9100,
    rating: 4.7, reviews: 720, progress: 0,
    tags: ['CAD', 'Mechanical'], color: 'from-slate-600/20 to-gray-600/20', iconColor: 'text-slate-400',
    instructor: 'Prof. Rohan Gupta', thumbnail: 'bg-gradient-to-br from-slate-800 to-gray-900',
  },
  {
    id: 7, slug: 'aerospace-intro',
    title: 'Introduction to Aerospace', category: 'Mechanical', icon: Rocket,
    difficulty: 'Advanced', duration: '28 hrs', lessons: 90, enrolled: 4200,
    rating: 4.8, reviews: 340, progress: 10,
    tags: ['Aerospace', 'Physics'], color: 'from-cyan-600/20 to-blue-600/20', iconColor: 'text-cyan-400',
    instructor: 'Dr. Vikram Nair', thumbnail: 'bg-gradient-to-br from-cyan-900 to-blue-900',
  },
  {
    id: 8, slug: 'product-management',
    title: 'Product Management Crash Course', category: 'Management', icon: Target,
    difficulty: 'Beginner', duration: '6 hrs', lessons: 28, enrolled: 12300,
    rating: 4.9, reviews: 1540, progress: 55,
    tags: ['PM', 'Strategy'], color: 'from-pink-600/20 to-rose-600/20', iconColor: 'text-pink-400',
    instructor: 'Neha Verma', thumbnail: 'bg-gradient-to-br from-pink-900 to-rose-900',
  },
  {
    id: 9, slug: 'biomedical-fundamentals',
    title: 'Biomedical Engineering Basics', category: 'Mechanical', icon: HeartPulse,
    difficulty: 'Intermediate', duration: '16 hrs', lessons: 44, enrolled: 3800,
    rating: 4.6, reviews: 290, progress: 0,
    tags: ['Biomedical', 'Healthcare'], color: 'from-red-600/20 to-pink-600/20', iconColor: 'text-red-400',
    instructor: 'Dr. Kavya Reddy', thumbnail: 'bg-gradient-to-br from-red-900 to-pink-900',
  },
]

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function CourseCard({ course, index }: { course: typeof COURSES[0]; index: number }) {
  const Icon = course.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className={`relative h-36 ${course.thumbnail} flex items-center justify-center overflow-hidden`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-80`} />
        <Icon className={`relative z-10 w-12 h-12 ${course.iconColor} opacity-80`} />
        {course.progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0">
            <Progress value={course.progress} className="h-1 rounded-none bg-white/10" />
          </div>
        )}
        {course.rating >= 4.8 && (
          <Badge className="absolute top-3 left-3 bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-bold">
            Top Rated
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Badge className={`text-[10px] border font-semibold ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span className="font-bold">{course.rating}</span>
            <span className="text-muted-foreground">({course.reviews.toLocaleString()})</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>

        <p className="text-xs text-muted-foreground">by {course.instructor}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.lessons} lessons</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{(course.enrolled / 1000).toFixed(1)}K</span>
        </div>

        {course.progress > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Progress</span>
              <span className="font-bold text-primary">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5 bg-muted/50" />
          </div>
        )}

        <div className="pt-1">
          <Link href={`/tutorials/${course.slug}`}>
            <Button
              size="sm"
              className={`w-full rounded-xl font-bold text-xs h-9 gap-1.5 ${
                course.progress > 0
                  ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white'
                  : 'bg-primary hover:bg-primary/90 text-white'
              } transition-all`}
            >
              {course.progress > 0 ? 'Continue' : 'Enroll Now'}
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function CourseCatalogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All Levels')
  const [sortBy, setSortBy] = useState('Most Popular')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = COURSES.filter((c) => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = activeCategory === 'All' || c.category === activeCategory
    const matchDifficulty = difficulty === 'All Levels' || c.difficulty === difficulty
    return matchSearch && matchCategory && matchDifficulty
  }).sort((a, b) => {
    if (sortBy === 'Highest Rated') return b.rating - a.rating
    if (sortBy === 'Shortest First') return parseInt(a.duration) - parseInt(b.duration)
    if (sortBy === 'Latest') return b.id - a.id
    return b.enrolled - a.enrolled
  })

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black font-heading tracking-tight text-white">Course Catalog</h1>
        <p className="text-muted-foreground">
          {filtered.length} courses across engineering, management, and computer science.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, topics, or skills..."
            className="pl-11 bg-card border-border h-11 rounded-xl text-sm focus-visible:ring-primary/30"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-muted-foreground hover:text-white transition-colors" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-card border border-border text-sm text-foreground rounded-xl px-4 h-11 focus:outline-none focus:ring-1 focus:ring-primary/30 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl border-border gap-2 text-sm font-semibold ${showFilters ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(difficulty !== 'All Levels') && (
              <Badge className="bg-primary text-white text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full">1</Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Filter row */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-4 p-5 bg-card/50 border border-border rounded-2xl"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${difficulty === d ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:text-white hover:border-border/80'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary'
                : 'border-border text-muted-foreground hover:text-white hover:border-border/80 bg-card/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong className="text-foreground">{filtered.length}</strong> courses
          {activeCategory !== 'All' && <> in <strong className="text-primary">{activeCategory}</strong></>}
        </p>
        {(search || activeCategory !== 'All' || difficulty !== 'All Levels') && (
          <button
            onClick={() => { setSearch(''); setActiveCategory('All'); setDifficulty('All Levels') }}
            className="text-xs text-muted-foreground hover:text-white flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border flex items-center justify-center mx-auto">
            <Search className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No courses match your filters.</p>
          <Button variant="ghost" onClick={() => { setSearch(''); setActiveCategory('All'); setDifficulty('All Levels') }}>
            Reset filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
