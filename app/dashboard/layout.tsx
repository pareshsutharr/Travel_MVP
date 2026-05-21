import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserSidebar from '@/app/components/user/UserSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/sign-in')

  return (
    <div className="flex h-screen bg-[#FAFAF8] overflow-hidden">
      <UserSidebar profile={profile} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
