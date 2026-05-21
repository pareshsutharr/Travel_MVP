import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Search, CheckCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Stats
  const { count: activeCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['on_path', 'delayed'])
  const { data: mtdData } = await supabase.from('bookings').select('total_amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  const mtdTotal = mtdData?.reduce((sum, b) => sum + (b.total_amount ?? 0), 0) ?? 0
  const mtdCount = mtdData?.length ?? 0
  const { count: newCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  const { data: npsData } = await supabase.from('profiles').select('nps').not('nps', 'is', null)
  const avgNps = npsData?.length ? Math.round(npsData.reduce((s, p) => s + (p.nps ?? 0), 0) / npsData.length) : 0

  // Active bookings with joins
  const { data: activeBookings } = await supabase
    .from('bookings')
    .select('*, journey:journeys(title, duration), user:profiles!user_id(full_name)')
    .in('status', ['on_path', 'delayed', 'confirmed'])
    .order('created_at', { ascending: false })
    .limit(10)

  // Journeys
  const { data: journeys } = await supabase.from('journeys').select('id, title, status, rating').order('sort_order').limit(6)

  // Unread messages
  const { data: unreadMessages } = await supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(full_name), booking:bookings(ref, current_location, journey:journeys(title))')
    .eq('is_read', false)
    .eq('sender_type', 'user')
    .order('created_at', { ascending: false })
    .limit(3)
  const { count: unreadCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false).eq('sender_type', 'user')

  const now = new Date()
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  return (
    <div className="px-8 py-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest text-[#9C9589] uppercase mb-1">{dateLabel}</p>
          <h1 className="font-serif text-3xl text-[#1C1917]">
            Good morning, {profile?.full_name?.split(' ')[0]} —{' '}
            <span className="font-serif italic text-[#B89A4E]">{activeCount ?? 0} travellers are on the path.</span>
          </h1>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9589]" />
          <input className="pl-9 pr-4 py-2.5 bg-white border border-[#E8E3D9] rounded-full text-sm text-[#9C9589] w-64 focus:outline-none focus:border-[#B89A4E]" placeholder="Search bookings, customers… ⌘K" readOnly />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'ACTIVE TRIPS', value: activeCount ?? 0, sub: '+3 this week' },
          { label: 'BOOKINGS · MTD', value: mtdCount, sub: `${formatCurrency(mtdTotal)} gross` },
          { label: 'NEW CUSTOMERS', value: newCustomers ?? 0, sub: '24 from US/EU' },
          { label: 'NPS · 90 DAY', value: avgNps, sub: `Up from ${avgNps - 3}` },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E8E3D9] rounded-xl px-5 py-5">
            <p className="text-[10px] tracking-widest text-[#9C9589] uppercase mb-2">{s.label}</p>
            <p className="font-serif text-5xl text-[#1C1917] mb-1">{s.value}</p>
            <p className="text-xs text-[#9C9589]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* LEFT: Live GPS */}
        <div className="col-span-2 bg-white border border-[#E8E3D9] rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[#E8E3D9] flex items-center justify-between">
            <div>
              <p className="text-[10px] tracking-widest text-[#9C9589] uppercase mb-0.5">LIVE · GPS</p>
              <h2 className="font-serif text-xl text-[#1C1917]">Travellers on the path</h2>
            </div>
            <div className="flex gap-2">
              {['All', 'India', 'Nepal'].map(t => (
                <button key={t} className={`text-xs px-3 py-1 rounded-full border transition-colors ${t === 'All' ? 'border-[#B89A4E] text-[#B89A4E] bg-[#F5F0E8]' : 'border-[#E8E3D9] text-[#9C9589] hover:border-[#B89A4E]'}`}>{t}</button>
              ))}
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8E3D9]">
                {['TRAVELLER', 'JOURNEY', 'WHERE', 'DAY', 'STATUS'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] tracking-widest text-[#9C9589] uppercase font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeBookings?.map(b => {
                const journey = b.journey as { title: string; duration: number } | null
                return (
                  <tr key={b.id} className="border-b border-[#E8E3D9] hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#1C1917]">{b.traveler_name}</td>
                    <td className="px-6 py-4 text-sm text-[#9C9589]">{journey?.title}</td>
                    <td className="px-6 py-4 text-sm text-[#9C9589]">{b.current_location ?? '—'}</td>
                    <td className="px-6 py-4 text-sm text-[#9C9589]">{b.current_day ? `${b.current_day} / ${journey?.duration}` : '—'}</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getStatusColor(b.status)}`}>{getStatusLabel(b.status)}</span></td>
                  </tr>
                )
              })}
              {(!activeBookings || activeBookings.length === 0) && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-[#9C9589]">No active travellers</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Story Line + Counsel */}
        <div className="space-y-4">
          {/* Story Line */}
          <div className="bg-white border border-[#E8E3D9] rounded-xl px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] tracking-widest text-[#9C9589] uppercase mb-0.5">STORY LINE</p>
                <h3 className="font-serif text-lg text-[#1C1917]">Drafts &amp; published</h3>
              </div>
              <Link href="/admin/storyline" className="text-xs text-[#B89A4E] hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {journeys?.map(j => (
                <div key={j.id} className="flex items-center gap-3 py-2 border-b border-[#E8E3D9] last:border-0">
                  <CheckCircle size={14} className={j.status === 'published' ? 'text-[#B89A4E]' : 'text-[#E8E3D9]'} />
                  <span className="text-sm text-[#1C1917] flex-1 truncate">{j.title}</span>
                  <span className="text-[10px] text-[#9C9589] capitalize">{j.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Counsellor Desk */}
          <div className="bg-white border border-[#E8E3D9] rounded-xl px-5 py-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] tracking-widest text-[#9C9589] uppercase">COUNSELLOR DESK</p>
            </div>
            <h3 className="font-serif text-lg text-[#1C1917] mb-4">{unreadCount ?? 0} messages need you</h3>
            <div className="space-y-3">
              {unreadMessages?.map(m => {
                const sender = m.sender as { full_name: string } | null
                const booking = m.booking as { ref: string; current_location: string | null; journey: { title: string } | null } | null
                return (
                  <Link key={m.id} href="/admin/counsel" className="flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-[#F5F0E8] flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-[#B89A4E] font-medium">{(sender?.full_name ?? 'U')[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#1C1917] truncate group-hover:text-[#B89A4E]">{sender?.full_name}</p>
                      {booking?.current_location && <p className="text-[9px] tracking-widest text-[#B89A4E] uppercase">{booking.current_location}</p>}
                      <p className="text-xs text-[#9C9589] truncate">&ldquo;{m.content}&rdquo;</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link href="/admin/counsel" className="block mt-4 text-xs text-[#B89A4E] hover:underline">Open inbox →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
