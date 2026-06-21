import Link from 'next/link'

const steps = [
  {
    number: '01',
    title: 'Find Your Dream Destination',
    description:
      'Explore curated places and pick the trip style that matches your pace, budget, and travel mood.',
  },
  {
    number: '02',
    title: 'Compare Packages',
    description:
      'Review routes, stays, experiences, inclusions, and prices before choosing the bundle that fits.',
  },
  {
    number: '03',
    title: 'Book & Secure Your Spot',
    description:
      'Confirm your package with a simple booking flow and clear support from our travel team.',
  },
  {
    number: '04',
    title: 'Get Ready to Travel',
    description:
      'Receive your trip details, travel checklist, and final reminders before your adventure begins.',
  },
]

export default function JourneyStartsSection() {
  return (
    <>
      {/* How it works */}
      <section id="about" className="scroll-mt-16 bg-[#F3F7F8] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-stretch">

          {/* Left: steps */}
          <div className="flex flex-col justify-center py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF35]">
              How it works
            </p>
            <h2 className="mt-4 text-[clamp(28px,4vw,48px)] font-black leading-tight text-[#2D2F33]">
              Your Journey{' '}
              <span className="text-[#D4AF35]">Starts Here</span>
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-[#6B7A80]">
              From the first spark of inspiration to the moment you arrive — every step
              is designed to feel simple, clear, and completely supported.
            </p>

            <div className="mt-10 space-y-0">
              {steps.map((step, index) => (
                <div key={step.title} className="group relative flex gap-5 pb-8 last:pb-0">
                  {/* Line + number */}
                  <div className="relative flex w-10 shrink-0 flex-col items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#D4AF35] bg-white text-[12px] font-black text-[#D4AF35] shadow-[0_0_0_4px_rgba(212,175,53,0.10)] transition-all duration-200 group-hover:bg-[#D4AF35] group-hover:text-[#1C1E21]">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-gradient-to-b from-[#D4AF35]/40 to-[#BFDDE7]/30" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="pb-1 pt-1.5">
                    <h3 className="text-[15px] font-bold text-[#2D2F33]">{step.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.75] text-[#6B7A80]">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/build/type"
                className="inline-flex rounded-full bg-[#2D2F33] px-7 py-3.5 text-[13px] font-bold tracking-[0.3px] text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#D4AF35] hover:text-[#1C1E21]"
              >
                Start Planning →
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative min-h-[420px] overflow-hidden rounded-[24px] lg:min-h-full">
            <img
              src="https://picsum.photos/seed/alpine-camper-van/1200/1100"
              alt="Mountain road with scenic views"
              className="h-full w-full object-cover"
            />
            {/* Overlay with floating card */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E21]/60 via-transparent to-transparent" />
            <div
              className="absolute bottom-6 left-6 right-6 rounded-2xl p-5"
              style={{
                background: 'rgba(28,30,33,0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF35]">
                Currently Trending
              </p>
              <p className="mt-1 text-base font-bold text-white">Annapurna Base Camp</p>
              <p className="mt-0.5 text-[13px] text-white/55">12 days · Nepal · From $6,420</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="relative overflow-hidden">
        <img
          src="https://picsum.photos/seed/mountain-valley-banner/1800/760"
          alt="Dramatic mountain landscape"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Multi-layer overlay for drama */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1E21]/85 via-[#1C1E21]/55 to-[#1C1E21]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E21]/70 via-transparent to-[#1C1E21]/30" />

        <div className="relative z-10 mx-auto flex min-h-[460px] max-w-7xl flex-col items-start justify-center px-4 py-24 sm:px-6 lg:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF35]">
            Ready to explore?
          </p>
          <h2 className="mt-4 max-w-2xl text-[clamp(28px,5vw,60px)] font-black leading-[1.0] text-white">
            Plan Your Perfect{' '}
            <span className="text-[#D4AF35]">Trip Today.</span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-[1.8] text-white/55">
            Our expert team and AI counsellor are ready to craft an experience built
            entirely around you.
          </p>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
            <Link
              href="/build/type"
              className="inline-flex rounded-full bg-[#D4AF35] px-8 py-4 text-[13px] font-bold tracking-[0.3px] text-[#1C1E21] shadow-[0_8px_30px_rgba(212,175,53,0.35)] transition-all duration-200 hover:scale-[1.03] hover:bg-[#B8941F]"
            >
              Get the Bundle
            </Link>
            <Link
              href="/journeys"
              className="inline-flex rounded-full border-2 border-white/30 px-8 py-4 text-[13px] font-bold tracking-[0.3px] text-white transition-all duration-200 hover:scale-[1.03] hover:border-white hover:bg-white hover:text-[#1C1E21]"
            >
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
