import type { Journey } from '@/types/database'
import { getJourneyImage } from '@/lib/travel-images'

const FALLBACK_TRIPS = [
  {
    tag: 'SPIRITUAL',
    photoLabel: 'Photo · The Slow Ganges',
    gradient: 'linear-gradient(150deg, #c5b89a 0%, #a0876a 100%)',
    image: getJourneyImage({ title: 'The Slow Ganges', category: 'spiritual', route: 'Varanasi → Rishikesh' }),
    title: 'The Slow Ganges',
    details: '14 d · Varanasi → Rishikesh',
    price: 'FROM $7,158',
    href: '#',
  },
  {
    tag: 'HERITAGE',
    photoLabel: 'Photo · Three Buddhas',
    gradient: 'linear-gradient(150deg, #b8c4b0 0%, #8a9c82 100%)',
    image: getJourneyImage({ title: 'Three Buddhas', category: 'heritage', route: 'Bodh Gaya → Lumbini' }),
    title: 'Three Buddhas',
    details: '10 d · Bodh Gaya → Lumbini',
    price: 'FROM $5,890',
    href: '#',
  },
  {
    tag: 'ADVENTURE',
    photoLabel: 'Photo · Annapurna in Hush',
    gradient: 'linear-gradient(150deg, #b0c0d0 0%, #7a95aa 100%)',
    image: getJourneyImage({ title: 'Annapurna in Hush', category: 'adventure', route: 'Pokhara → ABC' }),
    title: 'Annapurna in Hush',
    details: '12 d · Pokhara → ABC',
    price: 'FROM $6,420',
    href: '#',
  },
]

const CATEGORY_GRADIENTS: Record<string, string> = {
  spiritual: 'linear-gradient(150deg, #c5b89a 0%, #a0876a 100%)',
  heritage: 'linear-gradient(150deg, #b8c4b0 0%, #8a9c82 100%)',
  adventure: 'linear-gradient(150deg, #b0c0d0 0%, #7a95aa 100%)',
  wellness: 'linear-gradient(150deg, #c0c8d8 0%, #8a9ab8 100%)',
}

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
        photoLabel: `Photo · ${j.title}`,
        gradient: CATEGORY_GRADIENTS[j.category] ?? CATEGORY_GRADIENTS.spiritual,
        image: getJourneyImage(j),
        title: j.title,
        details: `${j.duration} d · ${j.route}`,
        price: `FROM $${j.price_from.toLocaleString()}`,
        href: `/journeys/${j.slug}`,
      }))
    : FALLBACK_TRIPS

  return (
    <section id="storyline" className="py-24 px-6 lg:px-8" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.2em' }}
            >
              The Story Line
            </p>
            <h2
              className="text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
            >
              Journeys,{' '}
              <em style={{ color: '#B89A4E', fontStyle: 'italic' }}>not packages.</em>
            </h2>
          </div>
          <a
            href="#"
            className="text-sm tracking-widest uppercase transition-opacity hover:opacity-70 flex-shrink-0"
            style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.15em' }}
          >
            View All →
          </a>
        </div>

        {/* Trip Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {displayTrips.map((trip) => (
            <div
              key={trip.title}
              className="rounded-2xl overflow-hidden group cursor-pointer transition-shadow duration-300 hover:shadow-lg"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D9' }}
            >
              {/* Photo Placeholder */}
              <div
                className="h-56 w-full flex items-end p-4 relative overflow-hidden"
                style={{ background: trip.gradient }}
              >
                <img src={trip.image} alt={trip.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/65 via-[#1C1917]/10 to-transparent" />
                <span
                  className="text-xs tracking-widest uppercase text-white/70 relative z-10"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.15em' }}
                >
                  {trip.photoLabel}
                </span>
                {/* Tag badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="text-xs tracking-widest uppercase px-2 py-1 rounded"
                    style={{
                      fontFamily: "'DM Sans', system-ui, sans-serif",
                      color: '#B89A4E',
                      backgroundColor: 'rgba(250, 250, 248, 0.9)',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {trip.tag}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5">
                <h3
                  className="text-2xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
                >
                  {trip.title}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', fontWeight: 300 }}
                >
                  {trip.details}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm font-medium tracking-wide"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917' }}
                  >
                    {trip.price}
                  </span>
                  <a
                    href={trip.href}
                    className="text-sm transition-colors hover:text-[#B89A4E]"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E' }}
                  >
                    Read the story →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Travel by feeling */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#F5F0E8' }}
        >
          <h3
            className="text-2xl lg:text-3xl mb-6"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
          >
            Travel by feeling
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className="px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:border-[#B89A4E] hover:text-[#B89A4E] group"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: '#1C1917',
                  border: '1px solid #E8E3D9',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <span className="font-medium">{cat.label}</span>
                <span className="ml-2 text-xs" style={{ color: '#9C9589' }}>· {cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
