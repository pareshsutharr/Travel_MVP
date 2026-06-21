'use client'

import { travelImages } from '@/lib/travel-images'
import Link from 'next/link'

const itinerary = [
  'Day 1–4  Varanasi · Assi Ghat heritage stay',
  'Day 5–7  Sarnath · meditative day-trips',
  'Day 8–11  Bodh Gaya · Mahabodhi residency',
  'Day 12–14  Rishikesh · the river, the silence',
]

const refineTags = ['Make it slower', 'Add Nepal', 'Less travel', 'More yoga']

export default function CounselSection() {
  return (
    <section
      id="counsel"
      className="scroll-mt-16 bg-[#F3F7F8] px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Left: image */}
          <div className="relative hidden overflow-hidden rounded-[24px] lg:block" style={{ minHeight: 680 }}>
            <img
              src={travelImages.varanasi}
              alt="Soma guide in Varanasi"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1E21]/75 via-[#1C1E21]/15 to-transparent" />
            {/* Diagonal texture */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.08) 40px, rgba(255,255,255,0.08) 41px)',
              }}
            />
            {/* Label pill */}
            <div className="absolute bottom-7 left-7 right-7">
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                style={{
                  background: 'rgba(212,175,53,0.15)',
                  border: '1px solid rgba(212,175,53,0.35)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D4AF35]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF35]">
                  Soma · Your AI Guide
                </span>
              </div>
              <p className="mt-3 text-2xl font-black text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Varanasi at dawn.
              </p>
              <p className="mt-1 text-[13px] text-white/55">Where every journey begins in stillness.</p>
            </div>
          </div>

          {/* Right: content */}
          <div className="flex flex-col gap-7">
            {/* Label */}
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D4AF35]">
              AI Counsellor
            </p>

            {/* Heading */}
            <h2 className="text-[clamp(28px,4vw,48px)] font-black leading-tight text-[#2D2F33]">
              Tell me about the{' '}
              <em
                className="font-normal text-[#D4AF35]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'italic' }}
              >
                journey you imagine.
              </em>
            </h2>

            <p className="text-[15px] leading-[1.8] text-[#6B7A80]">
              Soma, your personal AI travel counsellor, listens to how you want to feel — then
              builds an itinerary around that, not a template.
            </p>

            {/* Chat UI */}
            <div className="flex flex-col gap-4 rounded-[20px] border border-[#BFDDE7] bg-white p-5 shadow-[0_8px_30px_rgba(45,47,51,0.07)]">
              {/* Soma bubble */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF35]">
                  Soma · Your Guide
                </span>
                <div className="rounded-2xl rounded-tl-sm bg-[#EEF6F9] p-4">
                  <p
                    className="text-base italic leading-[1.75] text-[#2D2F33]"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    What season of life are you in, and what do you hope to leave behind for a little while?
                  </p>
                </div>
              </div>

              {/* User reply */}
              <div className="flex flex-col items-end gap-1.5">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm border border-[#BFDDE7] bg-[#F3F7F8] p-4">
                  <p className="text-[14px] leading-[1.75] font-light text-[#2D2F33]">
                    Just retired. Two of us. We want quiet — the Ganges at dawn, a few temples. Maybe two weeks.
                  </p>
                </div>
              </div>

              {/* Draft result */}
              <div className="rounded-2xl border border-[#D4AF35]/25 bg-gradient-to-br from-[#EEF6F9] to-[#F3F7F8] p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF35]">
                  A Draft For You
                </p>
                <h4
                  className="mt-1.5 text-xl text-[#2D2F33]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 500 }}
                >
                  14 days · The Slow Ganges
                </h4>
                <div className="mt-3 flex flex-col gap-2">
                  {itinerary.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full"
                        style={{ backgroundColor: '#D4AF35' }}
                      />
                      <p className="text-[13px] font-light leading-[1.7] text-[#3C687C]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {['SPIRITUAL', 'SLOW PACE', 'BOUTIQUE STAYS'].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#D4AF35]/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#D4AF35]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Refine chips */}
            <div className="flex flex-wrap gap-2">
              {refineTags.map((chip) => (
                <button
                  key={chip}
                  className="rounded-full border border-[#BFDDE7] bg-white px-4 py-2 text-[13px] font-semibold text-[#2D2F33] transition-all duration-200 hover:scale-[1.02] hover:border-[#D4AF35] hover:text-[#D4AF35]"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 rounded-full border-[1.5px] border-[#BFDDE7] bg-white px-5 py-3 shadow-sm focus-within:border-[#D4AF35]/60 transition-colors duration-200">
              <input
                type="text"
                placeholder="Refine the journey…"
                className="flex-1 bg-transparent text-sm text-[#2D2F33] outline-none placeholder:text-[#9BA8AF]"
              />
              <button
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF35] text-[#1C1E21] transition-all duration-200 hover:scale-110 hover:bg-[#B8941F]"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

            {/* CTA */}
            <Link
              href="/build/counsel"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2D2F33] px-7 py-3.5 text-[13px] font-bold tracking-[0.3px] text-white transition-all duration-200 hover:scale-[1.02] hover:bg-[#D4AF35] hover:text-[#1C1E21]"
            >
              Start a conversation with Soma →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
