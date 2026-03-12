'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Plus, Code2, HelpCircle, Video, Image,
  Save, Eye, Upload, Sparkles, ChevronRight, Grip,
  Play, Trash2, CheckCircle2, Settings, BarChart3, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type BlockType = 'text' | 'code' | 'quiz' | 'exercise' | 'video';

interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  language?: string;
  metadata?: Record<string, any>;
}

const BLOCK_ICONS: Record<BlockType, React.ElementType> = {
  text:     BookOpen,
  code:     Code2,
  quiz:     HelpCircle,
  exercise: Play,
  video:    Video,
};

const BLOCK_LABELS: Record<BlockType, string> = {
  text: 'Text / Markdown', code: 'Code Block', quiz: 'Quiz Question',
  exercise: 'Practice Exercise', video: 'Video Embed',
};

function genId() { return Math.random().toString(36).slice(2, 9); }

const AI_SUGGESTIONS = [
  'Generate 5 MCQ questions about this topic',
  'Create an exercise with test cases',
  'Write a beginner-friendly introduction',
  'Add a real-world example',
];

export default function TeacherStudioPage() {
  const [activeTab, setActiveTab]       = useState('editor');
  const [title, setTitle]               = useState('');
  const [domain, setDomain]             = useState('');
  const [difficulty, setDifficulty]     = useState('beginner');
  const [description, setDescription]   = useState('');
  const [blocks, setBlocks]             = useState<ContentBlock[]>([
    { id: genId(), type: 'text', content: '' },
  ]);
  const [selectedBlock, setSelected]    = useState<string | null>(null);
  const [generating, setGenerating]     = useState(false);
  const [aiPrompt, setAiPrompt]         = useState('');
  const [published, setPublished]       = useState(false);

  const addBlock = (type: BlockType) => {
    setBlocks([...blocks, { id: genId(), type, content: '', language: type === 'code' ? 'python' : undefined }]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map((b) => b.id === id ? { ...b, content } : b));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    // Simulate AI-generated content
    addBlock('text');
    const newId = blocks[blocks.length - 1]?.id;
    setAiPrompt('');
    setGenerating(false);
  };

  const handlePublish = async () => {
    await new Promise((r) => setTimeout(r, 800));
    setPublished(true);
  };

  const STATS = [
    { label: 'Enrolled Students', value: '0', icon: Users, color: 'text-blue-400' },
    { label: 'Completions',       value: '0', icon: CheckCircle2, color: 'text-foreground/70' },
    { label: 'Avg Rating',        value: '—', icon: BarChart3, color: 'text-foreground/70' },
  ];

  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Creator Studio</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-700" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Tutorial title..."
            className="h-8 w-80 border-0 bg-transparent text-sm font-semibold text-white focus-visible:ring-0 placeholder:text-gray-600"
          />
          {title && <Badge className="bg-gray-800 text-gray-400 text-[10px]">Draft</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 border-gray-700 text-gray-400 text-xs">
            <Eye className="h-3.5 w-3.5" /> Preview
          </Button>
          <Button
            size="sm"
            onClick={handlePublish}
            className={`gap-1.5 text-xs ${published ? 'bg-primary/80 hover:bg-primary/90' : 'bg-primary hover:bg-primary/90'}`}
          >
            {published ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Upload className="h-3.5 w-3.5" />}
            {published ? 'Published' : 'Publish'}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Block palette */}
        <aside className="hidden w-56 flex-col border-r border-gray-800 bg-gray-900 p-4 md:flex">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Add Block</p>
          {(Object.keys(BLOCK_ICONS) as BlockType[]).map((type) => {
            const Icon = BLOCK_ICONS[type];
            return (
              <button
                key={type}
                onClick={() => addBlock(type)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mb-1"
              >
                <Icon className="h-4 w-4" /> {BLOCK_LABELS[type]}
              </button>
            );
          })}

          <div className="mt-6 border-t border-gray-800 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Tutorial Settings</p>
            <div className="space-y-3">
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-sm text-gray-300 h-8">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['programming', 'mechanical', 'electrical', 'finance', 'management'].map((d) => (
                    <SelectItem key={d} value={d} className="text-gray-300 capitalize">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-sm text-gray-300 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {['beginner', 'intermediate', 'advanced'].map((d) => (
                    <SelectItem key={d} value={d} className="text-gray-300 capitalize">{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* CENTER: Editor */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="justify-start rounded-none border-b border-gray-800 bg-gray-900 px-5 gap-0 h-10">
              {[
                { value: 'editor',    label: 'Editor',    icon: BookOpen },
                { value: 'ai',        label: 'AI Assist', icon: Sparkles },
                { value: 'analytics', label: 'Analytics', icon: BarChart3 },
              ].map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2 text-xs data-[state=active]:border-blue-400 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
                >
                  <Icon className="h-3.5 w-3.5" />{label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* EDITOR tab */}
            <TabsContent value="editor" className="flex-1 overflow-y-auto p-6 mt-0">
              {/* Description */}
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what students will learn..."
                className="mb-5 bg-gray-900 border-gray-800 text-gray-300 placeholder:text-gray-600 text-sm resize-none"
                rows={2}
              />

              {/* Content blocks */}
              <div className="space-y-3">
                {blocks.map((block, i) => {
                  const Icon = BLOCK_ICONS[block.type];
                  return (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`group rounded-xl border transition-colors ${selectedBlock === block.id ? 'border-blue-600 bg-blue-950/10' : 'border-gray-800 bg-gray-900'}`}
                    >
                      {/* Block header */}
                      <div
                        className="flex cursor-pointer items-center gap-2 px-4 py-2.5"
                        onClick={() => setSelected(block.id === selectedBlock ? null : block.id)}
                      >
                        <Grip className="h-4 w-4 text-gray-700 cursor-grab" />
                        <Icon className="h-4 w-4 text-blue-400" />
                        <span className="text-xs font-medium text-gray-400">{BLOCK_LABELS[block.type]}</span>
                        <span className="ml-auto text-[10px] text-gray-700">Block {i + 1}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Block content */}
                      {selectedBlock === block.id && (
                        <div className="border-t border-gray-800 p-4">
                          {(block.type === 'text' || block.type === 'exercise') && (
                            <Textarea
                              value={block.content}
                              onChange={(e) => updateBlock(block.id, e.target.value)}
                              placeholder={block.type === 'text' ? 'Write your lesson content in Markdown...' : 'Describe the practice exercise...'}
                              className="min-h-[160px] bg-gray-800 border-gray-700 text-sm text-gray-200 placeholder:text-gray-600"
                            />
                          )}
                          {block.type === 'code' && (
                            <div>
                              <Select value={block.language} onValueChange={(lang) => setBlocks(blocks.map((b) => b.id === block.id ? { ...b, language: lang } : b))}>
                                <SelectTrigger className="mb-2 h-7 w-32 bg-gray-800 border-gray-700 text-xs text-gray-300">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  {['python', 'javascript', 'typescript', 'java', 'cpp', 'sql'].map((l) => (
                                    <SelectItem key={l} value={l} className="text-gray-300">{l}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Textarea
                                value={block.content}
                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                placeholder={`# Write ${block.language ?? 'code'} here...`}
                                className="min-h-[140px] bg-gray-800 border-gray-700 font-mono text-sm text-blue-300 placeholder:text-gray-600"
                              />
                            </div>
                          )}
                          {block.type === 'quiz' && (
                            <div className="space-y-3">
                              <Input placeholder="Question text..." className="bg-gray-800 border-gray-700 text-sm text-gray-200 placeholder:text-gray-600" />
                              {['A', 'B', 'C', 'D'].map((opt) => (
                                <Input key={opt} placeholder={`Option ${opt}...`} className="bg-gray-800 border-gray-700 text-sm text-gray-200 placeholder:text-gray-600" />
                              ))}
                              <Input placeholder="Correct answer (A/B/C/D)..." className="bg-gray-800 border-gray-700 text-sm text-gray-200 placeholder:text-gray-600 w-32" />
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* Add block buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(Object.keys(BLOCK_ICONS) as BlockType[]).map((type) => {
                    const Icon = BLOCK_ICONS[type];
                    return (
                      <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className="flex items-center gap-1.5 rounded-lg border border-dashed border-gray-700 px-3 py-2 text-xs text-gray-500 hover:border-blue-600 hover:text-blue-400 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" /> {BLOCK_LABELS[type]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* AI ASSIST tab */}
            <TabsContent value="ai" className="flex-1 overflow-y-auto p-6 mt-0">
              <div className="max-w-xl">
                <h2 className="text-base font-semibold text-white mb-1">AI Content Assistant</h2>
                <p className="text-sm text-gray-400 mb-5">Describe what you want to create — the AI will generate content blocks for your tutorial.</p>

                <div className="flex gap-2 mb-4">
                  <Input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAIGenerate()}
                    placeholder="e.g. Create 3 exercises about binary trees..."
                    className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-600"
                  />
                  <Button onClick={handleAIGenerate} disabled={generating} className="bg-primary hover:bg-primary/90 gap-1.5 shrink-0">
                    <Sparkles className="h-4 w-4" />
                    {generating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>

                <p className="text-xs text-gray-600 mb-3">Quick suggestions:</p>
                <div className="flex flex-col gap-2">
                  {AI_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setAiPrompt(s)}
                      className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-800 hover:text-white text-left transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* ANALYTICS tab */}
            <TabsContent value="analytics" className="flex-1 overflow-y-auto p-6 mt-0">
              <h2 className="text-base font-semibold text-white mb-5">Tutorial Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {STATS.map(({ label, value, icon: Icon, color }) => (
                  <Card key={label} className="bg-gray-900 border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${color}`} />
                        <span className="text-xs text-gray-500">{label}</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="flex flex-col items-center py-16 text-gray-500">
                  <BarChart3 className="h-12 w-12 mb-3 opacity-20" />
                  <p className="text-sm">Analytics will appear after publishing</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
