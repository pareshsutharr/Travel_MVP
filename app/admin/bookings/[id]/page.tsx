import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, initials } from '@/lib/utils'
import BookingStatusActions from '@/app/components/admin/BookingStatusActions'
import AdminHighlightsPanel from '@/app/components/admin/AdminHighlightsPanel'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null; user: Profile | null; counsellor: Profile | null }

export default async function BookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('bookings')
    .select('*, journey:journeys(*), user:profiles!user_id(*), counsellor:profiles!counsellor_id(*)')
    .eq('id', id)
    .single()
  if (!data) notFound()
  const booking = data as BookingRow
  const costs = [
    ['Flights', 'Suggested across partner sites', booking.flight_cost],
    ['Stays', 'Boutique hotels and lodges', booking.stays_cost],
    ['Cabs', 'Airport, intercity and daily rides', booking.cabs_cost],
    ['Visa / passport help', `${booking.travelers} travellers`, booking.visa_cost],
    ['SIM + language assistance', 'On-arrival kit', booking.sim_cost],
    ['Insurance', 'Medical, delay, luggage', booking.insurance_cost],
    ['Guide booking', 'Destination manager optional', booking.guide_cost],
  ].filter((row) => row[2])

  return (
    <div className="max-w-6xl px-8 py-8">
      <Link href="/admin/bookings" className="mb-6 flex items-center gap-2 text-sm text-blue-slate hover:text-graphite"><ArrowLeft size={14} /> Bookings / {booking.ref}</Link>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-5">
          <div className="rounded-xl border border-pale-sky bg-platinum p-6">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-metallic-gold">{booking.journey?.category ?? booking.trip_type}</p>
            <h1 className="font-serif text-4xl text-graphite">{booking.journey?.title ?? 'Custom Solura Journey'}</h1>
            <p className="mt-2 text-sm text-blue-slate">{formatDate(booking.start_date)} -&gt; {formatDate(booking.end_date)} · {booking.travelers} travellers · {booking.trip_type}</p>
            <span className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span>
          </div>

          <div className="rounded-xl border border-pale-sky bg-platinum p-6">
            <h2 className="font-serif text-2xl text-graphite">One basket. <span className="italic text-metallic-gold">One tap.</span></h2>
            <div className="mt-4">
              {costs.map(([label, sub, amount]) => (
                <div key={String(label)} className="flex items-center justify-between border-b border-pale-sky py-3">
                  <div><p className="text-sm text-graphite">{label}</p><p className="text-xs text-blue-slate">{sub}</p></div>
                  <p className="text-sm text-graphite">{formatCurrency(Number(amount))}</p>
                </div>
              ))}
              <div className="flex items-center justify-between border-b border-pale-sky py-3 text-metallic-gold"><p className="text-sm">Bundle discount</p><p className="text-sm">-{formatCurrency(booking.discount)}</p></div>
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs uppercase tracking-widest text-blue-slate">Total · {booking.travelers} travellers</p>
                <p className="font-serif text-3xl text-graphite">{formatCurrency(booking.total_amount)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-pale-sky bg-platinum p-6">
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">GPS · Day {booking.current_day ?? '-'}</p>
            <h2 className="mt-1 font-serif text-2xl text-graphite">{booking.current_location ?? 'Awaiting departure'}</h2>
            <p className="mt-1 font-mono text-xs text-blue-slate">{booking.gps_lat ?? '-'}, {booking.gps_lng ?? '-'}</p>
          </div>

          {booking.journey_id && adminUser && (
            <AdminHighlightsPanel
              journeyId={booking.journey_id}
              adminUserId={adminUser.id}
              bookingId={booking.id}
            />
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Traveller</p>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pale-sky text-sm text-metallic-gold">{initials(booking.user?.full_name ?? booking.traveler_name)}</div>
              <div><p className="text-sm font-medium text-graphite">{booking.user?.full_name ?? booking.traveler_name}</p><p className="text-xs text-blue-slate">{booking.user?.email}</p></div>
            </div>
            <Link href={`/admin/customers/${booking.user_id}`} className="mt-4 block text-xs text-metallic-gold hover:underline">View profile -&gt;</Link>
          </div>
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Counsellor</p>
            <p className="text-sm text-graphite">{booking.counsellor?.full_name ?? 'Unassigned'}</p>
            <Link href="/admin/counsel" className="mt-2 block text-xs text-metallic-gold hover:underline">Open inbox -&gt;</Link>
          </div>
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Update status</p>
            <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
          </div>
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="mb-2 text-[10px] uppercase tracking-widest text-blue-slate">Notes</p>
            <p className="text-sm leading-relaxed text-blue-slate">{booking.notes ?? 'No notes yet.'}</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
