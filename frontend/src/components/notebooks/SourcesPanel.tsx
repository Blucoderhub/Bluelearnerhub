'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText, Globe, Plus, Trash2, Loader2,
  CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp,
} from 'lucide-react'

interface Source {
  id: number
  title: string
  sourceType: 'text' | 'url' | 'pdf'
  chunkCount: number
  wordCount: number
  status: 'pending' | 'processing' | 'ready' | 'failed'
  createdAt: string
}

interface Props {
  notebookId: number
  sources: Source[]
  onSourcesChange: React.Dispatch<React.SetStateAction<Source[]>>
}

type AddMode = 'text' | 'url' | null

const STATUS_ICON = {
  ready:      <CheckCircle2 className="w-3.5 h-3.5 text-primary/80" />,
  processing: <Loader2 className="w-3.5 h-3.5 text-yellow-500 animate-spin" />,
  pending:    <Clock className="w-3.5 h-3.5 text-gray-400" />,
  failed:     <AlertCircle className="w-3.5 h-3.5 text-red-400" />,
}

export default function SourcesPanel({ notebookId, sources, onSourcesChange }: Props) {
  const [addMode,   setAddMode]   = useState<AddMode>(null)
  const [adding,    setAdding]    = useState(false)
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [url,       setUrl]       = useState('')
  const [expanded,  setExpanded]  = useState<number | null>(null)
  const [uploadingPdf, setUploadingPdf] = useState(false)

  const resetForm = () => {
    setTitle('')
    setContent('')
    setUrl('')
    setAddMode(null)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      const payload: Record<string, string> = {
        sourceType: addMode!,
        title:      title.trim() || (addMode === 'url' ? url : 'Pasted Text'),
      }
      if (addMode === 'text') payload.content = content
      if (addMode === 'url')  payload.url     = url

      const { data } = await api.post(`/notebooks/${notebookId}/sources`, payload)
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'source_added',
        eventPayload: { sourceType: addMode, contentSize: addMode === 'text' ? content.length : url.length },
      }).catch(() => {})
      onSourcesChange(prev => [...prev, data.source])
      resetForm()
    } catch (err) {
      console.error('Failed to add source', err)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (sid: number) => {
    if (!confirm('Remove this source?')) return
    try {
      await api.delete(`/notebooks/${notebookId}/sources/${sid}`)
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'source_deleted',
        eventPayload: { sourceId: sid },
      }).catch(() => {})
      onSourcesChange(prev => prev.filter(s => s.id !== sid))
    } catch (err) {
      console.error('Failed to delete source', err)
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a PDF file.')
      return
    }

    setUploadingPdf(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post(`/notebooks/${notebookId}/sources/pdf`, formData)
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'pdf_source_uploaded',
        eventPayload: { fileName: file.name, fileSize: file.size },
      }).catch(() => {})
      onSourcesChange(prev => [...prev, data.source])
    } catch (err) {
      console.error('Failed to upload PDF', err)
    } finally {
      setUploadingPdf(false)
      e.target.value = ''
    }
  }

  return (
    <div className="p-4 flex flex-col gap-3 h-full bg-white/40 dark:bg-transparent">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Sources ({sources.length})
        </h2>
      </div>

      {/* Add buttons */}
      {addMode === null && (
        <div className="flex gap-2">
          <button
            onClick={() => setAddMode('text')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium
                       rounded-lg border border-dashed border-gray-300 dark:border-gray-600
                       text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-primary/80
                       dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            <FileText className="w-3.5 h-3.5" /> Paste text
          </button>
          <button
            onClick={() => setAddMode('url')}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium
                       rounded-lg border border-dashed border-gray-300 dark:border-gray-600
                       text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-primary/80
                       dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
          >
            <Globe className="w-3.5 h-3.5" /> Add URL
          </button>
          <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium
                       rounded-lg border border-dashed border-gray-300 dark:border-gray-600
                       text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-primary/80
                       dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer">
            {uploadingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            PDF
            <input type="file" accept="application/pdf,.pdf" className="hidden" onChange={handlePdfUpload} />
          </label>
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {addMode !== null && (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={handleAdd}
            className="flex flex-col gap-2 rounded-xl border border-blue-100/80 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90"
          >
            <Input
              placeholder={addMode === 'url' ? 'Source title (optional)' : 'Source title'}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-sm h-8"
            />
            {addMode === 'text' ? (
              <textarea
                placeholder="Paste your notes, lecture transcripts, or any text content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
                rows={6}
                className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent
                           px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            ) : (
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className="text-sm h-8"
              />
            )}
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Cancel</Button>
              <Button
                type="submit"
                size="sm"
                disabled={adding || (addMode === 'text' && !content.trim()) || (addMode === 'url' && !url.trim())}
                className="bg-primary hover:bg-primary/90 text-white h-7 text-xs px-3"
              >
                {adding ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                Add
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Source list */}
      <div className="flex flex-col gap-2 overflow-y-auto">
        <AnimatePresence>
          {sources.map(src => (
            <motion.div
              key={src.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="group overflow-hidden rounded-xl border border-blue-100/70 bg-white/90 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90"
            >
              <div
                role="button"
                tabIndex={0}
                className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-blue-50/70 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setExpanded(expanded === src.id ? null : src.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setExpanded(expanded === src.id ? null : src.id)
                  }
                }}
              >
                <div className="shrink-0">
                  {src.sourceType === 'url'
                    ? <Globe className="w-3.5 h-3.5 text-blue-400" />
                    : <FileText className="w-3.5 h-3.5 text-gray-400" />
                  }
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 flex-1 truncate">
                  {src.title}
                </span>
                {STATUS_ICON[src.status]}
                <button
                  type="button"
                  aria-label={`Delete source ${src.title}`}
                  onClick={e => { e.stopPropagation(); handleDelete(src.id) }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-all focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                {expanded === src.id
                  ? <ChevronUp className="w-3 h-3 text-gray-400 shrink-0" />
                  : <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
                }
              </div>

              <AnimatePresence>
                {expanded === src.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-2.5 flex gap-4 text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-2">
                      <span>{src.wordCount.toLocaleString()} words</span>
                      <span>{src.chunkCount} chunks</span>
                      <span className="capitalize">{src.status}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {sources.length === 0 && addMode === null && (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-8 px-2">
            Add sources above — paste notes, lecture content, or web URLs.
          </p>
        )}
      </div>
    </div>
  )
}
