'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Trophy, Briefcase, GraduationCap,
  Search, ChevronRight, Zap, Globe, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const MOCK_ORGS = [
  {
    id: 1, slug: 'infosys-labs', name: 'Infosys Innovation Labs',
    orgType: 'corporate', description: 'Talent development and innovation arm of Infosys — connecting engineers with real-world challenges.',
    memberCount: 1240, openChallenges: 3, location: 'Bengaluru, India',
    gradient: 'from-blue-600 to-cyan-600', rating: 4.8,
    tags: ['AI/ML', 'Cloud', 'DevOps'],
  },
  {
    id: 2, slug: 'iit-bombay', name: 'IIT Bombay Research Hub',
    orgType: 'university', description: 'Collaborative research platform for students and faculty across engineering and sciences.',
    memberCount: 3800, openChallenges: 5, location: 'Mumbai, India',
    gradient: 'from-orange-600 to-red-600', rating: 4.9,
    tags: ['Research', 'Robotics', 'Semiconductor'],
  },
  {
    id: 3, slug: 'flipkart-campus', name: 'Flipkart Campus Program',
    orgType: 'corporate', description: 'Hire, train, and engage top engineering talent from India\'s best colleges.',
    memberCount: 620, openChallenges: 2, location: 'Bengaluru, India',
    gradient: 'from-yellow-500 to-orange-500', rating: 4.7,
    tags: ['E-commerce', 'Backend', 'Data Engineering'],
  },
  {
    id: 4, slug: 'iim-ahmedabad', name: 'IIM Ahmedabad Business Lab',
    orgType: 'university', description: 'Finance, strategy, and management learning programs with real-world case studies.',
    memberCount: 890, openChallenges: 4, location: 'Ahmedabad, India',
    gradient: 'from-emerald-600 to-teal-600', rating: 4.8,
    tags: ['Finance', 'Strategy', 'Consulting'],
  },
  {
    id: 5, slug: 'zepto-engineering', name: 'Zepto Engineering Guild',
    orgType: 'corporate', description: 'High-velocity engineering culture — build, ship, and learn at startup speed.',
    memberCount: 340, openChallenges: 1, location: 'Mumbai, India',
    gradient: 'from-purple-600 to-pink-600', rating: 4.6,
    tags: ['React Native', 'Go', 'Distributed Systems'],
  },
  {
    id: 6, slug: 'isro-space-tech', name: 'ISRO Space Tech Community',
    orgType: 'research', description: 'Aerospace engineering, satellite systems, and space exploration knowledge network.',
    memberCount: 2100, openChallenges: 6, location: 'Bengaluru, India',
    gradient: 'from-indigo-600 to-violet-600', rating: 4.9,
    tags: ['Aerospace', 'Embedded', 'Signal Processing'],
  },
];

const ORG_TYPES = ['All', 'corporate', 'university', 'research'];

const TYPE_CONFIG = {
  corporate:  { label: 'Corporate',  icon: Briefcase, color: 'bg-blue-900/50 text-blue-400' },
  university: { label: 'University', icon: GraduationCap, color: 'bg-amber-900/50 text-amber-400' },
  research:   { label: 'Research',   icon: Zap, color: 'bg-purple-900/50 text-purple-400' },
};

export default function OrganizationsPage() {
  const [search, setSearch] = useState('');
  const [type, setType]     = useState('All');

  const filtered = MOCK_ORGS.filter((o) => {
    const matchSearch = !search || o.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = type === 'All' || o.orgType === type;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Ecosystem</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
            <p className="mt-2 text-gray-400 max-w-xl">
              Partner with top companies, IITs, IIMs, and research labs. Compete in innovation challenges and get discovered by recruiters.
            </p>
          </motion.div>

          <div className="mt-6 flex gap-6">
            {[
              { label: 'Partners', value: '50+', icon: Building2, color: 'text-blue-400' },
              { label: 'Challenges', value: '120+', icon: Trophy, color: 'text-amber-400' },
              { label: 'Members', value: '32K+', icon: Users, color: 'text-emerald-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-bold">{value}</span>
                <span className="text-sm text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search organizations…"
              className="pl-9 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ORG_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  type === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {t === 'All' ? 'All' : TYPE_CONFIG[t as keyof typeof TYPE_CONFIG]?.label ?? t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((org, i) => {
            const typeInfo = TYPE_CONFIG[org.orgType as keyof typeof TYPE_CONFIG];
            const TypeIcon = typeInfo?.icon ?? Building2;

            return (
              <motion.div
                key={org.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 transition-all group h-full">
                  <div className={`h-2 bg-gradient-to-r ${org.gradient}`} />
                  <CardContent className="p-5 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className={`rounded-xl bg-gradient-to-br ${org.gradient} p-2.5`}>
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <Badge className={`text-xs ${typeInfo?.color ?? 'bg-gray-800 text-gray-400'}`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeInfo?.label ?? org.orgType}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1">{org.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 flex-1 leading-relaxed">{org.description}</p>

                    {/* Tags */}
                    <div className="mb-3 flex flex-wrap gap-1">
                      {org.tags.map((t) => (
                        <span key={t} className="rounded-md bg-gray-800 px-2 py-0.5 text-[10px] text-gray-400">{t}</span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{org.memberCount.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-amber-400" />{org.openChallenges} challenges</span>
                      <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" />{org.location.split(',')[0]}</span>
                    </div>

                    <Link href={`/organizations/${org.slug}`} className="block">
                      <Button variant="outline" size="sm" className="w-full text-xs border-gray-700 text-gray-300 hover:text-white gap-1">
                        View Organization <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
