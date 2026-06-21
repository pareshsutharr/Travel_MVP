import { createClient } from '@/lib/supabase/server'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesStrip from './components/ServicesStrip'
import FeaturedDestinationSection from './components/FeaturedDestinationSection'
import PerfectAdventureSection from './components/PerfectAdventureSection'
import JourneyStartsSection from './components/JourneyStartsSection'
import JourneyHighlightsSection from './components/JourneyHighlightsSection'
import CounselSection from './components/CounselSection'
import TestimonialsSection from './components/TestimonialsSection'
import Footer from './components/Footer'
import type { Journey } from '@/types/database'

export default async function Home() {
  const supabase = await createClient()
  const { data: journeys } = await supabase
    .from('journeys')
    .select('*')
    .eq('status', 'published')
    .order('sort_order')

  return (
    <>
      <Navbar transparentOnTop />
      <main>
        <HeroSection />
        <ServicesStrip />
        <FeaturedDestinationSection />
        <PerfectAdventureSection />
        <JourneyStartsSection />
        <JourneyHighlightsSection journeys={(journeys as Journey[]) ?? []} />
        <CounselSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
