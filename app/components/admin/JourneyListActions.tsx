'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { JourneyStatus } from '@/types/database'

export default function JourneyListActions({
  journeyId,
  status,
  featured,
}: {
  journeyId: string
  status: JourneyStatus
  featured: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState('')

  async function update(values: { status?: JourneyStatus; featured?: boolean }) {
    setBusy(Object.keys(values).join('-'))
    const supabase = createClient()
    await supabase.from('journeys').update(values).eq('id', journeyId)
    setBusy('')
    router.refresh()
  }

  async function remove() {
    if (!window.confirm('Delete this journey from Supabase?')) return
    setBusy('delete')
    const supabase = createClient()
    await supabase.from('journeys').delete().eq('id', journeyId)
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={Boolean(busy)}
        onClick={() => update({ featured: !featured })}
        className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${featured ? 'border-[#B89A4E] bg-[#F5F0E8] text-[#B89A4E]' : 'border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}
        title={featured ? 'Remove featured' : 'Feature journey'}
      >
        <Star size={13} className={featured ? 'fill-[#B89A4E]' : ''} />
      </button>
      <button
        disabled={Boolean(busy)}
        onClick={() => update({ status: status === 'published' ? 'draft' : 'published' })}
        className="rounded-full border border-[#E8E3D9] px-2.5 py-1 text-xs text-[#9C9589] transition-colors hover:border-[#B89A4E] hover:text-[#B89A4E]"
        title={status === 'published' ? 'Unpublish' : 'Publish'}
      >
        {status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button
        disabled={Boolean(busy)}
        onClick={remove}
        className="rounded-full border border-[#E8E3D9] px-2.5 py-1 text-xs text-red-500 transition-colors hover:border-red-200 hover:bg-red-50"
        title="Delete journey"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
