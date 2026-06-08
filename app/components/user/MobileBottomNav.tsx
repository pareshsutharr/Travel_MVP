'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, MapPin, MessageCircle, Car, AlertTriangle } from 'lucide-react'

const NAV = [
  { href: '/dashboard',          icon: Compass,        label: 'Discover' },
  { href: '/dashboard/trips',    icon: MapPin,         label: 'Trips' },
  { href: '/dashboard/counsel',  icon: MessageCircle,  label: 'Soma' },
  { href: '/dashboard/cab',      icon: Car,            label: 'Cab' },
  { href: '/dashboard/sos',      icon: AlertTriangle,  label: 'SOS', sos: true },
]

export default function MobileBottomNav() {
  const path = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-platinum border-t border-pale-sky flex safe-area-inset-bottom">
      {NAV.map(({ href, icon: Icon, label, sos }) => {
        const active = path === href || (href !== '/dashboard' && path.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-widest uppercase transition-colors ${
              sos
                ? active ? 'text-danger' : 'text-danger'
                : active ? 'text-metallic-gold' : 'text-blue-slate'
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
