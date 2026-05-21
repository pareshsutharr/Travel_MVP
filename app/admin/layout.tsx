import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/app/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || !['admin', 'counsellor'].includes(profile.role)) redirect('/dashboard')

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <AdminSidebar profile={profile} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
