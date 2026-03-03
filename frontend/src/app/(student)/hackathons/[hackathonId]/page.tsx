// src/app/(student)/hackathons/[hackathonId]/page.tsx

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import CountdownTimer from '@/components/hackathon/CountdownTimer'
import LeaderboardTable from '@/components/hackathon/LeaderboardTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function HackathonDetailsPage() {
  const params = useParams()
  const [registered, setRegistered] = useState(false)

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
            onClick={() => setRegistered(true)}
            className="mt-6 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Register Now
          </button>
        ) : (
          <button 
            className="mt-6 px-8 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
          >
            ✓ Registered - Go to Dashboard
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
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
