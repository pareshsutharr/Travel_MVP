import Link from 'next/link'

type SoluraLogoProps = {
  className?: string
  href?: string
  showTagline?: boolean
  variant?: 'default' | 'light'
}

export default function SoluraLogo({
  className = 'w-36',
  href,
  showTagline = false,
  variant = 'default',
}: SoluraLogoProps) {
  const ink = variant === 'light' ? '#F3F7F8' : '#2D2F33'
  const slate = variant === 'light' ? '#BFDDE7' : '#3C687C'

  const logo = (
    <span className={`inline-flex flex-col ${className}`}>
      <svg
        aria-label="Solura"
        className="h-auto w-full overflow-visible"
        role="img"
        viewBox="0 0 500 116"
      >
        <text x="0" y="92" fill={ink} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="100" fontWeight="500">
          S
        </text>

        <g transform="translate(92 9)">
          <path d="M50 4a46 46 0 1 0 0 92 46 46 0 1 0 0-92Z" fill="none" stroke={ink} strokeWidth="6" />
          <path d="M7 63 29 48l15 12 16-16 34 22v26H7Z" fill={slate} />
          <path d="m7 66 24-14 14 14 18-15 31 17v25H7Z" fill={ink} opacity=".92" />
          <path d="M32 94c7-17 36-17 38-28-16 3-27 1-37-7 11 15 7 22-1 35Z" fill="#F3F7F8" />
          <circle cx="50" cy="31" r="8" fill="#D4AF35" />
          <path d="m50 16 3 9 9-3-6 7 8 5-10-1-1 10-4-9-8 5 5-8-9-4 10 1Z" fill="#D4AF35" />
          <circle cx="50" cy="5" r="2.5" fill="#D4AF35" />
          <circle cx="50" cy="-5" r="2.5" fill="#D4AF35" />
        </g>

        <text x="200" y="92" fill={ink} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="100" fontWeight="500">
          L
        </text>
        <text x="272" y="92" fill={ink} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="100" fontWeight="500">
          U
        </text>
        <path d="M317 90c9-1 15-8 17-18 2 10 8 17 17 18-9 2-15 8-17 18-2-10-8-16-17-18Z" fill="#D4AF35" />
        <text x="365" y="92" fill={ink} fontFamily="Cormorant Garamond, Georgia, serif" fontSize="100" fontWeight="500">
          R
        </text>
        <path d="m464 94 26-82 27 82h-11l-7-22h-18l-6 22Zm21-34h11l-5-18Z" fill={ink} />
        <path d="M486 71c4-1 7-4 8-9 1 5 4 8 8 9-4 1-7 4-8 9-1-5-4-8-8-9Z" fill="#D4AF35" />
      </svg>
      {showTagline && (
        <span className={`-mt-1 text-center text-[8px] uppercase tracking-[0.22em] ${variant === 'light' ? 'text-pale-sky' : 'text-blue-slate'}`}>
          Travel · India &amp; Nepal
        </span>
      )}
    </span>
  )

  return href ? (
    <Link href={href} aria-label="Solura home" className="inline-flex shrink-0">
      {logo}
    </Link>
  ) : logo
}
