'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Loader2, X } from 'lucide-react'
import type { PlaceResult } from '@/app/api/places/search/route'

type Props = {
  value?: string
  placeholder?: string
  className?: string
  iconClassName?: string
  showIcon?: boolean
  onSelect: (name: string, lat: number, lng: number) => void
  onChange?: (value: string) => void
}

export default function PlaceAutocomplete({
  value = '',
  placeholder = 'Search any city, place, country…',
  className = '',
  iconClassName = 'text-metallic-gold',
  showIcon = true,
  onSelect,
  onChange,
}: Props) {
  const [text, setText] = useState(value)
  const [predictions, setPredictions] = useState<PlaceResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selecting, setSelecting] = useState(false)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setText(value) }, [value])

  function calcPos() {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setDropPos({ top: r.bottom + 2, left: r.left, width: r.width })
  }

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setPredictions([]); setOpen(false); return }
    setSearching(true)
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`)
      const data = await res.json() as { results: PlaceResult[] }
      const list = data.results ?? []
      setPredictions(list)
      if (list.length > 0) { calcPos(); setOpen(true) } else { setOpen(false) }
    } catch {
      setPredictions([])
    } finally {
      setSearching(false)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    setText(v)
    onChange?.(v)
    setHighlighted(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 300)
  }

  async function handleSelect(p: PlaceResult) {
    setOpen(false)
    setPredictions([])

    // If lat/lng already in result (Text Search / Geocode path), use immediately
    if (p.lat !== undefined && p.lng !== undefined) {
      const name = p.name
      setText(name)
      onChange?.(name)
      onSelect(name, p.lat, p.lng)
      return
    }

    // Otherwise fetch Place Details for exact coordinates
    setSelecting(true)
    setText(p.description) // show full description while loading
    onChange?.(p.name)
    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(p.placeId)}`)
      const detail = await res.json() as { name: string; lat: number; lng: number; error?: string }
      if (detail.lat && detail.lng) {
        const name = detail.name || p.name
        setText(name)
        onChange?.(name)
        onSelect(name, detail.lat, detail.lng)
      }
    } catch {
      // keep text, coords won't be set
    } finally {
      setSelecting(false)
    }
  }

  function handleClear() {
    setText(''); onChange?.(''); setPredictions([]); setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || predictions.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, predictions.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, 0)) }
    if (e.key === 'Enter' && highlighted >= 0) { e.preventDefault(); handleSelect(predictions[highlighted]) }
    if (e.key === 'Escape') { setOpen(false) }
  }

  // Reposition on scroll/resize
  useEffect(() => {
    if (!open) return
    const update = () => calcPos()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update) }
  }, [open])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const busy = searching || selecting

  return (
    <div ref={containerRef} className="relative w-full">
      {showIcon && !busy && (
        <MapPin size={13} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${iconClassName}`} />
      )}
      {busy && (
        <Loader2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-metallic-gold animate-spin" />
      )}
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => { if (predictions.length > 0) { calcPos(); setOpen(true) } }}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        className={`w-full pl-9 ${text ? 'pr-8' : 'pr-4'} ${className}`}
      />
      {text && !busy && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-slate hover:text-graphite transition-colors"
          onMouseDown={(e) => { e.preventDefault(); handleClear() }}
        >
          <X size={13} />
        </button>
      )}

      {/* Dropdown — fixed position to escape overflow:hidden parents */}
      {open && predictions.length > 0 && (
        <ul
          style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
          className="rounded-xl border border-pale-sky bg-platinum shadow-2xl overflow-hidden"
        >
          {predictions.map((p, i) => (
            <li key={p.placeId} className="border-b border-pale-sky last:border-0">
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); handleSelect(p) }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  highlighted === i ? 'bg-pale-sky' : 'hover:bg-platinum'
                }`}
              >
                <MapPin size={14} className="text-metallic-gold shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-graphite truncate">{p.name}</p>
                  {p.description !== p.name && (
                    <p className="text-xs text-blue-slate truncate mt-0.5">{p.description}</p>
                  )}
                </div>
              </button>
            </li>
          ))}
          <li className="px-4 py-1.5 flex items-center justify-end gap-1">
            <span className="text-[9px] text-blue-slate">Powered by</span>
            <span className="text-[9px] font-medium text-blue-slate">Google</span>
          </li>
        </ul>
      )}
    </div>
  )
}
