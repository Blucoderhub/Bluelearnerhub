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
    ChevronRight
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
            content: "Hello! I'm your AI Career Coach. I can help you with course recommendations, project ideas, or explaining complex technical concepts. What's on your mind today?",
            timestamp: new Date()
        }
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
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "That's a great question! Based on your progress in 'Advanced Machine Learning', I recommend following up with the 'Transformer Architecture' deep dive. Would you like me to generate a roadmap for that?",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, aiMsg])
            setIsTyping(false)
        }, 1500)
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Sidebar - History & Tools */}
            <aside className="hidden lg:flex w-80 flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <Button className="h-14 rounded-2xl bg-primary text-white font-bold gap-2 shadow-lg shadow-primary/20">
                        <PlusCircle className="h-5 w-5" /> New Conversation
                    </Button>
                </div>

                <div className="flex-1 rounded-[32px] glass-morphism border-border/50 p-6 space-y-6 overflow-hidden flex flex-col">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Recent Intervals</h4>
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {['Career Roadmap Hub', 'React Performance Tips', 'System Design Audit', 'Python Optimization'].map((chat, i) => (
                            <button key={i} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-primary/10 transition-all text-left group">
                                <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                <span className="text-sm font-semibold truncate group-hover:text-foreground">{chat}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-[32px] bg-primary/5 border border-primary/20 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="text-sm font-bold font-heading">AI Analysis</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">Generated insights based on your last 3 hackathon submissions.</p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-3 text-primary font-bold">View Career Report →</Button>
                </div>
            </aside>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col rounded-[40px] glass-morphism border-border/50 overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                {/* Chat Header */}
                <header className="px-8 py-6 border-b border-border/50 flex items-center justify-between bg-muted/10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <Bot className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                                AI Companion <Sparkles className="h-4 w-4 text-primary" />
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xs text-muted-foreground font-medium">Processing at the edge</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl"><Hash className="h-5 w-5" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-xl"><Sparkles className="h-5 w-5 text-primary" /></Button>
                    </div>
                </header>

                {/* Messages Wrapper */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar"
                >
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <Avatar className={`h-10 w-10 rounded-xl border border-border/50 ${msg.role === 'assistant' ? 'bg-primary' : 'bg-muted'}`}>
                                {msg.role === 'assistant' ? (
                                    <Bot className="h-6 w-6 text-white m-auto" />
                                ) : (
                                    <AvatarFallback className="font-bold">U</AvatarFallback>
                                )}
                            </Avatar>
                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                                <div className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-primary text-white rounded-tr-none'
                                        : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 px-2 tracking-widest">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                                <Bot className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex gap-1.5 p-5 bg-muted/50 rounded-3xl rounded-tl-none border border-border/50 items-center">
                                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <footer className="p-8 pt-4">
                    <div className="relative group">
                        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        <div className="relative flex items-center gap-3 bg-muted/30 border border-border/50 rounded-[24px] p-2 pr-4 pl-4 focus-within:bg-muted/50 focus-within:border-primary/50 transition-all shadow-inner">
                            <Input
                                placeholder="Ask me anything about your career or curriculum..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-[15px] font-medium placeholder:text-muted-foreground/50 h-12"
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    size="icon"
                                    onClick={handleSend}
                                    className="h-10 w-10 rounded-xl bg-primary text-white hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20"
                                >
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest opacity-50">
                        Powered by Bluecoderhub Gemini Engine v4.0
                    </p>
                </footer>
            </div>
        </div>
    )
}
