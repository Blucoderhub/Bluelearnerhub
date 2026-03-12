'use client'

import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollText, ExternalLink, Layers3, Search, BookmarkPlus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface SourceChunk {
  chunkIndex: number
  content: string
}

interface SourceDetail {
  id: number
  title: string
  sourceType: 'text' | 'url' | 'pdf'
  url?: string | null
  status: string
  wordCount: number
  chunkCount: number
  previewText: string
  focusChunkIndex?: number | null
  activeSearch?: string | null
  chunks: SourceChunk[]
}

interface Props {
  notebookId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  source: SourceDetail | null
  loading: boolean
  focusSnippet?: string
  focusChunkIndex?: number
  onSearch?: (query: string) => void
  onAnnotationsChanged?: () => void
}

interface Annotation {
  id: number
  quote: string
  note: string | null
  chunkIndex: number | null
  createdAt: string
}

export default function CitationInspector({ notebookId, open, onOpenChange, source, loading, focusSnippet, focusChunkIndex, onSearch, onAnnotationsChanged }: Props) {
  const chunkRefs = useRef<Record<number, HTMLDivElement | null>>({})
  const [query, setQuery] = useState('')
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [annotationLoading, setAnnotationLoading] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState('')
  const [selectedChunkIndex, setSelectedChunkIndex] = useState<number | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || loading || focusChunkIndex === undefined || focusChunkIndex === null) return
    const timer = window.setTimeout(() => {
      chunkRefs.current[focusChunkIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [open, loading, focusChunkIndex, source?.id])

  useEffect(() => {
    setQuery(source?.activeSearch || '')
  }, [source?.id, source?.activeSearch])

  useEffect(() => {
    if (!source || !open) return
    setSelectedQuote(focusSnippet || '')
    setSelectedChunkIndex(focusChunkIndex ?? null)
    setNoteDraft('')
  }, [source?.id, open, focusSnippet, focusChunkIndex])

  useEffect(() => {
    if (!open || !source) return
    setAnnotationLoading(true)
    api.get(`/notebooks/${notebookId}/sources/${source.id}/annotations`)
      .then(({ data }) => setAnnotations(data.annotations || []))
      .catch((err) => console.error('Failed to load annotations', err))
      .finally(() => setAnnotationLoading(false))
  }, [open, source?.id, notebookId])

  const saveAnnotation = async () => {
    if (!source || !selectedQuote.trim()) return
    setSaving(true)
    try {
      const { data } = await api.post(`/notebooks/${notebookId}/sources/${source.id}/annotations`, {
        quote: selectedQuote.trim(),
        note: noteDraft.trim(),
        chunkIndex: selectedChunkIndex,
      })
      setAnnotations(prev => [data.annotation, ...prev])
      setNoteDraft('')
      onAnnotationsChanged?.()
    } catch (err) {
      console.error('Failed to save annotation', err)
    } finally {
      setSaving(false)
    }
  }

  const deleteAnnotation = async (annotationId: number) => {
    if (!source) return
    try {
      await api.delete(`/notebooks/${notebookId}/sources/${source.id}/annotations/${annotationId}`)
      setAnnotations(prev => prev.filter(item => item.id !== annotationId))
      onAnnotationsChanged?.()
    } catch (err) {
      console.error('Failed to delete annotation', err)
    }
  }

  const safeSourceUrl = (() => {
    if (!source?.url) return null
    try {
      const parsed = new URL(source.url)
      return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed.toString() : null
    } catch {
      return null
    }
  })()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden border border-white/10 bg-slate-950/70 backdrop-blur-2xl">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-6 py-4 border-b border-white/10 bg-white/70 dark:bg-gray-900/60 backdrop-blur">
            <DialogTitle className="flex items-center gap-2 text-left">
              <ScrollText className="w-5 h-5 text-blue-500" />
              {source?.title || 'Citation Inspector'}
            </DialogTitle>
            <DialogDescription className="text-left">
              Inspect the exact source material used to ground this answer.
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex-1 overflow-y-auto px-6 py-4 space-y-5 bg-white/45 dark:bg-transparent">
            {loading ? (
              <div className="text-sm text-gray-500">Loading source…</div>
            ) : !source ? (
              <div className="text-sm text-gray-500">No source selected.</div>
            ) : (
              <>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 capitalize">
                    {source.sourceType}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {source.wordCount.toLocaleString()} words
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    {source.chunkCount} chunks
                  </span>
                  {safeSourceUrl ? (
                    <a
                      href={safeSourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                    >
                      Open original
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : source.url ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                      Invalid source URL
                    </span>
                  ) : null}
                </div>

                <div className="flex gap-2 items-center">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search within this source..."
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        onSearch?.(query.trim())
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => onSearch?.(query.trim())}>
                    <Search className="w-4 h-4 mr-1" />
                    Search
                  </Button>
                </div>

                {focusSnippet ? (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3">
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">Referenced snippet</div>
                    <div className="text-sm text-amber-900 dark:text-amber-100 whitespace-pre-wrap">{focusSnippet}</div>
                  </div>
                ) : null}

                <div className="rounded-xl border border-blue-200/80 dark:border-blue-800 bg-blue-50/85 dark:bg-blue-900/20 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                    <BookmarkPlus className="w-4 h-4" />
                    Save highlight
                  </div>
                  <Textarea
                    value={selectedQuote}
                    onChange={(e) => setSelectedQuote(e.target.value)}
                    placeholder="Select a cited snippet or choose a chunk below to save it here..."
                    rows={4}
                  />
                  <Textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Add your own note about why this matters..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="button" onClick={saveAnnotation} disabled={saving || !selectedQuote.trim()}>
                      <BookmarkPlus className="w-4 h-4 mr-1" />
                      Save highlight
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-100">Saved highlights</div>
                  {annotationLoading ? (
                    <div className="text-sm text-gray-500">Loading highlights…</div>
                  ) : annotations.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-500">
                      No saved highlights yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {annotations.map((item) => (
                        <div key={item.id} className="rounded-xl border border-blue-100/80 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 p-3 shadow-sm backdrop-blur">
                          <div className="text-sm whitespace-pre-wrap text-gray-800 dark:text-gray-100">{item.quote}</div>
                          {item.note ? <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">{item.note}</div> : null}
                          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                            <span>{item.chunkIndex !== null ? `Chunk ${item.chunkIndex}` : 'Custom excerpt'}</span>
                            <button type="button" onClick={() => deleteAnnotation(item.id)} className="inline-flex items-center gap-1 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                    <Layers3 className="w-4 h-4 text-blue-500" />
                    Extracted chunks
                  </div>
                  {source.chunks.length > 0 ? (
                    <div className="space-y-2">
                      {source.chunks.map(chunk => {
                        const matchesFocus = (focusChunkIndex !== undefined && chunk.chunkIndex === focusChunkIndex)
                          || (focusSnippet && chunk.content.includes(focusSnippet.slice(0, 40)))
                        return (
                          <div
                            key={chunk.chunkIndex}
                            ref={(element) => {
                              chunkRefs.current[chunk.chunkIndex] = element
                            }}
                            className={`rounded-xl border p-3 ${
                              matchesFocus
                                ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20'
                                : 'border-blue-100/70 dark:border-gray-700 bg-white/90 dark:bg-gray-900/80 backdrop-blur'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 mb-2">
                              <div className="text-[11px] uppercase tracking-wide text-gray-400">
                                Chunk {chunk.chunkIndex}
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedQuote(chunk.content)
                                  setSelectedChunkIndex(chunk.chunkIndex)
                                }}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded"
                              >
                                Use as highlight
                              </button>
                            </div>
                            <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-200">
                              {chunk.content}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm text-gray-500">
                      {source.previewText}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
