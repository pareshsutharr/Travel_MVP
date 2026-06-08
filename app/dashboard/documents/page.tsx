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
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <h1 className="mb-6 font-serif text-3xl text-graphite">Documents & Money</h1>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-pale-sky bg-platinum p-6"><h2 className="mb-4 font-serif text-xl text-graphite">Visas, passports, SIM</h2>{documents.map((doc) => <div key={doc.id} className="flex items-center justify-between border-t border-pale-sky py-4"><div><p className="text-sm font-medium text-graphite">{doc.name}</p><p className="text-xs capitalize text-blue-slate">{doc.type} · expires {doc.expiry_date ?? 'n/a'}</p></div><span className={`rounded-full px-2.5 py-0.5 text-xs ${doc.status === 'active' ? 'bg-status-soft text-success' : 'bg-status-soft text-warning'}`}>{doc.status}</span></div>)}{documents.length === 0 && <p className="text-sm text-blue-slate">Soma will show passport, visa, insurance and SIM status after booking.</p>}</section>
        <section className="rounded-xl border border-pale-sky bg-platinum p-6"><h2 className="mb-4 font-serif text-xl text-graphite">Currency converter</h2><input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-3 text-sm" /><div className="mt-3 flex gap-2">{(['INR', 'NPR'] as const).map((item) => <button key={item} onClick={() => setCurrency(item)} className={`rounded-full px-4 py-2 text-xs ${currency === item ? 'bg-graphite text-platinum' : 'border border-pale-sky text-blue-slate'}`}>USD -&gt; {item}</button>)}</div><p className="mt-5 font-serif text-3xl text-metallic-gold">{converted.toLocaleString(undefined, { maximumFractionDigits: 0 })} {currency}</p></section>
        <section className="rounded-xl border border-pale-sky bg-platinum p-6 lg:col-span-2"><h2 className="font-serif text-xl text-graphite">Managed before you travel</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">{managedServices.map((item) => <p key={item} className="rounded-lg bg-platinum px-4 py-3 text-sm text-graphite"><span className="text-metallic-gold">✓</span> {item}</p>)}</div></section>
        <section className="rounded-xl border border-pale-sky bg-pale-sky p-6 lg:col-span-2"><h2 className="font-serif text-xl text-graphite">Insurance · active</h2><div className="mt-3 grid gap-2 text-sm text-graphite sm:grid-cols-2">{['Medical emergency up to $500,000', 'Trip cancellation up to $10,000', 'Flight delay coverage', 'Lost luggage up to $2,000', 'Emergency evacuation'].map((item) => <p key={item}><span className="text-metallic-gold">✓</span> {item}</p>)}</div></section>
      </div>
    </div>
  )
}
