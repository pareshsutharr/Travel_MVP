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
      <main className="bg-platinum pt-16">
        <section className="relative flex h-[280px] sm:h-[420px] items-end overflow-hidden p-5 sm:p-8">
          <img src={getJourneyImage(journey)} alt={journey.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-graphite/75 via-graphite/25 to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-widest text-platinum/80">{journey.category}</p>
            <h1 className="font-serif text-4xl sm:text-6xl text-platinum leading-tight">{journey.title}</h1>
            <p className="text-platinum/75">{journey.route}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 py-10 sm:py-14 lg:grid-cols-3">
          <article className="space-y-10 lg:col-span-2">
            <div><h2 className="font-serif text-3xl text-graphite">{journey.subtitle}</h2><p className="mt-4 leading-7 text-blue-slate">{journey.description}</p></div>
            <div><h3 className="mb-4 font-serif text-2xl text-graphite">Highlights</h3>{journey.highlights.map((item, index) => <p key={item} className="border-t border-pale-sky py-3 text-sm text-graphite"><span className="mr-4 font-serif text-xl text-metallic-gold">{index + 1}</span>{item}</p>)}</div>
            <div><h3 className="mb-4 font-serif text-2xl text-graphite">Day by day</h3>{journey.itinerary.map((day) => <div key={day.day} className="border-t border-pale-sky py-4"><p className="text-xs uppercase tracking-widest text-metallic-gold">{day.day}</p><h4 className="font-serif text-xl text-graphite">{day.place}</h4><p className="text-sm text-blue-slate">{day.stay}</p><p className="mt-2 text-sm leading-6 text-blue-slate">{day.notes}</p></div>)}</div>
            <div><h3 className="mb-4 font-serif text-2xl text-graphite">What's included</h3><div className="grid gap-2 sm:grid-cols-2">{journey.included.map((item) => <p key={item} className="text-sm text-graphite"><span className="text-metallic-gold">✓</span> {item}</p>)}</div></div>
            <div><h3 className="mb-4 font-serif text-2xl text-graphite">What travellers say</h3>{reviews.map((review) => <div key={review.id} className="mb-3 rounded-xl border border-pale-sky bg-platinum p-5"><p className="text-metallic-gold">{'★'.repeat(review.rating)}</p><p className="mt-2 font-serif text-xl italic text-graphite">"{review.content}"</p><p className="mt-2 text-xs text-blue-slate">{review.user?.full_name ?? 'Traveller'}</p></div>)}</div>
          </article>
          <aside className="lg:sticky lg:top-24 lg:self-start"><div className="rounded-xl border border-pale-sky bg-platinum p-6 shadow-sm"><p className="text-xs text-blue-slate">from</p><p className="font-serif text-5xl text-metallic-gold">{formatCurrency(journey.price_from)}</p><p className="mt-2 text-sm text-blue-slate">{journey.duration} days · {journey.route}</p><Link href={`/build/type?journey=${journey.slug}`} className="mt-6 block rounded-full bg-graphite px-5 py-3 text-center text-sm text-platinum hover:bg-metallic-gold">Begin this journey -&gt;</Link><Link href="/dashboard/counsel" className="mt-3 block text-center text-sm text-metallic-gold">Talk with Soma</Link><div className="mt-6 grid grid-cols-2 gap-2 text-xs text-blue-slate"><p>Flights</p><p>Stays</p><p>Cabs</p><p>Visa</p><p>SIM</p><p>Insurance</p></div></div></aside>
        </section>
      </main>
      <Footer />
    </>
  )
}
