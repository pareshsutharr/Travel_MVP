import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle, Search } from 'lucide-react'
import LiveGpsTracker from '@/app/components/admin/LiveGpsTracker'
import RevenueChart from '@/app/components/admin/RevenueChart'
import type { Booking, Journey, Profile } from '@/types/database'

type BookingRow = Booking & { journey: Pick<Journey, 'title' | 'duration'> | null; user: Pick<Profile, 'full_name'> | null }

function buildMonthlyData(bookings: { created_at: string; total_amount: number }[]) {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1)
    const label = d.toLocaleDateString('en-US', { month: 'short' })
    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const rows = bookings.filter((b) => b.created_at.startsWith(monthStr))
    return { month: label, bookings: rows.length, revenue: rows.reduce((s, b) => s + (b.total_amount ?? 0), 0) }
  })
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  // Stats
  const { count: activeCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).in('status', ['on_path', 'delayed'])
  const { data: mtdData } = await supabase.from('bookings').select('total_amount').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  const mtdTotal = mtdData?.reduce((s, b) => s + (b.total_amount ?? 0), 0) ?? 0
  const mtdCount = mtdData?.length ?? 0
  const { count: newCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user').gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
  const { data: npsData } = await supabase.from('profiles').select('nps').not('nps', 'is', null)
  const avgNps = npsData?.length ? Math.round(npsData.reduce((s, p) => s + (p.nps ?? 0), 0) / npsData.length) : 0

  // Revenue chart data (6 months)
  const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1)
  const { data: allBookings } = await supabase.from('bookings').select('created_at, total_amount').gte('created_at', sixMonthsAgo.toISOString())
  const chartData = buildMonthlyData(allBookings ?? [])

  // Active bookings for realtime tracker
  const { data: activeBookings } = await supabase
    .from('bookings')
    .select('*, journey:journeys(title, duration), user:profiles!user_id(full_name)')
    .in('status', ['on_path', 'delayed', 'confirmed', 'new'])
    .order('created_at', { ascending: false })
    .limit(12)

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

  // Total stats
  const { count: totalBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true })
  const { count: totalCustomers } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user')
  const { data: revenueData } = await supabase.from('bookings').select('total_amount').neq('status', 'cancelled')
  const totalRevenue = revenueData?.reduce((s, b) => s + (b.total_amount ?? 0), 0) ?? 0

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-widest text-blue-slate uppercase mb-1">{dateLabel}</p>
          <h1 className="font-serif text-3xl text-graphite">
            Good morning, {profile?.full_name?.split(' ')[0]} —{' '}
            <span className="font-serif italic text-metallic-gold">{activeCount ?? 0} travellers are on the path.</span>
          </h1>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-slate" />
          <input className="pl-9 pr-4 py-2.5 bg-platinum border border-pale-sky rounded-full text-sm text-blue-slate w-64 focus:outline-none focus:border-metallic-gold" placeholder="Search bookings, customers…" readOnly />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'ACTIVE TRIPS', value: activeCount ?? 0, sub: 'On path now' },
          { label: 'BOOKINGS · MTD', value: mtdCount, sub: `${formatCurrency(mtdTotal)} gross` },
          { label: 'NEW CUSTOMERS', value: newCustomers ?? 0, sub: 'This month' },
          { label: 'NPS · 90 DAY', value: avgNps || '—', sub: 'Avg score' },
        ].map(s => (
          <div key={s.label} className="bg-platinum border border-pale-sky rounded-xl px-5 py-5">
            <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-2">{s.label}</p>
            <p className="font-serif text-5xl text-graphite mb-1">{s.value}</p>
            <p className="text-xs text-blue-slate">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'TOTAL BOOKINGS', value: totalBookings ?? 0 },
          { label: 'TOTAL CUSTOMERS', value: totalCustomers ?? 0 },
          { label: 'TOTAL REVENUE', value: formatCurrency(totalRevenue) },
        ].map(s => (
          <div key={s.label} className="bg-pale-sky border border-pale-sky rounded-xl px-5 py-4 flex items-center justify-between">
            <p className="text-[10px] tracking-widest text-blue-slate uppercase">{s.label}</p>
            <p className="font-serif text-2xl text-metallic-gold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2">
          <RevenueChart data={chartData} />
        </div>
        <div className="bg-platinum border border-pale-sky rounded-xl px-5 py-5">
          <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-1">QUICK ACTIONS</p>
          <h3 className="font-serif text-lg text-graphite mb-4">Manage</h3>
          <div className="space-y-2">
            {[
              { label: 'Add new journey', href: '/admin/storyline/new', sub: 'Create story' },
              { label: 'Manage bookings', href: '/admin/bookings', sub: `${totalBookings} total` },
              { label: 'Customer list', href: '/admin/customers', sub: `${totalCustomers} travellers` },
              { label: 'User roles', href: '/admin/users', sub: 'Admins & staff' },
              { label: 'Open counsel inbox', href: '/admin/counsel', sub: `${unreadCount ?? 0} unread` },
              { label: 'Site settings', href: '/admin/settings', sub: 'Configure' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="flex items-center justify-between py-2.5 border-b border-pale-sky last:border-0 hover:text-metallic-gold group">
                <div>
                  <p className="text-sm text-graphite group-hover:text-metallic-gold transition-colors">{item.label}</p>
                  <p className="text-[10px] text-blue-slate">{item.sub}</p>
                </div>
                <span className="text-metallic-gold text-sm">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid: Live GPS + Counsel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LiveGpsTracker initial={(activeBookings ?? []) as BookingRow[]} />

        {/* RIGHT: Story Line + Counsel */}
        <div className="space-y-4">
          <div className="bg-platinum border border-pale-sky rounded-xl px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-0.5">STORY LINE</p>
                <h3 className="font-serif text-lg text-graphite">Drafts &amp; published</h3>
              </div>
              <Link href="/admin/storyline" className="text-xs text-metallic-gold hover:underline">View all →</Link>
            </div>
            <div className="space-y-2">
              {journeys?.map(j => (
                <div key={j.id} className="flex items-center gap-3 py-2 border-b border-pale-sky last:border-0">
                  <CheckCircle size={14} className={j.status === 'published' ? 'text-metallic-gold' : 'text-pale-sky'} />
                  <span className="text-sm text-graphite flex-1 truncate">{j.title}</span>
                  <span className="text-[10px] text-blue-slate capitalize">{j.status.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            <Link href="/admin/storyline/new" className="mt-4 block text-xs text-metallic-gold hover:underline">+ New journey →</Link>
          </div>

          <div className="bg-platinum border border-pale-sky rounded-xl px-5 py-5">
            <p className="text-[10px] tracking-widest text-blue-slate uppercase">COUNSELLOR DESK</p>
            <h3 className="font-serif text-lg text-graphite mb-4">{unreadCount ?? 0} messages need you</h3>
            <div className="space-y-3">
              {unreadMessages?.map(m => {
                const sender = m.sender as { full_name: string } | null
                const booking = m.booking as { ref: string; current_location: string | null; journey: { title: string } | null } | null
                return (
                  <Link key={m.id} href="/admin/counsel" className="flex items-start gap-3 group">
                    <div className="w-7 h-7 rounded-full bg-pale-sky flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-metallic-gold font-medium">{(sender?.full_name ?? 'U')[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-graphite truncate group-hover:text-metallic-gold">{sender?.full_name}</p>
                      {booking?.current_location && <p className="text-[9px] tracking-widest text-metallic-gold uppercase">{booking.current_location}</p>}
                      <p className="text-xs text-blue-slate truncate">&ldquo;{m.content}&rdquo;</p>
                    </div>
                  </Link>
                )
              })}
            </div>
            <Link href="/admin/counsel" className="block mt-4 text-xs text-metallic-gold hover:underline">Open inbox →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
