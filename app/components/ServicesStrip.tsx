import { BadgeCheck, Compass, Headphones, ShieldCheck } from 'lucide-react'

const benefits = [
  {
    icon: Compass,
    iconBg: '#EEF2FB',
    iconColor: '#1D2B53',
    title: 'Curated Experiences',
    copy: 'Handpicked sacred journeys, designed for you.',
  },
  {
    icon: BadgeCheck,
    iconBg: '#FFF8E8',
    iconColor: '#E8A317',
    title: 'Best Price Guarantee',
    copy: 'We match any price for the same journey.',
  },
  {
    icon: Headphones,
    iconBg: '#EEF2FB',
    iconColor: '#1D2B53',
    title: '24/7 Support',
    copy: "We're here to help, wherever you are.",
  },
  {
    icon: ShieldCheck,
    iconBg: '#EDF4EE',
    iconColor: '#6E8B74',
    title: 'Safe & Secure',
    copy: 'Travel with confidence, insurance included.',
  },
]

export default function ServicesStrip() {
  return (
    <section className="bg-white px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-14 lg:px-8 border-b border-[#F0EDE8]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 divide-y divide-[#F0EDE8] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-y-0 sm:gap-0">
          {benefits.map(({ icon: Icon, iconBg, iconColor, title, copy }, i) => (
            <div
              key={title}
              className={`flex items-center gap-4 py-6 ${
                i === 0 ? 'sm:pr-6 lg:pl-0' : i === benefits.length - 1 ? 'sm:pl-6 lg:pr-0' : 'sm:px-6'
              }`}
            >
              {/* Icon circle */}
              <div
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: iconBg }}
              >
                <Icon size={22} style={{ color: iconColor }} />
              </div>
              {/* Text */}
              <div>
                <h3 className="text-[14px] font-bold text-[#1F2937]">{title}</h3>
                <p className="mt-0.5 text-[13px] leading-[1.6] text-[#6B7A80]">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
