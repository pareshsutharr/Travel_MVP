'use client'

import { useEffect, useState } from 'react'
import { Car, Phone, MessageCircle, CheckCircle, Loader2, AlertTriangle, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import PlaceAutocomplete from '@/app/components/PlaceAutocomplete'

type CabProvider = {
  id: string
  name: string
  phone: string
  whatsapp: string | null
  city: string
  country: string
  area: string | null
  vehicle_type: string
  notes: string | null
  is_active: boolean
  created_at: string
}

const VEHICLE_COLORS: Record<string, string> = {
  sedan:    'bg-pale-sky text-metallic-gold',
  suv:      'bg-status-soft text-info',
  tempo:    'bg-status-soft text-success',
  luxury:   'bg-status-soft text-info',
  minibus:  'bg-status-soft text-warning',
}

export default function CabPage() {
  const [userId, setUserId]           = useState('')
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation]   = useState('')
  const [notes, setNotes]             = useState('')
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [detecting, setDetecting]     = useState(false)
  const [latLng, setLatLng]           = useState<{ lat: number; lng: number } | null>(null)
  const [providers, setProviders]     = useState<CabProvider[]>([])
  const [sosLine, setSosLine]         = useState('+91 98765 43210')

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)

      const [providerRes, settingsRes] = await Promise.all([
        supabase.from('cab_providers').select('*').order('city').order('name'),
        supabase.from('site_settings').select('value').eq('key', 'sos').single(),
      ])

      if (providerRes.data) setProviders(providerRes.data as CabProvider[])
      const sos = settingsRes.data?.value as Record<string, string> | null
      if (sos?.['24x7_line']) setSosLine(sos['24x7_line'])
    })

    // Auto-detect location
    if ('geolocation' in navigator) {
      setDetecting(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords
          setLatLng({ lat, lng })
          setFromLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
          setDetecting(false)
        },
        () => {
          setDetecting(false)
        },
        { timeout: 8000 }
      )
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !fromLocation || !toLocation) return
    setSubmitting(true)

    const supabase = createClient()
    await supabase.from('cab_requests').insert({
      user_id: userId,
      from_location: fromLocation,
      to_location: toLocation,
      from_lat: latLng?.lat ?? null,
      from_lng: latLng?.lng ?? null,
      notes: notes || null,
      status: 'pending',
    })

    setSubmitting(false)
    setSubmitted(true)
  }

  // Group providers by city
  const byCity = providers.reduce<Record<string, CabProvider[]>>((acc, p) => {
    if (!acc[p.city]) acc[p.city] = []
    acc[p.city].push(p)
    return acc
  }, {})

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 max-w-2xl">
      {/* Heading */}
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-blue-slate">On-demand transport</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-graphite">
          Cab · <span className="italic text-metallic-gold">On-demand.</span>
        </h1>
        <p className="mt-1 text-sm text-blue-slate">
          Auto-detect your location, find local drivers, or request Solura to arrange a cab.
        </p>
      </div>

      {/* Request form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="rounded-xl border border-pale-sky bg-platinum p-6 mb-8">
          <p className="mb-4 text-[10px] uppercase tracking-widest text-blue-slate">Request a cab arrangement</p>

          {/* From */}
          <div className="mb-4">
            <label className="block text-xs text-blue-slate mb-1.5 uppercase tracking-widest">From</label>
            {detecting ? (
              <div className="flex items-center gap-2 rounded-lg border border-pale-sky bg-platinum px-4 py-3">
                <Loader2 size={14} className="text-blue-slate animate-spin shrink-0" />
                <span className="text-sm text-blue-slate">Detecting your location…</span>
              </div>
            ) : (
              <PlaceAutocomplete
                value={fromLocation}
                placeholder="Your pickup location, hotel, landmark…"
                className="rounded-lg border border-pale-sky bg-platinum py-3 text-sm text-graphite outline-none focus:border-metallic-gold transition-colors placeholder:text-blue-slate"
                onSelect={(name, lat, lng) => {
                  setFromLocation(name)
                  setLatLng({ lat, lng })
                }}
                onChange={setFromLocation}
              />
            )}
            {latLng && !detecting && (
              <p className="mt-1 text-[10px] text-metallic-gold flex items-center gap-1">
                <MapPin size={9} /> {latLng.lat.toFixed(4)}, {latLng.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* To */}
          <div className="mb-4">
            <label className="block text-xs text-blue-slate mb-1.5 uppercase tracking-widest">To</label>
            <PlaceAutocomplete
              value={toLocation}
              placeholder="Destination — airport, temple, city…"
              className="rounded-lg border border-pale-sky bg-platinum py-3 text-sm text-graphite outline-none focus:border-metallic-gold transition-colors placeholder:text-blue-slate"
              iconClassName="text-blue-slate"
              onSelect={(name) => setToLocation(name)}
              onChange={setToLocation}
            />
          </div>

          {/* Notes */}
          <div className="mb-5">
            <label className="block text-xs text-blue-slate mb-1.5 uppercase tracking-widest">Notes <span className="normal-case tracking-normal">(optional)</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Preferred vehicle type, luggage, special requests…"
              className="w-full resize-none rounded-lg border border-pale-sky bg-platinum px-4 py-3 text-sm text-graphite outline-none focus:border-metallic-gold transition-colors placeholder:text-blue-slate"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !userId || !fromLocation || !toLocation}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-metallic-gold py-3.5 text-sm font-medium text-platinum hover:bg-metallic-gold transition-colors disabled:opacity-50"
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Sending request…</>
            ) : (
              <><Car size={16} /> Request cab arrangement</>
            )}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-success bg-status-soft p-6 text-center mb-8">
          <CheckCircle size={32} className="mx-auto mb-3 text-success" />
          <p className="font-serif text-xl text-graphite">Request sent</p>
          <p className="mt-1 text-sm text-blue-slate">
            Your request has been sent. Solura will arrange a cab and contact you.
          </p>
        </div>
      )}

      {/* Local cab providers */}
      {Object.keys(byCity).length > 0 && (
        <div className="mb-8">
          <p className="mb-4 text-[10px] uppercase tracking-widest text-blue-slate">Local cab providers</p>
          <div className="space-y-6">
            {Object.entries(byCity).map(([city, list]) => (
              <div key={city}>
                <p className="mb-2 text-xs font-medium text-graphite uppercase tracking-widest">{city}</p>
                <div className="space-y-2">
                  {list.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between gap-4 rounded-xl border border-pale-sky bg-platinum px-5 py-4"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-serif text-base text-graphite">{p.name}</p>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wide capitalize ${VEHICLE_COLORS[p.vehicle_type] ?? 'bg-pale-sky text-blue-slate'}`}>
                            {p.vehicle_type}
                          </span>
                        </div>
                        {p.area && (
                          <p className="mt-0.5 text-xs text-blue-slate flex items-center gap-1">
                            <MapPin size={10} /> {p.area}
                          </p>
                        )}
                        {p.notes && (
                          <p className="mt-1 text-xs text-blue-slate">{p.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <a
                          href={`tel:${p.phone}`}
                          className="flex items-center gap-1.5 rounded-lg border border-pale-sky bg-pale-sky px-3 py-1.5 text-xs text-graphite hover:border-metallic-gold hover:text-metallic-gold transition-colors"
                        >
                          <Phone size={12} />
                          Call
                        </a>
                        {p.whatsapp && (
                          <a
                            href={`https://wa.me/${p.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-success bg-status-soft px-3 py-1.5 text-xs text-success hover:border-success transition-colors"
                          >
                            <MessageCircle size={12} />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency / SOS strip */}
      <div className="rounded-xl border border-pale-sky bg-platinum px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-soft">
            <AlertTriangle size={15} className="text-danger" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">Stuck?</p>
            <p className="text-sm text-graphite">Call our 24×7 line</p>
          </div>
        </div>
        <a
          href={`tel:${sosLine}`}
          className="font-serif text-lg text-danger hover:underline whitespace-nowrap"
        >
          {sosLine}
        </a>
      </div>
    </div>
  )
}
