'use client';

import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Journeys', href: '#journeys' },
    { label: 'The Story Line', href: '#storyline' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Counsel', href: '#counsel' },
    { label: 'Reviews', href: '#reviews' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm"
      style={{ borderBottom: '1px solid #E8E3D9' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex flex-col items-start flex-shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ border: '1px solid #B89A4E' }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#B89A4E' }}
                >
                  S
                </span>
              </div>
              <span
                className="text-xl font-semibold tracking-widest"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917' }}
              >
                SOLURA
              </span>
            </div>
            <span
              className="text-xs tracking-widest uppercase ml-9"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', letterSpacing: '0.15em' }}
            >
              Travel · India &amp; Nepal
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm transition-colors duration-200 hover:text-[#B89A4E]"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917', fontWeight: 400 }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              className="text-sm px-4 py-2 rounded-full transition-colors duration-200 hover:bg-gray-50"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917', fontWeight: 400 }}
            >
              Sign in
            </button>
            <button
              className="text-sm px-5 py-2 rounded-full transition-all duration-200 hover:bg-[#B89A4E] hover:text-white"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: '#B89A4E',
                border: '1px solid #B89A4E',
                fontWeight: 400,
              }}
            >
              Begin →
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
              style={{ backgroundColor: '#1C1917' }}
            />
            <span
              className={`block w-6 h-0.5 transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`}
              style={{ backgroundColor: '#1C1917' }}
            />
            <span
              className={`block w-6 h-0.5 bg-ink transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              style={{ backgroundColor: '#1C1917' }}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden py-4"
            style={{ borderTop: '1px solid #E8E3D9' }}
          >
            <div className="flex flex-col gap-4 pb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm py-1 hover:text-[#B89A4E] transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  className="text-sm px-4 py-2 rounded-full"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917', border: '1px solid #E8E3D9' }}
                >
                  Sign in
                </button>
                <button
                  className="text-sm px-5 py-2 rounded-full"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: '#B89A4E',
                    border: '1px solid #B89A4E',
                  }}
                >
                  Begin →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
