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
    <footer className="border-t border-border bg-white">
      {/* Partnership Strip */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-14">
          <p className="mb-8 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Partner With Us
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* For Colleges */}
            <div className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <span className="text-lg">🎓</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">For Institutions</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Dedicated portals for colleges. Placement tracking, lab synchronization, and student
                performance analytics.
              </p>
              <Link
                href="/contact?type=college"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-200 hover:text-brand-light"
              >
                Request a Demo →
              </Link>
            </div>

            {/* For Corporates */}
            <div className="group rounded-2xl border border-border bg-surface p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-md">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                <span className="text-lg">🏢</span>
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">For Corporates</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Host hackathons and discover elite engineering talent. Performance analytics for
                scaling your team efficiently.
              </p>
              <Link
                href="/contact?type=corporate"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-200 hover:text-brand-light"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-xs space-y-4">
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-bold tracking-tight text-foreground">
                Bluelearnerhub
              </span>
              <span className="text-[11px] font-medium text-muted-foreground italic">
                powered by Bluecoderhub
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The world's first elite Computer Science &amp; Engineering learning platform. Learn,
              practice, compete, and get hired.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-accent hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
            <Link href="/terms" className="transition-colors duration-200 hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors duration-200 hover:text-foreground">
              Privacy
            </Link>
            <Link href="/cookies" className="transition-colors duration-200 hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© 2026 Bluelearnerhub powered by Bluecoderhub. All rights reserved.</span>
          <span className="text-muted-foreground/60">v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
