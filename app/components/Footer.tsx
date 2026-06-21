import Link from 'next/link'
import { Globe, Mail, MapPin, Sparkles, Users } from 'lucide-react'

/* ─── Column data ─────────────────────────────────────────── */
const columns = [
  {
    title: 'Tours',
    icon: <Globe className="h-3.5 w-3.5" />,
    links: [
      ['Family Packages', '/journeys'],
      ['Honeymoon Trips', '/journeys'],
      ['Group Tours', '/journeys'],
      ['Weekend Escapes', '/journeys'],
      ['Luxury Travel', '/journeys'],
    ],
    boldIndex: 4,
  },
  {
    title: 'Destinations',
    icon: <MapPin className="h-3.5 w-3.5" />,
    links: [
      ['Switzerland', '/journeys'],
      ['Bali', '/journeys'],
      ['Santorini', '/journeys'],
      ['Paris', '/journeys'],
      ['Maldives', '/journeys'],
    ],
    boldIndex: 2,
  },
  {
    title: 'Spiritual Travel',
    icon: <Sparkles className="h-3.5 w-3.5" />,
    links: [
      ['Yoga Retreats', '/journeys'],
      ['Meditation Trips', '/journeys'],
      ['Sacred Sites', '/journeys'],
      ['Ayurveda Retreats', '/journeys'],
      ['Wellness Journeys', '/journeys'],
    ],
    boldIndex: 2,
  },
  {
    title: 'Company',
    icon: <Users className="h-3.5 w-3.5" />,
    links: [
      ['About Us', '/#about'],
      ['How It Works', '/#about'],
      ['Reviews', '/#reviews'],
      ['Counsel (Soma)', '/#counsel'],
      ['Travel Insurance', '/'],
    ],
    boldIndex: 2,
  },
]

const contactItems = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-[#D4AF35]">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 7L2 7" />
      </svg>
    ),
    text: 'hello@solura.travel',
    href: 'mailto:hello@solura.travel',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-[#D4AF35]">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
      </svg>
    ),
    text: '+1 (555) 018-2026',
    href: 'tel:+15550182026',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-[#D4AF35]">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: '24 Wanderlust Ave, New York, NY 10001',
    href: '/',
  },
]

