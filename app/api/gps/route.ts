import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') return null

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=locality|sublocality|administrative_area_level_2`
    const res = await fetch(url, { next: { revalidate: 0 } })
    const json = await res.json()
    if (json.status !== 'OK' || !json.results?.length) return null

    const result = json.results[0]
    const locality = result.address_components?.find(
      (c: { types: string[] }) => c.types.includes('locality') || c.types.includes('sublocality_level_1')
    )
    const area = result.address_components?.find(
      (c: { types: string[] }) => c.types.includes('administrative_area_level_2')
    )
    const country = result.address_components?.find(
      (c: { types: string[] }) => c.types.includes('country')
    )

    const parts = [locality?.long_name ?? area?.long_name, country?.short_name].filter(Boolean)
    return parts.join(', ') || result.formatted_address?.split(',').slice(0, 2).join(',').trim() || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { bookingId: string; lat: number; lng: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const { bookingId, lat, lng } = body

  if (!bookingId || typeof lat !== 'number' || typeof lng !== 'number') {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Verify the booking belongs to this user
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, user_id')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const locationName = await reverseGeocode(lat, lng)

  const updatePayload: Record<string, unknown> = {
    gps_lat: lat,
    gps_lng: lng,
    gps_last_updated: new Date().toISOString(),
  }
  if (locationName) updatePayload.current_location = locationName

  await Promise.all([
    supabase.from('bookings').update(updatePayload).eq('id', bookingId),
    supabase.from('gps_tracking').insert({
      booking_id: bookingId,
      user_id: user.id,
      lat,
      lng,
      location_name: locationName,
      recorded_at: new Date().toISOString(),
    }),
  ])

  return NextResponse.json({ ok: true, locationName: locationName ?? null })
}
