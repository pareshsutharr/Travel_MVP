'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check } from 'lucide-react'

export default function ConfirmPage() {
  const [confirmed, setConfirmed] = useState(false)
  if (confirmed) return <div className="rounded-2xl border border-[#E8E3D9] bg-white p-10 text-center"><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check /></div><h1 className="font-serif text-3xl text-[#1C1917]">Your journey is confirmed.</h1><p className="mt-2 text-sm text-[#9C9589]">Soma will be in touch before departure.</p><Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#1C1917] px-6 py-3 text-sm text-white">Go to dashboard -&gt;</Link></div>
  const rows = ['Flights + partner suggestions  $2,140.00', 'Stays + hotel alternatives  $3,860.00', 'Cabs reserved  $340.00', 'eVisa + passport management  $160.00', 'SIM + language kit  $28.00', 'Food/lodge recommendations  $120.00', 'Insurance coverage  $210.00', 'Local guide  $420.00', 'GPS + destination manager  $492.00', 'Bundle discount  -$612.00']
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-[#E8E3D9] bg-white p-6 shadow-sm"><p className="text-right font-mono text-xs text-[#9C9589]">NO. 04-2026-EH</p><div className="text-center"><p className="font-serif text-2xl text-[#1C1917]">SOLURA</p><p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Itinerary · 14 days · two travellers</p><h1 className="mt-2 font-serif text-2xl italic text-[#B89A4E]">The Slow Ganges</h1></div><div className="my-6 border-t border-dashed border-[#E8E3D9]" />{rows.map((row) => <p key={row} className="flex justify-between border-b border-[#E8E3D9] py-2 text-xs text-[#1C1917]"><span>{row.slice(0, row.lastIndexOf(' '))}</span><span>{row.slice(row.lastIndexOf(' ') + 1)}</span></p>)}<div className="flex items-center justify-between py-5"><p className="text-xs uppercase tracking-widest text-[#9C9589]">Total</p><p className="font-serif text-4xl text-[#1C1917]">$7,158</p></div><div className="rounded-lg border border-dashed border-[#B89A4E] py-2 text-center font-serif italic text-[#B89A4E]">ready · 03 may 2026</div><p className="my-5 text-center font-serif italic text-[#9C9589]">Carry only what cannot be bought at the destination.</p><button onClick={() => setConfirmed(true)} className="w-full text-center text-xs uppercase tracking-widest text-[#B89A4E]">Confirm · One Tap</button></div>
  )
}
