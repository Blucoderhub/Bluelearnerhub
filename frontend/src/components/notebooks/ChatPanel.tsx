'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Loader2, Bot, User, BookOpen, Trash2 } from 'lucide-react'

interface Source {
  id: number
  title: string
  status: string
}

interface CitedSource {
  source_id: number
  title: string
  snippet?: string
  chunk_index?: number
  similarity?: number
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: CitedSource[]
}

interface Props {
  notebookId: number
  messages: ChatMessage[]
  onMessagesChange: React.Dispatch<React.SetStateAction<ChatMessage[]>>
  sources: Source[]
  onOpenCitation: (sourceId: number, snippet?: string, chunkIndex?: number) => void
}

export default function ChatPanel({ notebookId, messages, onMessagesChange, sources, onOpenCitation }: Props) {
  const [input,    setInput]    = useState('')
  const [sending,  setSending]  = useState(false)
  const [clearing, setClearing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const readySources = sources.filter(s => s.status === 'ready')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = input.trim()
    if (!msg || sending) return

    const userMessage: ChatMessage = { role: 'user', content: msg }
    onMessagesChange(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'chat_message_sent',
        eventPayload: { messageLength: msg.length },
      }).catch(() => {})

      const { data } = await api.post(`/notebooks/${notebookId}/chat`, { message: msg })
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      }
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'chat_answer_received',
        eventPayload: { answerLength: String(data.answer || '').length, sourceCount: Array.isArray(data.sources) ? data.sources.length : 0 },
      }).catch(() => {})
      onMessagesChange(prev => [...prev, assistantMessage])
    } catch (err) {
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'chat_error',
        eventPayload: { stage: 'chat_request' },
      }).catch(() => {})
      onMessagesChange(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleClear = async () => {
    if (!confirm('Clear the chat history?')) return
    setClearing(true)
    try {
      await api.delete(`/notebooks/${notebookId}/chat`)
      onMessagesChange([])
    } catch (err) {
      console.error('Failed to clear chat', err)
    } finally {
      setClearing(false)
    }
  }

  return (
    <div className="relative flex flex-col h-full bg-white/35 dark:bg-transparent">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent" />
      {/* Chat header */}
      <div className="relative flex items-center justify-between px-4 py-2 border-b border-white/10 shrink-0 bg-white/65 dark:bg-gray-900/55 backdrop-blur">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {readySources.length === 0
              ? 'Add sources to start chatting'
              : `Grounded in ${readySources.length} source${readySources.length === 1 ? '' : 's'}`}
          </span>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearing}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 rounded"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-3">
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Ask anything about your sources
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
              {readySources.length === 0
                ? 'Add some sources in the Sources panel, then come back to chat.'
                : 'I\'ll answer based only on what\'s in your notebook, with citations.'}
            </p>
            {readySources.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center max-w-sm">
                {[
                  'Summarise the key points',
                  'What are the main concepts?',
                  'Explain in simple terms',
                  'What are the most important formulas?',
                ].map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20
                               text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40
                               border border-blue-200 dark:border-blue-800 transition-colors
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}

              <div className={`max-w-[80%] space-y-2 ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-white/90 dark:bg-gray-800/90 border border-blue-100/70 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-sm shadow-sm backdrop-blur'
                  }`}
                >
                  {msg.content}
                </div>

                {/* Source citations */}
                {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-col gap-1.5 w-full">
                    {msg.sources.map((src, si) => (
                      <button
                        key={si}
                        type="button"
                        onClick={() => onOpenCitation(src.source_id, src.snippet, src.chunk_index)}
                        className="text-xs px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20
                                   text-blue-700 dark:text-blue-300 border border-blue-200
                                   dark:border-blue-800 rounded-lg text-left hover:border-blue-400
                                   dark:hover:border-blue-600 transition-colors
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                      >
                        <div className="font-medium">📎 {src.title}</div>
                        {src.snippet ? <div className="opacity-80 mt-0.5">"{src.snippet}..."</div> : null}
                        {typeof src.similarity === 'number'
                          ? <div className="opacity-60 mt-0.5">relevance: {(src.similarity * 100).toFixed(1)}%</div>
                          : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {sending && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="shrink-0 px-4 py-3 border-t border-white/10 flex gap-2 bg-white/70 dark:bg-gray-900/60 backdrop-blur"
      >
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={readySources.length === 0 ? 'Add sources first…' : 'Ask a question about your sources…'}
          disabled={readySources.length === 0 || sending}
          className="flex-1"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e as any) }
          }}
        />
        <Button
          type="submit"
          disabled={!input.trim() || sending || readySources.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}
