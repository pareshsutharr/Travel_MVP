'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Image as ImageIcon, Video, Music, Link2, Upload, Loader2, Star, Eye, EyeOff, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { TripHighlight, HighlightType } from '@/types/database'

const TYPE_META: Record<HighlightType, { icon: React.ElementType; label: string; accept: string; ring: string }> = {
  image: { icon: ImageIcon, label: 'Photo', accept: 'image/*',  ring: 'from-blue-slate to-metallic-gold' },
  video: { icon: Video,     label: 'Video', accept: 'video/*',  ring: 'from-blue-slate to-metallic-gold' },
  audio: { icon: Music,     label: 'Audio', accept: 'audio/*',  ring: 'from-blue-slate to-metallic-gold' },
  link:  { icon: Link2,     label: 'Link',  accept: '',         ring: 'from-metallic-gold to-metallic-gold' },
}

const labelClass = 'block text-[10px] tracking-widest uppercase text-blue-slate mb-1.5'
const inputClass = 'w-full rounded-lg border border-pale-sky bg-platinum px-4 py-2.5 text-sm text-graphite outline-none focus:border-metallic-gold'

export default function AdminHighlightsPanel({
  journeyId,
  adminUserId,
  bookingId,
}: {
  journeyId: string
  adminUserId: string
  bookingId?: string // when provided, show that booking's user highlights too
}) {
  const supabase = createClient()

  const [tab, setTab] = useState<'journey' | 'user'>(bookingId ? 'user' : 'journey')
  const [journeyHighlights, setJourneyHighlights] = useState<TripHighlight[]>([])
  const [userHighlights, setUserHighlights] = useState<TripHighlight[]>([])
  const [busy, setBusy] = useState(false)

  // add form state
  const [addOpen, setAddOpen] = useState(false)
  const [addType, setAddType] = useState<HighlightType | null>(null)
  const [addUrl, setAddUrl] = useState('')
  const [addCaption, setAddCaption] = useState('')
  const [addDay, setAddDay] = useState('')
  const [addLocation, setAddLocation] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Admin posts for this journey
    supabase
      .from('trip_highlights')
      .select('*')
      .eq('journey_id', journeyId)
      .eq('is_admin_post', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => setJourneyHighlights((data ?? []) as TripHighlight[]))

    // User highlights for this booking (if provided)
    if (bookingId) {
      supabase
        .from('trip_highlights')
        .select('*')
        .eq('booking_id', bookingId)
        .eq('is_admin_post', false)
        .order('created_at', { ascending: true })
        .then(({ data }) => setUserHighlights((data ?? []) as TripHighlight[]))
    }
  }, [journeyId, bookingId])

  async function togglePublic(highlight: TripHighlight) {
    const next = !highlight.is_public
    setBusy(true)
    const { error } = await supabase
      .from('trip_highlights')
      .update({ is_public: next, journey_id: journeyId })
      .eq('id', highlight.id)
    setBusy(false)
    if (!error) {
      setUserHighlights((prev) =>
        prev.map((h) => h.id === highlight.id ? { ...h, is_public: next, journey_id: journeyId } : h)
      )
    }
  }

  async function deleteHighlight(id: string, isJourney: boolean) {
    await supabase.from('trip_highlights').delete().eq('id', id)
    if (isJourney) setJourneyHighlights((prev) => prev.filter((h) => h.id !== id))
    else setUserHighlights((prev) => prev.filter((h) => h.id !== id))
  }

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${adminUserId}/${journeyId}/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from('trip-highlights').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: pub } = supabase.storage.from('trip-highlights').getPublicUrl(data.path)
      setAddUrl(pub.publicUrl)
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
        journey_id: journeyId,
        booking_id: null,
        user_id: adminUserId,
        type: addType,
        url: addUrl.trim(),
        caption: addCaption.trim() || null,
        day_number: addDay ? Number(addDay) : null,
        location_name: addLocation.trim() || null,
        is_admin_post: true,
        is_public: true,
      })
      .select()
      .single()
    setUploading(false)
    if (!error && data) {
      setJourneyHighlights((prev) => [...prev, data as TripHighlight])
      setTab('journey')
      resetAdd()
    }
  }

  function resetAdd() {
    setAddOpen(false); setAddType(null); setAddUrl(''); setAddCaption(''); setAddDay(''); setAddLocation('')
  }

  return (
    <div className="rounded-xl border border-pale-sky bg-platinum p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-graphite">Highlights</h2>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-graphite px-4 py-2 text-xs text-platinum hover:bg-metallic-gold transition-colors"
        >
          <Star size={11} className="fill-platinum" /> Add Journey Post
        </button>
      </div>

      {/* Tabs */}
      {bookingId && (
        <div className="flex gap-0 mb-5 rounded-lg overflow-hidden border border-pale-sky w-fit">
          {(['user', 'journey'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                tab === t ? 'bg-graphite text-platinum' : 'bg-platinum text-blue-slate hover:text-graphite'
              }`}
            >
              {t === 'user' ? 'User Stories' : 'Journey Posts'}
            </button>
          ))}
        </div>
      )}

      {/* Journey Posts tab */}
      {tab === 'journey' && (
        <div>
          {journeyHighlights.length === 0 ? (
            <div className="rounded-xl border border-dashed border-pale-sky py-10 text-center">
              <Star size={24} className="mx-auto text-metallic-gold/40 mb-2" />
              <p className="text-sm text-blue-slate">No journey posts yet.</p>
              <p className="text-xs text-blue-slate mt-1">Add posts that all travellers on this journey will see.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {journeyHighlights.map((h) => {
                const meta = TYPE_META[h.type]
                const Icon = meta.icon
                return (
                  <div key={h.id} className="relative group rounded-xl overflow-hidden border border-pale-sky aspect-square bg-pale-sky flex items-center justify-center">
                    {h.type === 'image' ? (
                      <img src={h.url} alt={h.caption ?? ''} className="w-full h-full object-cover" />
                    ) : h.type === 'link' ? (
                      <div className="flex flex-col items-center gap-2 p-3 text-center">
                        <Icon size={28} className="text-metallic-gold" />
                        <p className="text-xs text-graphite line-clamp-2">{h.caption ?? h.url}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Icon size={32} className="text-blue-slate" />
                        <p className="text-[10px] text-blue-slate">{meta.label}</p>
                      </div>
                    )}
                    {/* Caption overlay */}
                    {h.caption && (
                      <div className="absolute bottom-0 inset-x-0 bg-graphite/50 px-2 py-1.5">
                        <p className="text-[10px] text-platinum truncate">{h.caption}</p>
                      </div>
                    )}
                    {/* Delete */}
                    <button
                      onClick={() => deleteHighlight(h.id, true)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-graphite/60 text-platinum flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={11} />
                    </button>
                    <span className="absolute top-2 left-2 rounded-full bg-metallic-gold px-1.5 py-0.5 text-[8px] text-platinum font-medium flex items-center gap-0.5">
                      <Star size={7} className="fill-platinum" /> Solura
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* User Stories tab */}
      {tab === 'user' && bookingId && (
        <div>
          {userHighlights.length === 0 ? (
            <div className="rounded-xl border border-dashed border-pale-sky py-10 text-center">
              <p className="text-sm text-blue-slate">This traveller hasn't added any highlights yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userHighlights.map((h) => {
                const meta = TYPE_META[h.type]
                const Icon = meta.icon
                return (
                  <div key={h.id} className="flex items-center gap-3 rounded-xl border border-pale-sky p-3 bg-platinum">
                    {/* Preview */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-pale-sky flex items-center justify-center">
                      {h.type === 'image' ? (
                        <img src={h.url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Icon size={18} className="text-blue-slate" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-blue-slate">{meta.label}</span>
                        {h.day_number && <span className="text-[10px] text-metallic-gold">Day {h.day_number}</span>}
                        {h.location_name && <span className="text-[10px] text-blue-slate">· {h.location_name}</span>}
                      </div>
                      {h.caption && <p className="text-sm text-graphite truncate mt-0.5">{h.caption}</p>}
                      <p className="text-[10px] text-blue-slate truncate mt-0.5">{h.url}</p>
                    </div>

                    {/* Reshare toggle */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {h.is_public && (
                        <span className="text-[9px] text-warning font-medium bg-status-soft border border-warning rounded-full px-2 py-0.5">
                          Public
                        </span>
                      )}
                      <button
                        onClick={() => togglePublic(h)}
                        disabled={busy}
                        title={h.is_public ? 'Remove from public' : 'Reshare to public'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          h.is_public
                            ? 'bg-status-soft text-warning hover:bg-status-soft'
                            : 'bg-pale-sky text-blue-slate hover:bg-metallic-gold/10 hover:text-metallic-gold'
                        }`}
                      >
                        {h.is_public ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => deleteHighlight(h.id, false)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-pale-sky text-blue-slate hover:bg-status-soft hover:text-danger transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <p className="mt-3 text-[10px] text-blue-slate">
            Eye icon → reshares to public journey highlights visible to all travellers on this journey.
          </p>
        </div>
      )}

      {/* Add post modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 bg-graphite/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4" onClick={resetAdd}>
          <div className="bg-platinum rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-graphite">Add Journey Post</h3>
                <p className="text-xs text-blue-slate mt-0.5">Visible to all travellers on this journey</p>
              </div>
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
                    <label className={labelClass}>URL</label>
                    <input autoFocus className={inputClass} placeholder="https://…" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} />
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
                          <p className="text-sm text-blue-slate">Upload {TYPE_META[addType].label.toLowerCase()}</p>
                          <p className="text-xs text-metallic-gold mt-1">or paste URL below</p>
                        </>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept={TYPE_META[addType].accept} className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                    <div>
                      <label className={labelClass}>Or paste URL</label>
                      <input className={inputClass} placeholder="https://…" value={addUrl} onChange={(e) => setAddUrl(e.target.value)} />
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClass}>Caption</label>
                  <input className={inputClass} placeholder="Describe this moment…" value={addCaption} onChange={(e) => setAddCaption(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Day</label>
                    <input type="number" min={1} className={inputClass} placeholder="e.g. 3" value={addDay} onChange={(e) => setAddDay(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} placeholder="Varanasi…" value={addLocation} onChange={(e) => setAddLocation(e.target.value)} />
                  </div>
                </div>

                <button onClick={handleSave} disabled={!addUrl.trim() || uploading}
                  className="w-full rounded-full bg-graphite py-3 text-sm text-platinum disabled:opacity-40 hover:bg-metallic-gold transition-colors">
                  {uploading ? 'Publishing…' : 'Publish to journey'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
