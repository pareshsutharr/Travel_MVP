'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'

type NavbarProps = {
  transparentOnTop?: boolean
}

const navLinks = [
  { label: 'Destinations', href: '/journeys' },
  { label: 'Experiences',  href: '/#experiences' },
  { label: 'How It Works', href: '/#about' },
  { label: 'AI Planner',   href: '/build/counsel' },
  { label: 'Stories',      href: '/#storyline' },
  { label: 'About',        href: '/#about' },
  { label: 'Contact',      href: '/#counsel' },
]

export default function Navbar({ transparentOnTop = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled,  setScrolled]  = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!transparentOnTop) return
    const onScroll = () => setScrolled(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparentOnTop])

  const isTransparent = transparentOnTop && !scrolled && !menuOpen

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    if (href.includes('#')) return false
    const path = href.split('#')[0].split('?')[0]
    return path ? pathname === path || pathname.startsWith(`${path}/`) : false
  }

  return (
    <nav
      className="sticky top-0 z-[100]"
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(229,231,235,0.8)',
        boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex shrink-0 items-center"
            onClick={() => setMenuOpen(false)}
          >
            <img
              src="/logo.png"
              alt="SOLURA"
              className="h-9 w-auto"
            />
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden items-center gap-5 xl:gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-[13px] font-medium transition-all duration-200 ${
                  isActive(link.href) ? 'text-[#1D2B53]' : 'text-[#6B7A80] hover:text-[#1D2B53]'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-0.5 left-0 h-px w-full rounded-full bg-[#E8A317]" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden items-center gap-3 md:flex shrink-0">
            {/* Wishlist heart */}
            <button
              aria-label="Wishlist"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7A80] transition-all duration-200 hover:scale-105 hover:text-[#1D2B53]"
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* Talk to Expert */}
            <Link
              href="/build/counsel"
              className="text-[13px] font-medium text-[#6B7A80] transition-colors duration-200 hover:text-[#1D2B53]"
            >
              Talk to Expert
            </Link>

            {/* Plan My Journey — primary CTA */}
            <Link
              href="/build/type"
              className="pulse-glow rounded-full bg-[#1D2B53] px-5 py-2.5 text-[13px] font-bold tracking-[0.2px] text-white transition-all duration-200 hover:scale-[1.03] hover:bg-[#E8A317]"
            >
              Plan My Journey
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="flex flex-col gap-[5px] p-2 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`block h-0.5 w-6 rounded-full bg-[#1D2B53] transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-[#1D2B53] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-6 rounded-full bg-[#1D2B53] transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div className="border-t border-[#1D2B53]/8 bg-white py-5 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`w-fit text-sm font-medium transition-colors duration-200 ${
                    isActive(link.href) ? 'text-[#E8A317]' : 'text-[#6B7A80] hover:text-[#1D2B53]'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-3 border-t border-[#1D2B53]/8 pt-4">
                <Link
                  href="/build/counsel"
                  className="text-sm font-medium text-[#6B7A80] hover:text-[#1D2B53]"
                  onClick={() => setMenuOpen(false)}
                >
                  Talk to Expert
                </Link>
                <Link
                  href="/build/type"
                  className="rounded-full bg-[#1D2B53] px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[#E8A317]"
                  onClick={() => setMenuOpen(false)}
                >
                  Plan My Journey
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
