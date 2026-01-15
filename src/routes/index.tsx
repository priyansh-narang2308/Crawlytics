import HeroSection from '@/components/web/hero-section'
import FeaturesSection from '@/components/web/features-section'
import CTASection from '@/components/web/cta-section'
import Footer from '@/components/web/footer'
import { Navbar } from '@/components/web/navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
