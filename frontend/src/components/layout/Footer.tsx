'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Youtube } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
  ]

  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <span className="text-sm font-bold tracking-tight text-white">
              BlueLearnerHub
            </span>
            <p className="text-xs text-muted-foreground">
              Learn, build, and showcase your skills. Free forever.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
            <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
            <div className="flex gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-border/30 pt-5 text-xs text-muted-foreground/50">
          © 2026 BlueLearnerHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
