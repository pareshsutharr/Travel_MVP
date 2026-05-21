import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import JourneyEditor from '@/app/components/admin/JourneyEditor'
import type { Journey } from '@/types/database'

export default async function EditStoryline({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('journeys').select('*').eq('id', id).single()
  if (!data) notFound()

  return (
    <div className="px-8 py-8">
      <Link href="/admin/storyline" className="mb-6 flex items-center gap-2 text-sm text-[#9C9589] hover:text-[#1C1917]"><ArrowLeft size={14} /> Story Line</Link>
      <h1 className="mb-6 font-serif text-3xl text-[#1C1917]">Edit <span className="italic text-[#B89A4E]">{data.title}</span></h1>
      <JourneyEditor journey={data as Journey} />
    </div>
  )
}
