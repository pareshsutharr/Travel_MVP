import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import JourneyEditor from '@/app/components/admin/JourneyEditor'
import AdminHighlightsPanel from '@/app/components/admin/AdminHighlightsPanel'
import type { Journey } from '@/types/database'

export default async function EditStoryline({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user: adminUser } } = await supabase.auth.getUser()
  const { data } = await supabase.from('journeys').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="px-8 py-8">
      <Link href="/admin/storyline" className="mb-6 flex items-center gap-2 text-sm text-blue-slate hover:text-graphite"><ArrowLeft size={14} /> Story Line</Link>
      <h1 className="mb-6 font-serif text-3xl text-graphite">Edit <span className="italic text-metallic-gold">{data.title}</span></h1>
      <div className="max-w-3xl space-y-6">
        <JourneyEditor journey={data as Journey} />
        {adminUser && (
          <AdminHighlightsPanel journeyId={id} adminUserId={adminUser.id} />
        )}
      </div>
    </div>
  )
}