const socialLinks = [
  {
    label: 'Instagram',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" strokeWidth="0" />
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Pinterest',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

/* ─── Illustrated header image ────────────────────────────── */
// Drop the banner as /public/footer-banner.png to activate.
// Falls back to the hand-drawn SVG scene while the file is missing.
function FooterScene() {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ftSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEF4FA" />
          <stop offset="100%" stopColor="#D8E9F4" />
        </linearGradient>
        <linearGradient id="ftMtn1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7EB2C8" />
          <stop offset="100%" stopColor="#A8CCE0" />
        </linearGradient>
        <linearGradient id="ftMtn2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6AA0BC" />
          <stop offset="100%" stopColor="#96C0D8" />
        </linearGradient>
        <linearGradient id="ftSun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5D87A" />
          <stop offset="100%" stopColor="#E8B844" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="1440" height="420" fill="url(#ftSky)" />

      {/* ── Mountains (behind SOLURA text) ── */}
      {/* Far back mountains — lightest */}
      <polygon points="0,420 260,258 520,420" fill="#B8D4E4" opacity="0.4" />
      <polygon points="300,420 560,190 820,420" fill="#A4C8DC" opacity="0.38" />
      <polygon points="620,420 880,95 1140,420" fill="url(#ftMtn1)" opacity="0.36" />
      <polygon points="850,420 1060,215 1270,420" fill="url(#ftMtn2)" opacity="0.34" />
      <polygon points="1100,420 1270,285 1440,420" fill="#C4D8E8" opacity="0.30" />
      {/* Snow caps */}
      <polygon points="878,95 858,145 898,145" fill="white" opacity="0.55" />
      <polygon points="560,190 545,225 575,225" fill="white" opacity="0.45" />

      {/* Sun & glow */}
      <circle cx="880" cy="175" r="80" fill="#F5E09A" opacity="0.18" />
      <circle cx="880" cy="175" r="56" fill="url(#ftSun)" opacity="0.82" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1={880 + Math.cos((angle * Math.PI) / 180) * 64}
          y1={175 + Math.sin((angle * Math.PI) / 180) * 64}
          x2={880 + Math.cos((angle * Math.PI) / 180) * 82}
          y2={175 + Math.sin((angle * Math.PI) / 180) * 82}
          stroke="#E8B844"
          strokeWidth="2.5"
          opacity="0.55"
          strokeLinecap="round"
        />
      ))}

      {/* Sea / water shimmer */}
      <ellipse cx="720" cy="418" rx="380" ry="28" fill="#A8CCE0" opacity="0.30" />
      <ellipse cx="720" cy="418" rx="260" ry="16" fill="#C4DCE8" opacity="0.25" />

      {/* ── Dotted airplane flight path ── */}
      <path
        d="M 90,290 Q 380,190 700,148 Q 980,110 1295,58"
        fill="none"
        stroke="#D4AF35"
        strokeWidth="1.8"
        strokeDasharray="10,7"
        opacity="0.65"
      />

      {/* ── Airplane at end of path ── */}
      <g transform="translate(1283,46) rotate(-22)" opacity="0.9">
        <path
          d="M0,6 L14,-2 L13,4 L20,2 L13,8 L14,14 L0,6 Z"
          fill="#D4AF35"
        />
      </g>

      {/* ── Birds — upper left cluster ── */}
      <g opacity="0.55" stroke="#3C687C" fill="none" strokeWidth="1.6" strokeLinecap="round">
        <path d="M 112,82 Q 119,74 126,82" />
        <path d="M 133,68 Q 141,60 149,68" />
        <path d="M 158,82 Q 165,74 172,82" />
      </g>
      {/* ── Birds — upper right cluster ── */}
      <g opacity="0.50" stroke="#3C687C" fill="none" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 1090,52 Q 1097,44 1104,52" />
        <path d="M 1115,40 Q 1122,32 1129,40" />
        <path d="M 1145,56 Q 1152,48 1159,56" />
        <path d="M 1170,44 Q 1177,36 1184,44" />
      </g>
      {/* Single bird mid-left */}
      <path d="M 320,55 Q 328,47 336,55" stroke="#3C687C" fill="none" strokeWidth="1.4" strokeLinecap="round" opacity="0.42" />

      {/* ── Sparkle / 4-pointed stars ── */}
      {/* Left sparkle */}
      <g transform="translate(68,105)" opacity="0.8">
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#D4AF35" strokeWidth="1.5" />
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#D4AF35" strokeWidth="1.5" />
        <line x1="-6" y1="-6" x2="6" y2="6" stroke="#D4AF35" strokeWidth="0.8" opacity="0.5" />
        <line x1="6" y1="-6" x2="-6" y2="6" stroke="#D4AF35" strokeWidth="0.8" opacity="0.5" />
      </g>
      {/* Right sparkle (smaller) */}
      <g transform="translate(1290,165)" opacity="0.65">
        <line x1="0" y1="-7" x2="0" y2="7" stroke="#D4AF35" strokeWidth="1.2" />
        <line x1="-7" y1="0" x2="7" y2="0" stroke="#D4AF35" strokeWidth="1.2" />
      </g>

      {/* ── Palm tree — right side ── */}
      {/* Trunk (curved) */}
      <path
        d="M 1388,420 Q 1372,335 1362,240"
        stroke="#3C687C"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* Fronds */}
      {[
        'M 1362,240 Q 1325,208 1295,200',
        'M 1362,240 Q 1348,198 1335,172',
        'M 1362,240 Q 1378,198 1392,175',
        'M 1362,240 Q 1398,215 1420,218',
        'M 1362,240 Q 1340,222 1318,228',
      ].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="#3C687C"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity="0.42"
        />
      ))}
      {/* Small palm coconuts */}
      <circle cx="1353" cy="248" r="5" fill="#5A8A6A" opacity="0.35" />
      <circle cx="1368" cy="244" r="4" fill="#5A8A6A" opacity="0.30" />

      {/* ── Tropical leaves — left ── */}
      <path
        d="M -10,310 Q 55,255 90,285 Q 60,330 -10,370 Z"
        fill="#3C687C"
        opacity="0.13"
      />
      <path
        d="M -10,360 Q 70,310 110,345 Q 75,390 -10,420 Z"
        fill="#3C687C"
        opacity="0.10"
      />
      {/* ── Tropical leaves — right ── */}
      <path
        d="M 1450,270 Q 1395,228 1370,260 Q 1398,298 1450,320 Z"
        fill="#3C687C"
        opacity="0.12"
      />
      <path
        d="M 1450,330 Q 1400,295 1375,330 Q 1405,370 1450,395 Z"
        fill="#3C687C"
        opacity="0.10"
      />

      {/* ── SOLURA large watermark text ── */}
      <text
        x="720"
        y="308"
        textAnchor="middle"
        fontSize="252"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="900"
        letterSpacing="6"
        fill="#3C687C"
        opacity="0.10"
      >
        SOLURA
      </text>

      {/* ── Tagline with gold lines ── */}
      {/* Left line */}
      <line x1="310" y1="374" x2="500" y2="374" stroke="#D4AF35" strokeWidth="1" opacity="0.70" />
      {/* Right line */}
      <line x1="940" y1="374" x2="1130" y2="374" stroke="#D4AF35" strokeWidth="1" opacity="0.70" />
      {/* Script tagline */}
      <text
        x="720"
        y="380"
        textAnchor="middle"
        fontSize="22"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic"
        fill="#2D2F33"
        opacity="0.75"
      >
        Journeys worth knowing about.
      </text>

      {/* ── Compass / 4-pointed star below tagline ── */}
      <g transform="translate(720,400)" opacity="0.75">
        <line x1="0" y1="-8" x2="0" y2="8" stroke="#D4AF35" strokeWidth="1.5" />
        <line x1="-8" y1="0" x2="8" y2="0" stroke="#D4AF35" strokeWidth="1.5" />
        <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z" fill="#D4AF35" />
      </g>
    </svg>
  )
}

