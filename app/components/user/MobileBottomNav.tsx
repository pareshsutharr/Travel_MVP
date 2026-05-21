'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, MapPin, MessageCircle, UserCheck, AlertTriangle } from 'lucide-react'

const NAV = [
  { href: '/dashboard',          icon: Compass,        label: 'Discover' },
  { href: '/dashboard/trips',    icon: MapPin,         label: 'Trips' },
  { href: '/dashboard/counsel',  icon: MessageCircle,  label: 'Soma' },
  { href: '/dashboard/guides',   icon: UserCheck,      label: 'Guides' },
  { href: '/dashboard/sos',      icon: AlertTriangle,  label: 'SOS', sos: true },
]

export default function MobileBottomNav() {
  const path = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E3D9] flex safe-area-inset-bottom">
      {NAV.map(({ href, icon: Icon, label, sos }) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-widest uppercase transition-colors ${
              sos
                ? active ? 'text-red-600' : 'text-red-400'
                : active ? 'text-[#B89A4E]' : 'text-[#9C9589]'
            }`}
          >
            <Icon size={18} strokeWidth={active ? 2 : 1.5} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
