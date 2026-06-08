import { BadgeCheck, Compass, Headphones, ShieldCheck } from 'lucide-react'

const benefits = [
  { icon: Compass, title: 'Curated journeys', copy: 'Handpicked for depth, not crowds' },
  { icon: BadgeCheck, title: 'One clear price', copy: 'Flights, stays and support bundled' },
  { icon: Headphones, title: '24/7 counsel', copy: 'A real person when you need one' },
  { icon: ShieldCheck, title: 'Safe and secure', copy: 'Live support throughout your trip' },
]

export default function ServicesStrip() {
  return (
    <section className="bg-platinum px-4 pb-14 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 border-b border-pale-sky pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ icon: Icon, title, copy }, index) => (
          <div key={title} className={`flex items-center gap-4 lg:px-5 ${index > 0 ? 'lg:border-l lg:border-pale-sky' : ''}`}>
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${index === 1 ? 'bg-metallic-gold text-graphite' : index === 2 ? 'bg-graphite text-platinum' : 'bg-pale-sky text-blue-slate'}`}>
              <Icon size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-graphite">{title}</span>
              <span className="mt-1 block text-xs leading-5 text-blue-slate">{copy}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
