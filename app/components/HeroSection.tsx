'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Search, Users } from 'lucide-react'
import Link from 'next/link'
import { travelImages } from '@/lib/travel-images'

const searchFields = [
  { icon: MapPin, eyebrow: 'Where to?', value: 'India or Nepal' },
  { icon: CalendarDays, eyebrow: 'When?', value: 'Choose your dates' },
  { icon: Users, eyebrow: 'Travellers', value: '2 travellers' },
]

const heroImages = [
  { src: travelImages.travelerWallpaper, alt: 'Traveller looking over a scenic destination' },
  { src: travelImages.travelUltraHd, alt: 'Ultra high definition travel landscape' },
  { src: travelImages.travelUltraHdAlt, alt: 'Dream travel destination wallpaper' },
  { src: travelImages.backpackWallpaper, alt: 'Backpacker travel wallpaper' },
  { src: travelImages.europeWallpaper, alt: 'European travel wallpaper' },
]

export default function HeroSection() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % heroImages.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-[780px] overflow-visible bg-graphite">
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((image, index) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1600ms] ease-in-out ${
              index === activeImage ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-graphite/48 via-graphite/18 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-graphite/22 via-transparent to-platinum/10" />

      <div className="relative mx-auto flex min-h-[780px] max-w-7xl items-center px-4 pb-40 pt-28 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.24em] text-metallic-gold">
            <span className="h-px w-10 bg-metallic-gold" />
            Your journey, thoughtfully handled
          </div>
          <h1 className="max-w-3xl font-serif text-5xl leading-[0.96] text-platinum drop-shadow-[0_3px_14px_rgba(45,47,51,0.55)] sm:text-6xl lg:text-8xl">
            Discover places
            <br />
            <span className="italic text-metallic-gold">you&apos;ll carry home.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-platinum drop-shadow-[0_2px_10px_rgba(45,47,51,0.5)] sm:text-lg">
            Curated spiritual and cultural journeys across India and Nepal, with every flight, stay,
            guide and quiet detail arranged around you.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/journeys"
              className="inline-flex items-center gap-3 rounded-xl bg-metallic-gold px-7 py-4 text-sm font-medium text-graphite shadow-lg transition hover:-translate-y-0.5 hover:bg-platinum"
            >
              Explore journeys <ArrowRight size={17} />
            </Link>
            <Link href="/build/type" className="rounded-xl border border-platinum/35 px-7 py-4 text-sm text-platinum backdrop-blur transition hover:border-metallic-gold hover:text-metallic-gold">
              Plan with Soma
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-2" aria-label="Hero image controls">
            {heroImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Show image ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeImage ? 'w-9 bg-metallic-gold' : 'w-3 bg-platinum/50 hover:bg-platinum'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 translate-y-1/2 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-platinum/70 bg-platinum shadow-[0_24px_60px_rgba(45,47,51,0.22)] md:grid-cols-[1fr_1fr_1fr_0.9fr]">
          {searchFields.map(({ icon: Icon, eyebrow, value }) => (
            <div key={eyebrow} className="flex items-center gap-4 border-b border-pale-sky px-5 py-5 md:border-b-0 md:border-r">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pale-sky text-blue-slate">
                <Icon size={19} />
              </span>
              <span>
                <span className="block text-[10px] uppercase tracking-[0.18em] text-blue-slate">{eyebrow}</span>
                <span className="mt-1 block text-sm font-medium text-graphite">{value}</span>
              </span>
            </div>
          ))}
          <Link href="/build/type" className="m-3 flex items-center justify-center gap-3 rounded-xl bg-graphite px-6 py-4 text-sm font-medium text-platinum transition hover:bg-blue-slate">
            Search your journey <Search size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}
