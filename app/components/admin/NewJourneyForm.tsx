'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ItineraryDay, JourneyCategory, JourneyDifficulty, JourneyStatus } from '@/types/database'

const labelClass = 'block text-[10px] tracking-widest uppercase text-[#9C9589] mb-1.5'
const inputClass = 'w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#B89A4E]'

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function NewJourneyForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState<JourneyCategory>('spiritual')
  const [status, setStatus] = useState<JourneyStatus>('draft')
  const [duration, setDuration] = useState(7)
  const [route, setRoute] = useState('Varanasi -> Rishikesh')
  const [price, setPrice] = useState(4500)
  const [description, setDescription] = useState('')
  const [featured, setFeatured] = useState(false)
  const [difficulty, setDifficulty] = useState<JourneyDifficulty>('moderate')
  const [bestSeason, setBestSeason] = useState('')
  const [maxTravelers, setMaxTravelers] = useState(12)
  const [imageUrl, setImageUrl] = useState('')
  const [highlights, setHighlights] = useState<string[]>([''])
  const [included, setIncluded] = useState<string[]>(['Flights', 'Stays', 'Cabs', 'Visa support', 'SIM', 'Insurance'])
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 'Day 1-2', place: 'Varanasi', stay: 'Heritage stay', notes: 'Arrival, orientation and river timing.' },
  ])

  async function createJourney() {
    setSaving(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('journeys')
      .insert({
        slug: slugify(title),
        title,
        subtitle,
        category,
        duration,
        route,
        price_from: price,
        description,
        highlights: highlights.filter(Boolean),
        itinerary,
        included: included.filter(Boolean),
        status,
        featured,
        difficulty,
        best_season: bestSeason || null,
        max_travelers: maxTravelers,
        image_url: imageUrl || null,
      })
      .select('id')
      .single()

    setSaving(false)
    if (error) {
      window.alert(error.message)
      return
    }
    router.push(`/admin/storyline/${data.id}`)
    router.refresh()
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#1C1917]">Create trip</h2>
        <div className="grid gap-4">
          <div><label className={labelClass}>Trip title</label><input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Kashi after Dusk" /></div>
          <div><label className={labelClass}>Subtitle</label><input className={inputClass} value={subtitle} onChange={(event) => setSubtitle(event.target.value)} placeholder="A slow evening route through Varanasi" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Category</label><select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value as JourneyCategory)}>{['spiritual', 'heritage', 'adventure', 'wellness'].map((item) => <option key={item}>{item}</option>)}</select></div>
            <div><label className={labelClass}>Status</label><select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as JourneyStatus)}>{['draft', 'in_review', 'published'].map((item) => <option key={item}>{item}</option>)}</select></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={labelClass}>Duration</label><input type="number" className={inputClass} value={duration} onChange={(event) => setDuration(Number(event.target.value))} /></div>
            <div><label className={labelClass}>Price from USD</label><input type="number" className={inputClass} value={price} onChange={(event) => setPrice(Number(event.target.value))} /></div>
          </div>
          <div><label className={labelClass}>Route</label><input className={inputClass} value={route} onChange={(event) => setRoute(event.target.value)} /></div>
          <div><label className={labelClass}>Description</label><textarea className={inputClass} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className={labelClass}>Difficulty</label><select className={inputClass} value={difficulty} onChange={(e) => setDifficulty(e.target.value as JourneyDifficulty)}>{['easy', 'moderate', 'challenging'].map((d) => <option key={d}>{d}</option>)}</select></div>
            <div><label className={labelClass}>Best season</label><input className={inputClass} value={bestSeason} onChange={(e) => setBestSeason(e.target.value)} placeholder="Oct – Mar" /></div>
            <div><label className={labelClass}>Max travelers</label><input type="number" min={1} className={inputClass} value={maxTravelers} onChange={(e) => setMaxTravelers(Number(e.target.value))} /></div>
          </div>
          <div><label className={labelClass}>Cover image URL (optional)</label><input className={inputClass} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" /></div>
          <label className="flex items-center gap-2 text-sm text-[#1C1917]"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Feature on public website</label>
        </div>
      </div>

      <EditableList title="Highlights" items={highlights} setItems={setHighlights} />
      <EditableList title="Included services" items={included} setItems={setIncluded} />

      <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
        <h2 className="mb-4 font-serif text-xl text-[#1C1917]">Itinerary</h2>
        <div className="space-y-3">
          {itinerary.map((item, index) => (
            <div key={index} className="grid gap-2 rounded-lg border border-[#E8E3D9] p-3 sm:grid-cols-4">
              {(['day', 'place', 'stay', 'notes'] as const).map((key) => (
                <input
                  key={key}
                  className={inputClass}
                  value={item[key]}
                  placeholder={key}
                  onChange={(event) => {
                    const next = [...itinerary]
                    next[index] = { ...next[index], [key]: event.target.value }
                    setItinerary(next)
                  }}
                />
              ))}
              <button className="text-red-500" onClick={() => setItinerary(itinerary.filter((_, itemIndex) => itemIndex !== index))}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button className="mt-3 flex items-center gap-1 text-xs text-[#B89A4E]" onClick={() => setItinerary([...itinerary, { day: '', place: '', stay: '', notes: '' }])}><Plus size={13} /> Add day</button>
      </div>

      <button disabled={!title || saving} onClick={createJourney} className="rounded-full bg-[#1C1917] px-8 py-3 text-sm text-white transition-colors hover:bg-[#B89A4E] disabled:opacity-40">
        {saving ? 'Creating...' : 'Create trip in Supabase'}
      </button>
    </div>
  )
}

function EditableList({ title, items, setItems }: { title: string; items: string[]; setItems: (items: string[]) => void }) {
  return (
    <div className="rounded-xl border border-[#E8E3D9] bg-white p-6">
      <h2 className="mb-4 font-serif text-xl text-[#1C1917]">{title}</h2>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input className={inputClass} value={item} onChange={(event) => {
              const next = [...items]
              next[index] = event.target.value
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
