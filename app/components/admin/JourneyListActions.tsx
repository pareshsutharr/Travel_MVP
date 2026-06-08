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
        className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${featured ? 'border-metallic-gold bg-pale-sky text-metallic-gold' : 'border-pale-sky text-blue-slate hover:border-metallic-gold'}`}
        title={featured ? 'Remove featured' : 'Feature journey'}
      >
        <Star size={13} className={featured ? 'fill-metallic-gold' : ''} />
      </button>
      <button
        disabled={Boolean(busy)}
        onClick={() => update({ status: status === 'published' ? 'draft' : 'published' })}
        className="rounded-full border border-pale-sky px-2.5 py-1 text-xs text-blue-slate transition-colors hover:border-metallic-gold hover:text-metallic-gold"
        title={status === 'published' ? 'Unpublish' : 'Publish'}
      >
        {status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button
        disabled={Boolean(busy)}
        onClick={remove}
        className="rounded-full border border-pale-sky px-2.5 py-1 text-xs text-danger transition-colors hover:border-danger hover:bg-status-soft"
        title="Delete journey"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
