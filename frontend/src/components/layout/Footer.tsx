'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Youtube } from 'lucide-react'

export default function Footer() {
  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@bluelearnerhub' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/bluelearnerhub' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/bluelearnerhub' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/bluelearnerhub' },
  ]

  return (
    <footer className="bg-white border-t border-border">
      {/* Partnership Strip */}
      <div className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-8">
            Partner With Us
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* For Colleges */}
            <div className="p-8 rounded-2xl border border-border bg-surface hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center mb-5">
                <span className="text-lg">🎓</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">For Institutions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Dedicated portals for colleges. Placement tracking, lab synchronization, and student performance analytics.
              </p>
              <Link
                href="/contact?type=college"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-brand-light transition-colors duration-200"
              >
                Request a Demo →
              </Link>
            </div>

            {/* For Corporates */}
            <div className="p-8 rounded-2xl border border-border bg-surface hover:shadow-card-md hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center mb-5">
                <span className="text-lg">🏢</span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">For Corporates</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Host hackathons and discover elite engineering talent. Performance analytics for scaling your team efficiently.
              </p>
              <Link
                href="/contact?type=corporate"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-brand-light transition-colors duration-200"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
                <span className="text-xs font-extrabold text-white">BL</span>
              </div>
              <span className="font-bold text-[15px] tracking-tight text-foreground">Bluelearnerhub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The world's first elite Computer Science &amp; Engineering learning platform. Learn, practice, compete, and get hired.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.name}
                    href={s.href}
                    aria-label={s.name}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary hover:bg-accent transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors duration-200">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors duration-200">Privacy</Link>
            <Link href="/cookies" className="hover:text-foreground transition-colors duration-200">Cookies</Link>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© 2026 Bluelearnerhub. All rights reserved.</span>
          <span className="text-muted-foreground/60">v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}

