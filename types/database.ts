export interface Testimonial {
  id: string
  name: string
  role: string | null
  location: string
  destination: string
  quote: string
  rating: number
  avatar_url: string
  is_published: boolean
  sort_order: number
  created_at: string
}

export type Role = 'user' | 'admin' | 'counsellor'
export type BookingStatus = 'new' | 'confirmed' | 'on_path' | 'delayed' | 'visa_hold' | 'done' | 'cancelled'
export type TripType = 'solo' | 'couple' | 'family' | 'group'
export type JourneyStatus = 'draft' | 'in_review' | 'published'
export type JourneyCategory = 'spiritual' | 'heritage' | 'adventure' | 'wellness'
export type DocumentType = 'passport' | 'visa' | 'insurance' | 'sim'
export type DocumentStatus = 'pending' | 'active' | 'expired'
export type SenderType = 'user' | 'counsellor' | 'soma'
export type JourneyDifficulty = 'easy' | 'moderate' | 'challenging'
export type GuideBookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type NotificationType = 'info' | 'booking' | 'message' | 'sos' | 'document' | 'guide'
export type SosStatus = 'active' | 'responded' | 'resolved'
export type FlightClass = 'economy' | 'premium_economy' | 'business'
export type FlightSource = 'makemytrip' | 'booking_com' | 'skyscanner' | 'direct'
export type HotelType = 'hotel' | 'boutique' | 'lodge' | 'airbnb' | 'guesthouse'
export type HotelSource = 'airbnb' | 'makemytrip' | 'booking_com' | 'direct'
export type FoodType = 'restaurant' | 'cafe' | 'street_food' | 'lodge' | 'dhaba'
export type PriceRange = '$' | '$$' | '$$$'

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
  destination_manager_id: string | null
  created_at: string
  updated_at: string
  destination_manager?: Profile
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
  image_url: string | null
  cover_gradient: string | null
  max_travelers: number
  difficulty: JourneyDifficulty
  best_season: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface ItineraryDay {
  day: string
  place: string
  stay: string
  notes: string
  lat?: number | null
  lng?: number | null
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
  cab_details: Record<string, unknown> | null
  food_preferences: string | null
  current_day: number | null
  current_location: string | null
  gps_lat: number | null
  gps_lng: number | null
  gps_last_updated: string | null
  sos_active: boolean
  counsellor_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  journey?: Journey
  user?: Profile
  counsellor?: Profile
}

export interface Message {
  id: string
  booking_id: string | null
  thread_user_id: string | null
  sender_id: string
  sender_type: SenderType
  content: string
  is_read: boolean
  created_at: string
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
  file_url: string | null
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

export interface GpsTracking {
  id: string
  booking_id: string
  user_id: string
  lat: number
  lng: number
  location_name: string | null
  accuracy: number | null
  recorded_at: string
}

export interface SiteSetting {
  key: string
  value: Record<string, unknown>
  updated_at: string
}

export interface TripBuild {
  id: string
  user_id: string | null
  trip_type: TripType
  travelers: number
  preferences: Record<string, unknown>
  soma_thread: Array<{ role: string; content: string }>
  draft_itinerary: ItineraryDay[] | null
  status: 'building' | 'reviewing' | 'confirmed'
  created_at: string
  updated_at: string
}

export interface Guide {
  id: string
  name: string
  location: string
  country: string
  languages: string[]
  specializations: string[]
  bio: string | null
  price_per_day: number
  rating: number
  review_count: number
  phone: string | null
  whatsapp: string | null
  is_available: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface GuideBooking {
  id: string
  guide_id: string
  user_id: string
  booking_id: string | null
  start_date: string
  days: number
  amount_usd: number
  status: GuideBookingStatus
  notes: string | null
  created_at: string
  guide?: Guide
}

export interface SosEvent {
  id: string
  user_id: string
  booking_id: string | null
  lat: number | null
  lng: number | null
  location_name: string | null
  message: string | null
  status: SosStatus
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  link: string | null
  is_read: boolean
  created_at: string
}

export interface FlightSuggestion {
  id: string
  route_tag: string
  from_city: string
  from_airport: string
  to_city: string
  to_airport: string
  airline: string
  duration_minutes: number | null
  price_usd: number
  class: FlightClass
  stops: number
  source: FlightSource
  external_url: string | null
  is_recommended: boolean
  created_at: string
}

export interface HotelSuggestion {
  id: string
  city: string
  country: string
  route_tag: string | null
  name: string
  address: string | null
  price_per_night_usd: number
  total_nights: number
  rating: number
  type: HotelType
  source: HotelSource
  external_url: string | null
  image_url: string | null
  amenities: string[]
  is_recommended: boolean
  created_at: string
}

export type HighlightType = 'image' | 'video' | 'audio' | 'link'

export interface TripHighlight {
  id: string
  booking_id: string | null
  user_id: string
  journey_id: string | null
  type: HighlightType
  url: string
  thumbnail_url: string | null
  caption: string | null
  day_number: number | null
  location_name: string | null
  is_admin_post: boolean
  is_public: boolean
  created_at: string
}

export interface FoodRecommendation {
  id: string
  city: string
  country: string
  name: string
  type: FoodType
  cuisine: string | null
  speciality: string
  price_range: PriceRange
  address: string | null
  rating: number
  tags: string[]
  image_url: string | null
  is_vegetarian: boolean
  created_at: string
}
