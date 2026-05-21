import { createClient } from '@/lib/supabase/server'
import type { FlightSuggestion } from '@/types/database'

const SOURCE_LABEL: Record<string, string> = {
  makemytrip: 'MakeMyTrip',
  booking_com: 'Booking.com',
  skyscanner: 'Skyscanner',
  direct: 'Direct',
}

const SOURCE_COLOR: Record<string, string> = {
  makemytrip: 'bg-red-50 text-red-600',
  booking_com: 'bg-blue-50 text-blue-600',
  skyscanner: 'bg-emerald-50 text-emerald-600',
  direct: 'bg-amber-50 text-amber-600',
}

function formatDuration(mins: number | null) {
  if (!mins) return '—'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default async function FlightsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('flight_suggestions')
    .select('*')
    .order('is_recommended', { ascending: false })
    .order('price_usd')

  const flights = (data ?? []) as FlightSuggestion[]

  const grouped = flights.reduce<Record<string, FlightSuggestion[]>>((acc, f) => {
    const key = `${f.from_city} → ${f.to_city}`
    acc[key] = [...(acc[key] ?? []), f]
    return acc
  }, {})

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-[#B89A4E]">Travel basket</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1C1917]">
          Flight <span className="italic text-[#B89A4E]">suggestions.</span>
        </h1>
        <p className="mt-1 text-sm text-[#9C9589]">
          Curated options from MakeMyTrip, Booking.com and Skyscanner — click any to book directly on the partner site.
        </p>
      </div>

      <div className="mb-6 rounded-xl bg-[#F5F0E8] border border-[#B89A4E]/20 px-5 py-4">
        <p className="text-sm text-[#1C1917]">
          <span className="font-medium text-[#B89A4E]">Soma tip · </span>
          Book economy seats 90–120 days before your journey start date for the best international fares.
          Your counsellor can assist with routing, seat selection and upgrades.
        </p>
      </div>

      {flights.length === 0 ? (
        <div className="rounded-xl border border-[#E8E3D9] bg-white p-10 text-center">
          <p className="font-serif text-xl text-[#1C1917]">No flights yet</p>
          <p className="mt-2 text-sm text-[#9C9589]">Your counsellor will add flight options once your journey is confirmed.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([route, routeFlights]) => (
            <div key={route}>
              <p className="mb-3 text-[10px] uppercase tracking-widest text-[#9C9589]">{route}</p>
              <div className="space-y-3">
                {routeFlights.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm ${
                      f.is_recommended ? 'border-[#B89A4E]/40' : 'border-[#E8E3D9]'
                    }`}
                  >
                    {f.is_recommended && (
                      <p className="mb-2 text-[10px] uppercase tracking-widest text-[#B89A4E]">Solura recommended</p>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-lg text-[#1C1917]">{f.airline}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${SOURCE_COLOR[f.source] ?? 'bg-gray-50 text-gray-600'}`}>
                            {SOURCE_LABEL[f.source] ?? f.source}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-[#9C9589]">
                          <span>{f.from_airport} → {f.to_airport}</span>
                          <span>·</span>
                          <span>{formatDuration(f.duration_minutes)}</span>
                          <span>·</span>
                          <span>{f.stops === 0 ? 'Non-stop' : `${f.stops} stop`}</span>
                          <span>·</span>
                          <span className="capitalize">{f.class.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div>
                          <p className="font-serif text-2xl text-[#B89A4E]">${f.price_usd.toLocaleString()}</p>
                          <p className="text-[10px] text-[#9C9589]">per person</p>
                        </div>
                        {f.external_url && (
                          <a
                            href={f.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full bg-[#1C1917] px-4 py-2 text-xs text-white hover:bg-[#B89A4E] transition-colors whitespace-nowrap"
                          >
                            Book →
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
