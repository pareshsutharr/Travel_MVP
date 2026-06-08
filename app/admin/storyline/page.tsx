import Link from 'next/link'
import { Plus, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, getCategoryColor } from '@/lib/utils'
import JourneyListActions from '@/app/components/admin/JourneyListActions'
import type { Journey } from '@/types/database'

export default async function AdminStoryline() {
  const supabase = await createClient()
  const { data } = await supabase.from('journeys').select('*').order('sort_order')
  const journeys = (data ?? []) as Journey[]

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="font-serif text-3xl text-graphite">Story Line <span className="italic text-metallic-gold">CMS</span></h1><p className="text-sm text-blue-slate">Drafts, reviews, routes and published stories.</p></div>
        <Link href="/admin/storyline/new" className="flex items-center gap-2 rounded-full bg-metallic-gold px-4 py-2 text-sm text-platinum hover:bg-metallic-gold"><Plus size={14} /> New journey</Link>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['All trips', journeys.length],
          ['Published', journeys.filter((journey) => journey.status === 'published').length],
          ['Featured', journeys.filter((journey) => journey.featured).length],
          ['Drafts', journeys.filter((journey) => journey.status !== 'published').length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-pale-sky bg-platinum px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">{label}</p>
            <p className="font-serif text-3xl text-graphite">{value}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-pale-sky bg-platinum">
        <table className="w-full">
          <thead className="bg-platinum"><tr>{['TITLE', 'CATEGORY', 'DURATION', 'ROUTE', 'FROM', 'STATUS', 'RATING', 'MANAGE', ''].map((h) => <th key={h} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-blue-slate">{h}</th>)}</tr></thead>
          <tbody>{journeys.map((journey) => <tr key={journey.id} className="border-t border-pale-sky hover:bg-platinum">
            <td className="px-5 py-4"><p className="text-sm font-medium text-graphite">{journey.title}</p><p className="max-w-xs truncate text-xs text-blue-slate">{journey.subtitle}</p></td>
            <td className={`px-5 py-4 text-xs uppercase tracking-widest ${getCategoryColor(journey.category)}`}>{journey.category}</td>
            <td className="px-5 py-4 text-sm text-blue-slate">{journey.duration}d</td>
            <td className="px-5 py-4 text-xs text-blue-slate">{journey.route}</td>
            <td className="px-5 py-4 text-sm text-graphite">{formatCurrency(journey.price_from)}</td>
            <td className="px-5 py-4"><span className="rounded-full bg-pale-sky px-2.5 py-0.5 text-xs capitalize text-graphite">{journey.status.replace('_', ' ')}</span></td>
            <td className="px-5 py-4 text-sm text-blue-slate">{journey.rating ? <span className="flex items-center gap-1"><Star size={13} className="fill-metallic-gold text-metallic-gold" /> {journey.rating}</span> : '-'}</td>
            <td className="px-5 py-4"><JourneyListActions journeyId={journey.id} status={journey.status} featured={journey.featured} /></td>
            <td className="px-5 py-4"><Link href={`/admin/storyline/${journey.id}`} className="text-xs text-metallic-gold hover:underline">Edit -&gt;</Link></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
