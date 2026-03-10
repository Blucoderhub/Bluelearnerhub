'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, GitFork, Eye, GitBranch, Code2, FileText,
  Bug, GitMerge, Settings, BookOpen, ChevronRight, ChevronDown,
  File, Folder, Clock, MessageSquare, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { formatDistanceToNow } from 'date-fns';

const MOCK_REPO = {
  name: 'neural-network-from-scratch',
  description: 'Building a deep neural network using only NumPy. Educational implementation with detailed comments.',
  language: 'Python', visibility: 'public', starCount: 128, forkCount: 34,
  topics: ['machine-learning', 'deep-learning', 'numpy'],
  defaultBranch: 'main', totalCommits: 47,
};

const MOCK_FILES = [
  { type: 'dir',  name: 'src',         message: 'Initial structure',    time: '3 days ago' },
  { type: 'dir',  name: 'tests',       message: 'Add unit tests',       time: '2 days ago' },
  { type: 'dir',  name: 'notebooks',   message: 'Add training notebook', time: '1 day ago' },
  { type: 'file', name: 'README.md',   message: 'Update documentation', time: '5 hours ago' },
  { type: 'file', name: 'requirements.txt', message: 'Pin numpy version', time: '2 days ago' },
  { type: 'file', name: 'main.py',     message: 'Fix forward pass bug',  time: '8 hours ago' },
];

const MOCK_COMMITS = [
  { sha: 'a3f8b2c', message: 'Fix forward pass bug in dense layer', author: 'arjun-sharma', time: '8 hours ago', additions: 12, deletions: 5 },
  { sha: 'e7d1a4f', message: 'Add dropout regularization', author: 'arjun-sharma', time: '2 days ago', additions: 45, deletions: 8 },
  { sha: 'b9c3e1d', message: 'Implement backpropagation', author: 'arjun-sharma', time: '3 days ago', additions: 120, deletions: 0 },
  { sha: 'f2a7c8b', message: 'Initial commit: basic layer structure', author: 'arjun-sharma', time: '5 days ago', additions: 200, deletions: 0 },
];

const MOCK_ISSUES = [
  { id: 1, number: 3, title: 'Gradient exploding with high learning rates', status: 'open', author: 'priya-m', labels: ['bug', 'help-wanted'], time: '1 day ago' },
  { id: 2, number: 2, title: 'Add LSTM support', status: 'open', author: 'karthik-v', labels: ['enhancement'], time: '3 days ago' },
  { id: 3, number: 1, title: 'README typo in installation section', status: 'closed', author: 'meera-i', labels: ['documentation'], time: '5 days ago' },
];

const README = `# Neural Network from Scratch

A complete implementation of deep neural networks using only **NumPy** — no PyTorch, no TensorFlow.

## Features

- Dense (fully connected) layers
- Activation functions: ReLU, Sigmoid, Softmax, Tanh
- Loss functions: MSE, Cross-entropy
- Optimizers: SGD, Adam
- Dropout regularization
- Batch normalization

## Quick Start

\`\`\`python
from src import Network, Dense, ReLU, Softmax

model = Network([
    Dense(784, 128),
    ReLU(),
    Dense(128, 64),
    ReLU(),
    Dense(64, 10),
    Softmax()
])

model.fit(X_train, y_train, epochs=50, lr=0.001)
\`\`\`

## Installation

\`\`\`bash
git clone https://github.com/bluelearnerhub/neural-network-from-scratch
pip install -r requirements.txt
\`\`\``;

function FileTree() {
  const [expanded, setExpanded] = useState<string[]>([]);
  return (
    <div className="font-mono text-sm">
      {MOCK_FILES.map((f) => (
        <div key={f.name} className="flex items-center gap-2 border-b border-gray-800 px-3 py-2 hover:bg-gray-800/50 transition-colors">
          {f.type === 'dir'
            ? <Folder className="h-4 w-4 text-blue-400 shrink-0" />
            : <File className="h-4 w-4 text-gray-500 shrink-0" />}
          <span className={`flex-1 ${f.type === 'dir' ? 'text-blue-400' : 'text-gray-300'}`}>{f.name}</span>
          <span className="text-xs text-gray-600 hidden sm:block">{f.message}</span>
          <span className="text-xs text-gray-600 ml-4 shrink-0">{f.time}</span>
        </div>
      ))}
    </div>
  );
}

