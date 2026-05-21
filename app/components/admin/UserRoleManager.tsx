'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, initials } from '@/lib/utils'
import type { Profile, Role } from '@/types/database'

export default function UserRoleManager({ users }: { users: Profile[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState('')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return users.filter((user) => {
      return !q || user.full_name?.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.role.includes(q)
    })
  }, [query, users])

  async function updateRole(userId: string, role: Role) {
    setSavingId(userId)
    const supabase = createClient()
    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    setSavingId('')
    if (error) {
      window.alert(error.message)
      return
    }
    router.refresh()
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="relative w-80 max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9C9589]" size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-[#E8E3D9] bg-white py-2.5 pl-9 pr-4 text-sm text-[#1C1917] outline-none focus:border-[#B89A4E]"
            placeholder="Search users, email, role..."
          />
        </div>
        <p className="text-xs text-[#9C9589]">Showing {filtered.length} of {users.length}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
        <table className="w-full min-w-[640px]">
          <thead className="bg-[#FAFAF8]">
            <tr>
              {['USER', 'ROLE', 'LOCATION', 'JOURNEYS', 'VALUE', 'JOINED', 'MANAGE'].map((head) => (
                <th key={head} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-[#E8E3D9] hover:bg-[#FAFAF8]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E8] text-xs text-[#B89A4E]">
                      {initials(user.full_name ?? user.email)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1C1917]">{user.full_name ?? 'Unnamed user'}</p>
                      <p className="text-xs text-[#9C9589]">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={user.role}
                    disabled={savingId === user.id}
                    onChange={(event) => updateRole(user.id, event.target.value as Role)}
                    className="rounded-full border border-[#E8E3D9] bg-white px-3 py-1.5 text-xs capitalize text-[#1C1917] outline-none focus:border-[#B89A4E]"
                  >
                    <option value="user">user</option>
                    <option value="counsellor">counsellor</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-sm text-[#9C9589]">{user.location ?? '-'}</td>
                <td className="px-5 py-4 text-sm text-[#1C1917]">{user.journeys_count}</td>
                <td className="px-5 py-4 text-sm text-[#1C1917]">{formatCurrency(user.lifetime_value)}</td>
                <td className="px-5 py-4 text-xs text-[#9C9589]">{formatDate(user.member_since)}</td>
                <td className="px-5 py-4">
                  {user.role === 'user' ? (
                    <Link href={`/admin/customers/${user.id}`} className="text-xs text-[#B89A4E] hover:underline">Profile -&gt;</Link>
                  ) : (
                    <span className="text-xs text-[#9C9589]">Staff account</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
