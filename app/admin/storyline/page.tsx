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
        <div><h1 className="font-serif text-3xl text-[#1C1917]">Story Line <span className="italic text-[#B89A4E]">CMS</span></h1><p className="text-sm text-[#9C9589]">Drafts, reviews, routes and published stories.</p></div>
        <Link href="/admin/storyline/new" className="flex items-center gap-2 rounded-full bg-[#B89A4E] px-4 py-2 text-sm text-white hover:bg-[#8B6914]"><Plus size={14} /> New journey</Link>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['All trips', journeys.length],
          ['Published', journeys.filter((journey) => journey.status === 'published').length],
          ['Featured', journeys.filter((journey) => journey.featured).length],
          ['Drafts', journeys.filter((journey) => journey.status !== 'published').length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#E8E3D9] bg-white px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[#9C9589]">{label}</p>
            <p className="font-serif text-3xl text-[#1C1917]">{value}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
        <table className="w-full">
          <thead className="bg-[#FAFAF8]"><tr>{['TITLE', 'CATEGORY', 'DURATION', 'ROUTE', 'FROM', 'STATUS', 'RATING', 'MANAGE', ''].map((h) => <th key={h} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{h}</th>)}</tr></thead>
          <tbody>{journeys.map((journey) => <tr key={journey.id} className="border-t border-[#E8E3D9] hover:bg-[#FAFAF8]">
            <td className="px-5 py-4"><p className="text-sm font-medium text-[#1C1917]">{journey.title}</p><p className="max-w-xs truncate text-xs text-[#9C9589]">{journey.subtitle}</p></td>
            <td className={`px-5 py-4 text-xs uppercase tracking-widest ${getCategoryColor(journey.category)}`}>{journey.category}</td>
            <td className="px-5 py-4 text-sm text-[#9C9589]">{journey.duration}d</td>
            <td className="px-5 py-4 text-xs text-[#9C9589]">{journey.route}</td>
            <td className="px-5 py-4 text-sm text-[#1C1917]">{formatCurrency(journey.price_from)}</td>
            <td className="px-5 py-4"><span className="rounded-full bg-[#F5F0E8] px-2.5 py-0.5 text-xs capitalize text-[#1C1917]">{journey.status.replace('_', ' ')}</span></td>
            <td className="px-5 py-4 text-sm text-[#9C9589]">{journey.rating ? <span className="flex items-center gap-1"><Star size={13} className="fill-[#B89A4E] text-[#B89A4E]" /> {journey.rating}</span> : '-'}</td>
            <td className="px-5 py-4"><JourneyListActions journeyId={journey.id} status={journey.status} featured={journey.featured} /></td>
            <td className="px-5 py-4"><Link href={`/admin/storyline/${journey.id}`} className="text-xs text-[#B89A4E] hover:underline">Edit -&gt;</Link></td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}
