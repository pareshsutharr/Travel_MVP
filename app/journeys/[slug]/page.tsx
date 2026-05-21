import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { getJourneyImage } from '@/lib/travel-images'
import type { Journey, Review } from '@/types/database'

export default async function JourneyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('journeys').select('*').eq('slug', slug).single()
  if (!data) notFound()
  const journey = data as Journey
  const { data: reviewRows } = await supabase.from('reviews').select('*, user:profiles(full_name)').eq('journey_id', journey.id).limit(3)
  const reviews = (reviewRows ?? []) as (Review & { user?: { full_name: string | null } | null })[]

  return (
    <>
      <Navbar />
      <main className="bg-[#FAFAF8] pt-16">
        <section className="relative flex h-[280px] sm:h-[420px] items-end overflow-hidden p-5 sm:p-8">
          <img src={getJourneyImage(journey)} alt={journey.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-[#1C1917]/25 to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-widest text-white/80">{journey.category}</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-white leading-tight">{journey.title}</h1>
            <p className="text-white/75">{journey.route}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 py-10 sm:py-14 lg:grid-cols-3">
          <article className="space-y-10 lg:col-span-2">
            <div><h2 className="font-serif text-3xl text-[#1C1917]">{journey.subtitle}</h2><p className="mt-4 leading-7 text-[#6f6a61]">{journey.description}</p></div>
            <div><h3 className="mb-4 font-serif text-2xl text-[#1C1917]">Highlights</h3>{journey.highlights.map((item, index) => <p key={item} className="border-t border-[#E8E3D9] py-3 text-sm text-[#1C1917]"><span className="mr-4 font-serif text-xl text-[#B89A4E]">{index + 1}</span>{item}</p>)}</div>
            <div><h3 className="mb-4 font-serif text-2xl text-[#1C1917]">Day by day</h3>{journey.itinerary.map((day) => <div key={day.day} className="border-t border-[#E8E3D9] py-4"><p className="text-xs uppercase tracking-widest text-[#B89A4E]">{day.day}</p><h4 className="font-serif text-xl text-[#1C1917]">{day.place}</h4><p className="text-sm text-[#9C9589]">{day.stay}</p><p className="mt-2 text-sm leading-6 text-[#6f6a61]">{day.notes}</p></div>)}</div>
            <div><h3 className="mb-4 font-serif text-2xl text-[#1C1917]">What's included</h3><div className="grid gap-2 sm:grid-cols-2">{journey.included.map((item) => <p key={item} className="text-sm text-[#1C1917]"><span className="text-[#B89A4E]">✓</span> {item}</p>)}</div></div>
            <div><h3 className="mb-4 font-serif text-2xl text-[#1C1917]">What travellers say</h3>{reviews.map((review) => <div key={review.id} className="mb-3 rounded-xl border border-[#E8E3D9] bg-white p-5"><p className="text-[#B89A4E]">{'★'.repeat(review.rating)}</p><p className="mt-2 font-serif text-xl italic text-[#1C1917]">"{review.content}"</p><p className="mt-2 text-xs text-[#9C9589]">{review.user?.full_name ?? 'Traveller'}</p></div>)}</div>
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start"><div className="rounded-xl border border-[#E8E3D9] bg-white p-6 shadow-sm"><p className="text-xs text-[#9C9589]">from</p><p className="font-serif text-5xl text-[#B89A4E]">{formatCurrency(journey.price_from)}</p><p className="mt-2 text-sm text-[#9C9589]">{journey.duration} days · {journey.route}</p><Link href={`/build/type?journey=${journey.slug}`} className="mt-6 block rounded-full bg-[#1C1917] px-5 py-3 text-center text-sm text-white hover:bg-[#B89A4E]">Begin this journey -&gt;</Link><Link href="/dashboard/counsel" className="mt-3 block text-center text-sm text-[#B89A4E]">Talk with Soma</Link><div className="mt-6 grid grid-cols-2 gap-2 text-xs text-[#9C9589]"><p>Flights</p><p>Stays</p><p>Cabs</p><p>Visa</p><p>SIM</p><p>Insurance</p></div></div></aside>
        </section>
      </main>
      <Footer />
    </>
  )
}
