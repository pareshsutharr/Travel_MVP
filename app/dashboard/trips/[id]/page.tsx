import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CircleDollarSign, Languages, MapPinned, MessageCircle, Phone, Shield, Utensils, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PulsingDot from '@/app/components/user/PulsingDot'
import { getJourneyImage } from '@/lib/travel-images'
import type { Booking, Journey } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null }

export default async function TripDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('bookings').select('*, journey:journeys(*)').eq('id', id).single()
  if (!data) notFound()
  const booking = data as BookingRow
  const day = booking.journey?.itinerary?.[(booking.current_day ?? 1) - 1] ?? booking.journey?.itinerary?.[0]

  return (
    <div>
      <div className="relative h-72 overflow-hidden bg-gradient-to-br from-blue-50 to-stone-100"><img src={getJourneyImage(booking.journey)} alt={booking.journey?.title ?? 'Active trip'} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/55 via-[#1C1917]/10 to-transparent" /><svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 700 260"><path d="M0 150 C130 60 210 230 360 130 S590 80 700 150" fill="none" stroke="#d8edf8" strokeWidth="16" strokeLinecap="round" /></svg><div className="absolute left-1/2 top-1/2"><PulsingDot /></div><div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-widest text-[#B89A4E]">GPS · Day {booking.current_day ?? 1} in {booking.current_location ?? 'India'}</div></div>
      <div className="px-8 py-8"><p className="text-xs uppercase tracking-widest text-[#9C9589]">Day {booking.current_day ?? 1}</p><h1 className="font-serif text-3xl text-[#1C1917]">{day?.place ?? booking.journey?.title}</h1><p className="mt-1 text-sm text-[#9C9589]">{day?.notes ?? 'Your day is ready.'}</p>
        <div className="mt-6 rounded-xl border border-[#E8E3D9] bg-white p-5">{['5:30 Boat at Assi Ghat', '6:30 Aarti with guide Rajesh', '9:00 Breakfast and rest', '11:00 Sarnath day trip'].map((item, index) => <div key={item} className="flex gap-4 border-b border-[#E8E3D9] py-3 last:border-0"><span className="font-mono text-xs text-[#9C9589]">{item.slice(0, 4)}</span><span className={`text-sm ${index === 1 ? 'text-[#B89A4E]' : 'text-[#1C1917]'}`}>{item.slice(5)}</span></div>)}</div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [MessageCircle, 'Counsel', 'Message Soma or your Solura counsellor.', '/dashboard/counsel'],
            [CircleDollarSign, '₹ / NPR / $', 'Live travel money conversion.', '/dashboard/documents'],
            [Shield, 'SOS', '24/7 emergency support and insurance help.', '/dashboard/counsel'],
            [Utensils, 'Eat', 'Food and lodge speciality recommendations.', '/dashboard/counsel'],
            [UserCheck, 'Guide', 'Local guide booking if needed.', '/dashboard/counsel'],
            [Languages, 'Language', 'SIM and language assistance.', '/dashboard/documents'],
            [MapPinned, 'Tracker', 'GPS visible to destination manager.', `/dashboard/trips/${booking.id}`],
            [Phone, 'Manager', 'Call your destination manager.', '/dashboard/counsel'],
          ].map(([Icon, label, copy, href]) => { const I = Icon as typeof MessageCircle; return <Link key={String(label)} href={String(href)} className="rounded-xl border border-[#E8E3D9] bg-white p-4 text-left text-sm text-[#1C1917] hover:border-[#B89A4E]"><I className="mb-2 text-[#B89A4E]" size={18} /><span className="block font-medium">{String(label)}</span><span className="mt-1 block text-xs leading-5 text-[#9C9589]">{String(copy)}</span></Link> })}
        </div>
        <div className="mt-5 rounded-xl border border-[#E8E3D9] bg-[#F5F0E8] p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">Destination manager note</p>
          <p className="mt-2 text-sm leading-6 text-[#1C1917]">
            Today is planned around low walking pressure, river timing, breakfast nearby, and guide availability. GPS is shared with the Solura desk for support.
          </p>
        </div>
      </div>
    </div>
  )
}
