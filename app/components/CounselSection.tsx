'use client';

import { travelImages } from '@/lib/travel-images';

export default function CounselSection() {
  return (
    <section
      id="counsel"
      className="py-24 px-6 lg:px-8"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Photo Placeholder */}
          <div
            className="hidden lg:block w-full h-[680px] rounded-2xl overflow-hidden relative"
          >
            <img src={travelImages.varanasi} alt="Soma guide in Varanasi" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
            {/* Decorative texture */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.1) 30px, rgba(255,255,255,0.1) 31px)',
                }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div
                className="inline-block px-3 py-1 rounded mb-3"
                style={{ backgroundColor: 'rgba(250, 250, 248, 0.15)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: 'rgba(255,255,255,0.9)', letterSpacing: '0.15em' }}
                >
                  Soma · Your Guide
                </span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex flex-col gap-6">
            {/* Label */}
            <p
              className="text-xs tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.2em' }}
            >
              AI Counsellor
            </p>

            {/* Heading */}
            <h2
              className="text-4xl lg:text-5xl leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 400 }}
            >
              Tell me about the{' '}
              <em style={{ color: '#B89A4E', fontStyle: 'italic' }}>journey you imagine.</em>
            </h2>

            {/* Chat interface */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D9' }}
            >
              {/* Soma bubble */}
              <div className="flex flex-col gap-2">
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.15em' }}
                >
                  Soma · Your Guide
                </span>
                <div
                  className="rounded-xl rounded-tl-sm p-4"
                  style={{ backgroundColor: '#F5F0E8' }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: '#1C1917',
                      fontStyle: 'italic',
                      fontSize: '1rem',
                    }}
                  >
                    What season of life are you in, and what do you hope to leave behind for a little while?
                  </p>
                </div>
              </div>

              {/* User reply bubble */}
              <div className="flex flex-col items-end gap-2">
                <div
                  className="rounded-xl rounded-tr-sm p-4 max-w-xs"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E3D9' }}
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917', fontWeight: 300 }}
                  >
                    Just retired. Two of us. We want quiet — the Ganges at dawn, a few temples. Maybe two weeks.
                  </p>
                </div>
              </div>

              {/* Draft result card */}
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: '#F5F0E8', border: '1px solid #E8E3D9' }}
              >
                <p
                  className="text-xs tracking-widest uppercase mb-2"
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#B89A4E', letterSpacing: '0.15em' }}
                >
                  A Draft For You
                </p>
                <h4
                  className="text-lg mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#1C1917', fontWeight: 500 }}
                >
                  14 days · The Slow Ganges
                </h4>
                <div className="flex flex-col gap-2 mb-3">
                  {[
                    'Day 1–4  Varanasi · Assi Ghat heritage stay',
                    'Day 5–7  Sarnath · meditative day-trips',
                    'Day 8–11  Bodh Gaya · Mahabodhi residency',
                    'Day 12–14  Rishikesh · the river, the silence',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#B89A4E' }} />
                      <p
                        className="text-xs leading-relaxed"
                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#9C9589', fontWeight: 300 }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {['SPIRITUAL', 'SLOW PACE', 'BOUTIQUE STAYS'].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs tracking-widest uppercase px-2 py-1 rounded"
                      style={{
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        color: '#B89A4E',
                        backgroundColor: 'rgba(184, 154, 78, 0.1)',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-2">
              {['Make it slower', 'Add Nepal', 'Less travel', 'More yoga'].map((chip) => (
                <button
                  key={chip}
                  className="px-4 py-2 rounded-full text-sm transition-all duration-200 hover:border-[#B89A4E] hover:text-[#B89A4E]"
                  style={{
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    color: '#1C1917',
                    border: '1px solid #E8E3D9',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 300,
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input field */}
            <div
              className="flex items-center gap-3 rounded-full px-5 py-3"
              style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #E8E3D9' }}
            >
              <input
                type="text"
                placeholder="Refine the journey…"
                className="flex-1 text-sm bg-transparent outline-none"
                style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#1C1917' }}
              />
              <button
                className="flex-shrink-0 p-1 rounded-full transition-colors hover:bg-highlight"
                style={{ color: '#9C9589' }}
                aria-label="Voice input"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
