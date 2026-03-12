// src/app/(student)/hackathons/[hackathonId]/page.tsx

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import CountdownTimer from '@/components/hackathon/CountdownTimer'
import LeaderboardTable from '@/components/hackathon/LeaderboardTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { hackathonsAPI } from '@/lib/api-civilization'

export default function HackathonDetailsPage() {
  const params = useParams()
  const [registered, setRegistered] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [adaptiveGuidance, setAdaptiveGuidance] = useState<string[]>([])

  const hackathonId = useMemo(() => {
    const rawId = Array.isArray(params.hackathonId) ? params.hackathonId[0] : params.hackathonId
    const parsed = Number(rawId)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null
  }, [params.hackathonId])

  useEffect(() => {
    if (!hackathonId) return

    void hackathonsAPI.trackBehavior(hackathonId, 'hackathon_opened').catch(() => undefined)
    void hackathonsAPI.adaptiveGuidance(hackathonId)
      .then((data) => {
        const guidance = Array.isArray(data?.guidance) ? data.guidance.filter((item: unknown) => typeof item === 'string') : []
        setAdaptiveGuidance(guidance.slice(0, 3))
      })
      .catch(() => setAdaptiveGuidance([]))
  }, [hackathonId])

  useEffect(() => {
    if (!hackathonId) return
    void hackathonsAPI.trackBehavior(hackathonId, 'tab_viewed', { tab: activeTab }).catch(() => undefined)
  }, [activeTab, hackathonId])

  const handleRegister = () => {
    setRegistered(true)
    if (!hackathonId) return
    void hackathonsAPI.trackBehavior(hackathonId, 'hackathon_registered').catch(() => undefined)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Winter Code Challenge 2024
            </h1>
            <p className="text-blue-100 text-lg">
              Solve algorithmic challenges and win prizes!
            </p>
            
            <div className="flex gap-4 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                💰 Prize Pool: ₹1,00,000
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                👥 2,450 Participants
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                ⏱️ 48 Hours
              </span>
            </div>
          </div>

          <CountdownTimer endTime="2024-12-31T23:59:59Z" />
        </div>

        {!registered ? (
          <button 
            onClick={handleRegister}
            className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Register Now
          </button>
        ) : (
          <button 
            className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            ✓ Registered - Go to Dashboard
          </button>
        )}
      </div>

      {adaptiveGuidance.length > 0 && (
        <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">Adaptive Coaching</h3>
          <ul className="list-disc pl-5 text-sm text-indigo-900 dark:text-indigo-100">
            {adaptiveGuidance.map((tip, index) => (
              <li key={`${tip}-${index}`}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                Join developers from around the world in this exciting 48-hour coding marathon...
              </p>
              
              <h3>Prizes</h3>
              <ul>
                <li>🥇 1st Place: ₹50,000</li>
                <li>🥈 2nd Place: ₹30,000</li>
                <li>🥉 3rd Place: ₹20,000</li>
              </ul>

              <h3>Rules</h3>
              <ul>
                <li>Individual or team participation (max 4 members)</li>
                <li>All code must be written during the hackathon</li>
                <li>Use any programming language</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardTable hackathonId={params.hackathonId as string} />
        </TabsContent>

        {/* Other tabs... */}
      </Tabs>
    </div>
  )
}
