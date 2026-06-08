import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UserSidebar from '@/app/components/user/UserSidebar'
import MobileBottomNav from '@/app/components/user/MobileBottomNav'
import SoluraLogo from '@/app/components/SoluraLogo'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/sign-in')

  return (
    <div className="flex h-screen bg-platinum overflow-hidden">
      <UserSidebar profile={profile} />
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center border-b border-pale-sky bg-platinum/95 px-4 backdrop-blur md:hidden">
        <SoluraLogo href="/" className="w-24" />
      </div>
      <main className="flex-1 overflow-auto pb-20 pt-14 md:pb-0 md:pt-0">{children}</main>
      <MobileBottomNav />
    </div>
  )
}
