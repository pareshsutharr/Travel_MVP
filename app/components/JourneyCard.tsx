'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  tag: string
  images: string[]
  title: string
  details: string
  price: string
  href: string
  category: string
}

const CATEGORY_COLORS: Record<string, string> = {
  spiritual: '#D4AF35',
  heritage:  '#3C687C',
  adventure: '#3C687C',
  wellness:  '#3C687C',
}

export default function JourneyCard({ tag, images, title, details, price, href, category }: Props) {
  const [current, setCurrent] = useState(0)
  const [hovered, setHovered] = useState(false)

  const total = images.filter(Boolean).length
  if (total === 0) return null

  function prev(e: React.MouseEvent) {
    e.preventDefault()
    setCurrent((c) => (c - 1 + total) % total)
  }

  function next(e: React.MouseEvent) {
    e.preventDefault()
    setCurrent((c) => (c + 1) % total)
  }

  const color = CATEGORY_COLORS[category] ?? '#D4AF35'

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl bg-platinum shadow-[0_12px_35px_rgba(45,47,51,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(45,47,51,0.18)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image carousel */}
      <div className="relative h-72 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              i === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/65 via-graphite/10 to-transparent" />

        {/* Category tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-xs tracking-widest uppercase px-2 py-1 rounded bg-platinum/90" style={{ color, fontFamily: "'DM Sans', sans-serif" }}>
            {tag}
          </span>
        </div>

        {/* Carousel controls — only when multiple images and hovered */}
        {total > 1 && hovered && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-platinum/80 text-graphite hover:bg-platinum transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-platinum/80 text-graphite hover:bg-platinum transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i) }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-4 bg-platinum' : 'w-1.5 bg-platinum/50'
                }`}
              />
            ))}
          </div>
        )}

        <span className="absolute bottom-4 left-4 z-10 text-xs tracking-widest uppercase text-platinum/70" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Photo · {title}
        </span>
      </div>

      <div className="p-5">
        <h3 className="mb-2 font-serif text-2xl text-graphite">{title}</h3>
        <p className="mb-4 text-sm text-blue-slate">{details}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-graphite">{price}</span>
          <span className="text-sm font-medium text-metallic-gold">Explore →</span>
        </div>
      </div>
    </Link>
  )
}
