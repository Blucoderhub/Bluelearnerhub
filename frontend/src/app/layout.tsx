import type { Metadata } from 'next'
import { Sora, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import '../styles/animations.css'
import { Providers } from './providers'
import { AIAssistant } from '@/components/ai/AIAssistant'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bluelearnerhub - Master Computer Science & Software Engineering',
  description: 'The world\'s first elite Computer Science & Software Engineering learning platform. Master coding, algorithms, and system design, compete in hackathons, and land your dream job.',
  keywords: ['education', 'computer science', 'software engineering', 'coding', 'algorithms', 'hackathon', 'learning', 'careers'],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground selection:bg-primary/30 selection:text-primary`}>
        <Providers>
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  )
}
