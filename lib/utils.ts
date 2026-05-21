export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    on_path: 'text-emerald-600 bg-emerald-50',
    confirmed: 'text-blue-600 bg-blue-50',
    delayed: 'text-amber-600 bg-amber-50',
    visa_hold: 'text-orange-600 bg-orange-50',
    new: 'text-stone-600 bg-stone-100',
    done: 'text-stone-400 bg-stone-50',
    cancelled: 'text-red-500 bg-red-50',
  }
  return map[status] ?? 'text-stone-500 bg-stone-50'
}

export function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    on_path: 'On path', confirmed: 'Confirmed', delayed: 'Delayed',
    visa_hold: 'Visa hold', new: 'New', done: 'Done', cancelled: 'Cancelled',
  }
  return map[status] ?? status
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    spiritual: 'text-[#B89A4E]', heritage: 'text-stone-600',
    adventure: 'text-emerald-600', wellness: 'text-blue-500',
  }
  return map[category] ?? 'text-stone-500'
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