export default function RepositoryPage({ params }: { params: { username: string; repo: string } }) {
  const [activeTab, setActiveTab] = useState('code');
  const [starred, setStarred]     = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1.5 text-sm">
          <Link href="/dev" className="text-blue-400 hover:underline">dev</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          <Link href={`/dev/${params.username}`} className="text-blue-400 hover:underline">{params.username}</Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
          <span className="font-semibold text-white">{params.repo}</span>
          <Badge className="ml-1 bg-gray-800 text-gray-400 text-[10px]">{MOCK_REPO.visibility}</Badge>
        </div>

        {/* Repo header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-sm text-gray-400 max-w-xl">{MOCK_REPO.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MOCK_REPO.topics.map((t) => (
                  <span key={t} className="rounded-full bg-blue-950 px-2.5 py-0.5 text-xs text-blue-400">{t}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setStarred(!starred)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  starred ? 'border-amber-600 bg-amber-950 text-amber-400' : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-amber-600'
                }`}
              >
                <Star className={`h-4 w-4 ${starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                {starred ? 'Starred' : 'Star'} · {MOCK_REPO.starCount + (starred ? 1 : 0)}
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-300 hover:border-gray-600">
                <GitFork className="h-4 w-4" /> Fork · {MOCK_REPO.forkCount}
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-5 flex items-center gap-5 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              {MOCK_REPO.language}
            </span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" />{MOCK_REPO.starCount}</span>
            <span className="flex items-center gap-1"><GitFork className="h-4 w-4" />{MOCK_REPO.forkCount}</span>
            <span className="flex items-center gap-1"><GitBranch className="h-4 w-4" />1 branch</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{MOCK_REPO.totalCommits} commits</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-900 border-b border-gray-800 w-full justify-start rounded-none px-0 mb-0 h-auto gap-0">
            {[
              { value: 'code',    icon: Code2,       label: 'Code' },
              { value: 'issues',  icon: Bug,         label: `Issues (${MOCK_ISSUES.filter(i => i.status === 'open').length})` },
              { value: 'pulls',   icon: GitMerge,    label: 'Pull Requests' },
              { value: 'commits', icon: Clock,       label: 'Commits' },
            ].map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm data-[state=active]:border-orange-400 data-[state=active]:text-white data-[state=inactive]:text-gray-500"
              >
                <Icon className="h-4 w-4" />{label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Code tab */}
          <TabsContent value="code" className="mt-0">
            <div className="flex flex-col lg:flex-row gap-4 pt-4">
              <div className="flex-1 min-w-0">
                {/* Latest commit banner */}
                <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-gray-800 bg-gray-900 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">A</div>
                    <span className="text-gray-300 font-medium">arjun-sharma</span>
                    <span className="text-gray-500">{MOCK_COMMITS[0].message}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-mono text-blue-400">{MOCK_COMMITS[0].sha}</span>
                    <span>{MOCK_COMMITS[0].time}</span>
                  </div>
                </div>
                <Card className="rounded-t-none bg-gray-900 border-gray-800">
                  <FileTree />
                </Card>

                {/* README */}
                <Card className="mt-4 bg-gray-900 border-gray-800">
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                      <BookOpen className="h-4 w-4 text-gray-400" /> README.md
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <SyntaxHighlighter language="markdown" style={oneDark as any} className="!rounded-lg !text-xs">
                        {README}
                      </SyntaxHighlighter>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* About sidebar */}
              <aside className="w-full lg:w-64 shrink-0 space-y-3">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">About</p>
                    <p className="text-sm text-gray-300">{MOCK_REPO.description}</p>
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Star className="h-3.5 w-3.5" /><span>{MOCK_REPO.starCount} stars</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="h-3.5 w-3.5" /><span>892 watching</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <GitFork className="h-3.5 w-3.5" /><span>{MOCK_REPO.forkCount} forks</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-1.5">Topics</p>
                      <div className="flex flex-wrap gap-1">
                        {MOCK_REPO.topics.map((t) => (
                          <span key={t} className="rounded-full bg-blue-950 px-2 py-0.5 text-xs text-blue-400">{t}</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>

          {/* Issues tab */}
          <TabsContent value="issues" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button className="text-sm font-medium text-white border-b-2 border-orange-400 pb-1">Open ({MOCK_ISSUES.filter(i => i.status === 'open').length})</button>
                <button className="text-sm text-gray-500 pb-1">Closed</button>
              </div>
              <Button size="sm" className="bg-green-700 hover:bg-green-600 gap-1.5 text-xs">
                <Bug className="h-3.5 w-3.5" /> New Issue
              </Button>
            </div>
            <Card className="bg-gray-900 border-gray-800">
              {MOCK_ISSUES.map((issue, i) => (
                <div key={issue.id} className={`flex items-start gap-3 px-4 py-3.5 ${i < MOCK_ISSUES.length - 1 ? 'border-b border-gray-800' : ''}`}>
                  <Bug className={`mt-0.5 h-4 w-4 shrink-0 ${issue.status === 'open' ? 'text-green-400' : 'text-purple-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{issue.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">#{issue.number} opened {issue.time} by {issue.author}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 shrink-0">
                    {issue.labels.map((l) => (
                      <Badge key={l} className="text-[10px] bg-gray-800 text-gray-300">{l}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Commits tab */}
          <TabsContent value="commits" className="pt-4">
            <Card className="bg-gray-900 border-gray-800">
              {MOCK_COMMITS.map((c, i) => (
                <div key={c.sha} className={`flex items-center gap-4 px-4 py-3 ${i < MOCK_COMMITS.length - 1 ? 'border-b border-gray-800' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{c.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.author} · {c.time}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs shrink-0">
                    <span className="text-green-400">+{c.additions}</span>
                    <span className="text-red-400">-{c.deletions}</span>
                    <span className="font-mono text-blue-400 bg-gray-800 px-2 py-0.5 rounded">{c.sha}</span>
                  </div>
                </div>
              ))}
            </Card>
          </TabsContent>

          {/* Pull Requests tab */}
          <TabsContent value="pulls" className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">0 open pull requests</p>
              <Button size="sm" className="bg-green-700 hover:bg-green-600 gap-1.5 text-xs">
                <GitMerge className="h-3.5 w-3.5" /> New Pull Request
              </Button>
            </div>
            <Card className="bg-gray-900 border-gray-800">
              <div className="flex flex-col items-center py-16 text-center text-gray-500">
                <GitMerge className="h-10 w-10 mb-3 opacity-30" />
                <p className="text-sm">No open pull requests</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
