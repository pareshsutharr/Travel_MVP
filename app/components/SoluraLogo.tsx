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
  variant = 'default',
}: SoluraLogoProps) {
  const framed = variant === 'light'

  const logo = (
    <span className={`inline-flex flex-col ${className}`}>
      <span className={framed ? 'rounded-xl bg-platinum px-2 py-1 shadow-sm' : ''}>
        <Image
          src="/Solura Logo coloured transparent.png"
          alt="Solura"
          width={1415}
          height={319}
          priority
          className="h-auto w-full"
        />
      </span>
    </span>
  )

  return href ? (
    <Link href={href} aria-label="Solura home" className="inline-flex shrink-0">
      {logo}
    </Link>
  ) : logo
}
