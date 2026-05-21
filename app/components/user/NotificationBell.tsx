'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types/database'

const TYPE_DOT: Record<string, string> = {
  booking: 'bg-[#B89A4E]',
  message: 'bg-blue-400',
  sos: 'bg-red-500',
  document: 'bg-emerald-400',
  guide: 'bg-purple-400',
  info: 'bg-[#9C9589]',
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notification[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => setNotifs((data ?? []) as Notification[]))

    const channel = supabase
      .channel('notif-bell')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifs((prev) => [payload.new as Notification, ...prev.slice(0, 7)])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function markAllRead() {
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unread = notifs.filter((n) => !n.is_read).length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => { setOpen((v) => !v); if (!open && unread > 0) markAllRead() }}
        className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#F5F0E8] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-[#9C9589]" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#B89A4E] text-[9px] font-medium text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-[#E8E3D9] bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-[#E8E3D9] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-[#9C9589]">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-[#B89A4E] hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-[#9C9589]">No notifications yet.</p>
            ) : (
              notifs.map((n) => (
                <div key={n.id} className={`flex gap-3 border-b border-[#E8E3D9] px-4 py-3 last:border-0 ${!n.is_read ? 'bg-[#FAFAF8]' : ''}`}>
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[n.type] ?? 'bg-[#9C9589]'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-[#1C1917]">{n.title}</p>
                    <p className="mt-0.5 text-xs text-[#9C9589] leading-4">{n.body}</p>
                    {n.link && (
                      <Link href={n.link} onClick={() => setOpen(false)} className="mt-1 text-[10px] text-[#B89A4E] hover:underline">
                        View →
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
