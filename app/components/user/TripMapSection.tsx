'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import GpsTracker from './GpsTracker'
import { AlertTriangle, Navigation } from 'lucide-react'
import type { MapMarker, RoutePoint } from '@/app/components/SoluraMap'
import type { ItineraryDay } from '@/types/database'

const SoluraMap = dynamic(() => import('@/app/components/SoluraMap'), { ssr: false })

// Map common place names → approx center coords so the map is always contextual
const PLACE_CENTERS: [string, number, number][] = [
  ['varanasi', 25.3176, 82.9739], ['kashi', 25.3176, 82.9739],
  ['sarnath', 25.3814, 83.0205], ['bodh gaya', 24.6961, 84.9914],
  ['rishikesh', 30.0869, 78.2676], ['haridwar', 29.9457, 78.1642],
  ['dharamsala', 32.2190, 76.3234], ['amritsar', 31.6340, 74.8723],
  ['delhi', 28.6139, 77.2090], ['agra', 27.1767, 78.0081],
  ['jaipur', 26.9124, 75.7873], ['udaipur', 24.5854, 73.7125],
  ['mumbai', 19.0760, 72.8777], ['goa', 15.2993, 74.1240],
  ['hampi', 15.3350, 76.4600], ['mysore', 12.2958, 76.6394],
  ['kochi', 9.9312, 76.2673], ['kolkata', 22.5726, 88.3639],
  ['kathmandu', 27.7172, 85.3240], ['pokhara', 28.2096, 83.9856],
  ['lumbini', 27.4833, 83.2763], ['chitwan', 27.5291, 84.3542],
  ['annapurna', 28.5303, 83.8745], ['everest', 27.9881, 86.9253],
]

function smartCenter(itinerary: ItineraryDay[], route?: string | null): { lat: number; lng: number; zoom: number } {
  const text = [
    ...itinerary.map((d) => d.place),
    route,
  ].join(' ').toLowerCase()

  for (const [name, lat, lng] of PLACE_CENTERS) {
    if (text.includes(name)) return { lat, lng, zoom: 10 }
  }
  // Default: centre of north India
  return { lat: 26.8, lng: 80.9, zoom: 6 }
}

type Props = {
  bookingId: string
  initialLat?: number | null
  initialLng?: number | null
  initialLocation?: string | null
  journeyTitle?: string | null
  journeyRoute?: string | null
  currentDay?: number | null
  totalDays?: number | null
  sosActive?: boolean
  itinerary?: ItineraryDay[]
}

export default function TripMapSection({
  bookingId,
  initialLat,
  initialLng,
  initialLocation,
  journeyTitle,
  journeyRoute,
  currentDay,
  totalDays,
  sosActive,
  itinerary = [],
}: Props) {
  const [livePos, setLivePos] = useState<{ lat: number; lng: number; name: string } | null>(
    initialLat && initialLng
      ? { lat: initialLat, lng: initialLng, name: initialLocation ?? 'Your location' }
      : null
  )

  // Route polyline from itinerary waypoints
  const routePoints: RoutePoint[] = itinerary
    .filter((d) => d.lat && d.lng)
    .map((d) => ({ lat: d.lat!, lng: d.lng! }))

  // Numbered stop markers for each itinerary day with coordinates
  const waypointMarkers: MapMarker[] = itinerary
    .filter((d) => d.lat && d.lng)
    .map((d) => ({
      lat: d.lat!,
      lng: d.lng!,
      title: `Day ${d.day}: ${d.place}`,
      type: 'waypoint' as const,
      info: [d.notes, d.stay ? `Stay: ${d.stay}` : ''].filter(Boolean).join('<br/>'),
      label: String(d.day),
    }))

  // Animated live dot for the traveler's current GPS position
  const liveMarker: MapMarker | null = livePos
    ? {
        lat: livePos.lat,
        lng: livePos.lng,
        title: sosActive ? `SOS — ${livePos.name}` : `You are here · ${livePos.name}`,
        type: sosActive ? 'sos' : 'live',
        info: `Day ${currentDay ?? 1} · ${journeyTitle ?? ''}`,
      }
    : null

  const allMarkers: MapMarker[] = [...waypointMarkers, ...(liveMarker ? [liveMarker] : [])]

  // Center: live GPS > last itinerary waypoint > smart journey-based center
  const { lat: defaultLat, lng: defaultLng, zoom: defaultZoom } = smartCenter(itinerary, journeyRoute)
  const centerLat = livePos?.lat ?? routePoints.at(-1)?.lat ?? defaultLat
  const centerLng = livePos?.lng ?? routePoints.at(-1)?.lng ?? defaultLng
  const zoom = allMarkers.length + routePoints.length > 1 ? 7 : liveMarker ? 13 : defaultZoom

  const hasRoute = routePoints.length >= 2

  function handleLocationUpdate(lat: number, lng: number, name: string) {
    setLivePos({ lat, lng, name })
  }

  return (
    <div className="relative h-56 sm:h-[340px] overflow-hidden bg-pale-sky">
      <SoluraMap
        markers={allMarkers}
        routePoints={routePoints}
        centerLat={centerLat}
        centerLng={centerLng}
        zoom={zoom}
        height="100%"
        className="h-full w-full"
      />

      {/* GPS tracker status pill — top left */}
      <div className="absolute left-3 top-3 z-10">
        <GpsTracker bookingId={bookingId} onLocationUpdate={handleLocationUpdate} />
      </div>

      {/* SOS alert — top right */}
      {sosActive && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-danger px-3 py-1.5 text-xs font-medium text-platinum shadow-lg animate-pulse">
          <AlertTriangle size={11} />
          SOS Active
        </div>
      )}

      {/* Day + location pill — bottom left */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 rounded-full bg-platinum/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
        <Navigation size={11} className="text-metallic-gold shrink-0" />
        <span className="text-xs font-medium uppercase tracking-wider text-graphite">
          Day {currentDay ?? 1}
          {livePos?.name
            ? ` · ${livePos.name}`
            : initialLocation
            ? ` · ${initialLocation}`
            : ''}
        </span>
      </div>

      {/* Stop count pill — bottom right (only if route is loaded) */}
      {hasRoute && (
        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-platinum/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="text-xs text-blue-slate">
            {routePoints.length} stops · {totalDays ?? routePoints.length}d
          </span>
        </div>
      )}

      {/* Subtle hint when itinerary has no coordinates yet — small pill, not a blocker */}
      {routePoints.length === 0 && !liveMarker && (
        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-graphite/70 px-3 py-1.5 backdrop-blur-sm">
          <span className="text-[10px] text-platinum/70">Route loads once admin sets stops</span>
        </div>
      )}
    </div>
  )
}
