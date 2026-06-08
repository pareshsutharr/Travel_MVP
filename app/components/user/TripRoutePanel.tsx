'use client'

import { useRef } from 'react'
import { MapPin, Check, Clock } from 'lucide-react'
import type { ItineraryDay } from '@/types/database'

type Props = {
  itinerary: ItineraryDay[]
  currentDay: number
  totalDays: number
  journeyTitle: string
}

export default function TripRoutePanel({ itinerary, currentDay, totalDays, journeyTitle }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const progress = Math.round(((currentDay - 1) / Math.max(totalDays - 1, 1)) * 100)

  if (itinerary.length === 0) return null

  return (
    <div className="rounded-xl border border-pale-sky bg-platinum overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">Journey route</p>
            <p className="text-sm font-medium text-graphite mt-0.5">{journeyTitle}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-metallic-gold font-medium">Day {currentDay}</span>
            <span className="text-xs text-blue-slate"> of {totalDays}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full rounded-full bg-pale-sky overflow-hidden">
          <div
            className="h-full rounded-full bg-metallic-gold transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Horizontal scrollable stops */}
      <div
        ref={scrollRef}
        className="flex gap-0 overflow-x-auto pb-4 px-4 scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {itinerary.map((day, idx) => {
          const dayNum = Number(day.day) || idx + 1
          const isPast = dayNum < currentDay
          const isCurrent = dayNum === currentDay
          const isFuture = dayNum > currentDay
          const isLast = idx === itinerary.length - 1

          return (
            <div key={idx} className="flex items-start flex-shrink-0">
              {/* Stop */}
              <div className="flex flex-col items-center" style={{ width: 80 }}>
                {/* Circle */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    isCurrent
                      ? 'border-metallic-gold bg-metallic-gold text-platinum shadow-md'
                      : isPast
                      ? 'border-metallic-gold bg-pale-sky text-metallic-gold'
                      : 'border-pale-sky bg-platinum text-blue-slate'
                  }`}
                >
                  {isPast ? (
                    <Check size={13} strokeWidth={2.5} />
                  ) : isCurrent ? (
                    <MapPin size={13} />
                  ) : (
                    <span className="text-[10px] font-semibold">{dayNum}</span>
                  )}
                </div>

                {/* Current day pulse */}
                {isCurrent && (
                  <div className="relative -mt-8 -ml-0">
                    <div className="absolute inset-0 h-8 w-8 rounded-full bg-metallic-gold/20 animate-ping" />
                  </div>
                )}

                {/* Label */}
                <p className={`mt-2 text-center text-[10px] leading-tight px-1 ${isCurrent ? 'text-graphite font-semibold' : isPast ? 'text-blue-slate' : 'text-blue-slate'}`}>
                  {day.place || `Day ${dayNum}`}
                </p>
                {isCurrent && (
                  <span className="mt-0.5 text-[9px] uppercase tracking-widest text-metallic-gold font-medium">Now</span>
                )}
                {isPast && (
                  <span className="mt-0.5 text-[9px] text-blue-slate">Done</span>
                )}
                {isFuture && day.stay && (
                  <div className="mt-0.5 flex items-center gap-0.5">
                    <Clock size={8} className="text-blue-slate" />
                    <span className="text-[9px] text-blue-slate truncate max-w-[60px]">{day.stay.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mt-4 flex-shrink-0" style={{ width: 20 }}>
                  <div
                    className={`h-0.5 w-full mt-0 ${
                      dayNum < currentDay ? 'bg-metallic-gold' : 'bg-pale-sky'
                    }`}
                    style={{ marginTop: 16 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
