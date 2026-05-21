'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { formatCurrency, formatShortDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null; user: Profile | null }
const STATUSES = ['all', 'new', 'confirmed', 'on_path', 'delayed', 'visa_hold', 'done', 'cancelled']

export default function BookingsClient({ bookings }: { bookings: BookingRow[] }) {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return bookings.filter((booking) => {
      const statusMatch = filter === 'all' || booking.status === filter
      const searchMatch = !q || booking.traveler_name.toLowerCase().includes(q) || booking.ref.toLowerCase().includes(q)
      return statusMatch && searchMatch
    })
  }, [bookings, filter, search])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${filter === status ? 'border-[#1C1917] bg-[#1C1917] text-white' : 'border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}
          >
            {status === 'all' ? 'All' : getStatusLabel(status)}
            <span className="ml-1 opacity-60">{status === 'all' ? bookings.length : bookings.filter((b) => b.status === status).length}</span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9589]" size={13} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-60 rounded-full border border-[#E8E3D9] bg-white py-2 pl-8 pr-4 text-xs text-[#1C1917] outline-none focus:border-[#B89A4E]"
            placeholder="Search ref or traveller..."
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
        <table className="w-full min-w-[640px]">
          <thead className="bg-[#FAFAF8]">
            <tr className="border-b border-[#E8E3D9]">
              {['REF', 'TRAVELLER', 'JOURNEY', 'DATES', 'VALUE', 'STATUS', ''].map((head) => (
                <th key={head} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id} className="border-b border-[#E8E3D9] last:border-0 hover:bg-[#FAFAF8]">
                <td className="px-5 py-4 font-mono text-xs text-[#9C9589]">{booking.ref}</td>
                <td className="px-5 py-4 text-sm font-medium text-[#1C1917]">{booking.traveler_name}</td>
                <td className="px-5 py-4 text-sm text-[#9C9589]">{booking.journey?.title ?? 'Custom journey'}</td>
                <td className="px-5 py-4 text-xs text-[#9C9589]">{formatShortDate(booking.start_date)} -&gt; {formatShortDate(booking.end_date)}</td>
                <td className="px-5 py-4 text-sm text-[#1C1917]">{formatCurrency(booking.total_amount)}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</span></td>
                <td className="px-5 py-4"><Link href={`/admin/bookings/${booking.id}`} className="text-xs text-[#B89A4E] hover:underline">View -&gt;</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
