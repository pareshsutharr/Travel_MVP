import Link from 'next/link'
import { Bell, Bot, Car, FileCheck2, Hotel, MapPinned, Plane, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import { getJourneyImage } from '@/lib/travel-images'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profileData } = user ? await supabase.from('profiles').select('*').eq('id', user.id).single() : { data: null }
  const profile = profileData as Profile | null
  const { data: bookingData } = user ? await supabase.from('bookings').select('*, journey:journeys(*)').eq('user_id', user.id).in('status', ['on_path', 'confirmed']).order('start_date').limit(1) : { data: [] }
  const active = ((bookingData ?? []) as BookingRow[])[0]
  const { data: journeysData } = await supabase.from('journeys').select('*').eq('status', 'published').order('sort_order').limit(5)
  const journeys = (journeysData ?? []) as Journey[]
  const managerName = profile?.preferences?.manager ?? 'Anika Rao'
  const recommendation = journeys.find((journey) => journey.category === 'spiritual') ?? journeys[0]

  return (
    <div className="px-8 py-8">
      <div className="mb-8 flex items-start justify-between"><div><p className="text-xs uppercase tracking-widest text-[#9C9589]">Namaste, {profile?.full_name?.split(' ')[0] ?? 'traveller'}</p><h1 className="font-serif text-4xl text-[#1C1917]">Where will the path <span className="italic text-[#B89A4E]">lead?</span></h1></div><Bell className="text-[#9C9589]" size={20} /></div>
      <div className="relative mb-6"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#9C9589]" size={16} /><input className="w-full rounded-full border border-[#E8E3D9] bg-white px-12 py-4 text-sm outline-none focus:border-[#B89A4E]" placeholder="Search a place, a feeling..." /><span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#B89A4E]">✦</span></div>
      {active && <Link href={`/dashboard/trips/${active.id}`} className="mb-8 block rounded-xl border border-[#B89A4E]/30 bg-[#F5F0E8] p-5"><p className="text-xs uppercase tracking-widest text-[#B89A4E]">{active.status === 'on_path' ? `Active · Day ${active.current_day}` : 'Upcoming'}</p><h2 className="font-serif text-2xl text-[#1C1917]">{active.journey?.title}</h2><p className="text-sm text-[#9C9589]">{active.journey?.duration} days · {active.journey?.route}</p><div className="mt-4 h-1.5 rounded-full bg-white"><div className="h-1.5 rounded-full bg-[#B89A4E]" style={{ width: `${Math.min(100, ((active.current_day ?? 1) / (active.journey?.duration ?? 1)) * 100)}%` }} /></div></Link>}
      <section className="mb-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[#B89A4E]"><Sparkles size={15} /> AI recommendation</div>
          <h2 className="font-serif text-2xl text-[#1C1917]">{recommendation?.title ?? 'The Slow Ganges'}</h2>
          <p className="mt-1 text-sm leading-6 text-[#9C9589]">Suggested from your spiritual pace, wishlist and previous travel style.</p>
          <Link href={recommendation ? `/journeys/${recommendation.slug}` : '/journeys'} className="mt-4 inline-flex text-sm text-[#B89A4E]">Open story -&gt;</Link>
        </div>
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[#B89A4E]"><MapPinned size={15} /> Destination manager</div>
          <h2 className="font-serif text-2xl text-[#1C1917]">{String(managerName)}</h2>
          <p className="mt-1 text-sm leading-6 text-[#9C9589]">Assigned according to your wishlist, preferences and active route.</p>
          <Link href="/dashboard/counsel" className="mt-4 inline-flex text-sm text-[#B89A4E]">Message manager -&gt;</Link>
        </div>
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-5">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-[#B89A4E]"><Bot size={15} /> One-click basket</div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-widest text-[#9C9589]">
            {[Plane, Hotel, Car, FileCheck2, ShieldCheck, MapPinned].map((Icon, index) => (
              <div key={index} className="rounded-lg bg-[#F5F0E8] py-3"><Icon className="mx-auto text-[#B89A4E]" size={15} /></div>
            ))}
          </div>
          <p className="mt-3 text-sm text-[#9C9589]">Flights, stays, cabs, visa, GPS and insurance inside one checkout.</p>
        </div>
      </section>
      <section><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl text-[#1C1917]">The Story Line</h2><Link href="/journeys" className="text-sm text-[#B89A4E]">See all -&gt;</Link></div><div className="flex gap-4 overflow-x-auto pb-2">{journeys.map((journey) => <Link key={journey.id} href={`/journeys/${journey.slug}`} className="w-72 shrink-0 overflow-hidden rounded-xl border border-[#E8E3D9] bg-white"><div className="relative h-36 overflow-hidden"><img src={getJourneyImage(journey)} alt={journey.title} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/55 to-transparent" /></div><div className="p-4"><p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">{journey.category}</p><h3 className="font-serif text-xl text-[#1C1917]">{journey.title}</h3><p className="text-xs text-[#9C9589]">{journey.duration} days · {formatCurrency(journey.price_from)}</p></div></Link>)}</div></section>
      <section className="mt-8"><h2 className="mb-4 font-serif text-xl text-[#1C1917]">Travel by feeling</h2><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{['Spiritual', 'Wellness', 'Heritage', 'Adventure'].map((item) => <Link key={item} href={`/journeys?category=${item.toLowerCase()}`} className="rounded-xl border border-[#E8E3D9] bg-white p-4 text-sm text-[#1C1917] hover:border-[#B89A4E]">{item}<span className="ml-2 text-xs text-[#9C9589]">· journeys</span></Link>)}</div></section>
    </div>
  )
}
