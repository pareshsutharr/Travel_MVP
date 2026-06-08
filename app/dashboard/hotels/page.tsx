import { createClient } from '@/lib/supabase/server'
import type { HotelSuggestion } from '@/types/database'

const SOURCE_LABEL: Record<string, string> = {
  makemytrip: 'MakeMyTrip',
  booking_com: 'Booking.com',
  airbnb: 'Airbnb',
  direct: 'Direct',
}

const SOURCE_COLOR: Record<string, string> = {
  makemytrip: 'bg-status-soft text-danger',
  booking_com: 'bg-status-soft text-info',
  airbnb: 'bg-status-soft text-danger',
  direct: 'bg-status-soft text-warning',
}

const TYPE_LABEL: Record<string, string> = {
  boutique: 'Boutique stay',
  lodge: 'Heritage lodge',
  airbnb: 'Private home',
  guesthouse: 'Guesthouse',
  hotel: 'Hotel',
}

function stars(rating: number) {
  return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating))
}

export default async function HotelsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hotel_suggestions')
    .select('*')
    .order('is_recommended', { ascending: false })
    .order('rating', { ascending: false })

  const hotels = (data ?? []) as HotelSuggestion[]

  const grouped = hotels.reduce<Record<string, HotelSuggestion[]>>((acc, h) => {
    acc[h.city] = [...(acc[h.city] ?? []), h]
    return acc
  }, {})

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-metallic-gold">Travel basket</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-graphite">
          Hotel <span className="italic text-metallic-gold">suggestions.</span>
        </h1>
        <p className="mt-1 text-sm text-blue-slate">
          Boutique stays, heritage lodges and partner options from Airbnb, MakeMyTrip and Booking.com.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-pale-sky border border-metallic-gold/20 px-5 py-4">
        <p className="text-sm text-graphite">
          <span className="font-medium text-metallic-gold">Solura tip · </span>
          All stays are handpicked for location, cleanliness and character.
          Your counsellor includes the recommended stay in your total — click to verify availability.
        </p>
      </div>

      {hotels.length === 0 ? (
        <div className="rounded-xl border border-pale-sky bg-platinum p-10 text-center">
          <p className="font-serif text-xl text-graphite">No hotel options yet</p>
          <p className="mt-2 text-sm text-blue-slate">Your counsellor will add stay options once your route is planned.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([city, cityHotels]) => (
            <div key={city}>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-blue-slate">{city}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cityHotels.map((h) => (
                  <div
                    key={h.id}
                    className={`rounded-xl border bg-platinum overflow-hidden transition-shadow hover:shadow-sm ${
                      h.is_recommended ? 'border-metallic-gold/40' : 'border-pale-sky'
                    }`}
                  >
                    {/* Image placeholder with gradient */}
                    <div className="h-36 bg-gradient-to-br from-pale-sky to-pale-sky relative flex items-end p-3">
                      {h.image_url ? (
                        <img src={h.image_url} alt={h.name} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-4xl text-blue-slate/40">S</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-graphite/50 to-transparent" />
                      {h.is_recommended && (
                        <span className="relative z-10 rounded-full bg-metallic-gold px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-platinum">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-serif text-lg text-graphite truncate">{h.name}</p>
                          <p className="text-xs text-blue-slate">{TYPE_LABEL[h.type] ?? h.type}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${SOURCE_COLOR[h.source] ?? 'bg-status-soft text-info'}`}>
                          {SOURCE_LABEL[h.source] ?? h.source}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-metallic-gold">{stars(h.rating)} · {h.rating}</p>
                      {h.address && <p className="mt-1 text-xs text-blue-slate truncate">{h.address}</p>}
                      {h.amenities.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {h.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="rounded bg-pale-sky px-1.5 py-0.5 text-[9px] text-blue-slate">{a}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <p className="font-serif text-xl text-metallic-gold">${h.price_per_night_usd}<span className="text-xs text-blue-slate">/night</span></p>
                          <p className="text-[10px] text-blue-slate">{h.total_nights} nights · ${(h.price_per_night_usd * h.total_nights).toLocaleString()} total</p>
                        </div>
                        {h.external_url && (
                          <a
                            href={h.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-graphite px-3 py-1.5 text-xs text-platinum hover:bg-metallic-gold transition-colors"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
