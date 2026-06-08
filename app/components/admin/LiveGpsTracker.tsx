'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, Radio, AlertTriangle, Navigation } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getStatusColor, getStatusLabel } from '@/lib/utils'
import type { Booking, Journey, Profile } from '@/types/database'
import type { MapMarker } from '@/app/components/SoluraMap'

const SoluraMap = dynamic(() => import('@/app/components/SoluraMap'), { ssr: false })

type BookingRow = Booking & {
  journey: Pick<Journey, 'title' | 'duration'> | null
  user: Pick<Profile, 'full_name'> | null
}

export default function LiveGpsTracker({ initial }: { initial: BookingRow[] }) {
  const [bookings, setBookings] = useState<BookingRow[]>(initial)
  const [pulse, setPulse] = useState(false)
  const [filter, setFilter] = useState<'All' | 'India' | 'Nepal'>('All')
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [focusCenter, setFocusCenter] = useState<{ lat: number; lng: number } | null>(null)

  // Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel('live-bookings')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings' }, (payload) => {
        setPulse(true)
        setTimeout(() => setPulse(false), 1200)
        setBookings((prev) =>
          prev.map((b) =>
            b.id === payload.new.id
              ? { ...b, current_location: payload.new.current_location, current_day: payload.new.current_day, gps_lat: payload.new.gps_lat, gps_lng: payload.new.gps_lng, status: payload.new.status, sos_active: payload.new.sos_active }
              : b
          )
        )
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const filtered = bookings.filter((b) => {
    if (filter === 'All') return true
    const loc = (b.current_location ?? '').toLowerCase()
    if (filter === 'Nepal') return loc.includes('nepal') || loc.includes('pokhara') || loc.includes('kathmandu') || loc.includes('lumbini')
    if (filter === 'India') return !loc.includes('nepal') && !loc.includes('pokhara') && !loc.includes('kathmandu')
    return true
  })

  const mapMarkers = useMemo<MapMarker[]>(() =>
    filtered
      .filter((b) => b.gps_lat && b.gps_lng)
      .map((b) => ({
        lat: Number(b.gps_lat),
        lng: Number(b.gps_lng),
        title: b.traveler_name,
        type: b.sos_active ? 'sos' : (focusedId === b.id ? 'live' : 'normal'),
        info: `${b.current_location ?? '—'} · ${(b.journey as { title: string } | null)?.title ?? ''} · Day ${b.current_day ?? '?'}`,
      })),
  [filtered, focusedId])

  function focusBooking(b: BookingRow) {
    setFocusedId(b.id)
    if (b.gps_lat && b.gps_lng) {
      setFocusCenter({ lat: Number(b.gps_lat), lng: Number(b.gps_lng) })
    }
  }

  const hasMapData = mapMarkers.length > 0

  return (
    <div className="col-span-2 bg-platinum border border-pale-sky rounded-xl overflow-hidden">

      {/* Map — always show, with placeholder when no GPS data */}
      <div className="relative border-b border-pale-sky" style={{ height: 300 }}>
        {hasMapData ? (
          <SoluraMap
            markers={mapMarkers}
            focusCenter={focusCenter}
            zoom={5}
            height="300px"
            className="rounded-none"
            onMarkerClick={(m) => {
              const b = filtered.find((bk) => bk.traveler_name === m.title && bk.gps_lat && Number(bk.gps_lat) === m.lat)
              if (b) setFocusedId(b.id)
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-pale-sky">
            <div className="text-center">
              <Navigation size={24} className="mx-auto mb-2 text-blue-slate" />
              <p className="text-sm text-blue-slate">No live GPS signals yet</p>
              <p className="text-xs text-blue-slate/70 mt-1">Markers appear here when travellers share location</p>
            </div>
          </div>
        )}

        {/* Map legend */}
        {hasMapData && (
          <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-full bg-platinum/90 px-3 py-1.5 text-[10px] shadow-sm">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-metallic-gold" />Active</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-danger" />SOS</span>
            <span className="text-blue-slate">Click marker or row to focus</span>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="px-6 py-4 border-b border-pale-sky flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${pulse ? 'bg-success scale-150' : 'bg-success'}`} />
          <Radio size={13} className={`text-success transition-opacity ${pulse ? 'opacity-100' : 'opacity-40'}`} />
          <p className="text-[10px] tracking-widest text-blue-slate uppercase">Live · GPS · Realtime</p>
          {focusedId && (
            <button onClick={() => { setFocusedId(null); setFocusCenter(null) }} className="text-[10px] text-metallic-gold hover:underline">
              Clear focus
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(['All', 'India', 'Nepal'] as const).map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${t === filter ? 'border-metallic-gold text-metallic-gold bg-pale-sky' : 'border-pale-sky text-blue-slate hover:border-metallic-gold'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-pale-sky">
              {['TRAVELLER', 'JOURNEY', 'WHERE NOW', 'DAY', 'COORDS', 'STATUS', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] tracking-widest text-blue-slate uppercase font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.id}
                onClick={() => focusBooking(b)}
                className={`border-b border-pale-sky last:border-0 cursor-pointer transition-colors ${
                  focusedId === b.id ? 'bg-pale-sky' : 'hover:bg-platinum'
                }`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {b.sos_active && <AlertTriangle size={13} className="text-danger flex-shrink-0 animate-pulse" />}
                    <span className="text-sm font-medium text-graphite">{b.traveler_name}</span>
                    {focusedId === b.id && <span className="text-[9px] text-metallic-gold uppercase tracking-wide">· focused</span>}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-blue-slate max-w-[140px] truncate">
                  {(b.journey as { title: string } | null)?.title}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className="text-metallic-gold flex-shrink-0" />
                    <span className="text-sm text-graphite">{b.current_location ?? '—'}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-blue-slate">
                  {b.current_day ? `${b.current_day} / ${(b.journey as { duration: number } | null)?.duration ?? '?'}` : '—'}
                </td>
                <td className="px-5 py-4 font-mono text-[10px] text-blue-slate">
                  {b.gps_lat && b.gps_lng ? `${Number(b.gps_lat).toFixed(4)}, ${Number(b.gps_lng).toFixed(4)}` : '—'}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(b.status)}`}>
                    {getStatusLabel(b.status)}
                  </span>
                </td>
                <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                  <Link href={`/admin/bookings/${b.id}`} className="text-xs text-metallic-gold hover:underline whitespace-nowrap">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-sm text-blue-slate">
                  No active travellers on the path
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
