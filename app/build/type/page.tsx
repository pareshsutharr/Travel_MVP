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
    <Suspense fallback={<div className="text-sm text-[#9C9589]">Loading builder...</div>}>
      <TripTypeContent />
    </Suspense>
  )
}

function TripTypeContent() {
  const [selected, setSelected] = useState('')
  const router = useRouter()
  const journey = useSearchParams().get('journey')
  return (
    <div><p className="mb-3 text-xs uppercase tracking-widest text-[#B89A4E]">Trip Builder</p><h1 className="font-serif text-4xl text-[#1C1917]">Who is <span className="italic text-[#B89A4E]">walking with you?</span></h1><p className="mt-2 text-sm text-[#9C9589]">We tailor pace, lodging and rituals to the company you keep.</p>{journey && <p className="mt-4 rounded-full bg-[#F5F0E8] px-4 py-2 text-xs text-[#9C9589]">Planning: {journey}</p>}<div className="mt-8 space-y-3">{TYPES.map(([value, Icon, title, copy, meta]) => <button key={value} onClick={() => setSelected(value)} className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left ${selected === value ? 'border-[#1C1917] bg-[#F5F0E8]' : 'border-[#E8E3D9] bg-white hover:border-[#9C9589]'}`}><Icon className="text-[#B89A4E]" size={20} /><div className="flex-1"><p className="font-serif text-xl text-[#1C1917]">{title}</p><p className="text-sm text-[#9C9589]">{copy}</p></div><span className="text-xs text-[#9C9589]">{meta}</span></button>)}</div><button disabled={!selected} onClick={() => router.push(`/build/counsel?type=${selected}${journey ? `&journey=${journey}` : ''}`)} className="mt-6 w-full rounded-full bg-[#1C1917] py-3 text-sm text-white disabled:opacity-40">Continue -&gt;</button></div>
  )
}
