import Link from 'next/link'
import Image from 'next/image'

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
  const framed = variant === 'light'

  const logo = (
    <span className={`inline-flex flex-col ${className}`}>
      <span className={framed ? 'rounded-xl bg-platinum/95 px-2 py-1 shadow-sm' : ''}>
        <Image
          src="/brand/solura-logo.svg"
          alt="Solura"
          width={1900}
          height={420}
          priority
          className="h-auto w-full"
        />
      </span>
      {showTagline && (
        <span className={`-mt-1 text-center text-[8px] uppercase tracking-[0.22em] ${variant === 'light' ? 'text-pale-sky' : 'text-blue-slate'}`}>
          A radiant inner journey
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
