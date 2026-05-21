import { createClient } from '@/lib/supabase/server'
import type { FoodRecommendation } from '@/types/database'

const TYPE_LABEL: Record<string, string> = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  street_food: 'Street food',
  lodge: 'Lodge dining',
  dhaba: 'Dhaba',
}

const TYPE_COLOR: Record<string, string> = {
  restaurant: 'bg-amber-50 text-amber-700',
  cafe: 'bg-blue-50 text-blue-600',
  street_food: 'bg-emerald-50 text-emerald-700',
  lodge: 'bg-purple-50 text-purple-600',
  dhaba: 'bg-orange-50 text-orange-600',
}

const PRICE_LABEL: Record<string, string> = {
  '$': 'Budget · under $5',
  '$$': 'Mid-range · $5–15',
  '$$$': 'Premium · $15+',
}

export default async function FoodPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('food_recommendations')
    .select('*')
    .order('rating', { ascending: false })

  const items = (data ?? []) as FoodRecommendation[]

  const grouped = items.reduce<Record<string, FoodRecommendation[]>>((acc, f) => {
    const key = `${f.city}, ${f.country}`
    acc[key] = [...(acc[key] ?? []), f]
    return acc
  }, {})

  const cities = Object.keys(grouped)

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#B89A4E]">Travel basket</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
          Food & Lodge <span className="italic text-[#B89A4E]">recommendations.</span>
        </h1>
        <p className="mt-1 text-sm text-[#9C9589]">
          Local specialities and trusted restaurants — curated by our destination managers for each city on your route.
        </p>
      </div>

      {/* City filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {cities.map((city) => (
          <a key={city} href={`#${city.replace(/[^a-z]/gi, '-').toLowerCase()}`}
            className="rounded-full border border-[#E8E3D9] bg-white px-4 py-1.5 text-xs text-[#1C1917] hover:border-[#B89A4E] hover:text-[#B89A4E] transition-colors">
            {city}
          </a>
        ))}
      </div>

      <div className="space-y-10">
        {Object.entries(grouped).map(([city, recs]) => (
          <div key={city} id={city.replace(/[^a-z]/gi, '-').toLowerCase()}>
            <div className="mb-4 flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-widest text-[#9C9589]">{city}</p>
              <div className="h-px flex-1 bg-[#E8E3D9]" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recs.map((r) => (
                <div key={r.id} className="rounded-xl border border-[#E8E3D9] bg-white p-5 hover:border-[#B89A4E] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg text-[#1C1917]">{r.name}</h3>
                      {r.cuisine && <p className="text-xs text-[#9C9589]">{r.cuisine}</p>}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wide ${TYPE_COLOR[r.type] ?? 'bg-gray-50 text-gray-600'}`}>
                      {TYPE_LABEL[r.type] ?? r.type}
                    </span>
                  </div>
                  <p className="text-sm leading-5 text-[#1C1917] mb-3">{r.speciality}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9C9589]">
                    <span className="text-[#B89A4E]">{'★'.repeat(Math.round(r.rating))}{'☆'.repeat(5 - Math.round(r.rating))}</span>
                    <span>{r.rating}</span>
                    <span>·</span>
                    <span>{PRICE_LABEL[r.price_range] ?? r.price_range}</span>
                    {r.is_vegetarian && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-600">Vegetarian</span>}
                  </div>
                  {r.address && <p className="mt-2 text-[10px] text-[#9C9589]">{r.address}</p>}
                  {r.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {r.tags.map((tag) => (
                        <span key={tag} className="rounded bg-[#F5F0E8] px-1.5 py-0.5 text-[9px] text-[#9C9589]">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-10 text-center">
          <p className="font-serif text-xl text-[#1C1917]">Recommendations coming soon</p>
          <p className="mt-2 text-sm text-[#9C9589]">Your destination manager will add food notes once your route is confirmed.</p>
        </div>
      )}
    </div>
  )
}
