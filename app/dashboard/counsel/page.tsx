'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Send, Loader2, Mic, MicOff, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Msg = {
  id: string
  sender_type: 'user' | 'soma' | 'counsellor'
  content: string
  created_at: string
  is_read: boolean
}

const QUICK_CHIPS = [
  'What should I see today?',
  'Food recommendation',
  'Arrange a cab',
  'What to wear?',
  'Cultural etiquette here',
  'Is it safe?',
]

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function groupByDate(messages: Msg[]): { date: string; items: Msg[] }[] {
  const groups: Record<string, Msg[]> = {}
  messages.forEach((m) => {
    const key = new Date(m.created_at).toDateString()
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  })
  return Object.entries(groups).map(([key, items]) => ({
    date: formatDate(items[0].created_at),
    items,
  }))
}

export default function SomaPage() {
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [typing, setTyping] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Load messages + booking on mount
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: auth }) => {
      if (!auth.user) return
      setUserId(auth.user.id)

      const { data: booking } = await supabase
        .from('bookings')
        .select('id')
        .eq('user_id', auth.user.id)
        .in('status', ['on_path', 'confirmed', 'new'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const bid = booking?.id ?? null
      setBookingId(bid)

      const query = supabase
        .from('messages')
        .select('id, sender_type, content, created_at, is_read')
        .order('created_at', { ascending: true })
        .limit(60)

      const { data } = bid
        ? await query.eq('booking_id', bid)
        : await query.eq('thread_user_id', auth.user.id)

      const fetched = (data ?? []) as Msg[]

      if (fetched.length === 0) {
        // Seed welcome message from Soma (local only, not persisted)
        setMessages([{
          id: 'welcome',
          sender_type: 'soma',
          content: 'Namaste. I am Soma, your Solura travel companion. Ask me anything about your journey — schedule, local tips, cultural customs, or logistics. I am here.',
          created_at: new Date().toISOString(),
          is_read: true,
        }])
      } else {
        setMessages(fetched)
      }
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Real-time subscription
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('soma-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const m = payload.new as Msg
          if (m.sender_type === 'user') return
          setMessages((prev) => {
            if (prev.find((x) => x.id === m.id)) return prev
            return [...prev, m]
          })
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  async function send(text = input) {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    setInput('')
    setSending(true)
    setTyping(true)

    // Optimistically add user message
    const userMsg: Msg = {
      id: `temp-${Date.now()}`,
      sender_type: 'user',
      content: trimmed,
      created_at: new Date().toISOString(),
      is_read: false,
    }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await fetch('/api/soma', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, bookingId }),
      })
      const { reply } = await res.json() as { reply: string }

      setTyping(false)

      const somaMsg: Msg = {
        id: `soma-${Date.now()}`,
        sender_type: 'soma',
        content: reply,
        created_at: new Date().toISOString(),
        is_read: true,
      }
      setMessages((prev) => [...prev, somaMsg])
    } catch {
      setTyping(false)
      setMessages((prev) => [...prev, {
        id: `err-${Date.now()}`,
        sender_type: 'soma',
        content: 'The connection dropped for a moment. Please try again.',
        created_at: new Date().toISOString(),
        is_read: true,
      }])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.lang = 'en-IN'
    rec.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript: string = e.results[0]?.[0]?.transcript ?? ''
      if (transcript) send(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    rec.start()
    recognitionRef.current = rec
    setListening(true)
  }

  const grouped = groupByDate(messages)

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)] sm:h-[calc(100dvh-0px)] bg-platinum">

      {/* Header */}
      <div className="shrink-0 border-b border-pale-sky bg-platinum px-5 sm:px-8 py-4 flex items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-metallic-gold/10">
          <span className="font-serif text-lg text-metallic-gold">S</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-serif text-lg text-graphite leading-tight">Soma</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success inline-block" />
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">Always here · Your travel companion</p>
          </div>
        </div>
        <Link
          href="/dashboard/sos"
          className="flex items-center gap-1.5 rounded-full border border-danger bg-status-soft px-3 py-1.5 text-xs text-danger hover:border-danger transition-colors shrink-0"
        >
          <AlertTriangle size={11} />
          SOS
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 space-y-1">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 size={20} className="animate-spin text-blue-slate" />
          </div>
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              {/* Date divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-pale-sky" />
                <span className="text-[10px] uppercase tracking-widest text-blue-slate shrink-0">{group.date}</span>
                <div className="flex-1 h-px bg-pale-sky" />
              </div>

              {group.items.map((msg) => {
                const isUser = msg.sender_type === 'user'
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Soma avatar */}
                    {!isUser && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-metallic-gold/10 mb-0.5">
                        <span className="font-serif text-xs text-metallic-gold">S</span>
                      </div>
                    )}

                    <div className={`max-w-[78%] sm:max-w-md ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isUser
                            ? 'rounded-br-sm bg-graphite text-platinum'
                            : msg.sender_type === 'counsellor'
                            ? 'rounded-bl-sm bg-metallic-gold text-platinum'
                            : 'rounded-bl-sm bg-platinum border border-pale-sky text-graphite'
                        }`}
                      >
                        {!isUser && msg.sender_type === 'counsellor' && (
                          <p className="text-[9px] uppercase tracking-widest text-platinum/70 mb-1">Counsellor</p>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p className={`text-[10px] text-blue-slate px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.created_at)}
                        {isUser && <span className="ml-1">{msg.is_read ? '✓✓' : '✓'}</span>}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-end gap-2 mb-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-metallic-gold/10">
              <span className="font-serif text-xs text-metallic-gold">S</span>
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-platinum border border-pale-sky px-4 py-3">
              <div className="flex gap-1 items-center h-4">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-slate animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-slate animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-slate animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      {messages.length <= 2 && (
        <div className="shrink-0 px-4 sm:px-8 pb-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => send(chip)}
              disabled={sending}
              className="shrink-0 rounded-full border border-pale-sky bg-platinum px-3 py-1.5 text-xs text-graphite hover:border-metallic-gold hover:text-metallic-gold transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="shrink-0 border-t border-pale-sky bg-platinum px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2 rounded-full border border-pale-sky bg-platinum px-4 py-2.5 focus-within:border-metallic-gold transition-colors">
          <button
            onClick={toggleVoice}
            className={`shrink-0 transition-colors ${listening ? 'text-danger' : 'text-blue-slate hover:text-metallic-gold'}`}
            title={listening ? 'Stop listening' : 'Voice input'}
          >
            {listening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask Soma anything about your journey…"
            className="flex-1 bg-transparent text-sm text-graphite placeholder:text-blue-slate outline-none"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || sending}
            className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-metallic-gold text-platinum transition-all disabled:opacity-40 hover:bg-metallic-gold active:scale-95"
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-blue-slate">
          Soma is an AI. For emergencies, use the{' '}
          <Link href="/dashboard/sos" className="text-danger hover:underline">SOS button</Link>.
        </p>
      </div>
    </div>
  )
}
