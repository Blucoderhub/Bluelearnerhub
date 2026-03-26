'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Globe,
  Eye,
  Save,
  Play,
  Plus,
  Trash2,
  Settings,
  Code2,
  ChevronDown,
  X,
  Share2,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  Download,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

type FileType = { id: string; name: string; lang: 'html' | 'css' | 'js'; content: string }

const DEFAULT_FILES: FileType[] = [
  {
    id: 'html',
    name: 'index.html',
    lang: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Space</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <h1>Hello, World! 👋</h1>
      <p>Edit this Space to build something awesome.</p>
      <button onclick="greet()">Say Hello</button>
    </div>
    <script src="app.js"></script>
  </body>
</html>`,
  },
  {
    id: 'css',
    name: 'style.css',
    lang: 'css',
    content: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: #0f0f0f;
  color: #ffffff;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
}

p {
  color: #888;
  margin-bottom: 2rem;
}

button {
  background: #fff;
  color: #000;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:hover {
  opacity: 0.85;
}`,
  },
  {
    id: 'js',
    name: 'app.js',
    lang: 'js',
    content: `function greet() {
  const names = ['Learner', 'Builder', 'Dev', 'Creator']
  const picked = names[Math.floor(Math.random() * names.length)]
  alert(\`Hey, \${picked}! Keep building 🚀\`)
}`,
  },
]

const LANG_COLORS = {
  html: 'text-orange-500',
  css: 'text-blue-500',
  js: 'text-yellow-500',
}

function buildPreviewSrc(files: FileType[]) {
  const html = files.find((f) => f.lang === 'html')?.content ?? ''
  const css = files.find((f) => f.lang === 'css')?.content ?? ''
  const js = files.find((f) => f.lang === 'js')?.content ?? ''

  const injected = html
    .replace('</head>', `<style>${css}</style></head>`)
    .replace('</body>', `<script>${js}</script></body>`)

  return `data:text/html;charset=utf-8,${encodeURIComponent(injected)}`
}

export default function SpacesEditorPage() {
  const [files, setFiles] = useState<FileType[]>(DEFAULT_FILES)
  const [activeFile, setActiveFile] = useState<string>('html')
  const [preview, setPreview] = useState(() => buildPreviewSrc(DEFAULT_FILES))
  const [projectName, setProjectName] = useState('My Space')
  const [isPrivate, setIsPrivate] = useState(false)
  const [published, setPublished] = useState(false)
  const [copied, setCopied] = useState(false)
  const [autoPreview, setAutoPreview] = useState(true)
  const previewTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const current = files.find((f) => f.id === activeFile)!

  const updateContent = (val: string) => {
    setFiles((prev) => prev.map((f) => (f.id === activeFile ? { ...f, content: val } : f)))
    if (autoPreview) {
      if (previewTimer.current) clearTimeout(previewTimer.current)
      previewTimer.current = setTimeout(() => {
        setPreview(
          buildPreviewSrc(files.map((f) => (f.id === activeFile ? { ...f, content: val } : f)))
        )
      }, 600)
    }
  }

  const runPreview = () => {
    setPreview(buildPreviewSrc(files))
  }

  const publish = () => {
    setPublished(true)
  }

  const copyLink = () => {
    navigator.clipboard.writeText(
      `spaces.bluelearnerhub.com/u/you/${projectName.toLowerCase().replace(/\s+/g, '-')}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* ── Top bar ── */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-border/50 bg-background px-4">
        {/* Project name */}
        <Input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="h-7 w-44 rounded-lg border-border/40 bg-muted/30 px-2 text-[13px] font-bold"
        />

        <div className="ml-1 flex items-center gap-1">
          {/* Privacy toggle */}
          <button
            onClick={() => setIsPrivate(!isPrivate)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold text-muted-foreground transition-all hover:bg-muted/50 hover:text-foreground"
          >
            {isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            {isPrivate ? 'Private' : 'Public'}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {published && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/40 px-3 py-1"
            >
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-muted-foreground">Live</span>
              <button
                onClick={copyLink}
                className="flex items-center gap-1 text-[11px] font-bold text-primary transition-colors hover:text-primary/80"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </motion.div>
          )}
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1.5 rounded-lg border-border/50 text-[12px] font-bold"
            onClick={runPreview}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Run
          </Button>
          <Button
            size="sm"
            className="h-7 gap-1.5 rounded-lg text-[12px] font-black"
            onClick={publish}
          >
            <Globe className="h-3.5 w-3.5" />
            {published ? 'Re-publish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex min-h-0 flex-1">
        {/* ── Editor panel ── */}
        <div className="flex w-1/2 min-w-0 flex-col border-r border-border/40">
          {/* File tabs */}
          <div className="flex shrink-0 items-center gap-0 border-b border-border/40 bg-muted/20">
            {files.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFile(f.id)}
                className={`flex items-center gap-1.5 border-r border-border/30 px-4 py-2.5 text-[12px] font-semibold transition-all ${
                  activeFile === f.id
                    ? 'border-b-2 border-b-primary bg-background text-foreground'
                    : 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'
                }`}
              >
                <Code2 className={`h-3 w-3 ${LANG_COLORS[f.lang]}`} />
                {f.name}
              </button>
            ))}
          </div>

          {/* Code textarea */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Line numbers */}
            <div className="w-10 shrink-0 select-none border-r border-border/30 bg-muted/10 pb-4 pr-2 pt-4 text-right">
              {current.content.split('\n').map((_, i) => (
                <div
                  key={i}
                  className="font-mono text-[11px] leading-[1.6rem] text-muted-foreground/40"
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              value={current.content}
              onChange={(e) => updateContent(e.target.value)}
              spellCheck={false}
              className="flex-1 resize-none overflow-auto bg-transparent p-4 font-mono text-[12px] leading-[1.6rem] text-foreground placeholder-muted-foreground outline-none"
              style={{ tabSize: 2 }}
            />
          </div>

          {/* Status bar */}
          <div className="flex shrink-0 items-center justify-between border-t border-border/30 bg-muted/10 px-4 py-1.5 font-mono text-[10px] text-muted-foreground/60">
            <span>{current.lang.toUpperCase()}</span>
            <span>{current.content.split('\n').length} lines</span>
            <label className="flex cursor-pointer items-center gap-1.5">
              <input
                type="checkbox"
                className="h-3 w-3"
                checked={autoPreview}
                onChange={(e) => setAutoPreview(e.target.checked)}
              />
              Auto-preview
            </label>
          </div>
        </div>

        {/* ── Preview panel ── */}
        <div className="flex w-1/2 min-w-0 flex-col">
          {/* Preview header */}
          <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border/40 bg-muted/10 px-4">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[12px] font-bold text-muted-foreground">Preview</span>
            <div className="ml-3 flex-1 truncate rounded-md border border-border/40 bg-background px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
              spaces.bluelearnerhub.com/preview/{projectName.toLowerCase().replace(/\s+/g, '-')}
            </div>
            <button
              onClick={runPreview}
              className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              <Play className="h-3 w-3" />
            </button>
          </div>

          {/* iframe preview */}
          <iframe
            src={preview}
            className="w-full flex-1 border-0 bg-white"
            title="Space Preview"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      </div>
    </div>
  )
}
