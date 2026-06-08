import { createClient } from '@/lib/supabase/server'
import UserRoleManager from '@/app/components/admin/UserRoleManager'
import type { Profile } from '@/types/database'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const users = (data ?? []) as Profile[]
  const stats = [
    ['All users', users.length],
    ['Travellers', users.filter((user) => user.role === 'user').length],
    ['Counsellors', users.filter((user) => user.role === 'counsellor').length],
    ['Admins', users.filter((user) => user.role === 'admin').length],
  ]

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-metallic-gold">Access control</p>
        <h1 className="font-serif text-2xl sm:text-3xl text-graphite">Users, customers and <span className="italic text-metallic-gold">admin roles.</span></h1>
        <p className="mt-1 text-sm text-blue-slate">Control who can access the traveller portal, counsellor desk and admin CMS.</p>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-pale-sky bg-platinum px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-blue-slate">{label}</p>
            <p className="font-serif text-3xl text-graphite">{value}</p>
          </div>
        ))}
      </div>
      <UserRoleManager users={users} />
    </div>
  )
}
