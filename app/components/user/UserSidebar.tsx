'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Compass, MapPin, MessageCircle, FileText, Heart, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import type { Profile } from '@/types/database'

const NAV = [
  { href: '/dashboard',           icon: Compass,       label: 'Discover' },
  { href: '/dashboard/trips',     icon: MapPin,        label: 'My Trips' },
  { href: '/dashboard/counsel',   icon: MessageCircle, label: 'Soma' },
  { href: '/dashboard/documents', icon: FileText,      label: 'Documents' },
  { href: '/dashboard/wishlist',  icon: Heart,         label: 'Wishlist' },
  { href: '/dashboard/profile',   icon: User,          label: 'Profile' },
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
    <aside className="w-60 bg-white border-r border-[#E8E3D9] flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E8E3D9]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#B89A4E] flex items-center justify-center">
            <span className="font-serif text-[#B89A4E] text-xs">S</span>
          </div>
          <span className="font-serif text-[#1C1917] text-sm tracking-wider">SOLURA</span>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 py-4 border-b border-[#E8E3D9]">
        <p className="text-[10px] tracking-widest text-[#9C9589] uppercase mb-0.5">Namaste</p>
        <p className="font-serif text-[#1C1917] text-base truncate">{profile.full_name?.split(' ')[0] ?? 'Traveller'}</p>
        <p className="text-[10px] text-[#9C9589] mt-0.5 capitalize">Seeker · since {new Date(profile.member_since).getFullYear()}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'text-[#B89A4E] bg-[#F5F0E8]'
                  : 'text-[#9C9589] hover:text-[#1C1917] hover:bg-[#F5F0E8]'
              }`}>
              <Icon size={15} />
              <span>{label}</span>
            </Link>
          )
        })}
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
