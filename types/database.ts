export type Role = 'user' | 'admin' | 'counsellor'
export type BookingStatus = 'new' | 'confirmed' | 'on_path' | 'delayed' | 'visa_hold' | 'done' | 'cancelled'
export type TripType = 'solo' | 'couple' | 'family' | 'group'
export type JourneyStatus = 'draft' | 'in_review' | 'published'
export type JourneyCategory = 'spiritual' | 'heritage' | 'adventure' | 'wellness'
export type DocumentType = 'passport' | 'visa' | 'insurance' | 'sim'
export type DocumentStatus = 'pending' | 'active' | 'expired'
export type SenderType = 'user' | 'counsellor' | 'soma'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  phone: string | null
  location: string | null
  avatar_url: string | null
  preferences: Record<string, unknown>
  member_since: string
  lifetime_value: number
  nps: number | null
  journeys_count: number
  cities_count: number
  created_at: string
  updated_at: string
}

export interface Journey {
  id: string
  slug: string
  title: string
  subtitle: string | null
  category: JourneyCategory
  duration: number
  route: string
  price_from: number
  description: string | null
  highlights: string[]
  itinerary: ItineraryDay[]
  included: string[]
  status: JourneyStatus
  featured: boolean
  sort_order: number
  rating: number | null
  review_count: number
  created_at: string
  updated_at: string
}

export interface ItineraryDay {
  day: string
  place: string
  stay: string
  notes: string
}

export interface Booking {
  id: string
  ref: string
  user_id: string
  journey_id: string
  traveler_name: string
  start_date: string
  end_date: string
  travelers: number
  trip_type: TripType
  status: BookingStatus
  total_amount: number
  discount: number
  flight_cost: number | null
  stays_cost: number | null
  cabs_cost: number | null
  visa_cost: number | null
  sim_cost: number | null
  insurance_cost: number | null
  guide_cost: number | null
  flight_details: Record<string, unknown> | null
  stays_details: Record<string, unknown> | null
  current_day: number | null
  current_location: string | null
  gps_lat: number | null
  gps_lng: number | null
  counsellor_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // joined
  journey?: Journey
  user?: Profile
  counsellor?: Profile
}

export interface Message {
  id: string
  booking_id: string | null
  sender_id: string
  sender_type: SenderType
  content: string
  is_read: boolean
  created_at: string
  // joined
  sender?: Profile
  booking?: Booking
}

export interface Review {
  id: string
  user_id: string
  journey_id: string
  rating: number
  content: string | null
  created_at: string
  user?: Profile
  journey?: Journey
}

export interface Document {
  id: string
  user_id: string
  booking_id: string | null
  type: DocumentType
  name: string
  status: DocumentStatus
  expiry_date: string | null
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  user_id: string
  place_name: string
  place_location: string | null
  journey_id: string | null
  created_at: string
  journey?: Journey
}
