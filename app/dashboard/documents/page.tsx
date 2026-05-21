'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Document } from '@/types/database'

const managedServices = [
  'Passport readiness check',
  'India eVisa / Nepal entry reminder',
  'Travel insurance bundled in total',
  'SIM card and language assistance kit',
  'Money conversion for INR and NPR',
]

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [amount, setAmount] = useState(100)
  const [currency, setCurrency] = useState<'INR' | 'NPR'>('INR')
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('documents').select('*').eq('user_id', data.user.id).then(({ data: rows }) => setDocuments((rows ?? []) as Document[]))
    })
  }, [])
  const converted = useMemo(() => amount * (currency === 'INR' ? 83.42 : 134.15), [amount, currency])

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-serif text-3xl text-[#1C1917]">Documents & Money</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-[#E8E3D9] bg-white p-6"><h2 className="mb-4 font-serif text-xl text-[#1C1917]">Visas, passports, SIM</h2>{documents.map((doc) => <div key={doc.id} className="flex items-center justify-between border-t border-[#E8E3D9] py-4"><div><p className="text-sm font-medium text-[#1C1917]">{doc.name}</p><p className="text-xs capitalize text-[#9C9589]">{doc.type} · expires {doc.expiry_date ?? 'n/a'}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs ${doc.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{doc.status}</span></div>)}{documents.length === 0 && <p className="text-sm text-[#9C9589]">Soma will show passport, visa, insurance and SIM status after booking.</p>}</section>
        <section className="rounded-xl border border-[#E8E3D9] bg-white p-6"><h2 className="mb-4 font-serif text-xl text-[#1C1917]">Currency converter</h2><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-3 text-sm" /><div className="mt-3 flex gap-2">{(['INR', 'NPR'] as const).map((item) => <button key={item} onClick={() => setCurrency(item)} className={`rounded-full px-4 py-2 text-xs ${currency === item ? 'bg-[#1C1917] text-white' : 'border border-[#E8E3D9] text-[#9C9589]'}`}>USD -&gt; {item}</button>)}</div><p className="mt-5 font-serif text-3xl text-[#B89A4E]">{converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} {currency}</p></section>
        <section className="rounded-xl border border-[#E8E3D9] bg-white p-6 lg:col-span-2"><h2 className="font-serif text-xl text-[#1C1917]">Managed before you travel</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{managedServices.map((item) => <p key={item} className="rounded-lg bg-[#FAFAF8] px-4 py-3 text-sm text-[#1C1917]"><span className="text-[#B89A4E]">✓</span> {item}</p>)}</div></section>
        <section className="rounded-xl border border-[#E8E3D9] bg-[#F5F0E8] p-6 lg:col-span-2"><h2 className="font-serif text-xl text-[#1C1917]">Insurance · active</h2><div className="mt-3 grid gap-2 text-sm text-[#1C1917] sm:grid-cols-2">{['Medical emergency up to $500,000', 'Trip cancellation up to $10,000', 'Flight delay coverage', 'Lost luggage up to $2,000', 'Emergency evacuation'].map((item) => <p key={item}><span className="text-[#B89A4E]">✓</span> {item}</p>)}</div></section>
      </div>
    </div>
  )
}
