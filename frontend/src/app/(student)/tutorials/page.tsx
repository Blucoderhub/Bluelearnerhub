import React from 'react'

export default function TutorialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tutorials</h1>
        <p className="text-muted-foreground">Browse interactive tutorials to master new skills</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tutorial cards will go here */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">JavaScript Basics</h3>
          <p className="text-sm text-muted-foreground mt-2">Learn the fundamentals of JavaScript</p>
          <div className="mt-4">
            <div className="text-xs text-muted-foreground">Progress: 45%</div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-full w-[45%] rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
