import Link from 'next/link'

type DestCard = {
  badge: string
  badgeStyle: string
  name: string
  country: string
  price: string
  image: string
  href: string
}

const destinations: DestCard[] = [
  {
    badge: 'Popular',
    badgeStyle: 'bg-[#E8A317] text-white',
    name: 'Varanasi',
    country: 'India',
    price: 'From $1,890',
    image: 'https://images.pexels.com/photos/3417874/pexels-photo-3417874.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1867&fit=crop',
    href: '/journeys',
  },
  {
    badge: 'Trending',
    badgeStyle: 'bg-[#1D2B53] text-white',
    name: 'Kathmandu',
    country: 'Nepal',
    price: 'From $2,190',
    image: 'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1867&fit=crop',
    href: '/journeys',
  },
  {
    badge: 'Best Value',
    badgeStyle: 'bg-[#6E8B74] text-white',
    name: 'Rishikesh',
    country: 'India',
    price: 'From $1,490',
    image: 'https://images.pexels.com/photos/2104742/pexels-photo-2104742.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1867&fit=crop',
    href: '/journeys',
  },
  {
    badge: 'New',
    badgeStyle: 'bg-white/90 text-[#1F2937]',
    name: 'Pokhara',
    country: 'Nepal',
    price: 'From $2,490',
    image: 'https://images.pexels.com/photos/3408353/pexels-photo-3408353.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1867&fit=crop',
    href: '/journeys',
  },
]

export default function FeaturedDestinationSection() {
  return (
    <section
      id="packages"
      className="scroll-mt-16 bg-[#F8F6F2] px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">

        {/* ── Section header ── */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[clamp(26px,3.5vw,40px)] font-black leading-tight text-[#1F2937]">
              Featured Destinations
            </h2>
            <p className="mt-2 text-[15px] leading-[1.7] text-[#6B7A80]">
              Handpicked destinations perfect for your next spiritual adventure.
            </p>
          </div>
          <Link
            href="/journeys"
            className="group inline-flex shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[#1D2B53] transition-colors hover:text-[#E8A317]"
          >
            View all destinations
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* ── Card grid ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {destinations.map((dest) => (
            <Link
              key={dest.name}
              href={dest.href}
              className="group relative block overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(29,43,83,0.10)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(29,43,83,0.18)]"
              style={{ aspectRatio: '3/4', backgroundColor: '#1D2B53' }}
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={`${dest.name}, ${dest.country}`}
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />

              {/* Badge */}
              <div className="absolute left-3 top-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.06em] ${dest.badgeStyle}`}
                >
                  {dest.badge}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                {/* Location */}
                <div className="mb-0.5 flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 text-[#E8A317]">
                    <path d="M8 0C5.24 0 3 2.24 3 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5zm0 6.5C7.17 6.5 6.5 5.83 6.5 5S7.17 3.5 8 3.5 9.5 4.17 9.5 5 8.83 6.5 8 6.5z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-white/70">{dest.country}</span>
                </div>
                {/* Name */}
                <h3 className="text-[22px] font-black leading-tight text-white">{dest.name}</h3>
                {/* Price */}
                <p className="mt-1 text-[13px] font-bold text-[#E8A317]">{dest.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
