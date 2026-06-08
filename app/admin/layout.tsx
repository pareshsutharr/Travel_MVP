import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/app/components/admin/AdminSidebar'
import SoluraLogo from '@/app/components/SoluraLogo'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile || !['admin', 'counsellor'].includes(profile.role)) redirect('/dashboard')

  return (
    <div className="flex h-screen bg-platinum overflow-hidden">
      <AdminSidebar profile={profile} />
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-center border-b border-pale-sky bg-platinum/95 backdrop-blur md:hidden">
        <SoluraLogo href="/" className="w-24" />
      </div>
      <main className="flex-1 overflow-auto pt-14 md:pt-0">{children}</main>
    </div>
  )
}
