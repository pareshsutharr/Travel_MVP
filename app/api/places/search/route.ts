import { NextRequest, NextResponse } from 'next/server'
import { searchLocations } from '@/lib/locations'

export type PlaceResult = {
  name: string
  description: string
  placeId: string
  // lat/lng populated only by fallback paths
  lat?: number
  lng?: number
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ results: [] })

  // --- PRIMARY: Local database — instant, no API key needed ---
  const local = searchLocations(q, 6)
  if (local.length > 0) {
    const results: PlaceResult[] = local.map((loc) => ({
      name: loc.name,
      description: loc.region,
      placeId: `local_${loc.name}_${loc.lat}_${loc.lng}`,
      lat: loc.lat,
      lng: loc.lng,
    }))
    return NextResponse.json({ results, mode: 'local' })
  }

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return NextResponse.json({ results: [] })

  // --- FALLBACK 1: Places Autocomplete ---
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&language=en&key=${encodeURIComponent(key)}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json() as {
      status: string
      predictions: { description: string; place_id: string; structured_formatting: { main_text: string; secondary_text?: string } }[]
    }

    if (data.status === 'OK' && data.predictions.length > 0) {
      const results: PlaceResult[] = data.predictions.slice(0, 6).map((p) => ({
        name: p.structured_formatting.main_text,
        description: p.description,
        placeId: p.place_id,
      }))
      return NextResponse.json({ results, mode: 'autocomplete' })
    }
  } catch {
    // fall through
  }

  // --- FALLBACK 2: Places Text Search ---
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&language=en&key=${encodeURIComponent(key)}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json() as {
      status: string
      results: { name: string; formatted_address: string; place_id: string; geometry: { location: { lat: number; lng: number } } }[]
    }

    if (data.status === 'OK' && data.results.length > 0) {
      const results: PlaceResult[] = data.results.slice(0, 6).map((r) => ({
        name: r.name,
        description: r.formatted_address,
        placeId: r.place_id,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
      }))
      return NextResponse.json({ results, mode: 'textsearch' })
    }
  } catch {
    // fall through
  }

  // --- FALLBACK 3: Geocoding API ---
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&language=en&key=${encodeURIComponent(key)}`
    const res = await fetch(url, { cache: 'no-store' })
    const data = await res.json() as {
      status: string
      results: { formatted_address: string; place_id: string; geometry: { location: { lat: number; lng: number } } }[]
    }

    if (data.status === 'OK') {
      const results: PlaceResult[] = data.results.slice(0, 5).map((r) => ({
        name: r.formatted_address.split(',')[0].trim(),
        description: r.formatted_address,
        placeId: r.place_id,
        lat: r.geometry.location.lat,
        lng: r.geometry.location.lng,
      }))
      return NextResponse.json({ results, mode: 'geocode' })
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ results: [] })
}
