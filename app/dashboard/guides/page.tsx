'use client'

import { useEffect, useState } from 'react'
import { Star, MessageCircle, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import GuideBookingForm from '@/app/components/user/GuideBookingForm'
import type { Guide, GuideBooking } from '@/types/database'

const SPEC_COLOR: Record<string, string> = {
  spiritual: 'bg-status-soft text-warning',
  heritage: 'bg-status-soft text-info',
  adventure: 'bg-status-soft text-success',
  wellness: 'bg-status-soft text-info',
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
        <p className="text-xs uppercase tracking-widest text-metallic-gold">Travel basket</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-graphite">
          Local <span className="italic text-metallic-gold">guides.</span>
        </h1>
        <p className="mt-1 text-sm text-blue-slate">
          Handpicked local guides for spiritual circuits, heritage walks and Himalayan treks across India and Nepal.
        </p>
      </div>

      {/* My bookings */}
      {myBookings.length > 0 && (
        <div className="mb-8 rounded-xl border border-metallic-gold/30 bg-pale-sky p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-metallic-gold">Your guide requests</p>
          <div className="space-y-2">
            {myBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg bg-platinum px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-graphite">{b.guide?.name}</p>
                  <p className="text-xs text-blue-slate">{b.guide?.location} · {b.days} day{b.days > 1 ? 's' : ''} · {b.start_date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-graphite">${b.amount_usd}</p>
                  <span className={`text-[10px] uppercase tracking-wide ${b.status === 'confirmed' ? 'text-success' : b.status === 'cancelled' ? 'text-danger' : 'text-warning'}`}>
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
              filter === s ? 'border-graphite bg-graphite text-platinum' : 'border-pale-sky text-blue-slate hover:border-metallic-gold'
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
            <div key={guide.id} className={`rounded-xl border bg-platinum p-5 ${guide.is_featured ? 'border-metallic-gold/40' : 'border-pale-sky'}`}>
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pale-sky font-serif text-xl text-metallic-gold">
                  {guide.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-lg text-graphite truncate">{guide.name}</p>
                    {guide.is_featured && <span className="shrink-0 rounded-full bg-metallic-gold/10 px-1.5 py-0.5 text-[8px] uppercase tracking-wide text-metallic-gold">Featured</span>}
                  </div>
                  <p className="text-xs text-blue-slate">{guide.location}, {guide.country}</p>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-blue-slate">
                    <Star size={11} className="text-metallic-gold fill-metallic-gold" />
                    <span>{guide.rating}</span>
                    <span>· {guide.review_count} reviews</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {guide.bio && <p className="text-xs leading-5 text-blue-slate mb-3 line-clamp-3">{guide.bio}</p>}

              {/* Specs */}
              <div className="flex flex-wrap gap-1 mb-3">
                {guide.specializations.map((s) => (
                  <span key={s} className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wide capitalize ${SPEC_COLOR[s] ?? 'bg-status-soft text-info'}`}>{s}</span>
                ))}
              </div>

              {/* Languages */}
              <p className="text-[10px] text-blue-slate mb-4">Speaks: {guide.languages.join(', ')}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-pale-sky">
                <div>
                  <p className="font-serif text-xl text-metallic-gold">${guide.price_per_day}<span className="text-xs text-blue-slate">/day</span></p>
                  {!guide.is_available && <p className="text-[10px] text-danger">Currently unavailable</p>}
                </div>
                <div className="flex gap-2">
                  {guide.whatsapp && (
                    <a
                      href={`https://wa.me/${guide.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-pale-sky text-blue-slate hover:border-success hover:text-success transition-colors"
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                  {guide.is_available && !booked ? (
                    <button
                      onClick={() => setSelected(guide)}
                      className="rounded-full bg-graphite px-3 py-1.5 text-xs text-platinum hover:bg-metallic-gold transition-colors"
                    >
                      Book →
                    </button>
                  ) : booked ? (
                    <span className="rounded-full bg-pale-sky px-3 py-1.5 text-xs text-metallic-gold">Requested</span>
                  ) : null}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-pale-sky bg-platinum p-10 text-center">
          <p className="text-sm text-blue-slate">No guides match this filter. Try "All guides".</p>
        </div>
      )}

      {selected && userId && (
        <GuideBookingForm guide={selected} userId={userId} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
