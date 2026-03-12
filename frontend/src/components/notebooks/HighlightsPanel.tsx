'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { Bookmark, Quote, Loader2 } from 'lucide-react'

interface HighlightItem {
  id: number
  sourceId: number
  sourceTitle: string
  quote: string
  note: string | null
  chunkIndex: number | null
  createdAt: string
}

interface Props {
  notebookId: number
  refreshToken: number
  onOpenCitation: (sourceId: number, snippet?: string, chunkIndex?: number) => void
}

export default function HighlightsPanel({ notebookId, refreshToken, onOpenCitation }: Props) {
  const [items, setItems] = useState<HighlightItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    api.get(`/notebooks/${notebookId}/annotations`)
      .then(({ data }) => {
        if (active) setItems(data.annotations || [])
      })
      .catch((err) => console.error('Failed to load notebook annotations', err))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [notebookId, refreshToken])

  return (
    <div className="p-4 flex flex-col gap-3 h-full overflow-y-auto bg-white/40 dark:bg-transparent">
      <div className="flex items-center gap-2">
        <Bookmark className="w-4 h-4 text-primary/80" />
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Highlights
        </h2>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading highlights...
        </div>
      ) : items.length === 0 ? (
        <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-8 px-2">
          Saved highlights will appear here when you bookmark source evidence.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onOpenCitation(item.sourceId, item.quote, item.chunkIndex ?? undefined)}
              className="w-full text-left rounded-xl border border-blue-100/80 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 p-3 shadow-sm backdrop-blur hover:border-blue-300 dark:hover:border-blue-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-gray-400 mb-2">
                <Quote className="w-3.5 h-3.5" />
                {item.sourceTitle}
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-100 line-clamp-4 whitespace-pre-wrap">
                {item.quote}
              </div>
              {item.note ? (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-3 whitespace-pre-wrap">
                  {item.note}
                </div>
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
