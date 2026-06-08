'use client'

import Link from 'next/link'
import SoluraLogo from '@/app/components/SoluraLogo'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const rows = [
  ['Flights · LHR ⇄ DEL', 2140],
  ['Stays · 13 nights', 3860],
  ['Cabs reserved', 340],
  ['eVisa + passport management', 160],
  ['SIM + language kit', 28],
  ['Food/lodge recommendations', 120],
  ['Insurance coverage', 210],
  ['Local guide', 420],
  ['GPS + destination manager', 492],
  ['Bundle discount', -612],
] as const

const tripTravelers: Record<string, number> = {
  solo: 1,
  couple: 2,
  family: 4,
  group: 8,
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="text-sm text-blue-slate">Preparing confirmation...</div>}>
      <ConfirmContent />
    </Suspense>
  )
}

function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripType = searchParams.get('type') ?? 'couple'
  const journeySlug = searchParams.get('journey') ?? 'the-slow-ganges'
  const [confirmedId, setConfirmedId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function confirmBooking() {
    setLoading(true)
    setError('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/sign-in?next=${encodeURIComponent(`/build/confirm?type=${tripType}&journey=${journeySlug}`)}`)
      return
    }

    const [{ data: profile }, { data: journey }] = await Promise.all([
      supabase.from('profiles').select('full_name, email').eq('id', user.id).maybeSingle(),
      supabase.from('journeys').select('id, title, price_from').eq('slug', journeySlug).maybeSingle(),
    ])

    if (!journey) {
      setError('This journey is not available right now. Please choose another Story Line.')
      setLoading(false)
      return
    }

    const start = new Date()
    start.setDate(start.getDate() + 21)
    const end = new Date(start)
    end.setDate(end.getDate() + 13)
    const travelers = tripTravelers[tripType] ?? 2
    const ref = `SOL-${Date.now().toString().slice(-6)}`

    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert({
        ref,
        user_id: user.id,
        journey_id: journey.id,
        traveler_name: profile?.full_name ?? user.email ?? 'Traveller',
        start_date: start.toISOString().slice(0, 10),
        end_date: end.toISOString().slice(0, 10),
        travelers,
        trip_type: tripType,
        status: 'new',
        total_amount: 7158,
        discount: 612,
        flight_cost: 2140,
        stays_cost: 3860,
        cabs_cost: 340,
        visa_cost: 160,
        sim_cost: 28,
        insurance_cost: 210,
        guide_cost: 420,
        current_day: null,
        current_location: null,
        notes: 'Created from one-click Solura trip builder.',
      })
      .select('id')
      .single()

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setConfirmedId(data.id)
  }

  if (confirmedId) {
    return (
      <div className="rounded-2xl border border-pale-sky bg-platinum p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-status-soft text-success"><Check /></div>
        <h1 className="font-serif text-3xl text-graphite">Your journey is confirmed.</h1>
        <p className="mt-2 text-sm text-blue-slate">The booking was saved in Supabase. Soma will be in touch before departure.</p>
        <Link href={`/dashboard/trips/${confirmedId}`} className="mt-6 inline-flex rounded-full bg-graphite px-6 py-3 text-sm text-platinum">View trip -&gt;</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-pale-sky bg-platinum p-6 shadow-sm">
      <p className="text-right font-mono text-xs text-blue-slate">NO. 04-2026-EH</p>
      <div className="text-center">
        <SoluraLogo className="w-36" />
        <p className="text-[10px] uppercase tracking-widest text-blue-slate">Itinerary · 14 days · {tripType} trip</p>
        <h1 className="mt-2 font-serif text-2xl italic text-metallic-gold">The Slow Ganges</h1>
      </div>
      <div className="my-6 border-t border-dashed border-pale-sky" />
      {rows.map(([label, amount]) => (
        <p key={label} className="flex justify-between border-b border-pale-sky py-2 text-xs text-graphite">
          <span>{label}</span>
          <span>{amount < 0 ? '-' : ''}${Math.abs(amount).toLocaleString()}.00</span>
        </p>
      ))}
      <div className="flex items-center justify-between py-5"><p className="text-xs uppercase tracking-widest text-blue-slate">Total</p><p className="font-serif text-4xl text-graphite">$7,158</p></div>
      <div className="rounded-lg border border-dashed border-metallic-gold py-2 text-center font-serif italic text-metallic-gold">ready · 03 may 2026</div>
      <p className="my-5 text-center font-serif italic text-blue-slate">Carry only what cannot be bought at the destination.</p>
      {error && <p className="mb-4 rounded-lg bg-status-soft px-3 py-2 text-center text-xs text-danger">{error}</p>}
      <button onClick={confirmBooking} disabled={loading} className="w-full rounded-full border border-metallic-gold py-3 text-center text-xs uppercase tracking-widest text-metallic-gold transition-colors hover:bg-metallic-gold hover:text-platinum disabled:opacity-50">
        {loading ? 'Saving booking...' : 'Confirm · One Tap'}
      </button>
    </div>
  )
}
