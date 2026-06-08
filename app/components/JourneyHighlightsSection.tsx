'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, MessageCircle } from 'lucide-react'
import type { Journey } from '@/types/database'
import { getJourneyImages } from '@/lib/travel-images'

type Highlight = {
  journey: Journey
  images: string[]
}

const STORY_RING = 'ring-2 ring-metallic-gold ring-offset-2 ring-offset-[#F3F7F8]'

export default function JourneyHighlightsSection({ journeys }: { journeys: Journey[] }) {
  const [open, setOpen] = useState<Highlight | null>(null)
  const [storyImg, setStoryImg] = useState(0)

  if (journeys.length === 0) return null

  const highlights: Highlight[] = journeys.slice(0, 8).map((j) => ({
    journey: j,
    images: j.image_url
      ? [j.image_url, ...getJourneyImages(j).slice(0, 2)]
      : getJourneyImages(j),
  }))

  function openStory(h: Highlight) {
    setOpen(h)
    setStoryImg(0)
  }

  function nextImg() {
    if (!open) return
    setStoryImg((i) => (i + 1) % open.images.length)
  }

  return (
    <>
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F3F7F8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', letterSpacing: '0.2em' }}>
                Journey Stories
              </p>
              <h2 className="text-2xl sm:text-3xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2D2F33', fontWeight: 400 }}>
                Glimpses of{' '}
                <em style={{ color: '#D4AF35', fontStyle: 'italic' }}>the path.</em>
              </h2>
            </div>
          </div>

          {/* Story circles — horizontal scroll on mobile */}
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {highlights.map((h) => (
              <button
                key={h.journey.id}
                onClick={() => openStory(h)}
                className="flex flex-col items-center gap-2 flex-shrink-0 snap-start group"
              >
                {/* Ring + circle image */}
                <div className={`${STORY_RING} rounded-full p-0.5`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
                    <img
                      src={h.images[0]}
                      alt={h.journey.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                {/* Label */}
                <div className="text-center max-w-[72px] sm:max-w-[88px]">
                  <p className="text-[10px] leading-tight text-graphite font-medium truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {h.journey.title}
                  </p>
                  <p className="text-[9px] text-blue-slate mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {h.journey.duration}d
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen story viewer */}
      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-graphite/80 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative w-full sm:w-[380px] sm:rounded-2xl overflow-hidden shadow-2xl"
            style={{ maxHeight: '90vh', backgroundColor: '#2D2F33' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative h-[55vh] sm:h-[480px]" onClick={nextImg}>
              <img
                src={open.images[storyImg]}
                alt={open.journey.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/10 to-transparent" />

              {/* Progress bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1.5">
                {open.images.map((_, i) => (
                  <div key={i} className="h-0.5 flex-1 rounded-full bg-platinum/30 overflow-hidden">
                    <div
                      className="h-full bg-platinum rounded-full transition-all duration-300"
                      style={{ width: i < storyImg ? '100%' : i === storyImg ? '60%' : '0%' }}
                    />
                  </div>
                ))}
              </div>

              {/* Close */}
              <button
                className="absolute top-8 right-4 text-platinum/80 hover:text-platinum"
                onClick={() => setOpen(null)}
              >
                <X size={20} />
              </button>

              {/* Category pill */}
              <div className="absolute top-8 left-4">
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-platinum/20 text-platinum">
                  {open.journey.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-xs tracking-widest uppercase text-metallic-gold mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {open.journey.duration} days · {open.journey.route}
              </p>
              <h3 className="text-2xl text-platinum mb-2" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {open.journey.title}
              </h3>
              {open.journey.subtitle && (
                <p className="text-sm text-platinum/60 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {open.journey.subtitle}
                </p>
              )}
              <p className="text-sm text-metallic-gold mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                from ${open.journey.price_from.toLocaleString()}
              </p>

              {/* CTAs */}
              <div className="flex gap-3">
                <Link
                  href={`/journeys/${open.journey.slug}`}
                  className="flex-1 rounded-full py-3 text-center text-sm font-medium text-graphite transition-colors hover:opacity-90"
                  style={{ backgroundColor: '#D4AF35', fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => setOpen(null)}
                >
                  Book this journey
                </Link>
                <Link
                  href="/build/type"
                  className="flex items-center gap-2 rounded-full border border-platinum/20 px-4 py-3 text-sm text-platinum hover:border-metallic-gold transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  onClick={() => setOpen(null)}
                >
                  <MessageCircle size={14} />
                  Soma
                </Link>
              </div>
              <p className="mt-3 text-center text-[10px] text-platinum/30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Tap the photo to advance · tap outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
