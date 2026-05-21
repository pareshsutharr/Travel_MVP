'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, BookOpen, MessageCircle, Settings, LogOut, ShieldCheck, Menu, X, UserCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import type { Profile } from '@/types/database'

const NAV = [
  { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/bookings',   icon: Calendar,        label: 'Bookings' },
  { href: '/admin/customers',  icon: Users,           label: 'Customers' },
  { href: '/admin/users',      icon: ShieldCheck,     label: 'Users & roles' },
  { href: '/admin/storyline',  icon: BookOpen,        label: 'Story Line' },
  { href: '/admin/guides',     icon: UserCheck,       label: 'Guides' },
  { href: '/admin/counsel',    icon: MessageCircle,   label: 'Counsel' },
  { href: '/admin/settings',   icon: Settings,        label: 'Settings' },
]

export default function AdminSidebar({ profile }: { profile: Profile }) {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  const SidebarContent = () => (
    <aside className="w-64 bg-[#1C1917] flex flex-col h-full">
      {/* Logo + close */}
      <div className="px-6 py-6 border-b border-white/10 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full border border-[#B89A4E] flex items-center justify-center">
              <span className="font-serif text-[#B89A4E] text-xs">S</span>
            </div>
            <span className="font-serif text-white text-base tracking-wider">SOLURA</span>
          </div>
          <p className="text-[10px] tracking-widest text-white/30 uppercase mt-0.5 ml-9">Admin</p>
        </div>
        <button className="md:hidden text-white/40 hover:text-white p-1" onClick={() => setOpen(false)}>
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = path === href || (href !== '/admin' && path.startsWith(href))
          return (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-[#B89A4E]/20 text-[#B89A4E]'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/5'
              }`}>
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#B89A4E]/20 flex items-center justify-center shrink-0">
            <span className="text-[#B89A4E] text-xs font-medium">{initials(profile.full_name ?? profile.email)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/90 truncate">{profile.full_name}</p>
            <p className="text-[10px] text-white/40 capitalize">{profile.role}</p>
          </div>
        </div>
        <button onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 w-full text-white/40 hover:text-white/80 text-sm transition-colors rounded-lg hover:bg-white/5">
          <LogOut size={15} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-3 left-3 z-50 md:hidden bg-[#1C1917] text-white rounded-lg p-2 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile: slide-over sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block shrink-0 h-screen">
        <SidebarContent />
      </div>
    </>
  )
}
