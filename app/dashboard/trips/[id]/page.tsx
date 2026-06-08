import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  CircleDollarSign, Languages, MapPinned, MessageCircle,
  Phone, Shield, Utensils, UserCheck, AlertTriangle, Plane, Hotel, Car,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import TripMapSection from '@/app/components/user/TripMapSection'
import TripRoutePanel from '@/app/components/user/TripRoutePanel'
import TripHighlights from '@/app/components/user/TripHighlights'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null; counsellor: Profile | null }

export default async function TripDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('bookings')
    .select('*, journey:journeys(*), counsellor:profiles!bookings_counsellor_id_fkey(*)')
    .eq('id', id)
    .single()
  if (!data) notFound()
  const booking = data as BookingRow

  const currentDayNum = booking.current_day ?? 1
  const itinerary = booking.journey?.itinerary ?? []
  const day = itinerary[currentDayNum - 1] ?? itinerary[0]
  const totalDays = booking.journey?.duration ?? itinerary.length

  const quickLinks = [
    [MessageCircle,    'Soma',       'Message your AI counsellor.',           '/dashboard/counsel'],
    [CircleDollarSign, '₹ / NPR',   'Currency conversion for India & Nepal.', '/dashboard/documents'],
    [Shield,           'Insurance',  'Coverage details and claims.',           '/dashboard/documents'],
    [Utensils,         'Food',       'Local food & lodge recommendations.',    '/dashboard/food'],
    [UserCheck,        'Guide',      'Book a local guide for your route.',     '/dashboard/guides'],
    [Plane,            'Flights',    'View flight options for your journey.',  '/dashboard/flights'],
    [Hotel,            'Hotels',     'Stay suggestions by city.',              '/dashboard/hotels'],
    [Car,              'Cab',        'On-demand cab arrangement.',             '/dashboard/cab'],
    [Languages,        'Language',   'SIM card & language assistance.',        '/dashboard/documents'],
    [MapPinned,        'GPS',        'Live tracker visible to Solura desk.',   `/dashboard/trips/${booking.id}`],
  ] as const

  return (
    <div>
      {/* Live GPS map with journey route */}
      <TripMapSection
        bookingId={booking.id}
        initialLat={booking.gps_lat ? Number(booking.gps_lat) : null}
        initialLng={booking.gps_lng ? Number(booking.gps_lng) : null}
        initialLocation={booking.current_location}
        journeyTitle={booking.journey?.title}
        journeyRoute={booking.journey?.route}
        currentDay={currentDayNum}
        totalDays={totalDays}
        sosActive={booking.sos_active}
        itinerary={itinerary}
      />

      <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-5">

        {/* Day header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-slate">
            Day {currentDayNum} of {totalDays}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl text-graphite">
            {day?.place ?? booking.journey?.title}
          </h1>
          {day?.notes && (
            <p className="mt-1 text-sm text-blue-slate">{day.notes}</p>
          )}
        </div>

        {/* Trip Highlights — Instagram-style story circles */}
        {user && booking.journey_id && (
          <TripHighlights
            bookingId={booking.id}
            journeyId={booking.journey_id}
            userId={user.id}
            totalDays={totalDays}
          />
        )}

        {/* Journey route panel */}
        {itinerary.length > 0 && (
          <TripRoutePanel
            itinerary={itinerary}
            currentDay={currentDayNum}
            totalDays={totalDays}
            journeyTitle={booking.journey?.title ?? 'Your journey'}
          />
        )}

        {/* Today's schedule — from itinerary or placeholder */}
        <div className="rounded-xl border border-pale-sky bg-platinum p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Today's schedule</p>
          {day?.notes ? (
            <p className="text-sm text-graphite leading-6">{day.notes}</p>
          ) : (
            <p className="text-sm text-blue-slate italic">Your Solura counsellor will share today's detailed schedule.</p>
          )}
          {day?.stay && (
            <div className="mt-3 pt-3 border-t border-pale-sky flex items-center gap-2">
              <Hotel size={13} className="text-metallic-gold" />
              <span className="text-xs text-blue-slate">Stay: <span className="text-graphite">{day.stay}</span></span>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {quickLinks.map(([Icon, label, copy, href]) => {
            const I = Icon as typeof MessageCircle
            return (
              <Link key={String(label)} href={String(href)}
                className="rounded-xl border border-pale-sky bg-platinum p-4 text-left hover:border-metallic-gold transition-colors">
                <I className="mb-2 text-metallic-gold" size={18} />
                <span className="block text-sm font-medium text-graphite">{String(label)}</span>
                <span className="mt-1 block text-xs leading-4 text-blue-slate">{String(copy)}</span>
              </Link>
            )
          })}
        </div>

        {/* SOS shortcut */}
        <Link href="/dashboard/sos"
          className="flex items-center gap-3 rounded-xl border border-danger bg-status-soft px-5 py-4 hover:border-danger transition-colors">
          <AlertTriangle size={18} className="text-danger shrink-0" />
          <div>
            <p className="text-sm font-medium text-danger">Emergency SOS</p>
            <p className="text-xs text-danger">24×7 Solura support line · tap to alert the desk</p>
          </div>
          <span className="ml-auto text-xs text-danger">→</span>
        </Link>

        {/* Destination manager */}
        {booking.counsellor && (
          <div className="rounded-xl border border-pale-sky bg-pale-sky p-5">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-metallic-gold">Your destination manager</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-metallic-gold/20 font-serif text-lg text-metallic-gold">
                {booking.counsellor.full_name?.charAt(0) ?? 'S'}
              </div>
              <div>
                <p className="text-sm font-medium text-graphite">{booking.counsellor.full_name}</p>
                <p className="text-xs text-blue-slate">{booking.counsellor.email}</p>
              </div>
              <Link href="/dashboard/counsel" className="ml-auto text-xs text-metallic-gold hover:underline">
                Message →
              </Link>
            </div>
          </div>
        )}

        {/* Manager note */}
        <div className="rounded-xl border border-pale-sky bg-platinum p-5">
          <p className="text-[10px] uppercase tracking-widest text-metallic-gold">Destination manager note</p>
          <p className="mt-2 text-sm leading-6 text-graphite">
            Your GPS is live-shared with the Solura operations desk.
            {day?.place ? ` Today you are in ${day.place}.` : ''}{' '}
            Any changes to today's plan will come through the Soma chat.
          </p>
        </div>
      </div>
    </div>
  )
}
