'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Map } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import PlaceAutocomplete from '@/app/components/PlaceAutocomplete'
import type { ItineraryDay, Journey } from '@/types/database'
import type { MapMarker, RoutePoint } from '@/app/components/SoluraMap'

const SoluraMap = dynamic(() => import('@/app/components/SoluraMap'), { ssr: false })

const labelClass = 'block text-[10px] tracking-widest uppercase text-blue-slate mb-1.5'
const inputClass = 'w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm text-graphite outline-none focus:border-metallic-gold'

export default function JourneyEditor({ journey }: { journey: Journey }) {
  const router = useRouter()
  const [form, setForm] = useState(journey)
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(journey.itinerary ?? [])
  const [highlights, setHighlights] = useState<string[]>(journey.highlights ?? [])
  const [included, setIncluded] = useState<string[]>(journey.included ?? [])
  const [saved, setSaved] = useState(false)
  const [mapFocus, setMapFocus] = useState<{ lat: number; lng: number } | null>(null)

  function setField(key: keyof Journey, value: unknown) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save() {
    const supabase = createClient()
    await supabase.from('journeys').update({
      title: form.title,
      subtitle: form.subtitle,
      category: form.category,
      duration: form.duration,
      route: form.route,
      price_from: form.price_from,
      description: form.description,
      status: form.status,
      featured: form.featured,
      difficulty: form.difficulty,
      best_season: form.best_season,
      max_travelers: form.max_travelers,
      image_url: form.image_url,
      highlights,
      itinerary,
      included,
    }).eq('id', journey.id)
    setSaved(true)
    router.refresh()
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-pale-sky bg-platinum p-6">
        <h2 className="mb-4 font-serif text-xl text-graphite">Journey details</h2>
        <div className="grid gap-4">
          <div><label className={labelClass}>Title</label><input className={inputClass} value={form.title} onChange={(e) => setField('title', e.target.value)} /></div>
          <div><label className={labelClass}>Subtitle</label><input className={inputClass} value={form.subtitle ?? ''} onChange={(e) => setField('subtitle', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Category</label><select className={inputClass} value={form.category} onChange={(e) => setField('category', e.target.value)}>{['spiritual', 'heritage', 'adventure', 'wellness'].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className={labelClass}>Status</label><select className={inputClass} value={form.status} onChange={(e) => setField('status', e.target.value)}>{['draft', 'in_review', 'published'].map((item) => <option key={item}>{item}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelClass}>Duration</label><input type="number" className={inputClass} value={form.duration} onChange={(e) => setField('duration', Number(e.target.value))} /></div>
            <div><label className={labelClass}>Price from</label><input type="number" className={inputClass} value={form.price_from} onChange={(e) => setField('price_from', Number(e.target.value))} /></div>
          </div>
          <div><label className={labelClass}>Route</label><input className={inputClass} value={form.route} onChange={(e) => setField('route', e.target.value)} /></div>
          <div><label className={labelClass}>Description</label><textarea rows={4} className={inputClass} value={form.description ?? ''} onChange={(e) => setField('description', e.target.value)} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelClass}>Difficulty</label><select className={inputClass} value={form.difficulty ?? 'moderate'} onChange={(e) => setField('difficulty', e.target.value)}>{['easy', 'moderate', 'challenging'].map((d) => <option key={d}>{d}</option>)}</select></div>
            <div><label className={labelClass}>Best season</label><input className={inputClass} value={form.best_season ?? ''} onChange={(e) => setField('best_season', e.target.value || null)} placeholder="Oct – Mar" /></div>
            <div><label className={labelClass}>Max travelers</label><input type="number" min={1} className={inputClass} value={form.max_travelers ?? 12} onChange={(e) => setField('max_travelers', Number(e.target.value))} /></div>
          </div>
          <div><label className={labelClass}>Cover image URL</label><input className={inputClass} value={form.image_url ?? ''} onChange={(e) => setField('image_url', e.target.value || null)} placeholder="https://…" /></div>
          <label className="flex items-center gap-2 text-sm text-graphite"><input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} /> Featured</label>
        </div>
      </div>

      <ListEditor title="Highlights" items={highlights} setItems={setHighlights} />
      <ListEditor title="Included" items={included} setItems={setIncluded} />

      <div className="rounded-xl border border-pale-sky bg-platinum p-6">
        <h2 className="mb-1 font-serif text-xl text-graphite">Day by day</h2>
        <p className="mb-4 text-xs text-blue-slate">Set GPS coordinates per day to draw the journey route on the map.</p>
        <div className="space-y-4">
          {itinerary.map((day, index) => (
            <div key={index} className="rounded-lg border border-pale-sky p-4">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['day', 'place', 'stay', 'notes'] as const).map((key) => (
                  <input key={key} className={inputClass} value={day[key]} placeholder={key} onChange={(e) => {
                    const next = [...itinerary]
                    next[index] = { ...next[index], [key]: e.target.value }
                    setItinerary(next)
                  }} />
                ))}
              </div>
              {/* Location row — Google Places Autocomplete (global) */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <PlaceAutocomplete
                    value={day.place}
                    placeholder="Search any city, town, landmark…"
                    className="rounded border border-pale-sky bg-platinum py-1.5 text-xs text-graphite outline-none focus:border-metallic-gold"
                    onSelect={(name, lat, lng) => {
                      const next = [...itinerary]
                      next[index] = { ...next[index], place: name, lat, lng }
                      setItinerary(next)
                      setMapFocus({ lat, lng })
                    }}
                    onChange={(val) => {
                      const next = [...itinerary]
                      next[index] = { ...next[index], place: val }
                      setItinerary(next)
                    }}
                  />
                </div>
                {day.lat && day.lng ? (
                  <span className="text-[10px] text-success whitespace-nowrap">
                    ✓ {Number(day.lat).toFixed(3)}, {Number(day.lng).toFixed(3)}
                  </span>
                ) : (
                  <span className="text-[10px] text-blue-slate">No coords yet</span>
                )}
                <button className="ml-auto text-danger hover:text-danger" onClick={() => setItinerary(itinerary.filter((_, i) => i !== index))}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1 text-xs text-metallic-gold" onClick={() => setItinerary([...itinerary, { day: '', place: '', stay: '', notes: '', lat: null, lng: null }])}><Plus size={13} /> Add day</button>
      </div>

      {/* Route preview map — shows whenever 1+ stops have coordinates */}
      {(() => {
        const mapped = itinerary.filter((d) => d.lat && d.lng)
        if (mapped.length === 0) return (
          <div className="rounded-xl border border-pale-sky bg-pale-sky p-6 flex items-center gap-3">
            <Map size={16} className="text-blue-slate" />
            <p className="text-sm text-blue-slate">Add GPS coordinates to stops above to preview the route map here.</p>
          </div>
        )
        const routePoints: RoutePoint[] = mapped.map((d) => ({ lat: d.lat!, lng: d.lng! }))
        const markers: MapMarker[] = mapped.map((d, i) => ({
          lat: d.lat!, lng: d.lng!,
          title: `Day ${d.day || i + 1}: ${d.place}`,
          type: 'waypoint',
          label: String(d.day || i + 1),
          info: d.notes || d.stay || undefined,
        }))
        return (
          <div className="rounded-xl border border-pale-sky overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-pale-sky border-b border-pale-sky">
              <div className="flex items-center gap-2">
                <Map size={14} className="text-metallic-gold" />
                <span className="text-xs font-medium text-graphite">Route preview</span>
              </div>
              <span className="text-[10px] text-blue-slate">{mapped.length} of {itinerary.length} stops mapped</span>
            </div>
            <SoluraMap
              markers={markers}
              routePoints={routePoints}
              focusCenter={mapFocus}
              height="320px"
              className="rounded-none"
            />
          </div>
        )
      })()}

      <button onClick={save} className="rounded-full bg-graphite px-8 py-3 text-sm text-platinum transition-colors hover:bg-metallic-gold">{saved ? 'Saved' : 'Save changes'}</button>
    </div>
  )
}

function ListEditor({ title, items, setItems }: { title: string; items: string[]; setItems: (items: string[]) => void }) {
  return (
    <div className="rounded-xl border border-pale-sky bg-platinum p-6">
      <h2 className="mb-4 font-serif text-xl text-graphite">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input className={inputClass} value={item} onChange={(e) => {
              const next = [...items]
              next[index] = e.target.value
              setItems(next)
            }} />
            <button className="text-danger" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button className="mt-3 flex items-center gap-1 text-xs text-metallic-gold" onClick={() => setItems([...items, ''])}><Plus size={13} /> Add item</button>
    </div>
  )
}
