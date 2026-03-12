'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Code2, Zap, Users, FolderOpen, Eye, GitFork,
  ArrowRight, Play, Star, ExternalLink, MonitorPlay,
  Layers, Lock, Sparkles, Terminal, CheckCircle2, Plus,
  Search, Filter, Clock, Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ─── data ──────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Code2,
    title: 'In-Browser IDE',
    desc: 'Full-featured code editor with syntax highlighting, autocomplete, and multi-file support — no installs needed.',
  },
  {
    icon: Zap,
    title: 'Instant Deploy',
    desc: 'Hit "Publish" and your project goes live in seconds with a shareable URL on our CDN.',
  },
  {
    icon: Globe,
    title: 'Free Hosting',
    desc: 'Every Space gets a unique public URL. Host HTML, CSS, JS, or React projects for free, forever.',
  },
  {
    icon: GitFork,
    title: 'Fork & Remix',
    desc: 'Found a Space you love? Fork it instantly, make changes, and publish your own version.',
  },
  {
    icon: Eye,
    title: 'Live Preview',
    desc: 'See your changes reflected in real-time in a split-pane preview — build with confidence.',
  },
  {
    icon: Users,
    title: 'Community Gallery',
    desc: 'Browse thousands of community Spaces for inspiration, learning, and collaboration.',
  },
  {
    icon: Layers,
    title: 'File Manager',
    desc: 'Organise HTML, CSS, JS, images, and assets in a clean project file tree.',
  },
  {
    icon: Lock,
    title: 'Public or Private',
    desc: 'Keep your work-in-progress private or flip it public to share with the world.',
  },
]

