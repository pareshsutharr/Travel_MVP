'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Check } from 'lucide-react'

type GeneralSettings = {
  site_name: string
  tagline: string
  contact_email: string
  phone: string
  whatsapp: string
}

type BookingSettings = {
  booking_fee_pct: number
  cancellation_days: number
  min_travelers: number
  max_travelers: number
}

type SosSettings = {
  '24x7_line': string
  emergency_email: string
}

type AllSettings = {
  general: GeneralSettings
  booking: BookingSettings
  sos: SosSettings
}

const labelClass = 'block text-[10px] tracking-widest uppercase text-[#9C9589] mb-1.5'
const inputClass = 'w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#B89A4E] transition-colors'

export default function AdminSettingsForm({ initial }: { initial: AllSettings }) {
  const [general, setGeneral] = useState<GeneralSettings>(initial.general)
  const [booking, setBooking] = useState<BookingSettings>(initial.booking)
  const [sos, setSos] = useState<SosSettings>(initial.sos)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function save() {
    setSaving(true)
    setError('')
    const supabase = createClient()

    const updates = [
      supabase.from('site_settings').upsert({ key: 'general', value: general as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }),
      supabase.from('site_settings').upsert({ key: 'booking', value: booking as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }),
      supabase.from('site_settings').upsert({ key: 'sos', value: sos as unknown as Record<string, unknown>, updated_at: new Date().toISOString() }),
    ]

    const results = await Promise.all(updates)
    const firstError = results.find((r) => r.error)?.error
    setSaving(false)

    if (firstError) {
      setError(firstError.message)
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* General */}
      <section className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="font-serif text-xl text-[#1C1917] mb-4">General</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Site name</label>
            <input className={inputClass} value={general.site_name} onChange={(e) => setGeneral({ ...general, site_name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Tagline</label>
            <input className={inputClass} value={general.tagline} onChange={(e) => setGeneral({ ...general, tagline: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Contact email</label>
            <input type="email" className={inputClass} value={general.contact_email} onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Phone / WhatsApp</label>
            <input className={inputClass} value={general.phone} onChange={(e) => setGeneral({ ...general, phone: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Booking */}
      <section className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="font-serif text-xl text-[#1C1917] mb-4">Booking rules</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Booking fee %</label>
            <input type="number" min={0} max={20} className={inputClass} value={booking.booking_fee_pct} onChange={(e) => setBooking({ ...booking, booking_fee_pct: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Free cancellation (days before)</label>
            <input type="number" min={0} className={inputClass} value={booking.cancellation_days} onChange={(e) => setBooking({ ...booking, cancellation_days: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Min travelers</label>
            <input type="number" min={1} className={inputClass} value={booking.min_travelers} onChange={(e) => setBooking({ ...booking, min_travelers: Number(e.target.value) })} />
          </div>
          <div>
            <label className={labelClass}>Max travelers</label>
            <input type="number" min={1} className={inputClass} value={booking.max_travelers} onChange={(e) => setBooking({ ...booking, max_travelers: Number(e.target.value) })} />
          </div>
        </div>
      </section>

      {/* SOS */}
      <section className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="font-serif text-xl text-[#1C1917] mb-1">SOS &amp; 24×7 support</h2>
        <p className="text-xs text-[#9C9589] mb-4">Shown to travellers on their active trip dashboard</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>24×7 emergency line</label>
            <input className={inputClass} value={sos['24x7_line']} onChange={(e) => setSos({ ...sos, '24x7_line': e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Emergency email</label>
            <input type="email" className={inputClass} value={sos.emergency_email} onChange={(e) => setSos({ ...sos, emergency_email: e.target.value })} />
          </div>
        </div>
      </section>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-[#1C1917] px-6 py-3 text-sm text-white transition-colors hover:bg-[#B89A4E] disabled:opacity-50"
      >
        {saved ? <Check size={15} /> : <Save size={15} />}
        {saved ? 'Saved' : saving ? 'Saving…' : 'Save settings'}
      </button>
    </div>
  )
}
