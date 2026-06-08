'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Image as ImageIcon, Video, Music, Link2, Upload, ExternalLink, Loader2, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { TripHighlight, HighlightType } from '@/types/database'

const TYPE_META: Record<HighlightType, { icon: React.ElementType; label: string; accept: string; ring: string }> = {
  image: { icon: ImageIcon, label: 'Photo', accept: 'image/*',  ring: 'from-blue-slate to-metallic-gold' },
  video: { icon: Video,     label: 'Video', accept: 'video/*',  ring: 'from-blue-slate to-metallic-gold' },
  audio: { icon: Music,     label: 'Audio', accept: 'audio/*',  ring: 'from-blue-slate to-metallic-gold' },
  link:  { icon: Link2,     label: 'Link',  accept: '',         ring: 'from-metallic-gold to-metallic-gold' },
}

const STORY_DURATION_MS = 5000

export default function TripHighlights({
  bookingId,
  journeyId,
  userId,
  totalDays,
}: {
  bookingId: string
  journeyId: string
  userId: string
  totalDays: number
}) {
  const supabase = createClient()

  const [highlights, setHighlights] = useState<TripHighlight[]>([])
  const [loading, setLoading] = useState(true)

  // viewer
  const [viewerIdx, setViewerIdx] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // add modal
  const [addOpen, setAddOpen] = useState(false)
  const [addType, setAddType] = useState<HighlightType | null>(null)
  const [addUrl, setAddUrl] = useState('')
  const [addCaption, setAddCaption] = useState('')
  const [addDay, setAddDay] = useState('')
  const [addLocation, setAddLocation] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase
      .from('trip_highlights')
      .select('*')
      .or(
        `and(booking_id.eq.${bookingId},user_id.eq.${userId}),` +
        `and(is_admin_post.eq.true,journey_id.eq.${journeyId}),` +
        `and(is_public.eq.true,journey_id.eq.${journeyId})`
      )
      .order('is_admin_post', { ascending: false })
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setHighlights((data ?? []) as TripHighlight[])
        setLoading(false)
      })
  }, [bookingId, journeyId, userId])

  // auto-advance timer (images + links only)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!viewerOpen || highlights.length === 0) return
    const current = highlights[viewerIdx]
    if (!current || current.type === 'video' || current.type === 'audio') {
      setProgress(0)
      return
    }
    setProgress(0)
    const tick = 100
    const steps = STORY_DURATION_MS / tick
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / steps
        if (next >= 100) {
          clearInterval(timerRef.current!)
          setTimeout(() => {
            setViewerIdx((i) => {
              if (i < highlights.length - 1) return i + 1
              setViewerOpen(false)
              return i
            })
            setProgress(0)
          }, 80)
          return 100
        }
        return next
      })
    }, tick)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [viewerOpen, viewerIdx, highlights])

  // keyboard nav
  useEffect(() => {
    if (!viewerOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') navigate('prev')
      if (e.key === 'ArrowRight') navigate('next')
      if (e.key === 'Escape') closeViewer()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewerOpen, viewerIdx, highlights.length])

  function openViewer(idx: number) { setViewerIdx(idx); setProgress(0); setViewerOpen(true) }
  function closeViewer() { setViewerOpen(false); setProgress(0) }
  function navigate(dir: 'prev' | 'next') {
    setProgress(0)
    setViewerIdx((i) => dir === 'prev' ? Math.max(0, i - 1) : Math.min(highlights.length - 1, i + 1))
  }

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${userId}/${bookingId}/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('trip-highlights').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: pub } = supabase.storage.from('trip-highlights').getPublicUrl(data.path)
      setAddUrl(pub.publicUrl)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!addType || !addUrl.trim()) return
    setUploading(true)
    const { data, error } = await supabase
      .from('trip_highlights')
      .insert({
        booking_id: bookingId,
        journey_id: journeyId,
        user_id: userId,
        type: addType,
        url: addUrl.trim(),
        caption: addCaption.trim() || null,
        day_number: addDay ? Number(addDay) : null,
        location_name: addLocation.trim() || null,
        is_admin_post: false,
        is_public: false,
      })
      .select()
      .single()
    setUploading(false)
    if (!error && data) { setHighlights((prev) => [...prev, data as TripHighlight]); resetAdd() }
  }

  async function deleteHighlight(id: string) {
    await supabase.from('trip_highlights').delete().eq('id', id)
    const next = highlights.filter((h) => h.id !== id)
    setHighlights(next)
    if (next.length === 0) closeViewer()
    else setViewerIdx((i) => Math.min(i, next.length - 1))
  }

  function resetAdd() {
    setAddOpen(false); setAddType(null); setAddUrl(''); setAddCaption(''); setAddDay(''); setAddLocation('')
  }

  const current = highlights[viewerIdx]
  const isOwn = (h: TripHighlight) => !h.is_admin_post && !h.is_public

  return (
    <>
      {/* ── HIGHLIGHTS STRIP ─────────────────────────────────────── */}
      <div className="rounded-xl border border-pale-sky bg-platinum p-4">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">Trip Highlights</p>
        <div className="flex items-center gap-4 overflow-x-auto pb-1">
          {/* Add button */}
          <button onClick={() => setAddOpen(true)} className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <div className="w-[60px] h-[60px] rounded-full border-2 border-dashed border-metallic-gold/40 flex items-center justify-center bg-platinum hover:bg-pale-sky transition-colors">
              <Plus size={20} className="text-metallic-gold" />
            </div>
            <span className="text-[9px] text-blue-slate">Add</span>
          </button>

          {!loading && highlights.length === 0 && (
            <p className="text-xs text-blue-slate italic">No highlights yet — add your first moment.</p>
          )}

          {highlights.map((h, i) => {
            const meta = TYPE_META[h.type]
            const Icon = meta.icon
            const ring = h.is_admin_post
              ? 'from-metallic-gold via-metallic-gold to-metallic-gold'
              : h.is_public
                ? 'from-blue-slate to-metallic-gold'
                : meta.ring
            return (
              <button key={h.id} onClick={() => openViewer(i)} className="flex-shrink-0 flex flex-col items-center gap-1.5 relative">
                <div className={`w-[60px] h-[60px] rounded-full p-0.5 bg-gradient-to-br ${ring}`}>
                  <div className="w-full h-full rounded-full bg-pale-sky overflow-hidden flex items-center justify-center">
                    {h.type === 'image' ? (
                      <img src={h.url} alt={h.caption ?? ''} className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={20} className="text-platinum drop-shadow" />
                    )}
                  </div>
                </div>
                {h.is_admin_post && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-metallic-gold flex items-center justify-center">
                    <Star size={8} className="text-platinum fill-platinum" />
                  </span>
                )}
                <span className="text-[9px] text-blue-slate max-w-[60px] text-center truncate">
                  {h.is_admin_post ? 'Solura' : h.day_number ? `Day ${h.day_number}` : h.caption ? h.caption.slice(0, 7) : meta.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── STORY VIEWER ─────────────────────────────────────────── */}
      {viewerOpen && current && (
        <div className="fixed inset-0 z-[60] bg-graphite flex flex-col select-none">
          {/* Progress bars */}
          <div className="flex gap-1 px-4 pt-12 pb-2">
            {highlights.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-platinum/25 rounded-full overflow-hidden">
                <div
                  className="h-full bg-platinum rounded-full"
                  style={{ width: i < viewerIdx ? '100%' : i === viewerIdx ? `${progress}%` : '0%' }}
                />
              </div>
            ))}
          </div>

          {/* Top bar */}
          <div className="flex items-start justify-between px-4 py-2">
            <div>
              {current.is_admin_post && (
                <span className="inline-flex items-center gap-1 rounded-full bg-metallic-gold px-2 py-0.5 text-[9px] font-medium text-platinum mb-1">
                  <Star size={8} className="fill-platinum" /> SOLURA PICK
                </span>
              )}
              {current.is_public && !current.is_admin_post && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning px-2 py-0.5 text-[9px] font-medium text-platinum mb-1">
                  ↗ CURATED
                </span>
              )}
              {current.day_number && <p className="text-xs text-platinum/60 uppercase tracking-widest">Day {current.day_number}</p>}
              {current.location_name && <p className="text-sm font-medium text-platinum leading-snug">{current.location_name}</p>}
            </div>
            <div className="flex items-center gap-4">
              {isOwn(current) && (
                <button onClick={() => deleteHighlight(current.id)} className="text-platinum/40 hover:text-danger transition-colors" title="Delete">
                  <X size={15} />
                </button>
              )}
              <button onClick={closeViewer} className="text-platinum"><X size={20} /></button>
            </div>
          </div>

          {/* Media */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {current.type === 'image' && (
              <img src={current.url} alt={current.caption ?? ''} className="max-h-full max-w-full object-contain" draggable={false} />
            )}
            {current.type === 'video' && (
              <video key={current.url} src={current.url} controls autoPlay className="max-h-full max-w-full" />
            )}
            {current.type === 'audio' && (
              <div className="flex flex-col items-center gap-8 p-8">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-slate to-metallic-gold flex items-center justify-center shadow-2xl">
                  <Music size={52} className="text-platinum" />
                </div>
                {current.caption && <p className="text-platinum text-lg font-medium text-center max-w-xs">{current.caption}</p>}
                <audio key={current.url} src={current.url} controls autoPlay className="w-72 max-w-[90vw]" />
              </div>
            )}
            {current.type === 'link' && (
              <div className="max-w-sm w-full mx-6 bg-platinum rounded-2xl p-8 flex flex-col items-center gap-5 shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-metallic-gold to-metallic-gold flex items-center justify-center">
                  <Link2 size={28} className="text-platinum" />
                </div>
                {current.caption && <p className="font-serif text-xl text-graphite text-center">{current.caption}</p>}
                <a href={current.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-metallic-gold hover:underline break-all text-center">
                  <ExternalLink size={14} className="shrink-0" />{current.url}
                </a>
              </div>
            )}
            {/* Tap zones */}
            <button className="absolute left-0 top-0 h-full w-1/3" onClick={() => navigate('prev')} aria-label="Previous" />
            <button className="absolute right-0 top-0 h-full w-1/3" onClick={() => navigate('next')} aria-label="Next" />
          </div>

          {current.caption && current.type !== 'audio' && (
            <div className="px-6 py-4 pb-10">
              <p className="text-sm text-platinum leading-relaxed">{current.caption}</p>
            </div>
          )}
        </div>
      )}

      {/* ── ADD MODAL ────────────────────────────────────────────── */}
      {addOpen && (
        <div className="fixed inset-0 z-[60] bg-graphite/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={resetAdd}>
          <div className="bg-platinum rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-graphite">Add to Highlights</h3>
              <button onClick={resetAdd}><X size={18} className="text-blue-slate" /></button>
            </div>

            {!addType ? (
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(TYPE_META) as [HighlightType, typeof TYPE_META[HighlightType]][]).map(([type, meta]) => {
                  const Icon = meta.icon
                  return (
                    <button key={type} onClick={() => setAddType(type)}
                      className="flex flex-col items-center gap-3 rounded-xl border border-pale-sky p-5 hover:border-metallic-gold hover:bg-platinum transition-colors">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${meta.ring} flex items-center justify-center`}>
                        <Icon size={20} className="text-platinum" />
                      </div>
                      <span className="text-sm font-medium text-graphite">{meta.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                <button onClick={() => { setAddType(null); setAddUrl('') }} className="text-xs text-blue-slate hover:text-graphite">← Change type</button>

                {addType === 'link' ? (
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-blue-slate mb-1.5">URL</label>
                    <input autoFocus className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm outline-none focus:border-metallic-gold"
                      placeholder="https://…" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div onClick={() => !uploading && fileRef.current?.click()}
                      className="cursor-pointer rounded-xl border-2 border-dashed border-pale-sky bg-platinum p-6 text-center hover:border-metallic-gold transition-colors">
                      {uploading ? (
                        <Loader2 size={24} className="mx-auto text-metallic-gold animate-spin" />
                      ) : addUrl ? (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-success">✓ Uploaded</p>
                          <p className="text-[10px] text-blue-slate truncate">{addUrl.split('/').pop()}</p>
                          <button onClick={(e) => { e.stopPropagation(); setAddUrl('') }} className="text-[10px] text-blue-slate hover:text-danger underline">Remove</button>
                        </div>
                      ) : (
                        <>
                          <Upload size={22} className="mx-auto text-blue-slate mb-2" />
                          <p className="text-sm text-blue-slate">Tap to upload {TYPE_META[addType].label.toLowerCase()}</p>
                          <p className="text-xs text-metallic-gold mt-1">or paste a URL below</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept={TYPE_META[addType].accept} className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-blue-slate mb-1.5">Or paste URL</label>
                      <input className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm outline-none focus:border-metallic-gold"
                        placeholder="https://…" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-blue-slate mb-1.5">Caption</label>
                  <input className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm outline-none focus:border-metallic-gold"
                    placeholder="What's this moment?" value={addCaption} onChange={(e) => setAddCaption(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-blue-slate mb-1.5">Day</label>
                    <select className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm outline-none focus:border-metallic-gold"
                      value={addDay} onChange={(e) => setAddDay(e.target.value)}>
                      <option value="">—</option>
                      {Array.from({ length: totalDays }, (_, i) => (
                        <option key={i + 1} value={i + 1}>Day {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-blue-slate mb-1.5">Location</label>
                    <input className="w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm outline-none focus:border-metallic-gold"
                      placeholder="Varanasi…" value={addLocation} onChange={(e) => setAddLocation(e.target.value)} />
                  </div>
                </div>

                <button onClick={handleSave} disabled={!addUrl.trim() || uploading}
                  className="w-full rounded-full bg-graphite py-3 text-sm text-platinum disabled:opacity-40 hover:bg-metallic-gold transition-colors">
                  {uploading ? 'Saving…' : 'Save highlight'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
