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
    <Suspense fallback={<div className="text-sm text-blue-slate">Loading basket...</div>}>
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
    <div><p className="mb-3 text-xs uppercase tracking-widest text-metallic-gold">Review</p><h1 className="font-serif text-4xl text-graphite">One basket. <span className="italic text-metallic-gold">One tap.</span></h1><p className="mt-3 text-xs uppercase tracking-widest text-metallic-gold">The Slow Ganges · 14 days</p>
      <div className="mt-6 rounded-xl border border-pale-sky bg-platinum p-5">{rows.map(([label, amount]) => <div key={String(label)} className="flex justify-between gap-5 border-b border-pale-sky py-3"><p className="text-sm leading-6 text-graphite">{label}</p><p className="whitespace-nowrap text-sm text-graphite">${Number(amount).toLocaleString()}</p></div>)}<div className="flex justify-between border-b border-pale-sky py-3 text-metallic-gold"><p>Bundle discount</p><p>-$612</p></div><div className="flex justify-between pt-5"><p className="text-xs uppercase tracking-widest text-blue-slate">Total · 2 travellers</p><p className="font-serif text-4xl text-graphite">$7,158</p></div><p className="mt-2 text-xs text-blue-slate">One-click checkout includes flights, stays, cabs, visas, SIM, language help, food guidance, guide, GPS, insurance and destination manager support.</p></div>
      <div className="mt-6 flex justify-between"><button onClick={() => router.back()} className="rounded-full border border-graphite px-6 py-3 text-sm">Adjust</button><button onClick={() => router.push(`/build/confirm?type=${type}&journey=${journey}`)} className="rounded-full bg-metallic-gold px-6 py-3 text-sm text-platinum">Confirm in one tap -&gt;</button></div>
    </div>
  )
}
