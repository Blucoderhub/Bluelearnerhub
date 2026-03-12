'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Eye, GitFork, Heart, Plus, MonitorPlay,
  ExternalLink, Star, TrendingUp, Clock, Globe, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const LANG_COLORS: Record<string, string> = {
  HTML: 'bg-orange-500/10 text-orange-600 border-orange-200',
  CSS: 'bg-blue-500/10 text-blue-600 border-blue-200',
  JavaScript: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  React: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  Tailwind: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
}

const ALL_SPACES = [
  { id: 1, name: 'Pixel Weather App', author: 'Arjun S.', lang: 'React', stars: 241, forks: 87, views: '12k', badge: 'Featured', ago: '2d' },
  { id: 2, name: 'CSS Sunset Art', author: 'Priya K.', lang: 'CSS', stars: 802, forks: 134, views: '34k', badge: 'Top Rated', ago: '5d' },
  { id: 3, name: 'Snake Game', author: 'Mihir T.', lang: 'JavaScript', stars: 615, forks: 290, views: '28k', badge: null, ago: '1d' },
  { id: 4, name: 'Dark Portfolio', author: 'Sneha R.', lang: 'HTML', stars: 183, forks: 62, views: '8.4k', badge: null, ago: '3d' },
  { id: 5, name: 'Typing Speed Test', author: 'Dev B.', lang: 'JavaScript', stars: 447, forks: 118, views: '19k', badge: 'Rising', ago: '12h' },
  { id: 6, name: 'Glass UI Kit', author: 'Meera N.', lang: 'CSS', stars: 930, forks: 310, views: '41k', badge: 'Top Rated', ago: '6d' },
  { id: 7, name: 'Markdown Previewer', author: 'Ravi M.', lang: 'React', stars: 338, forks: 91, views: '15k', badge: null, ago: '8h' },
  { id: 8, name: 'Pomodoro Timer', author: 'Ananya P.', lang: 'JavaScript', stars: 512, forks: 143, views: '22k', badge: 'Featured', ago: '1d' },
  { id: 9, name: 'Tailwind Dashboard', author: 'Karan J.', lang: 'Tailwind', stars: 690, forks: 188, views: '30k', badge: null, ago: '4d' },
  { id: 10, name: 'Expense Tracker', author: 'Nisha V.', lang: 'React', stars: 271, forks: 74, views: '11k', badge: 'Rising', ago: '2d' },
  { id: 11, name: 'CSS Neon Buttons', author: 'Raj S.', lang: 'CSS', stars: 441, forks: 156, views: '18k', badge: null, ago: '7d' },
  { id: 12, name: 'Quiz App', author: 'Isha T.', lang: 'JavaScript', stars: 388, forks: 107, views: '16k', badge: null, ago: '3d' },
]

const SORT_OPTIONS = ['Trending', 'Most Stars', 'Most Forks', 'Newest'] as const
const LANG_FILTERS = ['All', 'HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'] as const

type SortOption = typeof SORT_OPTIONS[number]
type LangFilter = typeof LANG_FILTERS[number]

function sortSpaces(spaces: typeof ALL_SPACES, sort: SortOption) {
  const copy = [...spaces]
  if (sort === 'Most Stars') return copy.sort((a, b) => b.stars - a.stars)
  if (sort === 'Most Forks') return copy.sort((a, b) => b.forks - a.forks)
  if (sort === 'Newest') return copy.sort((a, b) => a.ago.localeCompare(b.ago))
  return copy // Trending = default order
}

export default function SpacesExplorePage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('Trending')
  const [langFilter, setLangFilter] = useState<LangFilter>('All')

  const filtered = sortSpaces(
    ALL_SPACES.filter((s) => {
      const matchLang = langFilter === 'All' || s.lang === langFilter
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.author.toLowerCase().includes(search.toLowerCase())
      return matchLang && matchSearch
    }),
    sortBy
  )

  return (
    <div className="bg-background text-foreground min-h-screen">

      {/* ── Header ── */}
      <div className="border-b border-border/40 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">Community Gallery</p>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Explore Spaces</h1>
              <p className="text-muted-foreground mt-1.5 text-[14px]">{ALL_SPACES.length.toLocaleString()}+ projects built by learners</p>
            </div>
            <Link href="/spaces/new">
              <Button className="gap-2 font-black rounded-xl">
                <Plus className="h-4 w-4" />
                Create a Space
              </Button>
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search spaces or authors…"
                className="pl-9 rounded-xl border-border/50 bg-background h-10 text-[13px]"
              />
            </div>
            {/* Sort */}
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-bold border transition-all ${
                    sortBy === opt
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  {opt === 'Trending' && <Flame className="h-3 w-3" />}
                  {opt === 'Most Stars' && <Star className="h-3 w-3" />}
                  {opt === 'Most Forks' && <GitFork className="h-3 w-3" />}
                  {opt === 'Newest' && <Clock className="h-3 w-3" />}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Lang filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {LANG_FILTERS.map((lang) => (
              <button
                key={lang}
                onClick={() => setLangFilter(lang)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${
                  langFilter === lang
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Globe className="h-10 w-10 mx-auto mb-4 opacity-30" />
            <p className="text-[15px] font-bold">No spaces found</p>
            <p className="text-[13px] mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((s, i) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: i * 0.03 }}
                  className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="h-[120px] bg-muted/40 border-b border-border/40 relative overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-[0.03]"
                      style={{ backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: '16px 16px' }}
                    />
                    <MonitorPlay className="h-8 w-8 text-foreground/15" />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/spaces/${s.id}`}>
                        <Button size="sm" className="gap-1.5 font-black rounded-lg text-[11px] h-7 px-3">
                          <ExternalLink className="h-3 w-3" /> Open
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="gap-1.5 font-bold rounded-lg text-[11px] h-7 px-3 border-border/60">
                        <GitFork className="h-3 w-3" /> Fork
                      </Button>
                    </div>
                    {s.badge && (
                      <div className="absolute top-2 right-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                          s.badge === 'Top Rated' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                          : s.badge === 'Featured' ? 'bg-primary/10 text-primary border-primary/20'
                          : 'bg-green-500/10 text-green-600 border-green-200'
                        }`}>
                          {s.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="p-3.5">
                    <div className="flex items-start justify-between gap-1.5 mb-0.5">
                      <p className="text-[13px] font-black leading-tight truncate">{s.name}</p>
                      <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${LANG_COLORS[s.lang] ?? ''}`}>
                        {s.lang}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2.5">by {s.author} · {s.ago} ago</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {s.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {s.forks}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {s.views}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
