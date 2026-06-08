'use client'

import { useEffect, useRef } from 'react'
import { setOptions, importLibrary } from '@googlemaps/js-api-loader'

// Call setOptions only once per browser session (window-level so HMR reloads don't reset it)
function ensureMapsInit(apiKey: string) {
  if (typeof window === 'undefined') return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).__soluraMapsInit) return
  setOptions({ key: apiKey, v: 'weekly' })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).__soluraMapsInit = true
}

export type MapMarker = {
  lat: number
  lng: number
  title: string
  type?: 'normal' | 'sos' | 'guide' | 'food' | 'waypoint' | 'live'
  info?: string
  label?: string
}

export type RoutePoint = { lat: number; lng: number }

// Pulsing animated SVG for the live GPS dot
const LIVE_SVG = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="18" fill="#D4AF35" fill-opacity="0.15">
    <animate attributeName="r" values="10;18;10" dur="2.4s" repeatCount="indefinite"/>
    <animate attributeName="fill-opacity" values="0.25;0;0.25" dur="2.4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="20" cy="20" r="9" fill="#D4AF35"/>
  <circle cx="20" cy="20" r="4" fill="white"/>
</svg>`)

const SOS_SVG = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="18" fill="#2D2F33" fill-opacity="0.2">
    <animate attributeName="r" values="10;18;10" dur="1.2s" repeatCount="indefinite"/>
    <animate attributeName="fill-opacity" values="0.3;0;0.3" dur="1.2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="20" cy="20" r="10" fill="#2D2F33"/>
  <text x="20" y="24" text-anchor="middle" fill="white" font-size="10" font-weight="bold" font-family="sans-serif">!</text>
</svg>`)

const SOLURA_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#BFDDE7' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#2D2F33' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F3F7F8' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3C687C' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#F3F7F8' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#BFDDE7' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#D4AF35' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#2D2F33' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#3C687C' }] },
]

type Props = {
  markers?: MapMarker[]
  routePoints?: RoutePoint[]
  focusCenter?: { lat: number; lng: number } | null
  centerLat?: number
  centerLng?: number
  zoom?: number
  height?: string
  className?: string
  onMarkerClick?: (marker: MapMarker) => void
}

export default function SoluraMap({
  markers = [],
  routePoints = [],
  focusCenter,
  centerLat = 28.6139,
  centerLng = 77.2090,
  zoom = 6,
  height = '360px',
  className = '',
  onMarkerClick,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<google.maps.Map | null>(null)
  const markerRefs = useRef<google.maps.Marker[]>([])
  const polylineRef = useRef<google.maps.Polyline | null>(null)
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null)

  function clearMarkers() {
    markerRefs.current.forEach((m) => m.setMap(null))
    markerRefs.current = []
  }

  function drawRoute(map: google.maps.Map, points: RoutePoint[]) {
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null }
    if (points.length < 2) return
    polylineRef.current = new google.maps.Polyline({
      path: points,
      map,
      geodesic: true,
      strokeColor: '#D4AF35',
      strokeOpacity: 0.7,
      strokeWeight: 3,
      icons: [{
        icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, fillColor: '#D4AF35', fillOpacity: 1, strokeWeight: 0 },
        offset: '50%',
        repeat: '120px',
      }],
    })
  }

  function placeMarkers(map: google.maps.Map, items: MapMarker[]) {
    clearMarkers()
    const iw = infoWindowRef.current!
    const bounds = new google.maps.LatLngBounds()
    let hasBounds = false

    items.forEach((m) => {
      let markerIcon: google.maps.Icon | google.maps.Symbol

      if (m.type === 'live') {
        markerIcon = { url: `data:image/svg+xml,${LIVE_SVG}`, scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }
      } else if (m.type === 'sos') {
        markerIcon = { url: `data:image/svg+xml,${SOS_SVG}`, scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }
      } else {
        const color = m.type === 'waypoint' ? '#D4AF35' : m.type === 'guide' ? '#3C687C' : m.type === 'food' ? '#3C687C' : '#D4AF35'
        markerIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: m.type === 'waypoint' ? 11 : 9,
          fillColor: color,
          fillOpacity: 1,
          strokeColor: '#F3F7F8',
          strokeWeight: 2,
        }
      }

      const marker = new google.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map,
        title: m.title,
        icon: markerIcon,
        label: m.type === 'waypoint' && m.label
          ? { text: m.label, color: '#F3F7F8', fontSize: '10px', fontWeight: 'bold' }
          : undefined,
        zIndex: m.type === 'live' ? 200 : m.type === 'sos' ? 100 : 10,
      })

      marker.addListener('click', () => {
        iw.setContent(`
          <div style="font-family:'DM Sans',sans-serif;padding:6px 4px;min-width:150px;max-width:220px">
            <strong style="color:#2D2F33;font-size:13px;display:block;margin-bottom:4px">${m.title}</strong>
            ${m.info ? `<p style="color:#3C687C;font-size:12px;margin:0;line-height:1.5">${m.info}</p>` : ''}
          </div>
        `)
        iw.open(map, marker)
        onMarkerClick?.(m)
      })

      bounds.extend({ lat: m.lat, lng: m.lng })
      hasBounds = true
      markerRefs.current.push(marker)
    })

    routePoints.forEach((p) => { bounds.extend(p); hasBounds = true })

    const totalPoints = items.length + routePoints.length
    if (hasBounds && totalPoints > 1) {
      map.fitBounds(bounds, 56)
    } else if (hasBounds && totalPoints === 1) {
      const p = items[0] ?? routePoints[0]
      map.setCenter({ lat: p.lat, lng: p.lng })
      map.setZoom(13)
    }
  }

  // Init map once
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') return
    let cancelled = false

    async function init() {
      ensureMapsInit(apiKey as string)
      const { Map, InfoWindow } = await importLibrary('maps') as google.maps.MapsLibrary
      if (cancelled || !mapRef.current) return
      const map = new Map(mapRef.current, {
        center: { lat: centerLat, lng: centerLng },
        zoom,
        styles: SOLURA_STYLES,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
      })
      mapInstance.current = map
      infoWindowRef.current = new InfoWindow()
      drawRoute(map, routePoints)
      placeMarkers(map, markers)
    }

    init()
    return () => {
      cancelled = true
      clearMarkers()
      if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update markers + route on data change
  useEffect(() => {
    if (!mapInstance.current || !infoWindowRef.current) return
    drawRoute(mapInstance.current, routePoints)
    placeMarkers(mapInstance.current, markers)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, routePoints])

  // Pan to focused center without re-rendering markers
  useEffect(() => {
    if (!mapInstance.current || !focusCenter) return
    mapInstance.current.panTo({ lat: focusCenter.lat, lng: focusCenter.lng })
    mapInstance.current.setZoom(14)
  }, [focusCenter])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return (
      <div className={`flex items-center justify-center bg-pale-sky border border-pale-sky rounded-xl ${className}`} style={{ height }}>
        <div className="text-center px-6">
          <p className="text-sm font-medium text-graphite">Google Maps not configured</p>
          <p className="text-xs text-blue-slate mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</p>
        </div>
      </div>
    )
  }

  return <div ref={mapRef} className={`overflow-hidden ${className}`} style={{ height }} />
}
