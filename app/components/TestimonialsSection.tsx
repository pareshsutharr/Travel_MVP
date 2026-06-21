import { createClient } from '@/lib/supabase/server'
import type { Testimonial } from '@/types/database'
import { TestimonialGallery } from '@/components/ui/gallery'
import { Award, Users, Star } from 'lucide-react'

/* ─── Fallback data shown until the DB table is seeded ───── */
const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Amelia Roberts',
    role: 'Verified Traveler',
    location: 'London, UK',
    destination: 'Paris, France',
    quote:
      'Our Solura journey felt effortless from the very first search to the final flight home. Every stay, transfer, and local experience was thoughtfully chosen — it felt like someone who truly knew us had built the itinerary.',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/220?img=47',
    is_published: true,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '2',
    name: 'James & Priya Mehta',
    role: 'Verified Travelers',
    location: 'Mumbai, India',
    destination: 'Swiss Alps',
    quote:
      'Soma designed our entire honeymoon in under 20 minutes. We discovered hidden alpine villages we never would have found on our own. The concierge was available at every hour — genuinely remarkable service.',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/220?img=33',
    is_published: true,
    sort_order: 2,
    created_at: '',
  },
  {
    id: '3',
    name: 'David Chen',
    role: 'Verified Traveler',
    location: 'Singapore',
    destination: 'Bali, Indonesia',
    quote:
      '24/7 support gave us total peace of mind. When our connecting flight was cancelled, the Solura team had us rebooked on a better route before we even reached the gate. Unmatched responsiveness.',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/220?img=68',
    is_published: true,
    sort_order: 3,
    created_at: '',
  },
  {
    id: '4',
    name: 'Sofia Garcia',
    role: 'Verified Traveler',
    location: 'Madrid, Spain',
    destination: 'Maldives',
    quote:
      'The overwater villa was beyond anything I have ever experienced. Solura handled every detail — transfer boats, dive excursions, sunset dinners — so we could simply be present and breathe it all in.',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/220?img=25',
    is_published: true,
    sort_order: 4,
    created_at: '',
  },
  {
    id: '5',
    name: 'Marcus Kim',
    role: 'Verified Traveler',
    location: 'Seoul, Korea',
    destination: 'Nepal',
    quote:
      'The Annapurna Base Camp trek was expertly organized — from the acclimatization schedule to every lodge booking. Our mountain guide was outstanding. The sunrise over the Himalayas will stay with me forever.',
    rating: 5,
    avatar_url: 'https://i.pravatar.cc/220?img=12',
    is_published: true,
    sort_order: 5,
    created_at: '',
  },
]

/* ─── Trust badges ────────────────────────────────────────── */
const TRUST_BADGES = [
  { label: 'TripAdvisor', sub: 'Certificate of Excellence', icon: Award },
  { label: '4.9 / 5', sub: '2,400+ Verified Reviews', icon: Star },
  { label: 'Forbes Travel', sub: 'Recommended 2024', icon: Award },
  { label: 'Community', sub: '2M+ Happy Travelers', icon: Users },
]

export default async function TestimonialsSection() {
  let testimonials: Testimonial[] = SAMPLE_TESTIMONIALS

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(5)

    if (!error && data && data.length > 0) {
      testimonials = data as Testimonial[]
    }
  } catch {
    /* DB table not yet created — sample data is shown */
  }

  return (
    <section
      id="reviews"
      className="scroll-mt-16 overflow-hidden bg-[#F3F7F8] px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <TestimonialGallery testimonials={testimonials} animationDelay={0.3} />

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {TRUST_BADGES.map(({ label, sub, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#BFDDE7] bg-white px-4 py-5 text-center shadow-[0_2px_12px_rgba(45,47,51,0.05)]"
            >
              <Icon className="h-5 w-5 text-[#D4AF35]" strokeWidth={1.5} />
              <p className="font-bold text-[#2D2F33]">{label}</p>
              <p className="text-[12px] text-[#6B7A80]">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
