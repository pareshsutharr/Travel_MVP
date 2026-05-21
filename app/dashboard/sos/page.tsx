'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { SosEvent, Booking, Journey } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null }

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-red-50 text-red-600',
  responded: 'bg-amber-50 text-amber-600',
  resolved: 'bg-emerald-50 text-emerald-600',
}

export default function SosPage() {
  const [activeBooking, setActiveBooking] = useState<BookingRow | null>(null)
  const [events, setEvents] = useState<SosEvent[]>([])
  const [userId, setUserId] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [sosLine, setSosLine] = useState('+91 98765 43210')
  const [sosEmail, setSosEmail] = useState('sos@solura.travel')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)

      const [bookingRes, eventsRes, settingsRes] = await Promise.all([
        supabase.from('bookings').select('*, journey:journeys(*)').eq('user_id', data.user.id).eq('status', 'on_path').single(),
        supabase.from('sos_events').select('*').eq('user_id', data.user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('site_settings').select('value').eq('key', 'sos').single(),
      ])

      if (bookingRes.data) setActiveBooking(bookingRes.data as BookingRow)
      setEvents((eventsRes.data ?? []) as SosEvent[])
      const sos = settingsRes.data?.value as Record<string, string> | null
      if (sos?.['24x7_line']) setSosLine(sos['24x7_line'])
      if (sos?.emergency_email) setSosEmail(sos.emergency_email)
    })
  }, [])

  async function triggerSos() {
    setSending(true)
    const supabase = createClient()

    navigator.geolocation?.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      await insertSos(supabase, lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
    }, async () => {
      await insertSos(supabase, null, null, activeBooking?.current_location ?? null)
    })
  }

  async function insertSos(supabase: ReturnType<typeof createClient>, lat: number | null, lng: number | null, location: string | null) {
    const { error } = await supabase.from('sos_events').insert({
      user_id: userId,
      booking_id: activeBooking?.id ?? null,
      lat,
      lng,
      location_name: location,
      message: message || 'Emergency assistance needed.',
      status: 'active',
    })

    if (!error && activeBooking) {
      await supabase.from('bookings').update({ sos_active: true }).eq('id', activeBooking.id)
    }

    setSending(false)
    setSent(true)

    const { data: newEvent } = await supabase.from('sos_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).single()
    if (newEvent) setEvents((prev) => [newEvent as SosEvent, ...prev])
  }

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-2xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-red-500">Emergency</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">SOS · <span className="italic text-red-500">24×7 support.</span></h1>
        <p className="mt-1 text-sm text-[#9C9589]">
          Your Solura desk is always reachable. Use the button below for immediate assistance or call directly.
        </p>
      </div>

      {/* Emergency contacts */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <a href={`tel:${sosLine}`} className="flex items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-5 hover:border-red-400 transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <Phone size={18} className="text-red-600" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-red-400">24×7 SOS line</p>
            <p className="font-serif text-lg text-[#1C1917]">{sosLine}</p>
            <p className="text-xs text-red-500">Tap to call immediately</p>
          </div>
        </a>
        <a href={`mailto:${sosEmail}`} className="flex items-center gap-4 rounded-xl border border-[#E8E3D9] bg-white p-5 hover:border-[#B89A4E] transition-colors">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F0E8]">
            <Mail size={18} className="text-[#B89A4E]" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Emergency email</p>
            <p className="font-serif text-base text-[#1C1917]">{sosEmail}</p>
            <p className="text-xs text-[#9C9589]">Response within 5 minutes</p>
          </div>
        </a>
      </div>

      {/* Active trip location */}
      {activeBooking && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#E8E3D9] bg-white px-5 py-4">
          <MapPin size={16} className="text-[#B89A4E] shrink-0" />
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Your current location (from trip)</p>
            <p className="text-sm text-[#1C1917]">{activeBooking.current_location ?? 'Location updating...'} · {activeBooking.journey?.title}</p>
          </div>
        </div>
      )}

      {/* SOS trigger */}
      {!sent ? (
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">Send SOS alert to Solura desk</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Describe your emergency (medical, safety, lost, etc.)..."
            className="w-full resize-none rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-3 text-sm text-[#1C1917] outline-none focus:border-red-400 mb-4"
          />
          <button
            onClick={triggerSos}
            disabled={sending || !userId}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 py-4 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <AlertTriangle size={18} />
            {sending ? 'Sending alert...' : 'TRIGGER SOS — Alert Solura desk now'}
          </button>
          <p className="mt-3 text-center text-[10px] text-[#9C9589]">
            This will share your location and booking details with our 24×7 operations team.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle size={32} className="mx-auto mb-3 text-emerald-500" />
          <p className="font-serif text-xl text-[#1C1917]">SOS alert sent</p>
          <p className="mt-1 text-sm text-[#9C9589]">Our team has been notified. Someone will call you within 5 minutes.</p>
          <p className="mt-4 text-sm font-medium text-[#1C1917]">While you wait, call the SOS line directly:</p>
          <a href={`tel:${sosLine}`} className="mt-2 inline-block font-serif text-2xl text-red-600">{sosLine}</a>
        </div>
      )}

      {/* Previous SOS events */}
      {events.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">Previous SOS events</p>
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-[#E8E3D9] bg-white px-4 py-3">
                <div>
                  <p className="text-sm text-[#1C1917]">{e.message ?? 'Emergency alert'}</p>
                  <p className="text-xs text-[#9C9589]">{new Date(e.created_at).toLocaleString()} {e.location_name ? `· ${e.location_name}` : ''}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide capitalize ${STATUS_STYLE[e.status]}`}>
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
