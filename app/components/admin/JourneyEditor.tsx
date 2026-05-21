'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ItineraryDay, Journey } from '@/types/database'

const labelClass = 'block text-[10px] tracking-widest uppercase text-[#9C9589] mb-1.5'
const inputClass = 'w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#B89A4E]'

export default function JourneyEditor({ journey }: { journey: Journey }) {
  const router = useRouter()
  const [form, setForm] = useState(journey)
  const [itinerary, setItinerary] = useState<ItineraryDay[]>(journey.itinerary ?? [])
  const [highlights, setHighlights] = useState<string[]>(journey.highlights ?? [])
  const [included, setIncluded] = useState<string[]>(journey.included ?? [])
  const [saved, setSaved] = useState(false)

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
      <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#1C1917]">Journey details</h2>
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
          <label className="flex items-center gap-2 text-sm text-[#1C1917]"><input type="checkbox" checked={form.featured} onChange={(e) => setField('featured', e.target.checked)} /> Featured</label>
        </div>
      </div>

      <ListEditor title="Highlights" items={highlights} setItems={setHighlights} />
      <ListEditor title="Included" items={included} setItems={setIncluded} />

      <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#1C1917]">Day by day</h2>
        <div className="space-y-3">
          {itinerary.map((day, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 rounded-lg border border-[#E8E3D9] p-3">
              {(['day', 'place', 'stay', 'notes'] as const).map((key) => (
                <input key={key} className={inputClass} value={day[key]} placeholder={key} onChange={(e) => {
                  const next = [...itinerary]
                  next[index] = { ...next[index], [key]: e.target.value }
                  setItinerary(next)
                }} />
              ))}
              <button className="text-red-500" onClick={() => setItinerary(itinerary.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1 text-xs text-[#B89A4E]" onClick={() => setItinerary([...itinerary, { day: '', place: '', stay: '', notes: '' }])}><Plus size={13} /> Add day</button>
      </div>

      <button onClick={save} className="rounded-full bg-[#1C1917] px-8 py-3 text-sm text-white transition-colors hover:bg-[#B89A4E]">{saved ? 'Saved' : 'Save changes'}</button>
    </div>
  )
}

function ListEditor({ title, items, setItems }: { title: string; items: string[]; setItems: (items: string[]) => void }) {
  return (
    <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
      <h2 className="mb-4 font-serif text-xl text-[#1C1917]">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input className={inputClass} value={item} onChange={(e) => {
              const next = [...items]
              next[index] = e.target.value
              setItems(next)
            }} />
            <button className="text-red-500" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button className="mt-3 flex items-center gap-1 text-xs text-[#B89A4E]" onClick={() => setItems([...items, ''])}><Plus size={13} /> Add item</button>
    </div>
  )
}
