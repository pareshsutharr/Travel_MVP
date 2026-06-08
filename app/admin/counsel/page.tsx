'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Send, Search, Loader2, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type MessageRow = {
  id: string
  booking_id: string | null
  sender_id: string
  sender_type: 'user' | 'counsellor' | 'soma'
  content: string
  is_read: boolean
  created_at: string
  booking?: {
    id: string
    ref: string
    traveler_name: string
    current_location: string | null
    journey?: { title: string } | null
  } | null
}

type Thread = {
  bookingId: string
  ref: string
  travelerName: string
  location: string | null
  journeyTitle: string | null
  lastMessage: string
  lastAt: string
  unread: number
}

function timeLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString())
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

const COUNSELLOR_CHIPS = [
  'I will arrange that for you.',
  'Your guide will meet you at 8 AM.',
  "Today's schedule is on track.",
  'Please rest — I will sort the logistics.',
  'The driver is confirmed for 10 AM.',
]

export default function AdminCounsel() {
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<MessageRow[]>([])
  const [selected, setSelected] = useState<string>('')
  const [reply, setReply] = useState('')
  const [query, setQuery] = useState('')
  const [sending, setSending] = useState(false)
  const [userId, setUserId] = useState('')

  // Initial load
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })

    supabase
      .from('messages')
      .select('*, booking:bookings(id, ref, traveler_name, current_location, journey:journeys(title))')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        const rows = (data ?? []) as MessageRow[]
        setMessages(rows)
        // Auto-select the most recent thread
        const lastWithBooking = [...rows].reverse().find((r) => r.booking_id)
        if (lastWithBooking?.booking_id) setSelected(lastWithBooking.booking_id)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        // Fetch the full row with booking join
        const { data } = await supabase
          .from('messages')
          .select('*, booking:bookings(id, ref, traveler_name, current_location, journey:journeys(title))')
          .eq('id', payload.new.id)
          .single()
        if (data) {
          setMessages((prev) => {
            if (prev.find((m) => m.id === data.id)) return prev
            return [...prev, data as MessageRow]
          })
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) =>
          prev.map((m) => m.id === payload.new.id ? { ...m, is_read: payload.new.is_read } : m)
        )
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Mark messages read when thread selected
  useEffect(() => {
    if (!selected) return
    supabase
      .from('messages')
      .update({ is_read: true })
      .eq('booking_id', selected)
      .eq('sender_type', 'user')
      .eq('is_read', false)
      .then(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.booking_id === selected && m.sender_type === 'user' ? { ...m, is_read: true } : m
          )
        )
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selected])

  const threads = useMemo<Thread[]>(() => {
    const map = new Map<string, Thread>()
    messages.forEach((m) => {
      const b = m.booking
      if (!b || !m.booking_id) return
      const existing = map.get(m.booking_id)
      map.set(m.booking_id, {
        bookingId: m.booking_id,
        ref: b.ref,
        travelerName: b.traveler_name,
        location: b.current_location,
        journeyTitle: b.journey?.title ?? null,
        lastMessage: m.content,
        lastAt: m.created_at,
        unread: (existing?.unread ?? 0) + (!m.is_read && m.sender_type === 'user' ? 1 : 0),
      })
    })
    const all = Array.from(map.values()).sort((a, b) => b.lastAt.localeCompare(a.lastAt))
    return query
      ? all.filter((t) => t.travelerName.toLowerCase().includes(query.toLowerCase()) || t.journeyTitle?.toLowerCase().includes(query.toLowerCase()))
      : all
  }, [messages, query])

  const active = threads.find((t) => t.bookingId === selected)
  const threadMessages = messages.filter((m) => m.booking_id === selected)
  const totalUnread = threads.reduce((n, t) => n + t.unread, 0)

  async function sendReply() {
    const text = reply.trim()
    if (!text || !selected || sending) return
    setSending(true)
    setReply('')
    await supabase.from('messages').insert({
      booking_id: selected,
      sender_id: userId,
      sender_type: 'counsellor',
      content: text,
      is_read: false,
    })
    setSending(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex h-[calc(100vh-0px)] bg-platinum">

      {/* Sidebar — thread list */}
      <aside className={`${selected ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 shrink-0 border-r border-pale-sky bg-platinum`}>
        {/* Sidebar header */}
        <div className="border-b border-pale-sky px-5 py-4">
          <p className="text-[10px] uppercase tracking-widest text-blue-slate">Soma · Counsellor Inbox</p>
          <h1 className="font-serif text-2xl text-graphite leading-tight">
            {totalUnread > 0 ? (
              <><span className="text-metallic-gold">{totalUnread}</span> unread</>
            ) : (
              'All caught up'
            )}
          </h1>
          <div className="relative mt-3">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-slate" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-pale-sky bg-platinum py-2 pl-8 pr-3 text-xs outline-none focus:border-metallic-gold"
              placeholder="Search travellers…"
            />
          </div>
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 && (
            <p className="p-6 text-center text-sm text-blue-slate">No conversations yet</p>
          )}
          {threads.map((t) => (
            <button
              key={t.bookingId}
              onClick={() => setSelected(t.bookingId)}
              className={`w-full border-b border-pale-sky p-4 text-left transition-colors hover:bg-platinum ${
                selected === t.bookingId ? 'border-l-2 border-l-[#D4AF35] bg-pale-sky' : ''
              }`}
            >
              <div className="flex gap-3 items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pale-sky font-serif text-sm text-metallic-gold">
                  {t.travelerName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className="truncate text-sm font-medium text-graphite">{t.travelerName}</p>
                    <span className="shrink-0 text-[9px] text-blue-slate">{timeLabel(t.lastAt)}</span>
                  </div>
                  <p className="text-[10px] text-metallic-gold uppercase tracking-wide truncate">{t.journeyTitle ?? t.ref}</p>
                  <p className="mt-0.5 truncate text-xs text-blue-slate">{t.lastMessage}</p>
                </div>
                {t.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-metallic-gold text-[10px] text-platinum px-1">
                    {t.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat area */}
      <main className={`${selected ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
        {active ? (
          <>
            {/* Chat header */}
            <header className="flex items-center justify-between border-b border-pale-sky bg-platinum px-4 md:px-6 py-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  className="md:hidden text-blue-slate hover:text-graphite mr-1"
                  onClick={() => setSelected('')}
                >
                  ← Back
                </button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pale-sky font-serif text-sm text-metallic-gold">
                  {active.travelerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-graphite">{active.travelerName}</p>
                  <p className="text-xs text-blue-slate">
                    {active.location ? `${active.location} · ` : ''}{active.journeyTitle ?? active.ref}
                  </p>
                </div>
              </div>
              <Link href={`/admin/bookings/${active.bookingId}`} className="text-xs text-metallic-gold hover:underline shrink-0">
                Open booking →
              </Link>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-2">
              {threadMessages.map((m) => {
                const isUser = m.sender_type === 'user'
                const isSoma = m.sender_type === 'soma'
                return (
                  <div key={m.id} className={`flex items-end gap-2 ${isUser ? 'justify-start' : 'justify-end'}`}>
                    {isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pale-sky font-serif text-xs text-metallic-gold">
                        {active.travelerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className={`max-w-[75%] flex flex-col gap-0.5 ${isUser ? 'items-start' : 'items-end'}`}>
                      {isSoma && (
                        <p className="text-[9px] uppercase tracking-widest text-blue-slate px-1">Soma AI</p>
                      )}
                      <div className={`rounded-2xl px-4 py-2.5 ${
                        isUser
                          ? 'rounded-bl-sm bg-platinum border border-pale-sky text-graphite'
                          : isSoma
                          ? 'rounded-br-sm bg-pale-sky text-graphite'
                          : 'rounded-br-sm bg-metallic-gold text-platinum'
                      }`}>
                        <p className="text-sm leading-relaxed">{m.content}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-1 ${isUser ? 'justify-start' : 'justify-end'}`}>
                        <p className="text-[10px] text-blue-slate">{timeLabel(m.created_at)}</p>
                        {!isUser && m.sender_type === 'counsellor' && (
                          <CheckCheck size={11} className={m.is_read ? 'text-metallic-gold' : 'text-blue-slate'} />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Quick chips */}
            <div className="shrink-0 px-4 sm:px-6 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {COUNSELLOR_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setReply(chip)}
                  className="shrink-0 rounded-full border border-pale-sky bg-platinum px-3 py-1.5 text-xs text-blue-slate hover:border-metallic-gold hover:text-metallic-gold transition-colors whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Reply bar */}
            <footer className="shrink-0 border-t border-pale-sky bg-platinum px-4 sm:px-6 py-3">
              <div className="flex items-center gap-3 rounded-full border border-pale-sky bg-platinum px-4 py-2.5 focus-within:border-metallic-gold transition-colors">
                <input
                  ref={inputRef}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendReply() }}
                  className="flex-1 bg-transparent text-sm text-graphite placeholder:text-blue-slate outline-none"
                  placeholder={`Reply to ${active.travelerName}…`}
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-metallic-gold text-platinum disabled:opacity-40 hover:bg-metallic-gold transition-colors"
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="font-serif text-lg text-blue-slate">No conversation selected</p>
              <p className="text-sm text-blue-slate/70 mt-1">Pick a thread from the left</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
