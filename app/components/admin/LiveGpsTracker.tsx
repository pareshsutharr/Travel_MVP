'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Radio, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStatusColor, getStatusLabel } from '@/lib/utils'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & {
  journey: Pick<Journey, 'title' | 'duration'> | null
  user: Pick<Profile, 'full_name'> | null
}

export default function LiveGpsTracker({ initial }: { initial: BookingRow[] }) {
  const [bookings, setBookings] = useState<BookingRow[]>(initial)
  const [pulse, setPulse] = useState(false)
  const [filter, setFilter] = useState<'All' | 'India' | 'Nepal'>('All')

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('live-bookings')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'bookings' },
        (payload) => {
          setPulse(true)
          setTimeout(() => setPulse(false), 1200)
          setBookings((prev) =>
            prev.map((b) =>
              b.id === payload.new.id
                ? {
                    ...b,
                    current_location: payload.new.current_location,
                    current_day: payload.new.current_day,
                    gps_lat: payload.new.gps_lat,
                    gps_lng: payload.new.gps_lng,
                    status: payload.new.status,
                    sos_active: payload.new.sos_active,
                  }
                : b
            )
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const filtered = bookings.filter((b) => {
    if (filter === 'All') return true
    const loc = (b.current_location ?? '').toLowerCase()
    if (filter === 'Nepal') return loc.includes('nepal') || loc.includes('pokhara') || loc.includes('kathmandu') || loc.includes('lumbini')
    if (filter === 'India') return !loc.includes('nepal') && !loc.includes('pokhara') && !loc.includes('kathmandu')
    return true
  })

  return (
    <div className="col-span-2 bg-white border border-[#E8E3D9] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E8E3D9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-emerald-500 scale-150' : 'bg-emerald-400'} transition-all duration-300`} />
            <p className="text-[10px] tracking-widest text-[#9C9589] uppercase">LIVE · GPS · REALTIME</p>
          </div>
          <Radio size={13} className={`text-emerald-500 ${pulse ? 'opacity-100' : 'opacity-40'} transition-opacity`} />
        </div>
        <div className="flex gap-2">
          {(['All', 'India', 'Nepal'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${t === filter ? 'border-[#B89A4E] text-[#B89A4E] bg-[#F5F0E8]' : 'border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E8E3D9]">
            {['TRAVELLER', 'JOURNEY', 'WHERE NOW', 'DAY', 'COORDS', 'STATUS', ''].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest text-[#9C9589] uppercase font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((b) => (
            <tr key={b.id} className="border-b border-[#E8E3D9] last:border-0 hover:bg-[#FAFAF8] transition-colors">
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  {b.sos_active && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />}
                  <span className="text-sm font-medium text-[#1C1917]">{b.traveler_name}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-[#9C9589] max-w-[140px] truncate">{(b.journey as { title: string } | null)?.title}</td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-[#B89A4E] flex-shrink-0" />
                  <span className="text-sm text-[#1C1917]">{b.current_location ?? '—'}</span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-[#9C9589]">
                {b.current_day ? `${b.current_day} / ${(b.journey as { duration: number } | null)?.duration ?? '?'}` : '—'}
              </td>
              <td className="px-5 py-4 font-mono text-[10px] text-[#9C9589]">
                {b.gps_lat && b.gps_lng ? `${Number(b.gps_lat).toFixed(4)}, ${Number(b.gps_lng).toFixed(4)}` : '—'}
              </td>
              <td className="px-5 py-4">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(b.status)}`}>
                  {getStatusLabel(b.status)}
                </span>
              </td>
              <td className="px-5 py-4">
                <Link href={`/admin/bookings/${b.id}`} className="text-xs text-[#B89A4E] hover:underline whitespace-nowrap">
                  View →
                </Link>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="px-5 py-10 text-center text-sm text-[#9C9589]">
                No active travellers on the path
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
