import { createClient } from '@/lib/supabase/server'

export default async function AdminSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase.from('profiles').select('*').eq('id', user.id).single() : { data: null }
  const input = 'w-full rounded-lg border border-[#E8E3D9] bg-[#FAFAF8] px-4 py-2.5 text-sm text-[#1C1917]'
  const platformItems = [
    'India and Nepal international travel focus',
    'Europe and America customer base',
    'Spiritual journey first, with wellness, heritage and adventure support',
    'One-click travel basket: flights, hotels, cabs, visa, SIM, insurance, guide and GPS',
    'Partner suggestions from MakeMyTrip, Booking.com and Airbnb',
    'Soma chatbot and personal counsellor support',
    'Destination manager assigned from wishlist and preferences',
    'Profile hub for bookings done, tour manager, tour details and GPS tracker',
  ]
  return (
    <div className="max-w-4xl px-8 py-8">
      <h1 className="mb-8 font-serif text-3xl text-[#1C1917]">Settings</h1>
      <div className="space-y-6">
        <section className="rounded-xl border border-[#E8E3D9] bg-white p-6"><h2 className="mb-4 font-serif text-xl text-[#1C1917]">Account</h2><div className="grid gap-4"><input className={input} value={profile?.full_name ?? ''} readOnly /><input className={input} value={profile?.email ?? ''} readOnly /><input className={input} value={profile?.role ?? ''} readOnly /></div></section>
        <section className="rounded-xl border border-[#E8E3D9] bg-white p-6">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-[#B89A4E]">Requirements checklist</p>
          <h2 className="font-serif text-xl text-[#1C1917]">Solura platform scope</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {platformItems.map((item) => (
              <div key={item} className="rounded-lg bg-[#FAFAF8] px-4 py-3 text-sm leading-6 text-[#1C1917]">
                <span className="text-[#B89A4E]">✓</span> {item}
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-[#B89A4E]/20 bg-[#F5F0E8] p-6"><h2 className="font-serif text-xl text-[#1C1917]">Demo Accounts</h2><div className="mt-4 space-y-2 font-mono text-xs text-[#1C1917]"><p>Admin: admin@solura.travel / Admin@123</p><p>Counsellor: anika@solura.travel / Anika@123</p><p>User: eleanor@example.com / Eleanor@123</p></div></section>
      </div>
    </div>
  )
}
