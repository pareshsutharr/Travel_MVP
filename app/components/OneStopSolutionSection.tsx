import { Bot, Car, FileCheck2, Hotel, MapPinned, Plane } from 'lucide-react'
import Link from 'next/link'
import { travelImages } from '@/lib/travel-images'

const facilities = [
  { icon: Plane, title: 'Flights', copy: 'Routes compared and timed around your journey.' },
  { icon: Hotel, title: 'Stays', copy: 'Characterful hotels and trusted local lodges.' },
  { icon: Car, title: 'Private travel', copy: 'Airport transfers, drivers and intercity cars.' },
  { icon: FileCheck2, title: 'Visas and documents', copy: 'Checklists, reminders and hands-on support.' },
  { icon: Bot, title: 'Soma counsellor', copy: 'Personal guidance before and during your trip.' },
  { icon: MapPinned, title: 'Live trip support', copy: '24/7 assistance, GPS and local coordination.' },
]

export default function OneStopSolutionSection() {
  return (
    <section className="bg-platinum px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-blue-slate">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
            <img src={travelImages.rishikesh} alt="Rishikesh and the Ganges" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-blue-slate/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 sm:p-10">
              <p className="text-xs uppercase tracking-[0.2em] text-metallic-gold">One journey. One team.</p>
              <p className="mt-3 max-w-sm font-serif text-3xl leading-tight text-platinum">
                You experience the place. We handle what surrounds it.
              </p>
            </div>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-metallic-gold">Everything connected</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-platinum sm:text-5xl">
              Less planning. More presence.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-pale-sky">
              One clear travel basket brings together the practical details, local knowledge and human support behind every Solura journey.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {facilities.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="rounded-2xl border border-platinum/15 bg-platinum/5 p-4 transition hover:border-metallic-gold/70 hover:bg-platinum/10">
                  <Icon className="mb-3 text-metallic-gold" size={19} />
                  <h3 className="text-sm font-semibold text-platinum">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-pale-sky">{copy}</p>
                </div>
              ))}
            </div>

            <Link href="/build/type" className="mt-8 inline-flex rounded-xl bg-metallic-gold px-6 py-3 text-sm font-medium text-graphite transition hover:bg-platinum">
              Build your travel basket →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
