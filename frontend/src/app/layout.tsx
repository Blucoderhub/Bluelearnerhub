import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { CustomCursor } from '@/components/ui/CustomCursor'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://bluelearnerhub.com'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0f' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BlueLearnerHub — Learn. Code. Compete. Succeed.',
    template: '%s | BlueLearnerHub',
  },
  description:
    'India\'s premier EdTech platform for engineering students. Master programming with AI-powered quizzes, coding challenges, hackathons, and expert mentorship. Start your tech career today.',
  keywords: [
    'free coding bootcamp India',
    'learn programming free',
    'Python JavaScript React free',
    'system design course free',
    'hackathon platform India',
    'coding interview prep',
    'verified certificates',
    'BlueLearnerHub',
    'edtech India',
    'software engineering',
    'AI learning platform',
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
    locale: 'en_IN',
    url: BASE_URL,
    siteName: 'BlueLearnerHub',
    title: 'BlueLearnerHub — Learn. Code. Compete. Succeed.',
    description:
      'India\'s premier EdTech platform. AI-powered learning, coding challenges, hackathons, and mentorship for engineering students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlueLearnerHub — Your Path to Tech Excellence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bluelearnerhub',
    creator: '@bluelearnerhub',
    title: 'BlueLearnerHub — Learn. Code. Compete. Succeed.',
    description:
      'India\'s premier EdTech platform for engineering students. AI-powered learning, coding challenges, and hackathons.',
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
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${playfair.variable}`}>
        {/* Skip to main content - Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:font-semibold"
        >
          Skip to main content
        </a>
        <Providers>
          <CustomCursor />
          <div className="spilled-paint-bg">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
          </div>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
