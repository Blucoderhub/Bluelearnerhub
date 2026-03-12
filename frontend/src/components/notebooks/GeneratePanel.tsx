'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Sparkles, Loader2, ChevronDown, ChevronUp,
  BookOpen, HelpCircle, Layers, ListChecks, Brain, Volume2, Square, GitCompare,
} from 'lucide-react'

interface Generation {
  id: number
  type: string
  title: string
  content: string
  createdAt: string
}

interface Props {
  notebookId: number
  generations: Generation[]
  onGenerationsChange: React.Dispatch<React.SetStateAction<Generation[]>>
}

const GEN_TYPES = [
  {
    id: 'notebook_guide',
    label: 'Notebook Guide',
    icon: Sparkles,
    desc: 'NotebookLM-style structured research brief',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-primary dark:text-blue-400',
  },
  {
    id: 'summary',
    label: 'Summary',
    icon: BookOpen,
    desc: 'Concise overview of all your sources',
    color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-400',
  },
  {
    id: 'study_guide',
    label: 'Study Guide',
    icon: Layers,
    desc: 'Key concepts, principles & review questions',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-primary dark:text-blue-400',
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    desc: '10+ Q&A pairs from your materials',
    color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-primary dark:text-blue-400',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: Brain,
    desc: '15 term ↔ definition pairs',
    color: 'bg-secondary dark:bg-muted/20 border-border dark:border-border text-foreground/80 dark:text-foreground/70',
  },
  {
    id: 'quiz',
    label: 'Practice Quiz',
    icon: ListChecks,
    desc: '10 multiple-choice questions with answers',
    color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
  },
  {
    id: 'audio_overview',
    label: 'Audio Overview',
    icon: Volume2,
    desc: 'Two-host podcast script from your sources',
    color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'compare_sources',
    label: 'Compare Sources',
    icon: GitCompare,
    desc: 'Agreements, differences, contradictions, and synthesis',
    color: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400',
  },
]

function FlashcardViewer({ content }: { content: string }) {
  const [flip, setFlip] = useState<number | null>(null)

  let cards: { front: string; back: string }[] = []
  try {
    const match = content.match(/\[[\s\S]*\]/)
    if (match) cards = JSON.parse(match[0])
  } catch {
    return <pre className="text-sm whitespace-pre-wrap">{content}</pre>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <button
          key={i}
          onClick={() => setFlip(flip === i ? null : i)}
          className="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors min-h-[80px]"
        >
          {flip === i ? (
            <span className="text-sm text-blue-700 dark:text-blue-400">{card.back}</span>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-white">{card.front}</span>
          )}
          <div className="text-[10px] text-gray-400 mt-1">{flip === i ? 'Click to hide answer' : 'Click to reveal'}</div>
        </button>
      ))}
    </div>
  )
}

