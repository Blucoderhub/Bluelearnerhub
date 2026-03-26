import type { Metadata, Viewport } from 'next'
import { DM_Sans, Plus_Jakarta_Sans, JetBrains_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import '../styles/animations.css'
import { Providers } from './providers'

const BASE_URL = 'https://bluelearnerhub.com'

// Optimize font loading - only load what we use
const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: false, // Only used in specific components
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0F' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'BlueLearnerHub — Free Coding Bootcamp for Indian Students',
    template: '%s | BlueLearnerHub',
  },
  description:
    'Learn Python, JavaScript, React, and System Design for FREE. AI-powered quizzes, weekly hackathons, verified certificates. Join 50,000+ Indian students landing tech jobs at Google, Amazon, and top startups.',
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
    title: 'BlueLearnerHub — Free Coding Bootcamp for Indian Students',
    description:
      'Learn Python, JavaScript, React, and System Design for FREE. AI-powered quizzes, weekly hackathons, verified certificates. Join 50,000+ Indian students.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BlueLearnerHub — Free Coding Bootcamp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bluelearnerhub',
    creator: '@bluelearnerhub',
    title: 'BlueLearnerHub — Free Coding Bootcamp',
    description:
      'Learn to code for FREE. AI-powered quizzes, hackathons, verified certificates.',
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
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${playfair.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:font-bold"
        >
          Skip to main content
        </a>
        <Providers>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
