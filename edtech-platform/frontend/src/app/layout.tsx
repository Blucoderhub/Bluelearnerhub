import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google'
import './globals.css'
import '../styles/animations.css'
import { Providers } from './providers'
import { AIAssistant } from '@/components/ai/AIAssistant'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bluelearnerhub - Learn, Practice, Compete, Get Hired',
  description: 'The world\'s first all-engineering & management learning platform. Master any domain, compete in hackathons, and land your dream job.',
  keywords: ['education', 'engineering', 'management', 'hackathon', 'learning', 'careers'],
  authors: [{ name: 'Bluecoderhub' }],
  openGraph: {
    title: 'Bluelearnerhub',
    description: 'Learn, Practice, Compete, Get Hired',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary`}>
        <Providers>
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  )
}
