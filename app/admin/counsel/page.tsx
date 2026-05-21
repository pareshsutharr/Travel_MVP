'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Send, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Thread = {
  bookingId: string
  bookingRef: string
  travelerName: string
  location: string | null
  journeyTitle: string | null
  lastMessage: string
  unreadCount: number
}

type MessageRow = {
  id: string
  booking_id: string | null
  sender_id: string
  sender_type: 'user' | 'counsellor' | 'soma'
  content: string
  is_read: boolean
  created_at: string
  booking?: { id: string; ref: string; traveler_name: string; current_location: string | null; journey?: { title: string } | null } | null
}

export default function AdminCounsel() {
  const supabase = createClient()
  const [messages, setMessages] = useState<MessageRow[]>([])
  const [selected, setSelected] = useState<string>('')
  const [reply, setReply] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    supabase.from('messages').select('*, booking:bookings(id, ref, traveler_name, current_location, journey:journeys(title))').order('created_at').then(({ data }) => {
      const rows = (data ?? []) as MessageRow[]
      setMessages(rows)
      setSelected(rows.find((row) => row.booking_id)?.booking_id ?? '')
    })
  }, [supabase])

  const threads = useMemo(() => {
    const map = new Map<string, Thread>()
    messages.forEach((message) => {
      const booking = message.booking
      if (!booking || !message.booking_id) return
      const existing = map.get(message.booking_id)
      map.set(message.booking_id, {
        bookingId: message.booking_id,
        bookingRef: booking.ref,
        travelerName: booking.traveler_name,
        location: booking.current_location,
        journeyTitle: booking.journey?.title ?? null,
        lastMessage: message.content,
        unreadCount: (existing?.unreadCount ?? 0) + (!message.is_read && message.sender_type === 'user' ? 1 : 0),
      })
    })
    return Array.from(map.values()).filter((thread) => thread.travelerName.toLowerCase().includes(query.toLowerCase()))
  }, [messages, query])
  const active = threads.find((thread) => thread.bookingId === selected)
  const threadMessages = messages.filter((message) => message.booking_id === selected)

  async function sendReply() {
    if (!reply.trim() || !selected) return
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('messages').insert({ booking_id: selected, sender_id: user.id, sender_type: 'counsellor', content: reply.trim() })
    setReply('')
    const { data } = await supabase.from('messages').select('*, booking:bookings(id, ref, traveler_name, current_location, journey:journeys(title))').order('created_at')
    setMessages((data ?? []) as MessageRow[])
  }

  return (
    <div className="flex h-full bg-[#FAFAF8]">
      <aside className="w-80 shrink-0 border-r border-[#E8E3D9] bg-white">
        <div className="border-b border-[#E8E3D9] p-5"><p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Inbox</p><h1 className="font-serif text-2xl text-[#1C1917]">{threads.filter((t) => t.unreadCount).length} need you</h1><div className="relative mt-4"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9589]" /><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-full border border-[#E8E3D9] bg-[#FAFAF8] py-2 pl-8 pr-3 text-xs outline-none focus:border-[#B89A4E]" placeholder="Search travellers..." /></div></div>
        {threads.map((thread) => <button key={thread.bookingId} onClick={() => setSelected(thread.bookingId)} className={`w-full border-b border-[#E8E3D9] p-4 text-left hover:bg-[#FAFAF8] ${selected === thread.bookingId ? 'border-l-2 border-l-[#B89A4E] bg-[#FAFAF8]' : ''}`}><div className="flex gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E8] text-xs text-[#B89A4E]">{thread.travelerName[0]}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#1C1917]">{thread.travelerName}</p><p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">{thread.location ?? thread.bookingRef}</p><p className="truncate text-xs text-[#9C9589]">{thread.lastMessage}</p></div>{thread.unreadCount > 0 && <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B89A4E] text-[10px] text-white">{thread.unreadCount}</span>}</div></button>)}
      </aside>
      <main className="flex min-w-0 flex-1 flex-col">
        {active ? <><header className="flex items-center justify-between border-b border-[#E8E3D9] bg-white px-6 py-4"><div><p className="text-sm font-medium text-[#1C1917]">{active.travelerName}</p><p className="text-xs text-[#9C9589]">{active.location} · {active.journeyTitle}</p></div><Link href="/admin/bookings" className="text-xs text-[#B89A4E]">Open booking -&gt;</Link></header><div className="flex-1 space-y-4 overflow-auto p-6">{threadMessages.map((message) => <div key={message.id} className={`flex ${message.sender_type === 'user' ? 'justify-start' : 'justify-end'}`}><div className={`max-w-md rounded-xl px-4 py-3 ${message.sender_type === 'user' ? 'border border-[#E8E3D9] bg-white' : 'bg-[#F5F0E8]'}`}><p className="text-sm leading-relaxed text-[#1C1917]">{message.content}</p><p className="mt-1 text-[10px] text-[#9C9589]">{new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div></div>)}<div className="flex flex-wrap gap-2">{['Offer late breakfast', 'Add an afternoon rest', 'Reroute to Sarnath only'].map((chip) => <button key={chip} onClick={() => setReply(chip)} className="rounded-full border border-[#E8E3D9] px-3 py-1.5 text-xs text-[#9C9589] hover:border-[#B89A4E] hover:text-[#B89A4E]">✦ {chip}</button>)}</div></div><footer className="border-t border-[#E8E3D9] bg-white p-4"><div className="flex items-center gap-3 rounded-xl border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-3"><input value={reply} onChange={(e) => setReply(e.target.value)} className="flex-1 bg-transparent text-sm outline-none" placeholder={`Reply to ${active.travelerName}...`} /><button onClick={sendReply} className="text-[#B89A4E]"><Send size={16} /></button></div></footer></> : <div className="flex flex-1 items-center justify-center text-sm text-[#9C9589]">Select a conversation</div>}
      </main>
    </div>
  )
}
