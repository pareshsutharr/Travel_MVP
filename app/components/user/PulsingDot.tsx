'use client'

export default function PulsingDot() {
  return (
    <div className="relative">
      <div className="h-4 w-4 rounded-full bg-[#B89A4E]" />
      <div className="absolute inset-0 rounded-full bg-[#B89A4E]/40 animate-ping" />
    </div>
  )
}
