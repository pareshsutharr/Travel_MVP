import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CircleDollarSign, Languages, MapPinned, MessageCircle,
  Phone, Shield, Utensils, UserCheck, AlertTriangle, Plane, Hotel,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PulsingDot from '@/app/components/user/PulsingDot'
import { getJourneyImage } from '@/lib/travel-images'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null; counsellor: Profile | null }

export default async function TripDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('*, journey:journeys(*), counsellor:profiles!bookings_counsellor_id_fkey(*)')
    .eq('id', id)
    .single()
  if (!data) notFound()
  const booking = data as BookingRow
  const day = booking.journey?.itinerary?.[(booking.current_day ?? 1) - 1] ?? booking.journey?.itinerary?.[0]

  const quickLinks = [
    [MessageCircle, 'Soma',     'Message your AI counsellor.',              '/dashboard/counsel'],
    [CircleDollarSign, '₹ / NPR', 'Currency conversion for India & Nepal.', '/dashboard/documents'],
    [Shield,       'Insurance',  'Coverage details and claims.',            '/dashboard/documents'],
    [Utensils,     'Food',       'Local food & lodge recommendations.',     '/dashboard/food'],
    [UserCheck,    'Guide',      'Book a local guide for your route.',      '/dashboard/guides'],
    [Plane,        'Flights',    'View flight options for your journey.',   '/dashboard/flights'],
    [Hotel,        'Hotels',     'Stay suggestions by city.',               '/dashboard/hotels'],
    [Languages,    'Language',   'SIM card & language assistance.',         '/dashboard/documents'],
    [MapPinned,    'GPS',        'Live tracker visible to Solura desk.',    `/dashboard/trips/${booking.id}`],
    [Phone,        'Manager',    'Call your destination manager.',          '/dashboard/counsel'],
  ] as const

  return (
    <div>
      {/* GPS hero */}
      <div className="relative h-52 sm:h-72 overflow-hidden bg-gradient-to-br from-blue-50 to-stone-100">
        <img src={getJourneyImage(booking.journey)} alt={booking.journey?.title ?? 'Active trip'} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/55 via-[#1C1917]/10 to-transparent" />
        <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 700 260">
          <path d="M0 150 C130 60 210 230 360 130 S590 80 700 150" fill="none" stroke="#d8edf8" strokeWidth="14" strokeLinecap="round" />
        </svg>
        <div className="absolute left-1/2 top-1/2">
          <PulsingDot />
        </div>
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-widest text-[#B89A4E]">
          GPS · Day {booking.current_day ?? 1} in {booking.current_location ?? 'India'}
        </div>
        {booking.sos_active && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs text-white">
            <AlertTriangle size={12} />
            SOS Active
          </div>
        )}
      </div>

      <div className="px-4 sm:px-8 py-6 sm:py-8">
        {/* Day header */}
        <p className="text-xs uppercase tracking-widest text-[#9C9589]">Day {booking.current_day ?? 1}</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">{day?.place ?? booking.journey?.title}</h1>
        <p className="mt-1 text-sm text-[#9C9589]">{day?.notes ?? 'Your day is ready.'}</p>

        {/* Today's schedule */}
        <div className="mt-5 rounded-xl border border-[#E8E3D9] bg-white p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">Today's schedule</p>
          {['5:30 Boat at Assi Ghat', '6:30 Aarti with guide', '9:00 Breakfast and rest', '11:00 Sarnath day trip'].map((item, index) => (
            <div key={item} className="flex gap-4 border-b border-[#E8E3D9] py-3 last:border-0">
              <span className="font-mono text-xs text-[#9C9589] w-10 shrink-0">{item.slice(0, 4)}</span>
              <span className={`text-sm ${index === 1 ? 'text-[#B89A4E] font-medium' : 'text-[#1C1917]'}`}>{item.slice(5)}</span>
            </div>
          ))}
        </div>

        {/* Quick links grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {quickLinks.map(([Icon, label, copy, href]) => {
            const I = Icon as typeof MessageCircle
            return (
              <Link key={String(label)} href={String(href)}
                className="rounded-xl border border-[#E8E3D9] bg-white p-4 text-left hover:border-[#B89A4E] transition-colors">
                <I className="mb-2 text-[#B89A4E]" size={18} />
                <span className="block text-sm font-medium text-[#1C1917]">{String(label)}</span>
                <span className="mt-1 block text-xs leading-4 text-[#9C9589]">{String(copy)}</span>
              </Link>
            )
          })}
        </div>

        {/* SOS shortcut */}
        <Link href="/dashboard/sos"
          className="mt-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 hover:border-red-400 transition-colors">
          <AlertTriangle size={18} className="text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-600">Emergency SOS</p>
            <p className="text-xs text-red-400">24×7 Solura support line · tap to alert the desk</p>
          </div>
          <span className="ml-auto text-xs text-red-400">→</span>
        </Link>

        {/* Counsellor / Destination manager */}
        {booking.counsellor && (
          <div className="mt-5 rounded-xl border border-[#E8E3D9] bg-[#F5F0E8] p-5">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-[#B89A4E]">Your destination manager</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B89A4E]/20 font-serif text-lg text-[#B89A4E]">
                {booking.counsellor.full_name?.charAt(0) ?? 'S'}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1C1917]">{booking.counsellor.full_name}</p>
                <p className="text-xs text-[#9C9589]">{booking.counsellor.email}</p>
              </div>
              <Link href="/dashboard/counsel" className="ml-auto text-xs text-[#B89A4E] hover:underline">Message →</Link>
            </div>
          </div>
        )}

        {/* Manager note */}
        <div className="mt-4 rounded-xl border border-[#E8E3D9] bg-white p-5">
          <p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">Destination manager note</p>
          <p className="mt-2 text-sm leading-6 text-[#1C1917]">
            Today is planned around low walking pressure, river timing, breakfast nearby, and guide availability.
            GPS is shared with the Solura desk for continuous support.
          </p>
        </div>
      </div>
    </div>
  )
}
