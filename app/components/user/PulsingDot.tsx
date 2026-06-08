'use client'

export default function PulsingDot() {
  return (
    <div className="relative">
      <div className="h-4 w-4 rounded-full bg-metallic-gold" />
      <div className="absolute inset-0 rounded-full bg-metallic-gold/40 animate-ping" />
    </div>
  )
}
