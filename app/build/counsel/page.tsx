'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send } from 'lucide-react'

type Message = { sender: 'soma' | 'user'; content: string }

export default function BuildCounselPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([{ sender: 'soma', content: 'What season of life are you in, and what do you hope to leave behind for a little while?' }])
  const [input, setInput] = useState('')
  const drafted = messages.some((message) => message.sender === 'user')

  function send(text = input) {
    if (!text.trim()) return
    setMessages((current) => [...current, { sender: 'user', content: text }, { sender: 'soma', content: 'I drafted a slow spiritual route with dawn river time, fewer transfers, and boutique stays.' }])
    setInput('')
  }

  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-widest text-[#B89A4E]">AI Counsellor</p>
      <h1 className="font-serif text-4xl text-[#1C1917]">Tell me about the <span className="italic text-[#B89A4E]">journey you imagine.</span></h1>
      <div className="mt-8 space-y-4">{messages.map((message, index) => <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-md rounded-xl px-4 py-3 ${message.sender === 'user' ? 'border border-[#E8E3D9] bg-white' : 'bg-[#F5F0E8]'}`}><p className="text-sm text-[#1C1917]">{message.content}</p></div></div>)}</div>
      {drafted && <div className="mt-5 rounded-xl border border-[#E8E3D9] bg-white p-5"><p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">A draft for you</p><h2 className="font-serif text-2xl text-[#1C1917]">14 days · The Slow Ganges</h2>{['Day 1-4 · Varanasi · Assi Ghat heritage stay', 'Day 5-7 · Sarnath · meditative day trips', 'Day 8-11 · Bodh Gaya · Mahabodhi residency', 'Day 12-14 · Rishikesh · river silence'].map((line) => <p key={line} className="mt-2 text-sm text-[#9C9589]">{line}</p>)}<div className="mt-4 flex gap-2">{['Make it slower', 'Add Nepal', 'Less travel', 'More yoga'].map((chip) => <button key={chip} onClick={() => send(chip)} className="rounded-full border border-[#E8E3D9] px-3 py-1 text-xs text-[#1C1917]">{chip}</button>)}</div></div>}
      <div className="mt-6 flex items-center gap-3 rounded-full border border-[#E8E3D9] bg-white px-4 py-3"><input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 outline-none" placeholder="Share your pace, dates, people..." /><button onClick={() => send()} className="text-[#B89A4E]"><Send size={16} /></button></div>
      <button onClick={() => router.push('/build/review')} className="mt-6 w-full rounded-full bg-[#1C1917] py-3 text-sm text-white">See the basket -&gt;</button>
    </div>
  )
}
