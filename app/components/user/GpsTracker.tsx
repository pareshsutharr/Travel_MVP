'use client'

import { useEffect, useRef, useState } from 'react'
import { Radio, MapPin, WifiOff } from 'lucide-react'

type Props = {
  bookingId: string
  onLocationUpdate?: (lat: number, lng: number, locationName: string) => void
}

const MOVEMENT_THRESHOLD_M = 30
const UPDATE_INTERVAL_MS = 30_000

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function GpsTracker({ bookingId, onLocationUpdate }: Props) {
  const [status, setStatus] = useState<'idle' | 'tracking' | 'error' | 'unsupported'>('idle')
  const [locationName, setLocationName] = useState<string>('')
  const [lastPing, setLastPing] = useState<Date | null>(null)
  const lastPos = useRef<{ lat: number; lng: number } | null>(null)
  const lastSent = useRef<number>(0)
  const watchId = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('unsupported')
      return
    }

    setStatus('tracking')

    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        const now = Date.now()

        const moved = lastPos.current
          ? haversineMeters(lastPos.current.lat, lastPos.current.lng, lat, lng) > MOVEMENT_THRESHOLD_M
          : true

        const intervalElapsed = now - lastSent.current > UPDATE_INTERVAL_MS

        if (!moved && !intervalElapsed) return

        lastPos.current = { lat, lng }
        lastSent.current = now

        try {
          const res = await fetch('/api/gps', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bookingId, lat, lng }),
          })
          const json = await res.json()
          if (json.locationName) {
            setLocationName(json.locationName)
            onLocationUpdate?.(lat, lng, json.locationName)
          }
          setLastPing(new Date())
        } catch {
          // silent — keep tracking
        }
      },
      () => setStatus('error'),
      { enableHighAccuracy: true, maximumAge: 15_000, timeout: 20_000 }
    )

    return () => {
      if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId])

  if (status === 'unsupported') return null

  return (
    <div className="flex items-center gap-2 rounded-full bg-platinum/90 px-3 py-1.5 text-xs shadow-sm border border-pale-sky">
      {status === 'tracking' ? (
        <>
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </div>
          <Radio size={11} className="text-success" />
          <span className="text-success font-medium">GPS live</span>
          {locationName && (
            <>
              <span className="text-blue-slate">·</span>
              <MapPin size={10} className="text-metallic-gold" />
              <span className="text-graphite truncate max-w-[120px]">{locationName}</span>
            </>
          )}
          {lastPing && (
            <span className="text-blue-slate hidden sm:inline">
              · {lastPing.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff size={11} className="text-danger" />
          <span className="text-danger">GPS unavailable</span>
        </>
      )}
    </div>
  )
}
