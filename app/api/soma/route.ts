import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null

const SYSTEM_PROMPT = `You are Soma, the personal travel counsellor AI for Solura — a high-end spiritual and cultural travel company specialising in India and Nepal journeys (Varanasi, Bodh Gaya, Sarnath, Rishikesh, Kathmandu, Pokhara, Lumbini, Annapurna, and more).

You speak with warmth, calm intelligence, and deep knowledge of the sacred geography of the Indian subcontinent. You are never robotic. You are the traveller's companion — like a wise local guide who knows every ghat, monastery, and mountain trail.

Your role:
- Help travellers with their current journey — schedule questions, logistics, what to wear, what to eat, where to go
- Provide cultural context, safety advice, local customs, weather guidance
- Arrange things by telling them you will co-ordinate with the Solura operations desk (you cannot directly call cabs or make bookings, but you relay requests)
- Answer questions about Buddhism, Hinduism, Jainism, sacred sites, and spiritual practices with respect and depth
- Be concise — 1-3 sentences usually. More only if the question genuinely needs depth.
- Use the traveller's name when you know it.
- Never make up specific prices. Never guarantee logistics you can't control.
- If a safety concern is raised, always recommend contacting the 24×7 Solura desk or using the SOS button.

Tone: warm, measured, slightly poetic. Never over-chatty. Like a trusted companion who has made this journey many times.`

const FALLBACK_RESPONSES: Record<string, string> = {
  default: 'I hear you. Let me check with the operations desk and get back to you shortly.',
  food: 'For local recommendations today, I would suggest asking your hotel concierge — they will know the freshest options. I can also have the desk send you a curated list for your city.',
  transport: 'I will co-ordinate with the Solura desk to arrange transport. Please allow 30–60 minutes for confirmation.',
  safety: 'Your safety is our first priority. Please use the SOS button on the dashboard for immediate assistance, or call the 24×7 Solura line.',
  weather: 'Conditions vary. Light layers are usually wise in the mornings, especially near rivers and in the hills.',
}

function getFallback(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('food') || m.includes('eat') || m.includes('restaurant') || m.includes('chai')) return FALLBACK_RESPONSES.food
  if (m.includes('cab') || m.includes('taxi') || m.includes('transport') || m.includes('drive')) return FALLBACK_RESPONSES.transport
  if (m.includes('safe') || m.includes('sos') || m.includes('emergency') || m.includes('help')) return FALLBACK_RESPONSES.safety
  if (m.includes('weather') || m.includes('rain') || m.includes('cold') || m.includes('hot') || m.includes('wear')) return FALLBACK_RESPONSES.weather
  return FALLBACK_RESPONSES.default
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, bookingId } = await req.json() as { message: string; bookingId?: string }
  if (!message?.trim()) return NextResponse.json({ error: 'Empty message' }, { status: 400 })

  // Fetch booking context to ground Soma's responses
  let contextBlock = ''
  if (bookingId) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('traveler_name, current_day, current_location, journey:journeys(title, route, itinerary)')
      .eq('id', bookingId)
      .single()

    if (booking) {
      const j = booking.journey as unknown as { title: string; route: string; itinerary: { day: string; place: string; notes: string; stay: string }[] } | null
      const dayEntry = j?.itinerary?.[Math.max(0, (booking.current_day ?? 1) - 1)]
      contextBlock = [
        `Traveller: ${booking.traveler_name}`,
        `Journey: ${j?.title ?? 'unknown'} (${j?.route ?? ''})`,
        `Today (Day ${booking.current_day ?? 1}): ${dayEntry?.place ?? booking.current_location ?? 'unknown location'}`,
        dayEntry?.notes ? `Day notes: ${dayEntry.notes}` : '',
        dayEntry?.stay ? `Staying at: ${dayEntry.stay}` : '',
      ].filter(Boolean).join('\n')
    }
  }

  // Fetch last 10 messages for conversation context
  const { data: history } = await supabase
    .from('messages')
    .select('sender_type, content')
    .eq('booking_id', bookingId ?? '')
    .order('created_at', { ascending: false })
    .limit(10)

  const conversationHistory = (history ?? []).reverse()

  // Save the user message
  await supabase.from('messages').insert({
    booking_id: bookingId ?? null,
    sender_id: user.id,
    sender_type: 'user',
    content: message,
    thread_user_id: user.id,
  })

  let reply: string

  if (client) {
    try {
      const systemWithContext = contextBlock
        ? `${SYSTEM_PROMPT}\n\n--- CURRENT TRIP CONTEXT ---\n${contextBlock}`
        : SYSTEM_PROMPT

      const anthropicMessages: Anthropic.Messages.MessageParam[] = [
        ...conversationHistory
          .filter((m) => m.sender_type === 'user' || m.sender_type === 'soma')
          .map((m) => ({
            role: m.sender_type === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content,
          })),
        { role: 'user', content: message },
      ]

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: systemWithContext,
        messages: anthropicMessages,
      })

      reply = (response.content[0] as Anthropic.Messages.TextBlock).text
    } catch {
      reply = getFallback(message)
    }
  } else {
    reply = getFallback(message)
  }

  // Save Soma's response
  await supabase.from('messages').insert({
    booking_id: bookingId ?? null,
    sender_id: user.id,
    sender_type: 'soma',
    content: reply,
    thread_user_id: user.id,
  })

  return NextResponse.json({ reply })
}
