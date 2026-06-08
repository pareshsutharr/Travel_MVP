import { createClient } from '@/lib/supabase/server'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ServicesStrip from './components/ServicesStrip'
import OneStopSolutionSection from './components/OneStopSolutionSection'
import StoryLineSection from './components/StoryLineSection'
import JourneyHighlightsSection from './components/JourneyHighlightsSection'
import HowItWorks from './components/HowItWorks'
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
      <Navbar />
      <main>
        <HeroSection />
        <ServicesStrip />
        <StoryLineSection journeys={(journeys as Journey[]) ?? []} />
        <OneStopSolutionSection />
        <JourneyHighlightsSection journeys={(journeys as Journey[]) ?? []} />
        <HowItWorks />
        <CounselSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
