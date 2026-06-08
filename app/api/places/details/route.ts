import { NextRequest, NextResponse } from 'next/server'

export type PlaceDetails = {
  name: string
  lat: number
  lng: number
}

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get('placeId')?.trim()
  if (!placeId) return NextResponse.json({ error: 'Missing placeId' }, { status: 400 })

  const key = process.env.GOOGLE_MAPS_API_KEY
  if (!key) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,geometry&language=en&key=${encodeURIComponent(key)}`
  const res = await fetch(url, { cache: 'no-store' })
  const data = await res.json() as {
    status: string
    result?: { name: string; geometry: { location: { lat: number; lng: number } } }
  }

  if (data.status !== 'OK' || !data.result) {
    return NextResponse.json({ error: data.status }, { status: 400 })
  }

  return NextResponse.json({
    name: data.result.name,
    lat: data.result.geometry.location.lat,
    lng: data.result.geometry.location.lng,
  } satisfies PlaceDetails)
}