const TEMPLATES = [
  {
    id: 'html-starter',
    name: 'HTML Starter',
    desc: 'Clean HTML page — perfect baseline',
    lang: 'HTML',
    color: 'bg-orange-500/10 text-orange-600',
    stars: 4820,
    forks: 1240,
    preview: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Site</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>`,
  },
  {
    id: 'css-portfolio',
    name: 'CSS Portfolio',
    desc: 'Responsive personal portfolio page',
    lang: 'CSS',
    color: 'bg-blue-500/10 text-blue-600',
    stars: 3210,
    forks: 890,
    preview: `body { font-family: sans-serif; }\n.hero { display: flex; }\n.card { border-radius: 12px; }`,
  },
  {
    id: 'js-calculator',
    name: 'JS Calculator',
    desc: 'Working calculator with event listeners',
    lang: 'JavaScript',
    color: 'bg-yellow-500/10 text-yellow-600',
    stars: 5610,
    forks: 2100,
    preview: `function calculate(a, op, b) {\n  return eval(\`\${a}\${op}\${b}\`);\n}`,
  },
  {
    id: 'react-todo',
    name: 'React Todo App',
    desc: 'useState hooks, lists, and CRUD',
    lang: 'React',
    color: 'bg-cyan-500/10 text-cyan-600',
    stars: 7320,
    forks: 3450,
    preview: `const [todos, setTodos] = useState([]);\nconst add = (t) => setTodos([...todos, t]);`,
  },
  {
    id: 'tailwind-landing',
    name: 'Tailwind Landing',
    desc: 'Beautiful landing page with Tailwind',
    lang: 'Tailwind',
    color: 'bg-indigo-500/10 text-indigo-600',
    stars: 6140,
    forks: 1980,
    preview: `<section class="min-h-screen flex\n items-center justify-center\n bg-gray-950 text-white">`,
  },
  {
    id: 'api-fetch',
    name: 'API Fetch Demo',
    desc: 'Fetch public API and render results',
    lang: 'JavaScript',
    color: 'bg-yellow-500/10 text-yellow-600',
    stars: 4020,
    forks: 1560,
    preview: `fetch('https://api.example.com/data')\n  .then(r => r.json())\n  .then(console.log);`,
  },
]

const COMMUNITY = [
  { name: 'Pixel Weather App', author: 'Arjun S.', lang: 'React', stars: 241, forks: 87, views: '12k', badge: 'Featured' },
  { name: 'CSS Art — Sunset', author: 'Priya K.', lang: 'CSS', stars: 802, forks: 134, views: '34k', badge: 'Top Rated' },
  { name: 'Snake Game', author: 'Mihir T.', lang: 'JavaScript', stars: 615, forks: 290, views: '28k', badge: null },
  { name: 'Dark Portfolio', author: 'Sneha R.', lang: 'HTML', stars: 183, forks: 62, views: '8.4k', badge: null },
  { name: 'Typing Speed Test', author: 'Dev B.', lang: 'JavaScript', stars: 447, forks: 118, views: '19k', badge: 'Rising' },
  { name: 'Glass UI Kit', author: 'Meera N.', lang: 'CSS', stars: 930, forks: 310, views: '41k', badge: 'Top Rated' },
]

const STEPS = [
  {
    n: '01',
    title: 'Pick a Template',
    desc: 'Start from a blank canvas or choose a community template. HTML, CSS, JS, or React — your call.',
    icon: FolderOpen,
  },
  {
    n: '02',
    title: 'Build in the IDE',
    desc: 'Write code in our in-browser editor. Live preview updates as you type, side by side.',
    icon: Terminal,
  },
  {
    n: '03',
    title: 'Publish Instantly',
    desc: 'One click to publish. Your Space gets a shareable URL and appears in the community gallery.',
    icon: Globe,
  },
]

const LANG_COLORS: Record<string, string> = {
  HTML: 'bg-orange-500/10 text-orange-600 border-orange-200',
  CSS: 'bg-blue-500/10 text-blue-600 border-blue-200',
  JavaScript: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  React: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  Tailwind: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
}

const FILTER_TABS = ['All', 'HTML', 'CSS', 'JavaScript', 'React', 'Tailwind']

// ─── component ─────────────────────────────────────────────────────────────

export default function SpacesPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)

  const filteredTemplates =
    activeFilter === 'All'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.lang === activeFilter)

  return (
    <div className="bg-background text-foreground">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] bg-foreground/[0.04] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/8 border border-border/50 rounded-full text-[11px] font-bold uppercase tracking-widest text-primary mb-6"
          >
            <Sparkles className="h-3 w-3" />
            Bluelearnerhub Spaces — Free Web Hosting
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.0] mb-6"
          >
            Your Code.
            <br />
            <span className="text-foreground/40">Live on the Web.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
          >
            Build HTML, CSS, JavaScript, and React projects in your browser.
            Deploy them instantly with a single click — free, forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link href="/spaces/new">
              <Button size="lg" className="gap-2 font-black px-8 rounded-xl h-12 text-[14px]">
                <Plus className="h-4 w-4" />
                Create a Space
              </Button>
            </Link>
            <Link href="/spaces/explore">
              <Button size="lg" variant="outline" className="gap-2 font-bold px-8 rounded-xl h-12 text-[14px] border-border/60">
                <Search className="h-4 w-4" />
                Explore Spaces
              </Button>
            </Link>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm"
          >
            {[
              { val: '48k+', label: 'Spaces Published' },
              { val: 'Free', label: 'Forever Plan' },
              { val: '< 1s', label: 'Deploy Time' },
              { val: '99.9%', label: 'Uptime SLA' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black">{s.val}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BROWSER MOCKUP ── */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border/60 overflow-hidden shadow-2xl bg-background"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3 bg-muted/60 border-b border-border/40">
              <div className="h-3 w-3 rounded-full bg-border" />
              <div className="h-3 w-3 rounded-full bg-border" />
              <div className="h-3 w-3 rounded-full bg-border" />
              <div className="flex-1 mx-4 bg-background border border-border/50 rounded-md px-3 py-1 text-[11px] text-muted-foreground font-mono tracking-tight">
                spaces.bluelearnerhub.com/preview/my-portfolio
              </div>
              <div className="flex items-center gap-1 text-[11px] text-primary font-bold">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                Live
              </div>
            </div>
            {/* Editor split */}
            <div className="grid grid-cols-2 min-h-[340px]">
              {/* Code pane */}
              <div className="border-r border-border/40 bg-muted/10 p-6 font-mono text-[12px] leading-6">
                <div className="flex items-center gap-2 mb-4">
                  {['index.html', 'style.css', 'app.js'].map((f, i) => (
                    <span
                      key={f}
                      className={`px-3 py-1 rounded-t-md text-[11px] font-semibold border-t border-x ${
                        i === 0
                          ? 'bg-background border-border/60 text-foreground'
                          : 'border-transparent text-muted-foreground'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="space-y-0.5">
                  {[
                    { n: 1, code: '<!DOCTYPE html>', c: 'text-muted-foreground' },
                    { n: 2, code: '<html lang="en">', c: 'text-blue-500' },
                    { n: 3, code: '  <head>', c: 'text-blue-500' },
                    { n: 4, code: '    <title>My Portfolio</title>', c: 'text-foreground' },
                    { n: 5, code: '  </head>', c: 'text-blue-500' },
                    { n: 6, code: '  <body class="dark">', c: 'text-blue-500' },
                    { n: 7, code: '    <h1>Hey, I\'m Dev 👋</h1>', c: 'text-foreground' },
                    { n: 8, code: '    <p>I build cool stuff.</p>', c: 'text-foreground' },
                    { n: 9, code: '  </body>', c: 'text-blue-500' },
                    { n: 10, code: '</html>', c: 'text-blue-500' },
                  ].map((l) => (
                    <div key={l.n} className="flex gap-4">
                      <span className="w-5 text-right text-muted-foreground/40 select-none shrink-0">{l.n}</span>
                      <span className={l.c}>{l.code}</span>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <span className="w-5 text-right text-muted-foreground/40 select-none shrink-0">11</span>
                    <span className="border-r-2 border-foreground animate-pulse text-foreground">&nbsp;</span>
                  </div>
                </div>
              </div>
              {/* Preview pane */}
              <div className="bg-[#0f0f0f] p-8 flex flex-col justify-center font-sans">
                <p className="text-3xl font-black text-white mb-2">Hey, I'm Dev 👋</p>
                <p className="text-gray-400 text-sm">I build cool stuff.</p>
                <div className="mt-6 flex gap-2">
                  <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/10">GitHub</div>
                  <div className="px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/10">Portfolio</div>
                </div>
              </div>
            </div>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-muted/30 border-t border-border/40">
              <div className="flex gap-2">
                {['HTML', 'CSS', 'JS'].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors">
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-black hover:bg-primary/90 transition-all">
                  <Globe className="h-3 w-3" /> Publish
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">From idea to live site in 3 steps</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex flex-col gap-4 p-7 rounded-2xl border border-border/50 bg-card hover:border-border transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 border border-border/40">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-4xl font-black text-foreground/8 leading-none">{step.n}</span>
                  </div>
                  <div>
                    <p className="text-[15px] font-black mb-1.5">{step.title}</p>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-border" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="border-b border-border/40 py-20 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">Everything You Need</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Built for learners & builders</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col gap-3 p-6 rounded-2xl border border-border/50 bg-card hover:border-border hover:shadow-sm transition-all group"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/6 border border-border/40 group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-[14px] font-black mb-1">{f.title}</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">Starter Templates</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Pick one. Start building.</h2>
            </div>
            <Link href="/spaces/templates" className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors shrink-0">
              View all templates <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold border transition-all ${
                  activeFilter === tab
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04 }}
                  className="group rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-md transition-all"
                  onMouseEnter={() => setHoveredTemplate(t.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  {/* Code preview */}
                  <div className="relative bg-muted/40 border-b border-border/40 p-4 h-[120px] overflow-hidden font-mono text-[11px] leading-5">
                    <div className="flex gap-1.5 mb-3">
                      <div className="h-2.5 w-2.5 rounded-full bg-border" />
                      <div className="h-2.5 w-2.5 rounded-full bg-border" />
                      <div className="h-2.5 w-2.5 rounded-full bg-border" />
                    </div>
                    <pre className="text-muted-foreground whitespace-pre-wrap">{t.preview}</pre>
                    {/* Overlay on hover */}
                    <AnimatePresence>
                      {hoveredTemplate === t.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-background/90 flex items-center justify-center gap-3"
                        >
                          <Link href={`/spaces/new?template=${t.id}`}>
                            <Button size="sm" className="gap-1.5 font-black rounded-lg text-[12px] h-8">
                              <Play className="h-3 w-3" /> Use Template
                            </Button>
                          </Link>
                          <Link href={`/spaces/templates/${t.id}`}>
                            <Button size="sm" variant="outline" className="gap-1.5 font-bold rounded-lg text-[12px] h-8 border-border/60">
                              <Eye className="h-3 w-3" /> Preview
                            </Button>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-[14px] font-black leading-tight">{t.name}</p>
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border ${LANG_COLORS[t.lang] ?? ''}`}>
                        {t.lang}
                      </span>
                    </div>
                    <p className="text-[12px] text-muted-foreground mb-3">{t.desc}</p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" /> {t.stars.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {t.forks.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── COMMUNITY SPACES ── */}
      <section className="border-b border-border/40 py-20 bg-muted/10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2">Community Gallery</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Built by learners. For learners.</h2>
            </div>
            <Link href="/spaces/explore" className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground hover:text-foreground transition-colors shrink-0">
              Browse all Spaces <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMMUNITY.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group flex flex-col rounded-2xl border border-border/50 bg-card overflow-hidden hover:border-border hover:shadow-md transition-all cursor-pointer"
              >
                {/* Thumbnail placeholder */}
                <div className="h-[140px] bg-muted/50 flex items-center justify-center border-b border-border/40 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
                  />
                  <MonitorPlay className="h-10 w-10 text-foreground/20" />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link href={`/spaces/explore/${i + 1}`} onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className="gap-1.5 font-black rounded-lg text-[11px] h-8">
                        <ExternalLink className="h-3 w-3" /> Open
                      </Button>
                    </Link>
                    <Button size="sm" variant="outline" className="gap-1.5 font-bold rounded-lg text-[11px] h-8 border-border/60">
                      <GitFork className="h-3 w-3" /> Fork
                    </Button>
                  </div>
                </div>
                {/* Meta */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[14px] font-black leading-tight">{s.name}</p>
                    {s.badge && (
                      <span className={`shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wide ${
                        s.badge === 'Top Rated' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200'
                        : s.badge === 'Featured' ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-green-500/10 text-green-600 border-green-200'
                      }`}>
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-3">by {s.author}</p>
                  <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {s.stars}</span>
                    <span className="flex items-center gap-1"><GitFork className="h-3 w-3" /> {s.forks}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {s.views}</span>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${LANG_COLORS[s.lang] ?? ''}`}>{s.lang}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANS ── */}
      <section className="border-b border-border/40 py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-14">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">Start free. Scale when ready.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">

            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/60 bg-card p-8 flex flex-col gap-5"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Free</p>
                <p className="text-4xl font-black tracking-tighter">₹0 <span className="text-base font-semibold text-muted-foreground">/ forever</span></p>
              </div>
              <ul className="space-y-2.5">
                {['5 Spaces', 'Public hosting', 'Community templates', 'Live preview', 'Fork community Spaces', 'Public gallery listing'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-foreground/50" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/get-started" className="mt-auto">
                <Button variant="outline" className="w-full rounded-xl font-black border-border/60">Get Started Free</Button>
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative rounded-2xl border border-primary/30 bg-primary text-primary-foreground p-8 flex flex-col gap-5 shadow-xl"
            >
              <div className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/20">
                Popular
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/60 mb-2">Pro</p>
                <p className="text-4xl font-black tracking-tighter">₹199 <span className="text-base font-semibold text-primary-foreground/60">/ month</span></p>
              </div>
              <ul className="space-y-2.5">
                {['Unlimited Spaces', 'Private Spaces', 'Custom domains', 'Advanced file manager', 'Version history', 'Priority support', 'Remove Bluelearnerhub branding', 'Analytics dashboard'].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-primary-foreground/80">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-foreground" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/premium" className="mt-auto">
                <Button variant="secondary" className="w-full rounded-xl font-black">Upgrade to Pro</Button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-b border-border/40 py-20 bg-muted/10">
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-3">FAQ</p>
            <h2 className="text-3xl font-black tracking-tighter">Common questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: 'What languages can I use in a Space?',
                a: 'Currently HTML, CSS, JavaScript, and React (JSX). TypeScript and Python support is on the roadmap.',
              },
              {
                q: 'Can I use external libraries or CDNs?',
                a: 'Yes — add a <script> or <link> tag pointing to any CDN like unpkg or jsDelivr and the live preview will load it instantly.',
              },
              {
                q: 'What URL will my Space be hosted at?',
                a: 'Every Space gets a URL like spaces.bluelearnerhub.com/u/username/my-project. Pro users can connect their own custom domain.',
              },
              {
                q: 'Can I keep my Space private?',
                a: 'Free users get public-only Spaces. Pro users can toggle any Space to private — invisible in the gallery and accessible only via direct link.',
              },
              {
                q: 'Is there a size limit per Space?',
                a: 'Free Spaces are limited to 10 MB total. Pro Spaces support up to 500 MB and allow binary file uploads (images, fonts, etc.).',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-border/50 bg-card px-5 py-4 cursor-pointer"
              >
                <summary className="flex items-center justify-between gap-4 text-[14px] font-bold list-none select-none">
                  {item.q}
                  <Plus className="h-4 w-4 shrink-0 text-muted-foreground group-open:rotate-45 transition-transform duration-200" />
                </summary>
                <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-4">Ready to Build?</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter mb-6">
              Build it. Ship it. Share it.
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              Your next project is one click away. No installs, no config, no excuses.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/spaces/new">
                <Button size="lg" className="gap-2 font-black px-8 rounded-xl h-12 text-[14px]">
                  <Plus className="h-4 w-4" />
                  Create Your First Space
                </Button>
              </Link>
              <Link href="/spaces/explore">
                <Button size="lg" variant="outline" className="gap-2 font-bold px-8 rounded-xl h-12 text-[14px] border-border/60">
                  <Globe className="h-4 w-4" />
                  Explore Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
