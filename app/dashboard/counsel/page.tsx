'use client'

import { useEffect, useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ChatMessage = { sender: 'soma' | 'user'; content: string }

export default function SomaPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'soma', content: 'Good morning. The Ganga aarti starts in an hour. Shall I have Rajesh meet you at the ghat at 6:15?' }])
  const [input, setInput] = useState('')

  useEffect(() => {
    createClient().from('messages').select('sender_type, content').limit(8).then(({ data }) => {
      if (data?.length) setMessages((current) => [...current, ...data.map((row) => ({ sender: row.sender_type === 'user' ? 'user' as const : 'soma' as const, content: row.content }))])
    })
  }, [])

  function send(text = input) {
    if (!text.trim()) return
    setMessages((current) => [...current, { sender: 'user', content: text }])
    setInput('')
    window.setTimeout(() => setMessages((current) => [...current, { sender: 'soma', content: text.toLowerCase().includes('wear') ? 'Light cotton, comfortable shoes. It may be cool by the river.' : text.includes('6:30') ? 'Done. Rajesh will meet you at 6:30.' : 'I will arrange that and keep the day quiet.' }]), 600)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="border-b border-[#E8E3D9] bg-white px-8 py-5"><h1 className="font-serif text-2xl text-[#1C1917]">Soma</h1><p className="text-xs uppercase tracking-widest text-[#B89A4E]">Always listening</p></header>
      <main className="flex-1 space-y-4 overflow-auto px-8 py-6">{messages.map((message, index) => <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md rounded-xl px-4 py-3 ${message.sender === 'user' ? 'border border-[#E8E3D9] bg-white' : 'bg-[#F5F0E8]'}`}><p className="text-sm leading-relaxed text-[#1C1917]">{message.content}</p></div></div>)}<div className="flex flex-wrap gap-2">{['Yes, please', 'Make it 6:30', 'What should I wear?'].map((chip) => <button key={chip} onClick={() => send(chip)} className="rounded-full border border-[#1C1917] px-3 py-1 text-xs hover:bg-[#1C1917] hover:text-white">{chip}</button>)}</div></main>
      <footer className="border-t border-[#E8E3D9] bg-white p-4"><div className="flex items-center gap-3 rounded-full border border-[#E8E3D9] px-4 py-3"><Mic size={16} className="text-[#9C9589]" /><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 outline-none" placeholder="Ask Soma anything..." /><button onClick={() => send()} className="text-[#B89A4E]"><Send size={16} /></button></div></footer>
    </div>
  )
}
