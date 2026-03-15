'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import {
  Trophy, Users, Clock, Award, Loader2, CheckCircle2,
  Code2, ChevronRight, ExternalLink, Lightbulb, Send,
} from 'lucide-react'
import CountdownTimer from '@/components/hackathon/CountdownTimer'
import LeaderboardTable from '@/components/hackathon/LeaderboardTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { hackathonsAPI } from '@/lib/api-civilization'

const FALLBACK_HACKATHON = {
  id: 1,
  title: 'Winter Code Challenge 2025',
  description: 'Join developers from around the world in this exciting 48-hour coding marathon. Solve algorithmic challenges, build creative projects, and compete for prizes.',
  status: 'OPEN',
  prizePool: '₹1,00,000',
  participantCount: 2450,
  maxParticipants: 5000,
  durationHours: 48,
  domain: 'software',
  difficulty: 'intermediate',
  startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
  endDate: new Date(Date.now() + 86400000 * 4).toISOString(),
  prizes: [
    { rank: '1st Place', amount: '₹50,000', label: '🥇' },
    { rank: '2nd Place', amount: '₹30,000', label: '🥈' },
    { rank: '3rd Place', amount: '₹20,000', label: '🥉' },
  ],
  rules: [
    'Individual or team participation (max 4 members)',
    'All code must be written during the hackathon window',
    'Use any programming language',
    'AI-assisted coding is allowed; copied solutions are not',
    'Submissions must include source code and a brief explanation',
  ],
  problems: [
    { id: 1, title: 'Array Manipulation', difficulty: 'Easy',   points: 100, solved: false },
    { id: 2, title: 'Graph Traversal',    difficulty: 'Medium', points: 200, solved: false },
    { id: 3, title: 'DP Optimization',    difficulty: 'Hard',   points: 400, solved: false },
    { id: 4, title: 'System Design Mini', difficulty: 'Hard',   points: 300, solved: false },
  ],
  sponsors: ['TechCorp', 'InnovateLabs', 'CodeBase'],
}

const diffColors: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-400/10',
  Medium: 'text-amber-400 bg-amber-400/10',
  Hard: 'text-red-400 bg-red-400/10',
}

function HackathonSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-8">
      <div className="h-10 bg-gray-800 rounded w-2/3" />
      <div className="h-5 bg-gray-800 rounded w-1/2" />
      <div className="flex gap-4 mt-4">
        {[1, 2, 3].map(i => <div key={i} className="h-8 w-32 bg-gray-800 rounded-full" />)}
      </div>
      <div className="h-10 w-40 bg-gray-800 rounded-lg mt-6" />
    </div>
  )
}

