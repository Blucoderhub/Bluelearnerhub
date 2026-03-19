'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Send,
  Bot,
  Sparkles,
  Zap,
  BookOpen,
  MessageSquare,
  PlusCircle,
  Hash,
  ChevronRight,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI Career Coach. I can help you with course recommendations, project ideas, or explaining complex technical concepts. What's on your mind today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "That's a great question! Based on your progress in 'Advanced Machine Learning', I recommend following up with the 'Transformer Architecture' deep dive. Would you like me to generate a roadmap for that?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex h-[calc(100vh-8rem)] gap-6 duration-700">
      {/* Sidebar - History & Tools */}
      <aside className="hidden w-80 flex-col gap-6 lg:flex">
        <div className="flex flex-col gap-2">
          <Button className="h-14 gap-2 rounded-2xl bg-primary font-bold text-white shadow-lg shadow-primary/20">
            <PlusCircle className="h-5 w-5" /> New Conversation
          </Button>
        </div>

        <div className="glass-morphism flex flex-1 flex-col space-y-6 overflow-hidden rounded-[32px] border-border/50 p-6">
          <h4 className="px-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Recent Intervals
          </h4>
          <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-2">
            {[
              'Career Roadmap Hub',
              'React Performance Tips',
              'System Design Audit',
              'Python Optimization',
            ].map((chat, i) => (
              <button
                key={i}
                className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all hover:bg-primary/10"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span className="truncate text-sm font-semibold group-hover:text-foreground">
                  {chat}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-primary/20 bg-primary/5 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <h4 className="font-heading text-sm font-bold">AI Analysis</h4>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Generated insights based on your last 3 hackathon submissions.
          </p>
          <Button variant="link" className="mt-3 h-auto p-0 text-xs font-bold text-primary">
            View Career Report →
          </Button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="glass-morphism relative flex flex-1 flex-col overflow-hidden rounded-[40px] border-border/50 shadow-2xl">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

        {/* Chat Header */}
        <header className="flex items-center justify-between border-b border-border/50 bg-muted/10 px-8 py-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-heading text-lg font-bold">
                AI Companion <Sparkles className="h-4 w-4 text-primary" />
              </h3>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-muted-foreground">
                  Processing at the edge
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Hash className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Sparkles className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </header>

        {/* Messages Wrapper */}
        <div ref={scrollRef} className="custom-scrollbar flex-1 space-y-8 overflow-y-auto p-8">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <Avatar
                className={`h-10 w-10 rounded-xl border border-border/50 ${msg.role === 'assistant' ? 'bg-primary' : 'bg-muted'}`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="m-auto h-6 w-6 text-white" />
                ) : (
                  <AvatarFallback className="font-bold">U</AvatarFallback>
                )}
              </Avatar>
              <div
                className={`flex max-w-[80%] flex-col ${msg.role === 'user' ? 'items-end' : ''}`}
              >
                <div
                  className={`rounded-3xl p-5 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-tr-none bg-primary text-white'
                      : 'rounded-tl-none border border-border/50 bg-muted/50 text-foreground'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-1.5 rounded-3xl rounded-tl-none border border-border/50 bg-muted/50 p-5">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-8 pt-4">
          <div className="group relative">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-focus-within:opacity-100" />
            <div className="relative flex items-center gap-3 rounded-[24px] border border-border/50 bg-muted/30 p-2 pl-4 pr-4 shadow-inner transition-all focus-within:border-primary/50 focus-within:bg-muted/50">
              <Input
                placeholder="Ask me anything about your career or curriculum..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="h-12 flex-1 border-none bg-transparent text-[15px] font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="h-10 w-10 rounded-xl bg-primary text-white shadow-md shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
            Powered by Bluecoderhub Gemini Engine v4.0
          </p>
        </footer>
      </div>
    </div>
  )
}
