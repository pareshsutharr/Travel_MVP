'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getPlaceImage } from '@/lib/travel-images'
import type { Journey, WishlistItem } from '@/types/database'

type Item = WishlistItem & { journey: Pick<Journey, 'title' | 'slug'> | null }

export default function WishlistPage() {
  const [items, setItems] = useState<Item[]>([])
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return
      supabase.from('wishlist_items').select('*, journey:journeys(title, slug)').eq('user_id', data.user.id).then(({ data: rows }) => setItems((rows ?? []) as Item[]))
    })
  }, [supabase])
  async function remove(id: string) {
    await supabase.from('wishlist_items').delete().eq('id', id)
    setItems((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-serif text-3xl text-[#1C1917]">Wishlist · <span className="italic text-[#B89A4E]">{items.length} places</span></h1>
      {!items.length && <div className="rounded-xl border border-[#E8E3D9] bg-white p-10 text-center"><p className="font-serif text-2xl text-[#1C1917]">Your wishlist is empty.</p><Link href="/journeys" className="mt-3 inline-flex text-[#B89A4E]">Explore journeys -&gt;</Link></div>}
      <div className="grid gap-5 md:grid-cols-2">{items.map((item) => <div key={item.id} className="rounded-xl border border-[#E8E3D9] bg-white p-5 hover:border-[#B89A4E]"><div className="relative mb-4 h-28 overflow-hidden rounded-lg"><img src={getPlaceImage(item.place_name, item.place_location)} alt={item.place_name} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/45 to-transparent" /></div><div className="flex items-start justify-between"><div><h2 className="font-serif text-xl text-[#1C1917]">{item.place_name}</h2><p className="text-sm text-[#9C9589]">{item.place_location}</p>{item.journey && <Link href={`/journeys/${item.journey.slug}`} className="mt-2 block text-xs text-[#B89A4E]">Part of {item.journey.title}</Link>}</div><button onClick={() => remove(item.id)} className="text-[#9C9589] hover:text-red-500"><X size={16} /></button></div></div>)}</div>
    </div>
  )
}
