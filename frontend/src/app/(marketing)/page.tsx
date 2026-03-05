// src/app/(marketing)/page.tsx

import IsometricHero from '@/components/animations/IsometricHero'
import Features from '@/components/marketing/Features'
import HowItWorks from '@/components/marketing/HowItWorks'
import CallToAction from '@/components/marketing/CallToAction'

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* Hero Section with Isometric Animation */}
      <IsometricHero />



      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <HowItWorks />



      {/* Final CTA */}
      <CallToAction />
    </main>
  )
}
