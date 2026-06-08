'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Compass, MapPin, MessageCircle, FileText, Heart, User, LogOut,
  Plane, Hotel, Utensils, UserCheck, AlertTriangle, Car,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import NotificationBell from './NotificationBell'
import SoluraLogo from '@/app/components/SoluraLogo'
import type { Profile } from '@/types/database'

const NAV_GROUPS = [
  {
    label: 'Journey',
    items: [
      { href: '/dashboard',          icon: Compass,       label: 'Discover' },
      { href: '/dashboard/trips',    icon: MapPin,        label: 'My Trips' },
      { href: '/dashboard/wishlist', icon: Heart,         label: 'Wishlist' },
    ],
  },
  {
    label: 'Plan',
    items: [
      { href: '/dashboard/flights',  icon: Plane,         label: 'Flights' },
      { href: '/dashboard/hotels',   icon: Hotel,         label: 'Hotels' },
      { href: '/dashboard/cab',      icon: Car,           label: 'Cab' },
      { href: '/dashboard/guides',   icon: UserCheck,     label: 'Guides' },
      { href: '/dashboard/food',     icon: Utensils,      label: 'Food & Lodges' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/dashboard/counsel',   icon: MessageCircle, label: 'Soma' },
      { href: '/dashboard/documents', icon: FileText,      label: 'Documents' },
      { href: '/dashboard/sos',       icon: AlertTriangle, label: 'SOS · Emergency' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/dashboard/profile',  icon: User,          label: 'Profile' },
    ],
  },
]

export default function UserSidebar({ profile }: { profile: Profile }) {
  const path = usePathname()
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex w-64 bg-platinum border-r border-pale-sky flex-col h-full shrink-0">
      {/* Logo + notification */}
      <div className="px-5 py-4 border-b border-pale-sky flex items-center justify-between">
        <SoluraLogo href="/" className="w-24" />
        <NotificationBell userId={profile.id} />
      </div>

      {/* Greeting */}
      <div className="px-5 py-3 border-b border-pale-sky">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name ?? 'Traveller'} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pale-sky font-serif text-sm text-metallic-gold">
              {initials(profile.full_name ?? 'Traveller')}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-serif text-graphite text-sm truncate">{profile.full_name?.split(' ')[0] ?? 'Traveller'}</p>
            <p className="text-[10px] text-blue-slate capitalize">Seeker · since {new Date(profile.member_since).getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[9px] uppercase tracking-widest text-blue-slate">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = path === href || (href !== '/dashboard' && path.startsWith(href))
                const isSos = href === '/dashboard/sos'
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSos
                        ? active ? 'bg-status-soft text-danger' : 'text-danger hover:bg-status-soft hover:text-danger'
                        : active ? 'text-metallic-gold bg-pale-sky' : 'text-blue-slate hover:text-graphite hover:bg-pale-sky'
                    }`}>
                    <Icon size={15} />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-pale-sky">
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 w-full text-blue-slate hover:text-graphite text-sm transition-colors rounded-lg hover:bg-pale-sky">
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
