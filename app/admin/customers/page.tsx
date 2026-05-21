import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate, initials } from '@/lib/utils'
import type { Profile } from '@/types/database'

export default async function AdminCustomers() {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('role', 'user').order('lifetime_value', { ascending: false })
  const customers = (data ?? []) as Profile[]
  const value = customers.reduce((sum, customer) => sum + customer.lifetime_value, 0)

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-8">
      <h1 className="mb-6 font-serif text-2xl sm:text-3xl text-[#1C1917]">{customers.length} customers · <span className="italic text-[#B89A4E]">{formatCurrency(value)} lifetime value</span></h1>
      <div className="overflow-x-auto rounded-xl border border-[#E8E3D9] bg-white">
        <table className="w-full min-w-[700px]">
          <thead className="bg-[#FAFAF8]"><tr>{['CUSTOMER', 'JOURNEYS', 'CITIES', 'LIFETIME VALUE', 'NPS', 'MEMBER SINCE', ''].map((h) => <th key={h} className="px-5 py-3 text-left text-[10px] font-normal uppercase tracking-widest text-[#9C9589]">{h}</th>)}</tr></thead>
          <tbody>{customers.map((customer) => (
            <tr key={customer.id} className="border-t border-[#E8E3D9] hover:bg-[#FAFAF8]">
              <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F0E8] text-xs text-[#B89A4E]">{initials(customer.full_name ?? customer.email)}</div><div><p className="text-sm font-medium text-[#1C1917]">{customer.full_name}</p><p className="text-xs text-[#9C9589]">{customer.email}</p></div></div></td>
              <td className="px-5 py-4 text-sm text-[#1C1917]">{customer.journeys_count}</td>
              <td className="px-5 py-4 text-sm text-[#1C1917]">{customer.cities_count}</td>
              <td className="px-5 py-4 text-sm text-[#1C1917]">{formatCurrency(customer.lifetime_value)}</td>
              <td className="px-5 py-4 text-sm text-emerald-600">{customer.nps ?? '-'}</td>
              <td className="px-5 py-4 text-xs text-[#9C9589]">{formatDate(customer.member_since)}</td>
              <td className="px-5 py-4"><Link href={`/admin/customers/${customer.id}`} className="text-xs text-[#B89A4E] hover:underline">View -&gt;</Link></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  )
}
