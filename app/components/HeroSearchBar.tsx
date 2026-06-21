'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from 'lucide-react'

const DESTINATIONS = [
  'Varanasi, India',
  'Rishikesh, India',
  'Kathmandu, Nepal',
  'Pokhara, Nepal',
  'Dharamshala, India',
  'Pushkar, India',
  'Lumbini, Nepal',
  'Amritsar, India',
  'Bodh Gaya, India',
  'Tirupati, India',
]

export default function HeroSearchBar() {
  const router = useRouter()

  const [destination, setDestination] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [showTravelers, setShowTravelers] = useState(false)

  const destRef = useRef<HTMLDivElement>(null)
  const travRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)

  const filtered = destination.length > 0
    ? DESTINATIONS.filter(d => d.toLowerCase().includes(destination.toLowerCase()))
    : DESTINATIONS

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(e.target as Node)) setShowSuggestions(false)
      if (travRef.current && !travRef.current.contains(e.target as Node)) setShowTravelers(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (destination) params.set('destination', destination)
    if (date)        params.set('date', date)
    params.set('travelers', String(travelers))
    router.push(`/journeys${params.toString() ? `?${params}` : ''}`)
  }

  const formatDate = (d: string) => {
    if (!d) return 'Add dates'
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div
      className="rounded-2xl bg-white"
      style={{ boxShadow: '0 20px 64px rgba(10,18,40,0.36)' }}
    >
      <div className="flex flex-col sm:flex-row">

        {/* ── Where to ── */}
        <div ref={destRef} className="relative flex-1">
          <div className="flex cursor-text items-center gap-3 rounded-tl-2xl rounded-tr-2xl px-4 py-3 transition-colors hover:bg-[#F8F6F2] sm:rounded-tr-none sm:rounded-bl-2xl sm:gap-4 sm:px-5 sm:py-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8E8] sm:h-11 sm:w-11">
              <MapPin className="h-3.5 w-3.5 text-[#E8A317] sm:h-4 sm:w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#9BA8AF]">Where to?</span>
              <input
                type="text"
                value={destination}
                onChange={e => { setDestination(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search destinations"
                className="mt-0.5 block w-full bg-transparent text-[13px] font-semibold text-[#1F2937] outline-none placeholder:text-[#9BA8AF] sm:text-[14px]"
              />
            </div>
            {destination && (
              <button
                onClick={() => { setDestination(''); setShowSuggestions(false) }}
                className="shrink-0 text-lg leading-none text-[#C5CDD4] hover:text-[#9BA8AF]"
              >×</button>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && filtered.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-[200] mt-2 overflow-hidden rounded-xl border border-[#F0EDE8] bg-white shadow-[0_8px_40px_rgba(10,18,40,0.18)]">
              {filtered.map(d => (
                <li key={d}>
                  <button
                    onMouseDown={() => { setDestination(d); setShowSuggestions(false) }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-medium text-[#1F2937] transition-colors hover:bg-[#FFF8E8]"
                  >
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E8A317]" />
                    {d}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden sm:block w-px bg-[#F0EDE8] my-4" />

        {/* ── Check-in + Travelers (row on mobile) ── */}
        <div className="flex border-t border-[#F0EDE8] sm:contents">

          {/* Check in */}
          <button
            type="button"
            onClick={() => dateRef.current?.showPicker?.()}
            className="relative flex flex-1 cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F8F6F2] sm:gap-4 sm:px-5 sm:py-5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8E8] sm:h-11 sm:w-11">
              <CalendarDays className="h-3.5 w-3.5 text-[#E8A317] sm:h-4 sm:w-4" />
            </div>
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#9BA8AF]">Check in</span>
              <span className={`mt-0.5 block text-[13px] font-semibold sm:text-[14px] ${date ? 'text-[#1F2937]' : 'text-[#9BA8AF]'}`}>
                {formatDate(date)}
              </span>
            </div>
            {/* Hidden date input — opened programmatically */}
            <input
              ref={dateRef}
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => setDate(e.target.value)}
              className="pointer-events-none absolute opacity-0"
              tabIndex={-1}
            />
          </button>

          <div className="hidden sm:block w-px bg-[#F0EDE8] my-4" />
          <div className="block w-px bg-[#F0EDE8] my-3 sm:hidden" />

          {/* Travelers */}
          <div ref={travRef} className="relative flex-1">
            <button
              onClick={() => setShowTravelers(v => !v)}
              className="flex w-full items-center gap-3 px-4 py-3 transition-colors hover:bg-[#F8F6F2] sm:gap-4 sm:px-5 sm:py-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8E8] sm:h-11 sm:w-11">
                <Users className="h-3.5 w-3.5 text-[#E8A317] sm:h-4 sm:w-4" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#9BA8AF]">Travelers</span>
                <span className="mt-0.5 block text-[13px] font-semibold text-[#1F2937] sm:text-[14px]">
                  {travelers} Traveler{travelers !== 1 ? 's' : ''}
                </span>
              </div>
            </button>

            {showTravelers && (
              <div className="absolute left-0 right-0 top-full z-[200] mt-2 rounded-xl border border-[#F0EDE8] bg-white p-4 shadow-[0_8px_40px_rgba(10,18,40,0.18)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[13px] font-semibold text-[#1F2937]">Travelers</p>
                    <p className="text-[11px] text-[#9BA8AF]">Adults &amp; children</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTravelers(v => Math.max(1, v - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DDD8] text-[#1F2937] transition-colors hover:border-[#E8A317] hover:text-[#E8A317]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-5 text-center text-[15px] font-bold text-[#1F2937]">{travelers}</span>
                    <button
                      onClick={() => setTravelers(v => Math.min(20, v + 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E0DDD8] text-[#1F2937] transition-colors hover:border-[#E8A317] hover:text-[#E8A317]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowTravelers(false)}
                  className="mt-3 w-full rounded-lg bg-[#1D2B53] py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#E8A317]"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Search button ── */}
        <div className="flex items-stretch border-t border-[#F0EDE8] p-2.5 sm:border-0 sm:p-3.5">
          <button
            type="button"
            onClick={handleSearch}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8A317] px-6 py-2.5 text-[13px] font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#C98F12] sm:w-auto sm:rounded-[14px] sm:px-7 sm:py-3 sm:text-[14px]"
            style={{ boxShadow: '0 4px 20px rgba(232,163,23,0.42)' }}
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>

      </div>
    </div>
  )
}
