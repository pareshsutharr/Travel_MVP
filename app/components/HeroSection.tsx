import { travelImages } from '@/lib/travel-images'
import Link from 'next/link'

export default function HeroSection() {
  const photoCards = [
    {
      className: 'absolute top-0 right-0 w-48 h-72 rounded-2xl overflow-hidden shadow-md',
      src: travelImages.varanasi,
      label: 'Varanasi · Ghat',
    },
    {
      className: 'absolute top-28 left-4 w-56 h-52 rounded-2xl overflow-hidden shadow-md',
      src: travelImages.rishikesh,
      label: 'Rishikesh',
    },
    {
      className: 'absolute bottom-0 left-0 right-8 h-48 rounded-2xl overflow-hidden shadow-md',
      src: travelImages.nepal,
      label: 'Nepal · Pokhara',
    },
  ]

  return (
    <section
      className="min-h-screen flex items-center pt-16"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center gap-8 lg:py-20">
            {/* Label */}
            <p
              className="text-xs tracking-widest uppercase"
              style={{
                fontFamily: "'DM Sans', system-ui, sans-serif",
                color: '#B89A4E',
                letterSpacing: '0.2em',
              }}
            >
              India · Nepal · Since 2024
            </p>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
            >
              The trip is the
              <br />
              <em style={{ color: '#B89A4E', fontStyle: 'italic' }}>quiet part.</em>
            </h1>

            {/* Body */}
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', fontWeight: 300 }}
            >
              We pack the basket — the visa, the cab, the hotel, the SIM, the guide, the fees,
              and the small worries you didn&apos;t know you packed. You pay it. You walk.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/build/type"
                className="px-6 py-3 rounded-full text-sm transition-all duration-200 hover:bg-ink hover:text-white"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: '#1C1917',
                  border: '1.5px solid #1C1917',
                  fontWeight: 400,
                }}
              >
                Talk with Soma →
              </Link>
              <Link
                href="#storyline"
                className="px-6 py-3 rounded-full text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  backgroundColor: '#B89A4E',
                  fontWeight: 400,
                }}
              >
                See the Story Line
              </Link>
            </div>

            {/* Trust Row */}
            <div
              className="flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', letterSpacing: '0.1em' }}
            >
              <span>Trustpilot · 4.9</span>
              <span style={{ color: '#B89A4E' }}>·</span>
              <span>1,420+ Journeys</span>
              <span style={{ color: '#B89A4E' }}>·</span>
              <span>24×7 Counsel</span>
            </div>
          </div>

          {/* Right: Photo Collage (desktop only) */}
          <div className="hidden lg:block relative h-[600px] lg:h-[680px]">
            {photoCards.map((card) => (
              <div key={card.label} className={card.className}>
                <img src={card.src} alt={card.label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/55 via-[#1C1917]/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <p
                    className="text-xs tracking-widest uppercase text-white/85"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif", letterSpacing: '0.15em' }}
                  >
                    {card.label}
                  </p>
                </div>
              </div>
            ))}

            {/* Floating Quote Card */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/2 w-64 rounded-xl p-4 shadow-lg z-10"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D9' }}
            >
              <div
                className="w-6 h-6 rounded-full mb-3 flex items-center justify-center"
                style={{ backgroundColor: '#F5F0E8' }}
              >
                <span
                  className="text-xs"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#B89A4E' }}
                >
                  ❝
                </span>
              </div>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: '#1C1917',
                  fontStyle: 'italic',
                  fontSize: '0.875rem',
                }}
              >
                &ldquo;Felt like a friend in Delhi had thought of everything before we arrived.&rdquo;
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589' }}
              >
                Margaret &amp; John · USA · 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
