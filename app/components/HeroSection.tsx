import Link from 'next/link'
import HeroSearchBar from './HeroSearchBar'

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col"
      style={{ minHeight: 'calc(100svh - 64px)', backgroundColor: '#0A1228' }}
    >
      {/* ── Video + overlays — clipped inside their own div ── */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/2025_02_black-tomato-homepage.mp4" media="(min-width: 768px)" type="video/mp4" />
          <source src="/black-tomato-mob-home.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(10,18,40,0.52) 0%, rgba(10,18,40,0.10) 42%, rgba(10,18,40,0.72) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(100deg, rgba(10,18,40,0.60) 0%, rgba(10,18,40,0.18) 50%, transparent 100%)' }} />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* Hero copy */}
        <div className="flex flex-1 items-end px-4 pt-6 pb-5 sm:items-center sm:pt-10 sm:pb-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-[640px]">

              {/* Caption — hidden on mobile */}
              <div className="mb-5 hidden items-center gap-3 sm:flex">
                <div className="h-px w-8 shrink-0 bg-[#E8A317]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#E8A317]">
                  A radiant inner journey
                </span>
                <div className="h-px w-8 shrink-0 bg-[#E8A317]" />
              </div>

              {/* Headline */}
              <h1>
                <span
                  className="block text-[clamp(36px,6.5vw,86px)] font-black leading-[1.0] tracking-[-0.02em] text-white sm:leading-[0.93]"
                  style={{ textShadow: '0 2px 28px rgba(10,18,40,0.5)' }}
                >
                  Discover Places
                </span>
                <span
                  className="block text-[clamp(36px,6.5vw,86px)] font-black leading-[1.0] tracking-[-0.02em] text-white sm:leading-[0.93]"
                  style={{ textShadow: '0 2px 28px rgba(10,18,40,0.5)' }}
                >
                 you&apos;ll carry home.
                </span>
              </h1>

              {/* Sub-copy — hidden on mobile */}
              <p className="mt-5 hidden max-w-[420px] text-[15px] leading-[1.85] text-white/65 sm:block">
                Explore breathtaking spiritual destinations, unforgettable sacred experiences, and
                transformative journeys across India and Nepal that inspire.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex items-center gap-3 sm:mt-9 sm:gap-4">
                <Link
                  href="/build/type"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-bold text-[#1D2B53] shadow-[0_8px_32px_rgba(10,18,40,0.32)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#F8F6F2] sm:gap-2.5 sm:px-8 sm:py-4 sm:text-[14px]"
                >
                  Explore Now
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link
                  href="/journeys"
                  className="text-[13px] font-semibold text-white/80 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline sm:text-[14px]"
                >
                  Browse Journeys
                </Link>
              </div>

              {/* Trust chips — hidden on mobile */}
              <div className="mt-6 hidden flex-wrap items-center gap-x-5 gap-y-2 sm:flex">
                {['24/7 Support', 'Verified Guides', 'Insurance Included', 'GPS Tracking'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-[#E8A317]" />
                    <span className="text-[12px] font-medium text-white/55">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Search bar ── */}
        <div className="relative z-20 px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <HeroSearchBar />
          </div>
        </div>

      </div>
    </section>
  )
}
