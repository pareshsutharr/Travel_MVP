'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import SoluraLogo from './SoluraLogo'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [authState, setAuthState] = useState<{ loggedIn: boolean; role: string | null }>({ loggedIn: false, role: null })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setAuthState({ loggedIn: false, role: null }); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      setAuthState({ loggedIn: true, role: profile?.role ?? 'user' })
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) { setAuthState({ loggedIn: false, role: null }); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      setAuthState({ loggedIn: true, role: profile?.role ?? 'user' })
    })
    return () => {
      window.removeEventListener('scroll', onScroll)
      listener.subscription.unsubscribe()
    }
  }, [])

  const isAdmin = authState.role === 'admin' || authState.role === 'counsellor'
  const portalHref = isAdmin ? '/admin' : '/dashboard'
  const portalLabel = isAdmin ? 'Admin panel' : 'My dashboard'

  const navLinks = [
    { label: 'Journeys',      href: '/journeys' },
    { label: 'Experiences', href: '/#storyline' },
    { label: 'How it works',  href: '/#how-it-works' },
    { label: 'Counsel',       href: '/#counsel' },
    { label: 'Reviews',       href: '/#reviews' },
  ]

  return (
    <nav className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${scrolled || menuOpen ? 'border-b border-pale-sky bg-platinum/95 shadow-sm backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <SoluraLogo href="/" showTagline variant={scrolled || menuOpen ? 'default' : 'light'} className="w-28 sm:w-32" />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-metallic-gold ${scrolled ? 'text-graphite' : 'text-platinum'}`}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {authState.loggedIn ? (
              <Link href={portalHref}
                className="text-sm px-5 py-2 rounded-full transition-all duration-200 hover:bg-metallic-gold hover:text-platinum"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', border: '1px solid #D4AF35', fontWeight: 400 }}>
                {portalLabel} →
              </Link>
            ) : (
              <>
                <Link href="/sign-in"
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${scrolled ? 'text-graphite hover:bg-pale-sky' : 'text-platinum hover:bg-platinum/10'}`}>
                  Sign in
                </Link>
                <Link href="/build/type"
                  className="rounded-xl bg-metallic-gold px-5 py-2.5 text-sm font-medium text-graphite transition-all duration-200 hover:bg-platinum">
                  Begin →
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block h-0.5 w-6 transition-transform duration-200 ${menuOpen ? 'translate-y-2 rotate-45' : ''} ${scrolled || menuOpen ? 'bg-graphite' : 'bg-platinum'}`} />
            <span className={`block h-0.5 w-6 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''} ${scrolled || menuOpen ? 'bg-graphite' : 'bg-platinum'}`} />
            <span className={`block h-0.5 w-6 transition-transform duration-200 ${menuOpen ? '-translate-y-2 -rotate-45' : ''} ${scrolled || menuOpen ? 'bg-graphite' : 'bg-platinum'}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4" style={{ borderTop: '1px solid #BFDDE7' }}>
            <div className="flex flex-col gap-4 pb-4">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href}
                  className="text-sm py-1 hover:text-metallic-gold transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#2D2F33' }}
                  onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                {authState.loggedIn ? (
                  <Link href={portalHref} onClick={() => setMenuOpen(false)}
                    className="text-sm px-5 py-2 rounded-full"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', border: '1px solid #D4AF35' }}>
                    {portalLabel} →
                  </Link>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={() => setMenuOpen(false)}
                      className="text-sm px-4 py-2 rounded-full"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#2D2F33', border: '1px solid #BFDDE7' }}>
                      Sign in
                    </Link>
                    <Link href="/build/type" onClick={() => setMenuOpen(false)}
                      className="text-sm px-5 py-2 rounded-full"
                      style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', border: '1px solid #D4AF35' }}>
                      Begin →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
