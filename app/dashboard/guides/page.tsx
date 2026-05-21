'use client'

import { useEffect, useState } from 'react'
import { Star, MessageCircle, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import GuideBookingForm from '@/app/components/user/GuideBookingForm'
import type { Guide, GuideBooking } from '@/types/database'

const SPEC_COLOR: Record<string, string> = {
  spiritual: 'bg-amber-50 text-amber-700',
  heritage: 'bg-blue-50 text-blue-600',
  adventure: 'bg-emerald-50 text-emerald-700',
  wellness: 'bg-purple-50 text-purple-600',
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [myBookings, setMyBookings] = useState<GuideBooking[]>([])
  const [userId, setUserId] = useState('')
  const [selected, setSelected] = useState<Guide | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      supabase.from('guides').select('*').order('is_featured', { ascending: false }).order('rating', { ascending: false }).then(({ data: g }) => setGuides((g ?? []) as Guide[]))
      supabase.from('guide_bookings').select('*, guide:guides(*)').eq('user_id', data.user.id).then(({ data: b }) => setMyBookings((b ?? []) as GuideBooking[]))
    })
  }, [])

  const specs = ['all', 'spiritual', 'heritage', 'adventure', 'wellness']

  const filtered = guides.filter((g) =>
    filter === 'all' || g.specializations.includes(filter)
  )

  const bookedGuideIds = new Set(myBookings.map((b) => b.guide_id))

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#B89A4E]">Travel basket</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
          Local <span className="italic text-[#B89A4E]">guides.</span>
        </h1>
        <p className="mt-1 text-sm text-[#9C9589]">
          Handpicked local guides for spiritual circuits, heritage walks and Himalayan treks across India and Nepal.
        </p>
      </div>

      {/* My bookings */}
      {myBookings.length > 0 && (
        <div className="mb-8 rounded-xl border border-[#B89A4E]/30 bg-[#F5F0E8] p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#B89A4E]">Your guide requests</p>
          <div className="space-y-2">
            {myBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{b.guide?.name}</p>
                  <p className="text-xs text-[#9C9589]">{b.guide?.location} · {b.days} day{b.days > 1 ? 's' : ''} · {b.start_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#1C1917]">${b.amount_usd}</p>
                  <span className={`text-[10px] uppercase tracking-wide ${b.status === 'confirmed' ? 'text-emerald-600' : b.status === 'cancelled' ? 'text-red-500' : 'text-amber-600'}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {specs.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${
              filter === s ? 'border-[#1C1917] bg-[#1C1917] text-white' : 'border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'
            }`}
          >
            {s === 'all' ? 'All guides' : s}
          </button>
        ))}
      </div>

      {/* Guide cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide) => {
          const booked = bookedGuideIds.has(guide.id)
          return (
            <div key={guide.id} className={`rounded-xl border bg-white p-5 ${guide.is_featured ? 'border-[#B89A4E]/40' : 'border-[#E8E3D9]'}`}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8] font-serif text-xl text-[#B89A4E]">
                  {guide.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-lg text-[#1C1917] truncate">{guide.name}</p>
                    {guide.is_featured && <span className="shrink-0 rounded-full bg-[#B89A4E]/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-[#B89A4E]">Featured</span>}
                  </div>
                  <p className="text-xs text-[#9C9589]">{guide.location}, {guide.country}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[#9C9589]">
                    <Star size={11} className="text-[#B89A4E] fill-[#B89A4E]" />
                    <span>{guide.rating}</span>
                    <span>· {guide.review_count} reviews</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {guide.bio && <p className="text-xs leading-5 text-[#9C9589] mb-3 line-clamp-3">{guide.bio}</p>}

              {/* Specs */}
              <div className="flex flex-wrap gap-1 mb-3">
                {guide.specializations.map((s) => (
                  <span key={s} className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide capitalize ${SPEC_COLOR[s] ?? 'bg-gray-50 text-gray-600'}`}>{s}</span>
                ))}
              </div>

              {/* Languages */}
              <p className="text-[10px] text-[#9C9589] mb-4">Speaks: {guide.languages.join(', ')}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#E8E3D9]">
                <div>
                  <p className="font-serif text-xl text-[#B89A4E]">${guide.price_per_day}<span className="text-xs text-[#9C9589]">/day</span></p>
                  {!guide.is_available && <p className="text-[10px] text-red-500">Currently unavailable</p>}
                </div>
                <div className="flex gap-2">
                  {guide.whatsapp && (
                    <a
                      href={`https://wa.me/${guide.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E8E3D9] text-[#9C9589] hover:border-emerald-400 hover:text-emerald-600 transition-colors"
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                  {guide.is_available && !booked ? (
                    <button
                      onClick={() => setSelected(guide)}
                      className="rounded-full bg-[#1C1917] px-3 py-1.5 text-xs text-white hover:bg-[#B89A4E] transition-colors"
                    >
                      Book →
                    </button>
                  ) : booked ? (
                    <span className="rounded-full bg-[#F5F0E8] px-3 py-1.5 text-xs text-[#B89A4E]">Requested</span>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-10 text-center">
          <p className="text-sm text-[#9C9589]">No guides match this filter. Try "All guides".</p>
        </div>
      )}

      {selected && userId && (
        <GuideBookingForm guide={selected} userId={userId} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
