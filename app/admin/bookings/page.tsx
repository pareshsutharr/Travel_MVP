import Link from 'next/link'
import { Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/utils'
import BookingsClient from '@/app/components/admin/BookingsClient'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null; user: Profile | null }

export default async function AdminBookings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('bookings')
    .select('*, journey:journeys(*), user:profiles!user_id(*)')
    .order('created_at', { ascending: false })
  const bookings = (data ?? []) as BookingRow[]
  const total = bookings.reduce((sum, booking) => sum + booking.total_amount, 0)

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-serif text-3xl text-graphite">{bookings.length} live · <span className="italic text-metallic-gold">{formatCurrency(total)} managed</span></h1>
        <Link href="/build/type" className="flex items-center gap-2 rounded-full bg-metallic-gold px-4 py-2 text-sm text-platinum hover:bg-metallic-gold"><Plus size={14} /> New booking</Link>
      </div>
      <BookingsClient bookings={bookings} />
    </div>
  )
}
