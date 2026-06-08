import { createClient } from '@/lib/supabase/server'
import AdminSettingsForm from '@/app/components/admin/AdminSettingsForm'

const DEFAULTS = {
  general: { site_name: 'Solura Travel', tagline: 'A radiant inner journey', contact_email: 'hello@solura.travel', phone: '+91 98765 43210', whatsapp: '+91 98765 43210' },
  booking: { booking_fee_pct: 5, cancellation_days: 14, min_travelers: 1, max_travelers: 20 },
  sos: { '24x7_line': '+91 98765 43210', emergency_email: 'sos@solura.travel' },
}

export default async function AdminSettings() {
  const supabase = await createClient()

  const { data: rows } = await supabase.from('site_settings').select('key, value')
  const settingsMap = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]))

  const settings = {
    general: { ...DEFAULTS.general, ...(settingsMap.general as typeof DEFAULTS.general ?? {}) },
    booking: { ...DEFAULTS.booking, ...(settingsMap.booking as typeof DEFAULTS.booking ?? {}) },
    sos: { ...DEFAULTS.sos, ...(settingsMap.sos as typeof DEFAULTS.sos ?? {}) },
  }

  const { data: profile } = await supabase.from('profiles').select('full_name, email, role').single()

  const platformItems = [
    'India and Nepal international travel focus',
    'Europe and America customer base (US/EU)',
    'Spiritual journey first — wellness, heritage, adventure',
    'One-click travel basket: flights, hotels, cabs, visa, SIM, insurance, guide, GPS',
    'Flight/hotel suggestions via MakeMyTrip, Booking.com, Airbnb',
    'Soma AI chatbot + personalised counsellor support',
    'Destination manager assigned from wishlist and preferences',
    'Profile hub: bookings, tour manager, tour details, GPS tracker',
    'Solo · Couple · Family · Group trips',
    '24×7 GPS tracking and SOS line',
    'Money conversion for INR and NPR',
    'Visa and passport management',
    'SIM card and language assistance kit',
    'Travel insurance bundled in total',
  ]

  return (
    <div className="max-w-4xl px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-8 px-0">
        <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-1">Super Admin</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-graphite">Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminSettingsForm initial={settings} />
        </div>

        <aside className="space-y-5">
          {/* Account */}
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-3">Your account</p>
            <p className="text-sm font-medium text-graphite">{profile?.full_name}</p>
            <p className="text-xs text-blue-slate">{profile?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-pale-sky px-2.5 py-0.5 text-xs capitalize text-metallic-gold">{profile?.role}</span>
          </div>

          {/* Demo accounts */}
          <div className="rounded-xl border border-metallic-gold/20 bg-pale-sky p-5">
            <p className="text-[10px] tracking-widest text-metallic-gold uppercase mb-3">Demo accounts</p>
            <div className="space-y-1.5 font-mono text-xs text-graphite">
              <p className="font-sans text-[10px] text-blue-slate uppercase tracking-widest">Admin</p>
              <p>admin@solura.travel</p>
              <p className="text-blue-slate">Admin@123</p>
              <p className="mt-2 font-sans text-[10px] text-blue-slate uppercase tracking-widest">Counsellor</p>
              <p>anika@solura.travel</p>
              <p className="text-blue-slate">Anika@123</p>
              <p className="mt-2 font-sans text-[10px] text-blue-slate uppercase tracking-widest">User</p>
              <p>eleanor@example.com</p>
              <p className="text-blue-slate">Eleanor@123</p>
            </div>
          </div>

          {/* Platform scope */}
          <div className="rounded-xl border border-pale-sky bg-platinum p-5">
            <p className="text-[10px] tracking-widest text-blue-slate uppercase mb-3">Platform scope</p>
            <div className="space-y-1.5">
              {platformItems.map((item) => (
                <p key={item} className="text-xs leading-5 text-graphite">
                  <span className="text-metallic-gold mr-1.5">✓</span>{item}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
