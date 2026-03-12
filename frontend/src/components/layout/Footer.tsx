'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Facebook, Twitter, Linkedin, Github, Instagram, ChevronDown } from 'lucide-react'
import { PoweredByBadge } from '@/components/branding/Logo'

interface FooterSection {
  title: string
  links: { name: string; href: string }[]
}

function AccordionSection({ section }: { section: FooterSection }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden border-b border-white/[0.06] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-white font-semibold text-sm">{section.title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 pb-4' : 'max-h-0'
          }`}
      >
        <ul className="space-y-2.5">
          {section.links.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Footer() {
  const sections: FooterSection[] = [
    {
      title: 'Product',
      links: [
        { name: 'Learn', href: '/learn' },
        { name: 'Courses', href: '/courses' },
        { name: 'Academy', href: '/mentors' },
        { name: 'Practice', href: '/practice' },
        { name: 'Hackathons', href: '/hackathons' },
        { name: 'Community', href: '/community' },
        { name: 'Updates', href: '/updates' },
      ],
    },
    {
      title: 'Domains',
      links: [
        { name: 'Computer Science', href: '/learn/computer-science' },
        { name: 'Mechanical', href: '/learn/mechanical' },
        { name: 'Electrical', href: '/learn/electrical' },
        { name: 'Civil', href: '/learn/civil' },
        { name: 'Management', href: '/learn/management' },
        { name: 'Resources', href: '/resources' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Contact', href: '/contact' },
        { name: 'Culture', href: '/about/culture' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'FAQ', href: '/faq' },
        { name: 'API', href: '/api' },
        { name: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Portals',
      links: [
        { name: 'Corporate Login', href: '/login/corporate' },
        { name: 'College Login', href: '/login/university' },
        { name: 'Mentor Login', href: '/login/mentor' },
        { name: 'Admin Portal', href: '/login/admin' },
      ],
    },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'GDPR', href: '/gdpr' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'GitHub', icon: Github, href: 'https://github.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  ]

  return (
    <footer className="bg-background border-t border-border/50 py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                <span className="text-xl font-black text-primary-foreground">BL</span>
              </div>
              <div>
                <div className="text-lg font-black tracking-tighter">BLUELEARNERHUB</div>
                <PoweredByBadge />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
              The world&apos;s first all-engineering & management learning platform.
              Master any domain, compete in hackathons, and reach peak expertise.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="col-span-1 md:col-span-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {sections.map((section) => (
                <div key={section.title} className="space-y-6">
                  <h3 className="font-black text-xs uppercase tracking-widest text-primary">{section.title}</h3>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-200 block font-medium"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground/60 order-2 md:order-1">
              &copy; {new Date().getFullYear()} Bluelearnerhub. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 order-1 md:order-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
