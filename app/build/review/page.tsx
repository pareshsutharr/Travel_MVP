'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const rows = [
  ['Flights · LHR <-> DEL / Air India · partner suggestions from MakeMyTrip + Booking.com', 2140],
  ['Stays · 13 nights / heritage hotels · Airbnb + MakeMyTrip alternatives checked', 3860],
  ['Cabs · airport + city / Private AC · all reservations included', 340],
  ['eVisa + passport management · 2 travelers / 30-day tourist', 160],
  ['SIM + language kit · Airtel 10 GB + Hindi/Nepali assistance', 28],
  ['Food and lodge recommendations · local speciality shortlist', 120],
  ['Insurance · 2 people / Medical + delay + luggage', 210],
  ['Local guide · 4 days / Varanasi + Sarnath', 420],
  ['Destination manager + 24/7 GPS support', 492],
]

export default function ReviewPage() {
  return (
    <Suspense fallback={<div className="text-sm text-[#9C9589]">Loading basket...</div>}>
      <ReviewContent />
    </Suspense>
  )
}

function ReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const type = searchParams.get('type') ?? 'couple'
  const journey = searchParams.get('journey') ?? 'the-slow-ganges'
  return (
    <div><p className="mb-3 text-xs uppercase tracking-widest text-[#B89A4E]">Review</p><h1 className="font-serif text-4xl text-[#1C1917]">One basket. <span className="italic text-[#B89A4E]">One tap.</span></h1><p className="mt-3 text-xs uppercase tracking-widest text-[#B89A4E]">The Slow Ganges · 14 days</p>
      <div className="mt-6 rounded-xl border border-[#E8E3D9] bg-white p-5">{rows.map(([label, amount]) => <div key={String(label)} className="flex justify-between gap-5 border-b border-[#E8E3D9] py-3"><p className="text-sm leading-6 text-[#1C1917]">{label}</p><p className="whitespace-nowrap text-sm text-[#1C1917]">${Number(amount).toLocaleString()}</p></div>)}<div className="flex justify-between border-b border-[#E8E3D9] py-3 text-[#B89A4E]"><p>Bundle discount</p><p>-$612</p></div><div className="flex justify-between pt-5"><p className="text-xs uppercase tracking-widest text-[#9C9589]">Total · 2 travellers</p><p className="font-serif text-4xl text-[#1C1917]">$7,158</p></div><p className="mt-2 text-xs text-[#9C9589]">One-click checkout includes flights, stays, cabs, visas, SIM, language help, food guidance, guide, GPS, insurance and destination manager support.</p></div>
      <div className="mt-6 flex justify-between"><button onClick={() => router.back()} className="rounded-full border border-[#1C1917] px-6 py-3 text-sm">Adjust</button><button onClick={() => router.push(`/build/confirm?type=${type}&journey=${journey}`)} className="rounded-full bg-[#B89A4E] px-6 py-3 text-sm text-white">Confirm in one tap -&gt;</button></div>
    </div>
  )
}
