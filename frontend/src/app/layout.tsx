import type { Metadata } from 'next'
import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono, Playfair_Display } from 'next/font/google'
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

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
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

const BASE_URL = 'https://bluelearnerhub.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BlueLearnerHub — Free Online Courses in Computer Science & Software Engineering',
    template: '%s | BlueLearnerHub',
  },
  description:
    'Learn computer science, software engineering, Python, JavaScript, React, system design, and more — for free. Compete in AI-powered hackathons, earn verified certificates, and land your dream tech job.',
  keywords: [
    'free online courses computer science',
    'software engineering courses',
    'learn python online free',
    'learn javascript online',
    'react course free',
    'coding bootcamp free',
    'system design course',
    'hackathon platform',
    'AI learning platform',
    'programming challenges',
    'coding interview prep',
    'verified certificates online',
    'learn coding free',
    'computer science degree online',
    'software developer courses',
    'BlueLearnerHub',
    'edtech platform India',
  ],
  authors: [{ name: 'BlueLearnerHub', url: BASE_URL }],
  creator: 'BlueLearnerHub',
  publisher: 'BlueLearnerHub',
  category: 'education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'BlueLearnerHub',
    title: 'BlueLearnerHub — Free Online Courses in CS & Software Engineering',
    description:
      'Master coding, algorithms, and system design. Compete in AI-powered hackathons, earn certificates, and land top tech jobs. Start free today.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlueLearnerHub — The Future of Tech Education',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bluelearnerhub',
    creator: '@bluelearnerhub',
    title: 'BlueLearnerHub — Free Courses in CS & Software Engineering',
    description:
      'Master coding for free. AI-powered quizzes, live hackathons, verified certificates. Join 50,000+ learners.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: 'google-site-verification-token',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} bg-background font-sans text-foreground antialiased`}
      >
        <Providers>
          {children}
          <AIAssistant />
        </Providers>
      </body>
    </html>
  )
}
