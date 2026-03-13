'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Maximize2, Minimize2, Sparkles, MessageSquare, Briefcase, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [persona, setPersona] = useState<'tutor' | 'technical' | 'manager' | 'career' | 'competition'>('tutor');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your BLUELEARNERHUB AI Assistant. How can I help you today with your learning or career path?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const assistantMessage = { role: 'assistant', content: '' };
        setMessages((prev) => [...prev, assistantMessage]);
        let currentContent = '';

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    context: { path: window.location.pathname },
                    persona
                }),
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '');
                        if (dataStr === '[DONE]') break;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.text) {
                                currentContent += data.text;
                                setMessages((prev) => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = currentContent;
                                    return newMessages;
                                });
                            }
                        } catch (e) {
                            // Bit of a hack for partial JSON, but works for most stream chunks
                        }
                    }
                }
            }
        } catch (error) {
            setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = 'Sorry, I encountered an error. Please try again.';
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const personaIcons: Record<string, any> = {
        tutor: <Sparkles className="w-3.5 h-3.5" />,
        technical: <Bot className="w-3.5 h-3.5" />,
        manager: <Briefcase className="w-3.5 h-3.5" />,
        career: <Trophy className="w-3.5 h-3.5" />,
        competition: <Zap className="w-3.5 h-3.5" />
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && !isMinimized && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] md:w-[450px] h-[600px]"
                    >
                        <Card className="h-full flex flex-col bg-card border-border shadow-2xl overflow-hidden glass-morphism">
                            <CardHeader className="p-4 border-b border-border flex flex-col gap-3 bg-background/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            {personaIcons[persona]}
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-black italic text-white tracking-widest uppercase">
                                                BlueAI_{persona}
                                            </CardTitle>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase">Real-time Mentorship</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsMinimized(true)}>
                                            <Minimize2 className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsOpen(false)}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Persona Selector */}
                                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                                    {['tutor', 'technical', 'manager', 'career', 'competition'].map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => setPersona(p as any)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase italic tracking-widest whitespace-nowrap transition-all ${persona === p
                                                ? 'bg-primary text-primary-foreground ai-glow'
                                                : 'bg-card text-muted-foreground hover:text-foreground/80'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-hidden p-0 bg-card/50">
                                <div className="h-full p-4 overflow-y-auto scroll-smooth" ref={scrollRef}>
                                    <div className="space-y-4">
                                        {messages.map((m, i) => (
                                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${m.role === 'user'
                                                    ? 'bg-primary text-white shadow-lg font-medium'
                                                    : 'bg-background/80 text-foreground border border-slate-800'
                                                    }`}>
                                                    {m.content}
                                                    {isLoading && i === messages.length - 1 && m.role === 'assistant' && m.content === '' && (
                                                        <div className="flex gap-1 py-1">
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-3 border-t border-border bg-background/30">
                                <form className="flex w-full items-center gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                                    <Input
                                        placeholder={`Message the ${persona} assistant...`}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1 bg-secondary border-border text-white placeholder:text-muted-foreground h-10 italic"
                                    />
                                    <Button type="submit" size="icon" className="h-10 w-10 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" disabled={isLoading}>
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </CardFooter>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? 'bg-primary shadow-blue-500/20' : 'bg-card border border-border shadow-black'
                    }`}
            >
                {isOpen ? <MessageSquare className="w-6 h-6 text-white" /> : <Bot className="w-7 h-7 text-blue-400" />}
            </motion.button>
        </div>
    );
}
