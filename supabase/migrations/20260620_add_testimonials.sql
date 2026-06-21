-- ─── Testimonials table ────────────────────────────────────────────────────────
create table if not exists public.testimonials (
  id          uuid         primary key default gen_random_uuid(),
  name        text         not null,
  role        text,
  location    text         not null,
  destination text         not null,
  quote       text         not null,
  rating      int          not null default 5 check (rating >= 1 and rating <= 5),
  avatar_url  text         not null,
  is_published boolean     not null default true,
  sort_order  int          not null default 0,
  created_at  timestamptz  not null default now()
);

-- Anyone can read published testimonials (public landing page)
alter table public.testimonials enable row level security;
create policy "public read published testimonials"
  on public.testimonials for select
  using (is_published = true);

-- Only admins can write
create policy "admin manage testimonials"
  on public.testimonials for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ─── Sample data ────────────────────────────────────────────────────────────────
insert into public.testimonials
  (name, role, location, destination, quote, rating, avatar_url, sort_order)
values
  (
    'Amelia Roberts', 'Verified Traveler', 'London, UK', 'Paris, France',
    'Our Solura journey felt effortless from the very first search to the final flight home. Every stay, transfer, and local experience was thoughtfully chosen — it felt like someone who truly knew us had built the itinerary.',
    5, 'https://i.pravatar.cc/220?img=47', 1
  ),
  (
    'James & Priya Mehta', 'Verified Travelers', 'Mumbai, India', 'Swiss Alps',
    'Soma designed our entire honeymoon in under 20 minutes. We discovered hidden alpine villages we never would have found on our own. The concierge was available at every hour — genuinely remarkable service.',
    5, 'https://i.pravatar.cc/220?img=33', 2
  ),
  (
    'David Chen', 'Verified Traveler', 'Singapore', 'Bali, Indonesia',
    '24/7 support gave us total peace of mind. When our connecting flight was cancelled, the Solura team had us rebooked on a better route before we even reached the gate. Unmatched responsiveness.',
    5, 'https://i.pravatar.cc/220?img=68', 3
  ),
  (
    'Sofia Garcia', 'Verified Traveler', 'Madrid, Spain', 'Maldives',
    'The overwater villa was beyond anything I have ever experienced. Solura handled every detail — transfer boats, dive excursions, sunset dinners — so we could simply be present and breathe it all in.',
    5, 'https://i.pravatar.cc/220?img=25', 4
  ),
  (
    'Marcus Kim', 'Verified Traveler', 'Seoul, Korea', 'Nepal',
    'The Annapurna Base Camp trek was expertly organized — from the acclimatization schedule to every lodge booking. Our mountain guide was outstanding. The sunrise over the Himalayas will stay with me forever.',
    5, 'https://i.pravatar.cc/220?img=12', 5
  );
