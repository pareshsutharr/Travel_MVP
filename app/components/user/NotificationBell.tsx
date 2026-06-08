'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types/database'

const TYPE_DOT: Record<string, string> = {
  booking: 'bg-metallic-gold',
  message: 'bg-info',
  sos: 'bg-danger',
  document: 'bg-success',
  guide: 'bg-info',
  info: 'bg-blue-slate',
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
        className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-pale-sky transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className="text-blue-slate" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-metallic-gold text-[9px] font-medium text-platinum">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 rounded-xl border border-pale-sky bg-platinum shadow-lg">
          <div className="flex items-center justify-between border-b border-pale-sky px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-blue-slate">Notifications</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-metallic-gold hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="px-4 py-6 text-center text-xs text-blue-slate">No notifications yet.</p>
            ) : (
              notifs.map((n) => (
                <div key={n.id} className={`flex gap-3 border-b border-pale-sky px-4 py-3 last:border-0 ${!n.is_read ? 'bg-platinum' : ''}`}>
                  <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[n.type] ?? 'bg-blue-slate'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-graphite">{n.title}</p>
                    <p className="mt-0.5 text-xs text-blue-slate leading-4">{n.body}</p>
                    {n.link && (
                      <Link href={n.link} onClick={() => setOpen(false)} className="mt-1 text-[10px] text-metallic-gold hover:underline">
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
