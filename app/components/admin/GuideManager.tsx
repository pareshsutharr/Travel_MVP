'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Guide, GuideBooking } from '@/types/database'

type GuideBookingRow = GuideBooking & { guide: Guide | null }

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600',
  confirmed: 'bg-emerald-50 text-emerald-600',
  cancelled: 'bg-red-50 text-red-500',
}

export default function GuideManager({ guides, bookings }: { guides: Guide[]; bookings: GuideBookingRow[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<'guides' | 'requests'>('guides')
  const [saving, setSaving] = useState('')

  async function toggleAvailability(guide: Guide) {
    setSaving(guide.id)
    const supabase = createClient()
    await supabase.from('guides').update({ is_available: !guide.is_available }).eq('id', guide.id)
    setSaving('')
    router.refresh()
  }

  async function toggleFeatured(guide: Guide) {
    setSaving(guide.id)
    const supabase = createClient()
    await supabase.from('guides').update({ is_featured: !guide.is_featured }).eq('id', guide.id)
    setSaving('')
    router.refresh()
  }

  async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled') {
    setSaving(bookingId)
    const supabase = createClient()
    await supabase.from('guide_bookings').update({ status }).eq('id', bookingId)
    setSaving('')
    router.refresh()
  }

  return (
    <div>
      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl bg-[#F5F0E8] p-1 w-fit">
        {(['guides', 'requests'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-xs capitalize transition-colors ${tab === t ? 'bg-white text-[#1C1917] shadow-sm' : 'text-[#9C9589]'}`}
          >
            {t === 'requests' ? `Booking requests ${bookings.filter(b => b.status === 'pending').length > 0 ? `(${bookings.filter(b => b.status === 'pending').length})` : ''}` : 'Guides'}
          </button>
        ))}
      </div>

      {tab === 'guides' && (
        <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
          <table className="w-full min-w-[700px]">
            <thead className="bg-[#FAFAF8]">
              <tr>
                {['GUIDE', 'LOCATION', 'SPECIALIZATIONS', 'RATING', 'PRICE/DAY', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guides.map((g) => (
                <tr key={g.id} className="border-t border-[#E8E3D9] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-[#1C1917]">{g.name}</p>
                    <p className="text-xs text-[#9C9589]">{g.languages.join(', ')}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#9C9589]">{g.location}, {g.country}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {g.specializations.map((s) => (
                        <span key={s} className="rounded-full bg-[#F5F0E8] px-2 py-0.5 text-[9px] capitalize text-[#B89A4E]">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-[#B89A4E] fill-[#B89A4E]" />
                      <span className="text-sm text-[#1C1917]">{g.rating}</span>
                      <span className="text-xs text-[#9C9589]">({g.review_count})</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#1C1917]">${g.price_per_day}</td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <span className={`block rounded-full px-2 py-0.5 text-center text-[10px] ${g.is_available ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {g.is_available ? 'Available' : 'Unavailable'}
                      </span>
                      {g.is_featured && <span className="block rounded-full bg-[#F5F0E8] px-2 py-0.5 text-center text-[10px] text-[#B89A4E]">Featured</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleAvailability(g)}
                        disabled={saving === g.id}
                        className="rounded-full border border-[#E8E3D9] px-3 py-1 text-xs text-[#1C1917] hover:border-[#B89A4E] disabled:opacity-40"
                      >
                        {g.is_available ? 'Mark unavail.' : 'Mark avail.'}
                      </button>
                      <button
                        onClick={() => toggleFeatured(g)}
                        disabled={saving === g.id}
                        className="rounded-full border border-[#E8E3D9] px-3 py-1 text-xs text-[#9C9589] hover:border-[#B89A4E] disabled:opacity-40"
                      >
                        {g.is_featured ? 'Unfeature' : 'Feature'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'requests' && (
        <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
          <table className="w-full min-w-[600px]">
            <thead className="bg-[#FAFAF8]">
              <tr>
                {['GUIDE', 'DATES', 'DAYS', 'AMOUNT', 'NOTES', 'STATUS', 'ACTIONS'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-[#E8E3D9] hover:bg-[#FAFAF8]">
                  <td className="px-5 py-4 text-sm font-medium text-[#1C1917]">{b.guide?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-xs text-[#9C9589]">{b.start_date}</td>
                  <td className="px-5 py-4 text-sm text-[#1C1917]">{b.days}</td>
                  <td className="px-5 py-4 text-sm text-[#1C1917]">${b.amount_usd}</td>
                  <td className="px-5 py-4 text-xs text-[#9C9589] max-w-[150px] truncate">{b.notes ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] capitalize ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          disabled={saving === b.id}
                          className="rounded-full bg-emerald-600 px-3 py-1 text-xs text-white hover:bg-emerald-700 disabled:opacity-40"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'cancelled')}
                          disabled={saving === b.id}
                          className="rounded-full border border-[#E8E3D9] px-3 py-1 text-xs text-red-500 hover:border-red-300 disabled:opacity-40"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-[#9C9589]">No guide booking requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