function QuizViewer({ content }: { content: string }) {
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})

  let questions: { question: string; options: Record<string, string>; answer: string }[] = []
  try {
    const match = content.match(/\[[\s\S]*\]/)
    if (match) questions = JSON.parse(match[0])
  } catch {
    return <pre className="text-sm whitespace-pre-wrap">{content}</pre>
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {i + 1}. {q.question}
          </p>
          {!q?.options || typeof q.options !== 'object' ? (
            <div className="rounded-lg border border-border bg-secondary px-3 py-2 text-xs text-foreground dark:border-border dark:bg-muted/20 dark:text-foreground/60">
              Options unavailable for this question.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(q.options as Record<string, string>).map(([key, val]) => {
                const isSelected = selected[i] === key
                const isCorrect  = key === q.answer
                const isRevealed = revealed[i]
                let cls = 'px-3 py-2 rounded-lg text-sm border text-left transition-colors '
                if (isRevealed) {
                  cls += isCorrect
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 '
                    : isSelected
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 '
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 '
                } else {
                  cls += isSelected
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 '
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 '
                }
                return (
                  <button
                    key={key}
                    className={cls}
                    onClick={() => !isRevealed && setSelected(s => ({ ...s, [i]: key }))}
                  >
                    <span className="font-medium mr-2">{key}.</span>{val}
                  </button>
                )
              })}
            </div>
          )}
          {selected[i] && !revealed[i] && (
            <button
              onClick={() => setRevealed(r => ({ ...r, [i]: true }))}
              className="text-xs text-primary/80 hover:underline"
            >
              Check answer
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function CompareSourcesViewer({ content }: { content: string }) {
  const sections = content
    .split(/^##\s+/m)
    .map((part) => part.trim())
    .filter(Boolean)

  // If the model returned plain text without headings, fall back gracefully.
  if (sections.length === 0 || !content.includes('## ')) {
    return <pre className="text-sm whitespace-pre-wrap">{content}</pre>
  }

  return (
    <div className="space-y-4">
      {sections.map((section, idx) => {
        const [titleLine, ...rest] = section.split('\n')
        const body = rest.join('\n').trim()

        return (
          <div
            key={idx}
            className="rounded-xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50/60 dark:bg-cyan-900/15 p-4"
          >
            <h4 className="text-sm font-semibold text-cyan-900 dark:text-cyan-200 mb-2">
              {titleLine.replace(/^#+\s*/, '')}
            </h4>
            <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
              {body}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function GeneratePanel({ notebookId, generations, onGenerationsChange }: Props) {
  const [generating, setGenerating]   = useState<string | null>(null)
  const [expanded,   setExpanded]     = useState<number | null>(null)
  const [speakingId, setSpeakingId]   = useState<number | null>(null)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const stopSpeech = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel()
    }
    setSpeakingId(null)
  }

  const playOverview = (id: number, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    stopSpeech()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)
    window.speechSynthesis.speak(utterance)
    setSpeakingId(id)
  }

  const handleGenerate = async (type: string) => {
    setGenerating(type)
    setGenerationError(null)
    try {
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'generation_requested',
        eventPayload: { type },
      }).catch(() => {})

      const { data } = await api.post(`/notebooks/${notebookId}/generate`, { type })
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'generation_created',
        eventPayload: { type, generationId: data?.generation?.id ?? null },
      }).catch(() => {})
      onGenerationsChange(prev => [data.generation, ...prev])
      setExpanded(data.generation.id)
    } catch (err) {
      console.error('Generation failed', err)
      setGenerationError('Failed to generate content. Please try again.')
      api.post(`/notebooks/${notebookId}/behavior-events`, {
        eventType: 'generation_error',
        eventPayload: { type },
      }).catch(() => {})
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white/35 dark:bg-transparent">
      {/* Generation type buttons */}
      <div className="p-4 border-b border-white/10 shrink-0 bg-white/65 dark:bg-gray-900/55 backdrop-blur">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Generate study materials from all your notebook sources:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {GEN_TYPES.map(gt => {
            const Icon = gt.icon
            return (
              <button
                type="button"
                key={gt.id}
                onClick={() => handleGenerate(gt.id)}
                disabled={!!generating}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left
                            transition-all hover:shadow-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 ${gt.color}`}
              >
                <div className="flex items-center gap-1.5 w-full">
                  {generating === gt.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Icon className="w-3.5 h-3.5 shrink-0" />
                  }
                  <span className="text-xs font-semibold truncate">{gt.label}</span>
                </div>
                <span className="text-[10px] opacity-70 leading-tight">{gt.desc}</span>
              </button>
            )
          })}
        </div>
        {generationError && (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400">{generationError}</p>
        )}
      </div>

      {/* Generated items list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {generations.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Generated study materials will appear here.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {generations.map(gen => (
              <motion.div
                key={gen.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl overflow-hidden border border-blue-100/70 bg-white/90 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-800/90"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === gen.id ? null : gen.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50/60 dark:hover:bg-gray-700/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
                >
                  <div className="flex items-center gap-2 text-left">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{gen.title}</span>
                  </div>
                  {expanded === gen.id
                    ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  }
                </button>

                <AnimatePresence>
                  {expanded === gen.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                        {gen.type === 'flashcards' ? (
                          <FlashcardViewer content={gen.content} />
                        ) : gen.type === 'quiz' ? (
                          <QuizViewer content={gen.content} />
                        ) : gen.type === 'compare_sources' ? (
                          <CompareSourcesViewer content={gen.content} />
                        ) : gen.type === 'audio_overview' ? (
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => playOverview(gen.id, gen.content)}
                                disabled={speakingId === gen.id}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                              >
                                <Volume2 className="w-4 h-4 mr-1" />
                                Play
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={stopSpeech}
                                disabled={speakingId !== gen.id}
                              >
                                <Square className="w-4 h-4 mr-1" />
                                Stop
                              </Button>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {gen.content}
                            </div>
                          </div>
                        ) : (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {gen.content}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
