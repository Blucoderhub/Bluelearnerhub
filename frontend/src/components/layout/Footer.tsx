'use client'

import Link from 'next/link'
import { Twitter, Linkedin, Github, Youtube, ArrowRight, Building2, GraduationCap, Mail } from 'lucide-react'
import { PoweredByBadge } from '@/components/branding/Logo'

export default function Footer() {
  const socialLinks = [
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@bluelearnerhub' },
    { name: 'Twitter / X', icon: Twitter, href: 'https://twitter.com/bluelearnerhub' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/bluelearnerhub' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/bluelearnerhub' },
  ]

  return (
    <footer className="bg-background border-t border-border/50">

      {/* Partnership CTA Strip */}
      <div className="border-b border-border/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-6">Partner With Us</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* For Colleges */}
            <div className="group relative rounded-2xl border border-border/60 bg-card/50 p-8 hover:border-primary/40 hover:bg-card transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg tracking-tight mb-1">For Colleges & Universities</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Get a dedicated institutional portal for your students — custom branding, placement tracking, lab access, and performance dashboards. Built for engineering colleges.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact?type=college"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] group/btn"
                    >
                      Request a College Portal
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href="mailto:colleges@bluelearnerhub.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/70 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all"
                    >
                      <Mail className="h-4 w-4" />
                      colleges@bluelearnerhub.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* For Corporates */}
            <div className="group relative rounded-2xl border border-border/60 bg-card/50 p-8 hover:border-primary/40 hover:bg-card transition-all duration-300">
              <div className="flex items-start gap-5">
                <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-lg tracking-tight mb-1">For Corporates & Startups</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Host hackathons, discover pre-vetted engineering talent, and upskill your team. Get a corporate portal with hiring tools, sponsored challenges, and analytics.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/contact?type=corporate"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all active:scale-[0.98] group/btn"
                    >
                      Request a Corporate Portal
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                    <a
                      href="mailto:corporate@bluelearnerhub.com"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/70 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border transition-all"
                    >
                      <Mail className="h-4 w-4" />
                      corporate@bluelearnerhub.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12">

          {/* Brand + Social */}
          <div className="space-y-7">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <span className="text-xl font-black text-primary-foreground">BL</span>
              </div>
              <div>
                <div className="text-lg font-black tracking-tighter">BLUELEARNERHUB</div>
                <PoweredByBadge />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The world&apos;s first all-engineering & management learning platform.
              Master any domain, compete in hackathons, and reach peak expertise.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/50 bg-muted/30 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                )
              })}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50 order-2 sm:order-1">
            &copy; {new Date().getFullYear()} Bluelearnerhub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5 order-1 sm:order-2">
            <Link href="/terms" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
