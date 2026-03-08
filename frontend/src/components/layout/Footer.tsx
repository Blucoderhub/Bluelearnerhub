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
    <footer className="bg-card/80 border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-0 md:gap-8">
          <div className="col-span-1 md:col-span-2 mb-8 md:mb-0">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/20">
                <span className="text-lg font-bold text-white">BL</span>
              </div>
              <div>
                <div className="text-base font-bold text-white">Bluelearnerhub</div>
                <PoweredByBadge />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-xs">
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
                    className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="col-span-1 md:col-span-4">
            <div className="md:hidden">
              {sections.map((section) => (
                <AccordionSection key={section.title} section={section} />
              ))}
            </div>

            <div className="hidden md:grid md:grid-cols-4 gap-8">
              {sections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-white font-semibold text-sm mb-4">{section.title}</h3>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
