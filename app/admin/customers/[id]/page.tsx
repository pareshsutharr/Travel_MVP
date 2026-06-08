import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel, initials } from '@/lib/utils'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Pick<Journey, 'title' | 'duration' | 'route'> | null }

export default async function AdminCustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single()
  if (!profile) notFound()
  const customer = profile as Profile
  const { data } = await supabase.from('bookings').select('*, journey:journeys(title, duration, route)').eq('user_id', id).order('start_date', { ascending: false })
  const bookings = (data ?? []) as BookingRow[]
  const prefs = customer.preferences ?? {}
  const tags = Object.values(prefs).flat().filter(Boolean).map(String)

  return (
    <div className="max-w-6xl px-8 py-8">
      <Link href="/admin/customers" className="mb-6 flex items-center gap-2 text-sm text-blue-slate hover:text-graphite"><ArrowLeft size={14} /> Customers</Link>
      <div className="grid grid-cols-3 gap-6">
        <main className="col-span-2 space-y-5">
          <div className="rounded-xl border border-pale-sky bg-platinum p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pale-sky font-serif text-2xl text-metallic-gold">{initials(customer.full_name ?? customer.email)}</div>
              <div><h1 className="font-serif text-3xl text-graphite">{customer.full_name}</h1><p className="text-[10px] uppercase tracking-widest text-metallic-gold">Seeker · Since {new Date(customer.member_since).getFullYear()}</p><p className="mt-2 text-xs text-blue-slate">{customer.email} · {customer.phone ?? 'No phone'} · {customer.location ?? 'No location'}</p></div>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-4 border-t border-pale-sky pt-5 text-center">{[
              [customer.journeys_count, 'JOURNEYS'], [formatCurrency(customer.lifetime_value), 'LIFETIME VALUE'], [customer.cities_count, 'CITIES'], [customer.nps ?? '-', 'NPS'],
            ].map(([n, label]) => <div key={label}><p className="font-serif text-2xl text-graphite">{n}</p><p className="text-[10px] uppercase tracking-widest text-blue-slate">{label}</p></div>)}</div>
          </div>
          <div className="rounded-xl border border-pale-sky bg-platinum p-6">
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">Journeys</p>
            <h2 className="mb-4 font-serif text-xl text-graphite">{bookings.length} with Solura · {bookings.reduce((sum, booking) => sum + (booking.journey?.duration ?? 0), 0)} days total</h2>
            {bookings.map((booking) => <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="flex items-center justify-between border-t border-pale-sky py-4"><div><p className="text-sm font-medium text-graphite">{booking.journey?.title}</p><p className="text-xs text-blue-slate">{formatDate(booking.start_date)} · {booking.journey?.route}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span></Link>)}
          </div>
        </main>
        <aside className="space-y-4">
          <div className="rounded-xl border border-pale-sky bg-platinum p-5"><p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Travel preferences</p><div className="flex flex-wrap gap-2">{tags.length ? tags.map((tag) => <span key={tag} className="rounded-full bg-pale-sky px-3 py-1 text-xs capitalize text-graphite">{tag}</span>) : <p className="text-xs text-blue-slate">No preferences yet.</p>}</div></div>
          <div className="rounded-xl border border-pale-sky bg-platinum p-5"><p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Counsellor notes</p><p className="text-sm italic leading-relaxed text-blue-slate">Prefers early mornings, slower routes, small temples over famous ones, and one-click travel baskets with documents handled ahead of arrival.</p></div>
        </aside>
      </div>
    </div>
  )
}
