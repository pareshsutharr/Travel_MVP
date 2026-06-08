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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-slate" size={14} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-full border border-pale-sky bg-platinum py-2.5 pl-9 pr-4 text-sm text-graphite outline-none focus:border-metallic-gold"
            placeholder="Search users, email, role..."
          />
        </div>
        <p className="text-xs text-blue-slate">Showing {filtered.length} of {users.length}</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-pale-sky bg-platinum">
        <table className="w-full min-w-[640px]">
          <thead className="bg-platinum">
            <tr>
              {['USER', 'ROLE', 'LOCATION', 'JOURNEYS', 'VALUE', 'JOINED', 'MANAGE'].map((head) => (
                <th key={head} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-blue-slate">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-t border-pale-sky hover:bg-platinum">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pale-sky text-xs text-metallic-gold">
                      {initials(user.full_name ?? user.email)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-graphite">{user.full_name ?? 'Unnamed user'}</p>
                      <p className="text-xs text-blue-slate">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={user.role}
                    disabled={savingId === user.id}
                    onChange={(event) => updateRole(user.id, event.target.value as Role)}
                    className="rounded-full border border-pale-sky bg-platinum px-3 py-1.5 text-xs capitalize text-graphite outline-none focus:border-metallic-gold"
                  >
                    <option value="user">user</option>
                    <option value="counsellor">counsellor</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-sm text-blue-slate">{user.location ?? '-'}</td>
                <td className="px-5 py-4 text-sm text-graphite">{user.journeys_count}</td>
                <td className="px-5 py-4 text-sm text-graphite">{formatCurrency(user.lifetime_value)}</td>
                <td className="px-5 py-4 text-xs text-blue-slate">{formatDate(user.member_since)}</td>
                <td className="px-5 py-4">
                  {user.role === 'user' ? (
                    <Link href={`/admin/customers/${user.id}`} className="text-xs text-metallic-gold hover:underline">Profile -&gt;</Link>
                  ) : (
                    <span className="text-xs text-blue-slate">Staff account</span>
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
