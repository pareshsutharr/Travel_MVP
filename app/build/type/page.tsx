'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Users, User, Heart, Circle } from 'lucide-react'

const TYPES = [
  ['solo', User, 'Solo', 'A retreat with yourself', '1 traveler'],
  ['couple', Heart, 'Couple', 'Two paths, one walk', '2 travelers'],
  ['family', Users, 'Family', 'Across generations', '3-6 travelers'],
  ['group', Circle, 'Group', 'A circle of seekers', '7+ travelers'],
] as const

export default function TripTypePage() {
  return (
    <Suspense fallback={<div className="text-sm text-blue-slate">Loading builder...</div>}>
      <TripTypeContent />
    </Suspense>
  )
}

function TripTypeContent() {
  const [selected, setSelected] = useState('')
  const router = useRouter()
  const journey = useSearchParams().get('journey')
  return (
    <div><p className="mb-3 text-xs uppercase tracking-widest text-metallic-gold">Trip Builder</p><h1 className="font-serif text-4xl text-graphite">Who is <span className="italic text-metallic-gold">walking with you?</span></h1><p className="mt-2 text-sm text-blue-slate">We tailor pace, lodging and rituals to the company you keep.</p>{journey && <p className="mt-4 rounded-full bg-pale-sky px-4 py-2 text-xs text-blue-slate">Planning: {journey}</p>}<div className="mt-8 space-y-3">{TYPES.map(([value, Icon, title, copy, meta]) => <button key={value} onClick={() => setSelected(value)} className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left ${selected === value ? 'border-graphite bg-pale-sky' : 'border-pale-sky bg-platinum hover:border-blue-slate'}`}><Icon className="text-metallic-gold" size={20} /><div className="flex-1"><p className="font-serif text-xl text-graphite">{title}</p><p className="text-sm text-blue-slate">{copy}</p></div><span className="text-xs text-blue-slate">{meta}</span></button>)}</div><button disabled={!selected} onClick={() => router.push(`/build/counsel?type=${selected}${journey ? `&journey=${journey}` : ''}`)} className="mt-6 w-full rounded-full bg-graphite py-3 text-sm text-platinum disabled:opacity-40">Continue -&gt;</button></div>
  )
}
