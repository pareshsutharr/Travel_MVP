import Link from 'next/link'
import { Calendar, CheckCircle2, Compass, FileText, Heart, MapPin, Route } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { initials } from '@/lib/utils'
import ProfileEditForm from '@/app/components/user/ProfileEditForm'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Journey | null }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profileData } = user ? await supabase.from('profiles').select('*').eq('id', user.id).single() : { data: null }
  const { data: bookingData } = user ? await supabase.from('bookings').select('*, journey:journeys(*)').eq('user_id', user.id) : { data: [] }
  const profile = profileData as Profile | null
  const bookings = (bookingData ?? []) as BookingRow[]
  const active = bookings.find((booking) => booking.status === 'on_path')
  const prefs = Object.values(profile?.preferences ?? {}).flat().filter(Boolean).map(String)

  return (
    <div className="grid max-w-6xl gap-6 px-8 py-8 lg:grid-cols-5">
      <main className="space-y-5 lg:col-span-3">
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-6"><div className="flex items-center gap-4">{profile?.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name ?? 'Traveller'} className="h-20 w-20 rounded-full object-cover ring-4 ring-[#F5F0E8]" /> : <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F0E8] font-serif text-3xl text-[#B89A4E]">{initials(profile?.full_name ?? 'Traveller')}</div>}<div><h1 className="font-serif text-4xl text-[#1C1917]">{profile?.full_name}</h1><p className="text-[10px] uppercase tracking-widest text-[#B89A4E]">Seeker · Since {profile ? new Date(profile.member_since).getFullYear() : 2026}</p><p className="mt-2 text-sm text-[#9C9589]">{profile?.email} · {profile?.location ?? 'Location not set'}</p>{profile?.avatar_url && <p className="mt-1 text-[10px] uppercase tracking-widest text-[#9C9589]">Google profile connected</p>}</div></div><div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#E8E3D9] pt-5 text-center"><div><p className="font-serif text-3xl">{profile?.journeys_count ?? 0}</p><p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Journeys</p></div><div><p className="font-serif text-3xl">{profile?.cities_count ?? 0}</p><p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Cities</p></div><div><p className="font-serif text-3xl">{bookings.reduce((s, b) => s + (b.journey?.duration ?? 0), 0)}</p><p className="text-[10px] uppercase tracking-widest text-[#9C9589]">Days</p></div></div></div>
        {active && <Link href={`/dashboard/trips/${active.id}`} className="block rounded-xl border border-[#B89A4E]/30 bg-[#F5F0E8] p-5"><p className="text-xs uppercase tracking-widest text-[#B89A4E]">Active · Day {active.current_day}</p><h2 className="font-serif text-2xl text-[#1C1917]">{active.journey?.title}</h2><p className="text-sm text-[#9C9589]">{active.current_location}</p></Link>}
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">Personal profile login</p>
          {[
            [CheckCircle2, `Bookings done · ${bookings.length}`, '/dashboard/trips'],
            [Calendar, 'Tour manager', '/dashboard/trips'],
            [Compass, 'Tour details', '/dashboard/trips'],
            [MapPin, 'According to profile GPS tracker', active ? `/dashboard/trips/${active.id}` : '/dashboard/trips'],
            [Route, 'Destination manager from wishlist', '/dashboard/wishlist'],
            [Heart, 'Wishlist preferences', '/dashboard/wishlist'],
            [FileText, 'Visas, passports & insurance', '/dashboard/documents'],
          ].map(([Icon, label, href]) => { const I = Icon as typeof Calendar; return <Link key={String(label)} href={String(href)} className="flex items-center gap-3 border-b border-[#E8E3D9] py-3 text-sm text-[#1C1917] last:border-0"><I size={16} className="text-[#B89A4E]" />{String(label)}<span className="ml-auto text-[#B89A4E]">-&gt;</span></Link> })}
        </div>
      </main>
      <aside className="space-y-5 lg:col-span-2">
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-5">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">Travel preferences</p>
          <div className="flex flex-wrap gap-2">
            {prefs.length ? prefs.map((tag) => <span key={tag} className="rounded-full bg-[#F5F0E8] px-3 py-1 text-xs capitalize text-[#1C1917]">{tag}</span>) : <p className="text-xs text-[#9C9589]">Soma will learn as you travel.</p>}
          </div>
        </div>
        {profile && <ProfileEditForm profile={profile} />}
      </aside>
    </div>
  )
}
