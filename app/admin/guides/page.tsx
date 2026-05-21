import { createClient } from '@/lib/supabase/server'
import GuideManager from '@/app/components/admin/GuideManager'
import type { Guide, GuideBooking } from '@/types/database'

type GuideBookingRow = GuideBooking & { guide: Guide | null }

export default async function AdminGuidesPage() {
  const supabase = await createClient()

  const [{ data: guidesData }, { data: bookingsData }] = await Promise.all([
    supabase.from('guides').select('*').order('is_featured', { ascending: false }).order('rating', { ascending: false }),
    supabase.from('guide_bookings').select('*, guide:guides(*)').order('created_at', { ascending: false }).limit(20),
  ])

  const guides = (guidesData ?? []) as Guide[]
  const bookings = (bookingsData ?? []) as GuideBookingRow[]

  const stats = [
    ['Total guides', guides.length],
    ['Available', guides.filter((g) => g.is_available).length],
    ['Featured', guides.filter((g) => g.is_featured).length],
    ['Pending requests', bookings.filter((b) => b.status === 'pending').length],
  ]

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#B89A4E]">Operations</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
          Guides & <span className="italic text-[#B89A4E]">booking requests.</span>
        </h1>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-[#E8E3D9] bg-white px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[#9C9589]">{label}</p>
            <p className="font-serif text-3xl text-[#1C1917]">{value}</p>
          </div>
        ))}
      </div>

      <GuideManager guides={guides} bookings={bookings} />
    </div>
  )
}
