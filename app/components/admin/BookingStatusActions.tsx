'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getStatusLabel } from '@/lib/utils'

const TRANSITIONS: Record<string, string[]> = {
  new: ['confirmed', 'visa_hold', 'cancelled'],
  confirmed: ['on_path', 'delayed', 'cancelled'],
  on_path: ['delayed', 'done'],
  delayed: ['on_path', 'done'],
  visa_hold: ['confirmed', 'cancelled'],
}

export default function BookingStatusActions({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const options = TRANSITIONS[currentStatus] ?? []

  async function updateStatus(status: string) {
    setLoading(status)
    const supabase = createClient()
    await supabase.from('bookings').update({ status }).eq('id', bookingId)
    setLoading('')
    router.refresh()
  }

  if (options.length === 0) return <p className="text-xs text-blue-slate">No further status changes.</p>

  return (
    <div className="space-y-2">
      {options.map((status) => (
        <button
          key={status}
          disabled={Boolean(loading)}
          onClick={() => updateStatus(status)}
          className="w-full rounded-lg border border-pale-sky px-4 py-2.5 text-left text-sm text-graphite transition-colors hover:border-metallic-gold hover:bg-pale-sky disabled:opacity-50"
        >
          {loading === status ? 'Updating...' : `Mark ${getStatusLabel(status)}`}
        </button>
      ))}
    </div>
  )
}
