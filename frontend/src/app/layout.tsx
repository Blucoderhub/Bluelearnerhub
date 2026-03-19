import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import '../styles/animations.css'
import { Providers } from './providers'
import { AIAssistant } from '@/components/ai/AIAssistant'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bluelearnerhub - Master Computer Science & Software Engineering',
  description:
    "The world's first elite Computer Science & Software Engineering learning platform. Master coding, algorithms, and system design, compete in hackathons, and land your dream job.",
  keywords: [
    'education',
    'computer science',
    'software engineering',
    'coding',
    'algorithms',
    'hackathon',
    'learning',
    'careers',
  ],
  authors: [{ name: 'Bluecoderhub' }],
  openGraph: {
    title: 'Bluelearnerhub',
    description: 'Learn, Practice, Compete, Get Hired',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  )
}
