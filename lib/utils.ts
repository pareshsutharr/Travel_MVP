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
    on_path: 'text-success bg-status-soft',
    confirmed: 'text-info bg-status-soft',
    delayed: 'text-warning bg-status-soft',
    visa_hold: 'text-warning bg-status-soft',
    new: 'text-info bg-status-soft',
    done: 'text-info bg-status-soft',
    cancelled: 'text-danger bg-status-soft',
  }
  return map[status] ?? 'text-info bg-status-soft'
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
    spiritual: 'text-metallic-gold', heritage: 'text-info',
    adventure: 'text-success', wellness: 'text-info',
  }
  return map[category] ?? 'text-info'
}

export function initials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
