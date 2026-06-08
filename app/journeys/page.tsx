import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import JourneyCard from '@/app/components/JourneyCard'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { getJourneyImages } from '@/lib/travel-images'
import type { Journey } from '@/types/database'

const categories = ['all', 'spiritual', 'heritage', 'adventure', 'wellness']

export default async function JourneysPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const supabase = await createClient()
  let query = supabase.from('journeys').select('*').eq('status', 'published').order('sort_order')
  if (category && category !== 'all') query = query.eq('category', category)
  const { data } = await query
  const journeys = (data ?? []) as Journey[]

  return (
    <>
      <Navbar />
      <main className="bg-platinum px-4 sm:px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-metallic-gold">The Story Line</p>
          <h1 className="font-serif text-4xl sm:text-5xl text-graphite">Journeys, <span className="italic text-metallic-gold">not packages.</span></h1>
          <div className="my-8 flex gap-4 sm:gap-6 border-b border-pale-sky overflow-x-auto pb-px">
            {categories.map((item) => <Link key={item} href={item === 'all' ? '/journeys' : `/journeys?category=${item}`} className={`pb-3 text-sm capitalize whitespace-nowrap flex-shrink-0 ${(!category && item === 'all') || category === item ? 'border-b-2 border-metallic-gold text-metallic-gold' : 'text-blue-slate'}`}>{item}</Link>)}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => (
              <JourneyCard
                key={journey.id}
                tag={journey.category.toUpperCase()}
                images={journey.image_url ? [journey.image_url, ...getJourneyImages(journey).slice(0, 2)] : getJourneyImages(journey)}
                title={journey.title}
                details={`${journey.duration} days · ${journey.route}`}
                price={`from ${formatCurrency(journey.price_from)}`}
                href={`/journeys/${journey.slug}`}
                category={journey.category}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