export default function HackathonDetailsPage() {
  const params = useParams()
  const [hackathon, setHackathon] = useState<typeof FALLBACK_HACKATHON | null>(null)
  const [loading, setLoading] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [adaptiveGuidance, setAdaptiveGuidance] = useState<string[]>([])

  const hackathonId = useMemo(() => {
    const rawId = Array.isArray(params.hackathonId) ? params.hackathonId[0] : params.hackathonId
    const parsed = Number(rawId)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null
  }, [params.hackathonId])

  useEffect(() => {
    if (!hackathonId) {
      setHackathon(FALLBACK_HACKATHON)
      setLoading(false)
      return
    }

    hackathonsAPI.get(hackathonId)
      .then((data: any) => {
        const h = data?.hackathon ?? data
        if (h?.id) {
          setHackathon({
            ...FALLBACK_HACKATHON,
            id: h.id,
            title: h.title ?? FALLBACK_HACKATHON.title,
            description: h.description ?? FALLBACK_HACKATHON.description,
            status: h.status ?? 'OPEN',
            prizePool: h.prizePool ?? h.prize_pool ?? FALLBACK_HACKATHON.prizePool,
            participantCount: h.participantCount ?? h.participant_count ?? FALLBACK_HACKATHON.participantCount,
            maxParticipants: h.maxParticipants ?? h.max_participants ?? FALLBACK_HACKATHON.maxParticipants,
            durationHours: h.durationHours ?? h.duration_hours ?? 48,
            domain: h.domain ?? 'software',
            startDate: h.startDate ?? h.start_date ?? FALLBACK_HACKATHON.startDate,
            endDate: h.endDate ?? h.end_date ?? FALLBACK_HACKATHON.endDate,
          })
          setRegistered(h.isRegistered ?? h.is_registered ?? false)
        } else {
          setHackathon(FALLBACK_HACKATHON)
        }
      })
      .catch(() => setHackathon(FALLBACK_HACKATHON))
      .finally(() => setLoading(false))

    void hackathonsAPI.trackBehavior(hackathonId, 'hackathon_opened').catch(() => undefined)
    void hackathonsAPI.adaptiveGuidance(hackathonId)
      .then((data: any) => {
        const guidance = Array.isArray(data?.guidance)
          ? data.guidance.filter((item: unknown) => typeof item === 'string')
          : []
        setAdaptiveGuidance(guidance.slice(0, 3))
      })
      .catch(() => setAdaptiveGuidance([]))
  }, [hackathonId])

  useEffect(() => {
    if (!hackathonId) return
    void hackathonsAPI.trackBehavior(hackathonId, 'tab_viewed', { tab: activeTab }).catch(() => undefined)
  }, [activeTab, hackathonId])

  const handleRegister = async () => {
    if (!hackathonId) {
      setRegistered(true)
      toast.success('Registered successfully! Good luck!')
      return
    }
    setRegistering(true)
    try {
      await hackathonsAPI.register(hackathonId)
      void hackathonsAPI.trackBehavior(hackathonId, 'hackathon_registered').catch(() => undefined)
      setRegistered(true)
      toast.success('Registered successfully! Good luck!')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setRegistering(false)
    }
  }

  const h = hackathon ?? FALLBACK_HACKATHON

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* Hero Banner */}
        {loading ? (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden">
            <HackathonSkeleton />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={`text-xs font-bold border-0 ${
                    h.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300' :
                    h.status === 'UPCOMING' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {h.status}
                  </Badge>
                  <Badge className="bg-white/10 text-white/80 text-xs border-0">{h.domain}</Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight">{h.title}</h1>
                <p className="text-blue-100 text-base mb-5 max-w-xl leading-relaxed">{h.description}</p>

                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium">
                    <Trophy className="h-4 w-4" /> Prize Pool: {h.prizePool}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium">
                    <Users className="h-4 w-4" /> {h.participantCount?.toLocaleString()} Participants
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4" /> {h.durationHours}h Duration
                  </span>
                </div>

                <div className="mt-6">
                  {registered ? (
                    <button className="px-8 py-3 bg-white/20 border border-white/30 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-white/25 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                      Registered — Go to Dashboard
                    </button>
                  ) : (
                    <Button
                      onClick={handleRegister}
                      disabled={registering || h.status === 'CLOSED'}
                      className="px-8 py-3 h-auto bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors gap-2 disabled:opacity-60"
                    >
                      {registering && <Loader2 className="h-4 w-4 animate-spin" />}
                      {h.status === 'CLOSED' ? 'Registration Closed' : registering ? 'Registering...' : 'Register Now — Free'}
                    </Button>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-center">
                <p className="text-xs text-blue-200 uppercase font-bold tracking-wider mb-2">Ends in</p>
                <CountdownTimer endTime={h.endDate} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Adaptive Guidance */}
        {adaptiveGuidance.length > 0 && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wide">Adaptive Coaching</h3>
            </div>
            <ul className="space-y-1">
              {adaptiveGuidance.map((tip, index) => (
                <li key={`${tip}-${index}`} className="text-sm text-indigo-100 flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-indigo-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tabs */}
        {!loading && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="submissions">My Submissions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* About + Rules */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-bold text-white mb-3">About</h2>
                      <p className="text-gray-400 leading-relaxed text-sm">{h.description}</p>

                      <h3 className="text-base font-bold text-white mt-6 mb-3">Rules</h3>
                      <ul className="space-y-2">
                        {h.rules.map((rule, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {h.sponsors?.length > 0 && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardContent className="p-6">
                        <h3 className="text-base font-bold text-white mb-3">Sponsors</h3>
                        <div className="flex flex-wrap gap-3">
                          {h.sponsors.map((s: string) => (
                            <span key={s} className="px-4 py-2 rounded-xl bg-gray-800 text-sm text-gray-300 font-medium">{s}</span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Prizes */}
                <div>
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-400" /> Prizes
                      </h2>
                      <div className="space-y-3">
                        {h.prizes.map((prize) => (
                          <div key={prize.rank} className="flex items-center justify-between p-3 rounded-xl bg-gray-800">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{prize.label}</span>
                              <span className="text-sm text-gray-300">{prize.rank}</span>
                            </div>
                            <span className="text-sm font-bold text-white">{prize.amount}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-500">Total Prize Pool</p>
                        <p className="text-2xl font-black text-amber-400">{h.prizePool}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="problems">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Problems</h2>
                    {!registered && (
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                        Register to unlock all problems
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-3">
                    {h.problems.map((problem, i) => (
                      <motion.div
                        key={problem.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                          registered
                            ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800 cursor-pointer'
                            : 'border-gray-800 bg-gray-900/50 opacity-60'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-300">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{problem.title}</p>
                          <p className="text-xs text-gray-500">{problem.points} points</p>
                        </div>
                        <Badge className={`text-[10px] border-0 ${diffColors[problem.difficulty] ?? ''}`}>
                          {problem.difficulty}
                        </Badge>
                        {problem.solved && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                        {registered && !problem.solved && <Code2 className="h-4 w-4 text-gray-500 shrink-0" />}
                      </motion.div>
                    ))}
                  </div>
                  {!registered && (
                    <div className="mt-6 text-center">
                      <Button onClick={handleRegister} disabled={registering} className="bg-blue-600 hover:bg-blue-700 gap-2">
                        {registering && <Loader2 className="h-4 w-4 animate-spin" />}
                        Register to Start Solving
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard">
              <LeaderboardTable hackathonId={params.hackathonId as string} />
            </TabsContent>

            <TabsContent value="submissions">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  {registered ? (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold text-white mb-4">My Submissions</h2>
                      <div className="flex flex-col items-center py-12 gap-3 text-center">
                        <Send className="h-10 w-10 text-gray-600" />
                        <p className="text-sm text-gray-400">No submissions yet.</p>
                        <p className="text-xs text-gray-600">Go to Problems tab to start solving challenges.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 mt-2"
                          onClick={() => setActiveTab('problems')}
                        >
                          View Problems
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-12 gap-3 text-center">
                      <Trophy className="h-10 w-10 text-gray-600" />
                      <p className="text-sm text-gray-400">Register first to submit solutions.</p>
                      <Button onClick={handleRegister} disabled={registering} className="bg-blue-600 hover:bg-blue-700 gap-2 mt-2">
                        {registering && <Loader2 className="h-4 w-4 animate-spin" />}
                        Register Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
