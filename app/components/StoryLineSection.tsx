import type { Journey } from '@/types/database'
import { getJourneyAttraction, getJourneyImages } from '@/lib/travel-images'
import JourneyCard from './JourneyCard'

const FALLBACK_TRIPS = [
  {
    tag: 'SPIRITUAL',
    title: 'The Slow Ganges',
    details: '14 d · Varanasi → Rishikesh',
    price: 'FROM $7,158',
    href: '#',
    category: 'spiritual',
  },
  {
    tag: 'HERITAGE',
    title: 'Three Buddhas',
    details: '10 d · Bodh Gaya → Lumbini',
    price: 'FROM $5,890',
    href: '#',
    category: 'heritage',
  },
  {
    tag: 'ADVENTURE',
    title: 'Annapurna in Hush',
    details: '12 d · Pokhara → ABC',
    price: 'FROM $6,420',
    href: '#',
    category: 'adventure',
  },
]

const categories = [
  { label: 'Spiritual', count: '24 journeys' },
  { label: 'Wellness', count: '18 journeys' },
  { label: 'Heritage', count: '31 journeys' },
  { label: 'Adventure', count: '12 journeys' },
]

interface Props {
  journeys: Journey[]
}

export default function StoryLineSection({ journeys }: Props) {
  const hasRealData = journeys.length > 0
  const displayTrips = hasRealData
    ? journeys.slice(0, 3).map((j) => ({
        tag: j.category.toUpperCase(),
        images: getJourneyImages(j),
        title: j.title,
        details: `${getJourneyAttraction(j)} · ${j.duration} d`,
        price: `FROM $${j.price_from.toLocaleString()}`,
        href: `/journeys/${j.slug}`,
        category: j.category,
      }))
    : FALLBACK_TRIPS.map((t) => ({
        ...t,
        images: getJourneyImages({ title: t.title, category: t.category as 'spiritual' | 'heritage' | 'adventure' | 'wellness', route: t.details }),
        details: `${getJourneyAttraction({ title: t.title, category: t.category as 'spiritual' | 'heritage' | 'adventure' | 'wellness', route: t.details })} · ${t.details}`,
      }))

  return (
    <section id="storyline" className="bg-platinum px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs tracking-widest uppercase mb-3" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#D4AF35', letterSpacing: '0.2em' }}>
              Featured journeys
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-tight" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2D2F33', fontWeight: 400 }}>
              Places worth{' '}
              <em style={{ color: '#D4AF35', fontStyle: 'italic' }}>slowing down for.</em>
            </h2>
          </div>
          <a href="/journeys" className="flex-shrink-0 text-sm font-medium text-blue-slate transition hover:text-metallic-gold">
            View all journeys →
          </a>
        </div>

        {/* Journey card grid with carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayTrips.map((trip) => (
            <JourneyCard key={trip.title} {...trip} />
          ))}
        </div>

        {/* Travel by feeling */}
        <div className="rounded-3xl bg-graphite p-8 sm:p-10">
          <h3 className="text-2xl lg:text-3xl mb-6" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2D2F33', fontWeight: 400 }}>
            <span className="text-platinum">Travel by feeling</span>
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <a
                key={cat.label}
                href={`/journeys?category=${cat.label.toLowerCase()}`}
                className="group rounded-xl border border-platinum/15 bg-platinum/5 px-5 py-3 text-sm text-platinum transition-all duration-200 hover:border-metallic-gold hover:text-metallic-gold"
              >
                <span className="font-medium">{cat.label}</span>
                <span className="ml-2 text-xs text-pale-sky">· {cat.count}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
