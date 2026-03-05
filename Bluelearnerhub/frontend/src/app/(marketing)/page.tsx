// src/app/(marketing)/page.tsx

import IsometricHero from '@/components/animations/IsometricHero'
import Features from '@/components/marketing/Features'
import HowItWorks from '@/components/marketing/HowItWorks'
import Stats from '@/components/marketing/Stats'
import Testimonials from '@/components/marketing/Testimonials'
import CallToAction from '@/components/marketing/CallToAction'

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {/* Hero Section with Isometric Animation */}
      <IsometricHero />
      
      {/* Stats Section */}
      <Stats 
        stats={[
          { label: 'Active Learners', value: '50,000+', icon: '👨‍💻' },
          { label: 'Coding Challenges', value: '10,000+', icon: '💡' },
          { label: 'Hackathons Hosted', value: '500+', icon: '🏆' },
          { label: 'Jobs Posted', value: '2,000+', icon: '💼' }
        ]}
      />
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Final CTA */}
      <CallToAction />
    </main>
  )
}
