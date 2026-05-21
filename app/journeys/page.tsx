import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, getCategoryColor } from '@/lib/utils'
import { getJourneyImage } from '@/lib/travel-images'
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
      <main className="bg-[#FAFAF8] px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-xs uppercase tracking-widest text-[#B89A4E]">The Story Line</p>
          <h1 className="font-serif text-5xl text-[#1C1917]">Journeys, <span className="italic text-[#B89A4E]">not packages.</span></h1>
          <div className="my-8 flex gap-6 border-b border-[#E8E3D9]">
            {categories.map((item) => <Link key={item} href={item === 'all' ? '/journeys' : `/journeys?category=${item}`} className={`pb-3 text-sm capitalize ${(!category && item === 'all') || category === item ? 'border-b-2 border-[#B89A4E] text-[#B89A4E]' : 'text-[#9C9589]'}`}>{item}</Link>)}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {journeys.map((journey) => <Link key={journey.id} href={`/journeys/${journey.slug}`} className="overflow-hidden rounded-xl border border-[#E8E3D9] bg-white hover:border-[#B89A4E]">
              <div className="relative flex h-48 items-end overflow-hidden p-4">
                <img src={getJourneyImage(journey)} alt={journey.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/65 via-[#1C1917]/10 to-transparent" />
                <p className="relative text-xs uppercase tracking-widest text-white/85">{journey.category} · {journey.title}</p>
              </div>
              <div className="p-5"><p className={`mb-2 text-xs uppercase tracking-widest ${getCategoryColor(journey.category)}`}>{journey.category}</p><h2 className="font-serif text-2xl text-[#1C1917]">{journey.title}</h2><p className="mt-1 text-sm text-[#9C9589]">{journey.duration} days · {journey.route}</p><div className="mt-4 flex items-center justify-between"><span className="text-sm text-[#B89A4E]">from {formatCurrency(journey.price_from)}</span><span className="text-sm text-[#B89A4E]">Read -&gt;</span></div></div>
            </Link>)}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
