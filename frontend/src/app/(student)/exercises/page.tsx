'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Zap, 
  Trophy, 
  ChevronRight, 
  Star,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const challenges = [
  {
    id: 'c1',
    title: 'Self-Attention Mechanisms',
    domain: 'Computer Science',
    subDomain: 'Machine Learning',
    difficulty: 'Hard',
    points: 100,
    successRate: '68%',
    solved: true,
  },
  {
    id: 'c2',
    title: 'Equilibrium of Rigid Bodies',
    domain: 'Mechanical',
    subDomain: 'Statics',
    difficulty: 'Medium',
    points: 50,
    successRate: '82%',
    solved: false,
  },
  {
    id: 'c3',
    title: 'Operational Amplifiers Analysis',
    domain: 'Electrical',
    subDomain: 'Circuit Theory',
    difficulty: 'Hard',
    points: 120,
    successRate: '45%',
    solved: false,
  },
  {
    id: 'c4',
    title: 'Supply Chain Optimization',
    domain: 'Management',
    subDomain: 'Operations',
    difficulty: 'Medium',
    points: 80,
    successRate: '75%',
    solved: true,
  },
  {
    id: 'c5',
    title: 'Reinforced Concrete Design',
    domain: 'Civil',
    subDomain: 'Structures',
    difficulty: 'Hard',
    points: 150,
    successRate: '32%',
    solved: false,
  },
];

const domains = ['All Domains', 'Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Management'];

export default function ChallengeHub() {
  const [activeDomain, setActiveDomain] = useState('All Domains');

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      {/* Hero Section (HackerRank Style) */}
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 p-12 md:p-16 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <Badge className="bg-amber-500/20 text-amber-400 border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
            Mastery Practice
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight">
            PREPARE_FOR <span className="text-amber-500 ai-glow">WORLD_CLASS</span> DOMAIN_MASTERY
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Solve world-class challenges across all engineering and management disciplines. Gain points, climb the global leaderboard, and get certified by the industry's best.
          </p>
          <div className="flex gap-4 pt-4">
             <Button className="h-14 px-8 bg-amber-500 hover:bg-amber-600 text-white font-black italic tracking-tighter rounded-2xl shadow-xl shadow-amber-500/20">
                START_ASSESSMENT
             </Button>
             <Link href="/hackathons">
                <Button variant="outline" className="h-14 px-8 border-slate-700 text-white font-black italic tracking-tighter rounded-2xl hover:bg-slate-900">
                    VIEW_HACKATHONS
                </Button>
             </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-6 p-4 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex-1 w-full relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            placeholder="Search for challenges (e.g. 'Thermodynamics', 'React', 'Equity Financing')" 
            className="h-16 pl-14 pr-6 rounded-2xl border-none bg-slate-50 dark:bg-slate-800/50 text-base font-medium focus-visible:ring-amber-500"
          />
        </div>
        <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden lg:block" />
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto px-2 lg:px-0 scrollbar-none">
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => setActiveDomain(domain)}
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeDomain === domain 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : 'text-slate-500 hover:text-amber-500 hover:bg-amber-500/5'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-xl font-black font-heading flex items-center gap-2 italic">
              <LayoutGrid size={20} className="text-amber-500" />
              TOP_CHALLENGES
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-400">Sort by:</span>
               <select className="bg-transparent text-xs font-black text-amber-600 focus:outline-none">
                  <option>NEWEST</option>
                  <option>MOST_ATTEMPTED</option>
                  <option>POINTS</option>
               </select>
            </div>
          </div>

          <div className="space-y-4">
            {challenges.filter(c => activeDomain === 'All Domains' || c.domain === activeDomain).map((challenge) => (
              <motion.div 
                key={challenge.id}
                whileHover={{ x: 6 }}
                className="group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-3xl ${challenge.solved ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    {challenge.solved ? <Trophy size={24} /> : <Star size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{challenge.domain}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{challenge.subDomain}</span>
                    </div>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors uppercase italic tracking-tighter">
                      {challenge.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-2">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Zap size={14} className="text-amber-500" /> {challenge.points} Points
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Star size={14} className="text-orange-500" /> {challenge.difficulty}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Star size={14} className="text-blue-500" /> {challenge.successRate} Success
                       </div>
                    </div>
                  </div>
                </div>
                <Link href={`/quiz?id=${challenge.id}`}>
                    <Button variant="ghost" className="h-16 w-16 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-500 hover:text-white transition-all">
                        <ChevronRight size={24} />
                    </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500" />
              <h3 className="text-xl font-black italic mb-6 tracking-tight">YOUR_RANKING</h3>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-black text-white/40 uppercase mb-2">Current Tier</p>
                    <div className="flex items-center gap-4">
                       <div className="h-14 w-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                          <Trophy size={28} />
                       </div>
                       <div>
                          <p className="text-2xl font-black italic tracking-tighter">EMERALD_III</p>
                          <p className="text-xs font-bold text-amber-400">Top 5.2% Globally</p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-white/40 uppercase">Global Points</span>
                       <span className="text-amber-400 tracking-widest uppercase">14,250 PTS</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold">
                       <span className="text-white/40 uppercase">Domain Badges</span>
                       <span className="text-white">12 Mastery Badges</span>
                    </div>
                 </div>

                 <Button className="w-full h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-widest">
                    VIEW_LEADERBOARD
                 </Button>
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/20 space-y-4 text-center group cursor-pointer hover:bg-amber-500/10 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto group-hover:scale-110 transition-transform">
                 <Clock size={32} />
              </div>
              <h4 className="text-xl font-black italic tracking-tight text-white/90">COMING_SOON</h4>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-tight">
                 Real-time Multiplayer Battles
              </p>
              <Button variant="ghost" className="text-xs font-black text-amber-500 hover:text-amber-400">
                GET_NOTIFIED
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
