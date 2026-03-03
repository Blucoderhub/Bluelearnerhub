import React from 'react'

export default function CandidateDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Dashboard</h1>
        <p className="text-muted-foreground">Track your job applications and interview schedule</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">Active Applications</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">Upcoming Interviews</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-2xl font-bold">95%</div>
          <p className="text-xs text-muted-foreground">Profile Completion</p>
        </div>
      </div>
    </div>
  )
}
