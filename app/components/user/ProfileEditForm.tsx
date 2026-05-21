'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Check } from 'lucide-react'
import type { Profile } from '@/types/database'

const inputClass = 'w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917] outline-none focus:border-[#B89A4E] transition-colors'
const labelClass = 'block text-[10px] tracking-widest uppercase text-[#9C9589] mb-1.5'

const TRAVEL_STYLES = ['Spiritual', 'Wellness', 'Heritage', 'Adventure', 'Slow travel', 'Culture', 'Nature', 'Pilgrimage']
const PACE = ['Very slow', 'Slow', 'Moderate', 'Active']

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const router = useRouter()
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [phone, setPhone] = useState(profile.phone ?? '')
  const [location, setLocation] = useState(profile.location ?? '')
  const [styles, setStyles] = useState<string[]>(
    (profile.preferences?.styles as string[] | undefined) ?? []
  )
  const [pace, setPace] = useState<string>(
    (profile.preferences?.pace as string | undefined) ?? 'Slow'
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function toggleStyle(s: string) {
    setStyles((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])
  }

  async function save() {
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        location,
        preferences: { ...profile.preferences, styles, pace },
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="rounded-xl border border-[#E8E3D9] bg-white p-6 space-y-5">
      <h2 className="font-serif text-xl text-[#1C1917]">Edit profile</h2>

      <div className="grid gap-4">
        <div>
          <label className={labelClass}>Full name</label>
          <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
        </div>
        <div>
          <label className={labelClass}>Home city / country</label>
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Travel style (pick all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {TRAVEL_STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStyle(s)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${styles.includes(s) ? 'bg-[#1C1917] text-white' : 'border border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Preferred pace</label>
        <div className="flex gap-2 mt-2">
          {PACE.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPace(p)}
              className={`rounded-full px-3 py-1 text-xs transition-colors ${pace === p ? 'bg-[#B89A4E] text-white' : 'border border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <button
        onClick={save}
        disabled={saving || !fullName.trim()}
        className="flex items-center gap-2 rounded-full bg-[#1C1917] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#B89A4E] disabled:opacity-40"
      >
        {saved ? <Check size={14} /> : <Save size={14} />}
        {saved ? 'Saved' : saving ? 'Saving…' : 'Save profile'}
      </button>
    </div>
  )
}
