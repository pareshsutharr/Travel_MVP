import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import type { Booking, Journey } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null }

export default async function TripsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = user ? await supabase.from('bookings').select('*, journey:journeys(*)').eq('user_id', user.id).order('start_date', { ascending: false }) : { data: [] }
  const bookings = (data ?? []) as BookingRow[]
  const active = bookings.find((booking) => booking.status === 'on_path')
  const upcoming = bookings.filter((booking) => ['confirmed', 'new', 'visa_hold'].includes(booking.status))
  const past = bookings.filter((booking) => booking.status === 'done')

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-serif text-3xl text-[#1C1917]">My Trips</h1>
      {!bookings.length && <div className="rounded-xl border border-[#E8E3D9] bg-white p-10 text-center"><h2 className="font-serif text-2xl text-[#1C1917]">No journeys yet.</h2><p className="mt-2 text-sm text-[#9C9589]">Let Soma plan your first.</p><Link href="/build/type" className="mt-5 inline-flex rounded-full bg-[#1C1917] px-6 py-3 text-sm text-white">Begin -&gt;</Link></div>}
      {active && <TripCard booking={active} title="Active now" highlight />}
      <Section title="Upcoming" bookings={upcoming} />
      <Section title="Past" bookings={past} />
    </div>
  )
}

function Section({ title, bookings }: { title: string; bookings: BookingRow[] }) {
  if (!bookings.length) return null
  return <section className="mt-8"><h2 className="mb-3 font-serif text-xl text-[#1C1917]">{title}</h2><div className="grid gap-4">{bookings.map((booking) => <TripCard key={booking.id} booking={booking} />)}</div></section>
}

function TripCard({ booking, title, highlight }: { booking: BookingRow; title?: string; highlight?: boolean }) {
  return <Link href={`/dashboard/trips/${booking.id}`} className={`block rounded-xl border p-5 ${highlight ? 'border-[#B89A4E]/30 bg-[#F5F0E8]' : 'border-[#E8E3D9] bg-white'}`}>{title && <p className="text-xs uppercase tracking-widest text-[#B89A4E]">{title} · Day {booking.current_day ?? '-'}</p>}<div className="mt-1 flex items-center justify-between"><div><h3 className="font-serif text-2xl text-[#1C1917]">{booking.journey?.title}</h3><p className="text-sm text-[#9C9589]">{formatDate(booking.start_date)} -&gt; {formatDate(booking.end_date)} · {booking.current_location ?? booking.journey?.route}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span></div></Link>
}