/* ─── Footer component ────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="bg-[#EEF3F8]">

      {/* ── Illustrated hero section ── */}
      <div className="relative overflow-hidden" style={{ height: 420 }}>
        {/* SVG fallback — always rendered underneath */}
        <FooterScene />
        {/*
          Real banner: CSS background-image shows nothing (no broken icon) when
          the file is missing, so the SVG above stays visible as the fallback.
          Drop the banner as /public/footer-banner.png to activate.
        */}
        <div
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: 'url(/footer-banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-[#C5D8E5]" />

      {/* ── Main column grid ── */}
      <div className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.2fr]">

            {/* Brand column */}
            <div>
              <Link href="/" className="inline-block">
                <span className="text-[15px] font-black tracking-[0.22em] text-[#2D2F33]">
                  SOLURA
                </span>
                <div className="mt-1 h-0.5 w-8 rounded-full bg-[#D4AF35]" />
              </Link>
              <p className="mt-4 max-w-[220px] text-[13px] leading-[1.8] text-[#6B7A80]">
                Handpicked travel experiences for dreamers, explorers, and comfort seekers —
                designed to make every journey feel effortless.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {socialLinks.map(({ label, href, icon }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5D8E5] text-[#3C687C] transition-all duration-200 hover:scale-105 hover:border-[#D4AF35] hover:text-[#D4AF35]"
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            {columns.map((col) => (
              <div key={col.title}>
                <div className="mb-4 flex items-center gap-1.5 text-[#3C687C]">
                  {col.icon}
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2D2F33]">
                    {col.title}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {col.links.map(([label, href], i) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className={`group flex items-center gap-1.5 text-[13px] leading-[1.7] transition-colors duration-200 hover:text-[#D4AF35] ${
                          i === col.boldIndex
                            ? 'font-bold text-[#2D2F33]'
                            : 'text-[#6B7A80]'
                        }`}
                      >
                        <span className="text-[10px] text-[#D4AF35] opacity-60 transition-opacity group-hover:opacity-100">›</span>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact column */}
            <div>
              <div className="mb-4 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#3C687C]" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2D2F33]">
                  Contact
                </h3>
              </div>
              <ul className="space-y-3.5">
                {contactItems.map(({ icon, text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="group flex items-start gap-2.5 text-[13px] leading-[1.65] text-[#6B7A80] transition-colors duration-200 hover:text-[#D4AF35]"
                    >
                      {icon}
                      <span>{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-[#C5D8E5] px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Copyright */}
          <p className="text-[12px] text-[#8BA0AC]">
            © 2026 Solura Travel. All rights reserved.
          </p>

          {/* Center tagline */}
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 20 12" fill="none" className="h-3 w-5 text-[#D4AF35] opacity-70">
              <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
              <path d="M10,2 L18,6 L10,10" fill="#D4AF35" opacity="0.8" />
            </svg>
            <p
              className="text-[13px] text-[#6B7A80]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
            >
              Travel deeper. Live fuller. Return inspired.
            </p>
            <svg viewBox="0 0 20 12" fill="none" className="h-3 w-5 rotate-180 text-[#D4AF35] opacity-70">
              <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1" />
              <path d="M10,2 L18,6 L10,10" fill="#D4AF35" opacity="0.8" />
            </svg>
          </div>

          {/* Policy links */}
          <div className="flex items-center gap-4 text-[12px] text-[#8BA0AC]">
            <Link href="/" className="transition-colors duration-200 hover:text-[#D4AF35]">Privacy Policy</Link>
            <span className="text-[#C5D8E5]">|</span>
            <Link href="/" className="transition-colors duration-200 hover:text-[#D4AF35]">Terms of Service</Link>
            <span className="text-[#C5D8E5]">|</span>
            <Link href="/" className="transition-colors duration-200 hover:text-[#D4AF35]">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
