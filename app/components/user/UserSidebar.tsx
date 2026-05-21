'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Compass, MapPin, MessageCircle, FileText, Heart, User, LogOut,
  Plane, Hotel, Utensils, UserCheck, AlertTriangle,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import NotificationBell from './NotificationBell'
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
    <aside className="hidden md:flex w-64 bg-white border-r border-[#E8E3D9] flex-col h-full shrink-0">
      {/* Logo + notification */}
      <div className="px-5 py-4 border-b border-[#E8E3D9] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#B89A4E] flex items-center justify-center">
            <span className="font-serif text-[#B89A4E] text-xs">S</span>
          </div>
          <span className="font-serif text-[#1C1917] text-sm tracking-wider">SOLURA</span>
        </div>
        <NotificationBell userId={profile.id} />
      </div>

      {/* Greeting */}
      <div className="px-5 py-3 border-b border-[#E8E3D9]">
        <div className="flex items-center gap-3">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name ?? 'Traveller'} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F0E8] font-serif text-sm text-[#B89A4E]">
              {initials(profile.full_name ?? 'Traveller')}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-serif text-[#1C1917] text-sm truncate">{profile.full_name?.split(' ')[0] ?? 'Traveller'}</p>
            <p className="text-[10px] text-[#9C9589] capitalize">Seeker · since {new Date(profile.member_since).getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1 text-[9px] uppercase tracking-widest text-[#9C9589]">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = path === href || (href !== '/dashboard' && path.startsWith(href))
                const isSos = href === '/dashboard/sos'
                return (
                  <Link key={href} href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSos
                        ? active ? 'bg-red-50 text-red-600' : 'text-red-400 hover:bg-red-50 hover:text-red-600'
                        : active ? 'text-[#B89A4E] bg-[#F5F0E8]' : 'text-[#9C9589] hover:text-[#1C1917] hover:bg-[#F5F0E8]'
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
      <div className="px-3 py-4 border-t border-[#E8E3D9]">
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 w-full text-[#9C9589] hover:text-[#1C1917] text-sm transition-colors rounded-lg hover:bg-[#F5F0E8]">
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
