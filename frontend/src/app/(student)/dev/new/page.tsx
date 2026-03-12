'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Lock, Globe, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LICENSE_OPTIONS = ['None', 'MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-2-Clause'];
const GITIGNORE_TEMPLATES = ['None', 'Node', 'Python', 'Go', 'Rust', 'Java'];

export default function NewRepositoryPage() {
  const router = useRouter();
  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility]   = useState<'public' | 'private'>('public');
  const [initReadme, setInitReadme]   = useState(true);
  const [license, setLicense]         = useState('MIT');
  const [gitignore, setGitignore]     = useState('None');
  const [creating, setCreating]       = useState(false);
  const [error, setError]             = useState('');

  const slugified = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleCreate = async () => {
    if (!name.trim()) { setError('Repository name is required'); return; }
    setCreating(true);
    setError('');

    try {
      // POST /api/repositories
      const res = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: slugified,
          description,
          visibility,
          license: license !== 'None' ? license : null,
          gitignoreTemplate: gitignore !== 'None' ? gitignore : null,
          initWithReadme: initReadme,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      router.push(`/dev/me/${slugified}`);
    } catch (err: any) {
      setError(err.message ?? 'Failed to create repository');
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/dev" className="hover:text-white">Dev Portal</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-300">New Repository</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-900/50 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Create a new repository</h1>
              <p className="text-sm text-gray-500">A repository contains your project files and revision history.</p>
            </div>
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Repository name <span className="text-red-400">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="my-awesome-project"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                />
                {slugified && name !== slugified && (
                  <p className="text-xs text-gray-500 mt-1">Will be saved as: <span className="text-blue-400">{slugified}</span></p>
                )}
                {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Description <span className="text-gray-600">(optional)</span>
                </label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A short description of your project"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-600"
                />
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['public', 'private'] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        visibility === v
                          ? 'border-blue-500 bg-blue-900/20'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      {v === 'public'
                        ? <Globe className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                        : <Lock className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      }
                      <div>
                        <p className="text-sm font-medium capitalize">{v}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {v === 'public' ? 'Anyone can see this repository' : 'Only you can see this repository'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Init options */}
              <div className="border-t border-gray-800 pt-5">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Initialize repository</h3>
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={initReadme}
                    onChange={(e) => setInitReadme(e.target.checked)}
                    className="accent-blue-500 h-4 w-4"
                  />
                  <span className="flex items-center gap-2 text-sm text-gray-300">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Add a README file
                  </span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">.gitignore template</label>
                    <select
                      value={gitignore}
                      onChange={(e) => setGitignore(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {GITIGNORE_TEMPLATES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1.5">License</label>
                    <select
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      {LICENSE_OPTIONS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 font-semibold"
              >
                {creating ? 'Creating repository…' : 'Create repository'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
