import {
  BadgeCheck,
  Bot,
  Building2,
  Car,
  CircleDollarSign,
  FileCheck2,
  Globe2,
  Hotel,
  Languages,
  MapPinned,
  Plane,
  ShieldCheck,
  Sparkles,
  Utensils,
  Users,
} from 'lucide-react'

const facilities = [
  { icon: Car, title: 'Cab reservations', copy: 'Airport transfers, intercity routes, daily cars and driver coordination.' },
  { icon: FileCheck2, title: 'Visa / passport management', copy: 'Checklist, reminders, document status and traveller-ready visa support.' },
  { icon: Languages, title: 'SIM and language assistance', copy: 'Arrival SIM guidance, local language help and destination-specific etiquette notes.' },
  { icon: Plane, title: 'Flight suggestions', copy: 'Compare and suggest options from partners such as MakeMyTrip and Booking.com.' },
  { icon: Hotel, title: 'Hotel suggestions', copy: 'Boutique stays, lodges and partner options from Airbnb, MakeMyTrip and Booking.com.' },
  { icon: Utensils, title: 'Food and lodge recommendations', copy: 'Local specialities, trusted restaurants and stay notes for each city.' },
  { icon: Bot, title: 'Soma chatbot', copy: 'Trip timing, dates, upcoming routes, daily questions and real-time suggestions.' },
  { icon: Sparkles, title: 'AI recommendations', copy: 'Personal recommendations based on previous trips, wishlists and preferences.' },
  { icon: Users, title: 'Solo / group / family trips', copy: 'Dedicated flows for solo seekers, couples, families and larger groups.' },
  { icon: MapPinned, title: '24/7 GPS tracking', copy: 'Active trip map, day status, quick SOS and destination manager visibility.' },
  { icon: ShieldCheck, title: 'Insurance bundled', copy: 'Travel, medical, delay and luggage coverage kept inside one total.' },
  { icon: CircleDollarSign, title: 'Money conversion', copy: 'USD to INR/NPR conversion for India and Nepal spending clarity.' },
  { icon: BadgeCheck, title: 'Guide booking', copy: 'Local guide matching when needed for spiritual, heritage and adventure routes.' },
  { icon: Building2, title: 'Personal counsellor', copy: 'Company counsellor and destination manager assigned around user preferences.' },
]

export default function OneStopSolutionSection() {
  return (
    <section className="bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-4 text-xs uppercase tracking-widest text-[#B89A4E]">One stop solution for travel</p>
            <h2 className="font-serif text-5xl leading-tight text-[#1C1917]">
              Spiritual journeys through <span className="italic text-[#B89A4E]">India and Nepal.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#6f6a61]">
              Solura is built for travellers from Europe and America who want the depth of India and Nepal without managing the scattered work of flights, hotels, visas, cabs, guides, SIMs, insurance and local support.
            </p>
            <div className="mt-8 grid gap-3 text-sm text-[#1C1917] sm:grid-cols-2">
              {['Target: India + Nepal', 'Customers: Europe + America', 'Focus: Spiritual journeys', 'Core: One-click travel basket'].map((item) => (
                <div key={item} className="rounded-xl border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {facilities.map(({ icon: Icon, title, copy }) => (
              <div key={title} className="rounded-xl border border-[#E8E3D9] bg-[#FAFAF8] p-4 transition-colors hover:border-[#B89A4E]">
                <Icon className="mb-3 text-[#B89A4E]" size={19} />
                <h3 className="font-serif text-xl text-[#1C1917]">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-[#9C9589]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
