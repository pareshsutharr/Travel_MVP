'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Guide } from '@/types/database'

export default function GuideBookingForm({ guide, userId, onClose }: { guide: Guide; userId: string; onClose: () => void }) {
  const [date, setDate] = useState('')
  const [days, setDays] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const total = guide.price_per_day * days

  async function submit() {
    if (!date) { setError('Please select a start date.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('guide_bookings').insert({
      guide_id: guide.id,
      user_id: userId,
      start_date: date,
      days,
      amount_usd: total,
      notes: notes || null,
      status: 'pending',
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    await supabase.from('notifications').insert({
      user_id: userId,
      title: 'Guide request sent',
      body: `Your request for ${guide.name} has been sent. Confirmation within 24 hours.`,
      type: 'guide',
      link: '/dashboard/guides',
    })
    setDone(true)
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/40 px-4" onClick={onClose}>
        <div className="w-full max-w-sm rounded-2xl bg-platinum p-8 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pale-sky">
            <Check size={22} className="text-metallic-gold" />
          </div>
          <h3 className="font-serif text-2xl text-graphite">Request sent</h3>
          <p className="mt-2 text-sm text-blue-slate">
            {guide.name} will confirm within 24 hours. Your counsellor is also notified.
          </p>
          <button onClick={onClose} className="mt-6 rounded-full bg-graphite px-6 py-2.5 text-sm text-platinum hover:bg-metallic-gold transition-colors">
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-graphite/40 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl rounded-b-3xl sm:rounded-2xl bg-platinum p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">Book a guide</p>
            <h3 className="font-serif text-2xl text-graphite">{guide.name}</h3>
            <p className="text-sm text-blue-slate">{guide.location} · ${guide.price_per_day}/day</p>
          </div>
          <button onClick={onClose} className="text-blue-slate hover:text-graphite p-1"><X size={18} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-blue-slate mb-1.5">Start date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm text-graphite outline-none focus:border-metallic-gold"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-blue-slate mb-1.5">Number of days</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setDays((d) => Math.max(1, d - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-pale-sky text-lg text-graphite">−</button>
              <span className="font-serif text-xl text-graphite w-6 text-center">{days}</span>
              <button onClick={() => setDays((d) => Math.min(14, d + 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-pale-sky text-lg text-graphite">+</button>
              <span className="ml-2 text-sm text-blue-slate">day{days > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-blue-slate mb-1.5">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Specific places you'd like to visit, pace preference..."
              className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm text-graphite outline-none focus:border-metallic-gold resize-none"
            />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-danger">{error}</p>}

        <div className="mt-5 flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl text-metallic-gold">${total.toLocaleString()}</p>
            <p className="text-[10px] text-blue-slate">{days} day{days > 1 ? 's' : ''} · pending confirmation</p>
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-graphite px-6 py-2.5 text-sm text-platinum hover:bg-metallic-gold transition-colors disabled:opacity-40"
          >
            {loading ? 'Sending...' : 'Request guide →'}
          </button>
        </div>
      </div>
    </div>
  )
}
