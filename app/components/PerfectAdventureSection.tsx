'use client'

import { useState } from 'react'
import { DestinationCard } from '@/components/ui/card-21'

const tabs = ['All', 'Beach', 'Mountain', 'Cultural', 'Luxury', 'Adventure'] as const
type Tab = (typeof tabs)[number]

type Adventure = {
  id: number
  category: Exclude<Tab, 'All'>
  location: string
  flag: string
  stats: string
  image: string
  href: string
  themeColor: string
}

const adventures: Adventure[] = [
  {
    id: 1,
    category: 'Cultural',
    location: 'Paris',
    flag: '🇫🇷',
    stats: '5 Days  •  From $520  •  ★ 4.9',
    image: '/185289.jpg',
    href: '/journeys',
    themeColor: '215 45% 28%', // deep navy blue
  },
  {
    id: 2,
    category: 'Adventure',
    location: 'Bali',
    flag: '🇮🇩',
    stats: '7 Days  •  From $690  •  ★ 4.8',
    image: '/wp5240504-travel-ultra-hd-wallpapers.jpg',
    href: '/journeys',
    themeColor: '150 48% 22%', // lush deep green
  },
  {
    id: 3,
    category: 'Mountain',
    location: 'Nepal',
    flag: '🇳🇵',
    stats: '9 Days  •  From $850  •  ★ 4.7',
    image: '/wp9087904-4k-eu-wallpapers.jpg',
    href: '/journeys',
    themeColor: '200 50% 24%', // deep glacier teal
  },
  {
    id: 4,
    category: 'Beach',
    location: 'Maldives',
    flag: '🇲🇻',
    stats: '6 Days  •  From $740  •  ★ 4.9',
    image: '/wp5240579-travel-ultra-hd-wallpapers.jpg',
    href: '/journeys',
    themeColor: '192 60% 26%', // deep ocean
  },
  {
    id: 5,
    category: 'Luxury',
    location: 'Switzerland',
    flag: '🇨🇭',
    stats: '8 Days  •  From $980  •  ★ 5.0',
    image: '/wp3067500-traveler-wallpapers.jpg',
    href: '/journeys',
    themeColor: '240 38% 28%', // rich twilight purple
  },
  {
    id: 6,
    category: 'Adventure',
    location: 'Iceland',
    flag: '🇮🇸',
    stats: '5 Days  •  From $610  •  ★ 4.6',
    image: '/wp6510008-bts-backpack-wallpapers.jpg',
    href: '/journeys',
    themeColor: '195 55% 22%', // arctic midnight blue
  },
]

export default function PerfectAdventureSection() {
  const [activeTab, setActiveTab] = useState<Tab>('All')

  const filtered =
    activeTab === 'All' ? adventures : adventures.filter((a) => a.category === activeTab)

  return (
    <section id="gallery" className="scroll-mt-16 bg-[#F3F7F8] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF35]">
              Curated Collection
            </p>
            <h2 className="mt-3 text-[clamp(28px,4vw,48px)] font-black leading-tight text-[#2D2F33]">
              Find Your Perfect{' '}
              <span className="text-[#D4AF35]">Adventure</span>
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-[#6B7A80]">
              Browse curated escapes by travel style — from serene coastlines to bold mountain routes.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold tracking-[0.2px] transition-all duration-200 hover:scale-[1.02] ${
                  activeTab === tab
                    ? 'border-[#D4AF35] bg-[#D4AF35] text-[#1C1E21]'
                    : 'border-[#BFDDE7] bg-white text-[#6B7A80] hover:border-[#D4AF35]/50 hover:text-[#2D2F33]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((adventure) => (
            <div key={adventure.id} className="h-[420px]">
              <DestinationCard
                imageUrl={adventure.image}
                location={adventure.location}
                flag={adventure.flag}
                stats={adventure.stats}
                href={adventure.href}
                themeColor={adventure.themeColor}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
