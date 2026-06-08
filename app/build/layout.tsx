import Link from 'next/link'
import SoluraLogo from '@/app/components/SoluraLogo'

const STEPS = [
  { n: 1, label: 'Travel type' },
  { n: 2, label: 'Your journey' },
  { n: 3, label: 'Review' },
  { n: 4, label: 'Confirm' },
]

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-platinum">
      <header className="border-b border-pale-sky bg-platinum px-6 py-4 flex items-center justify-between">
        <SoluraLogo href="/" className="w-24 sm:w-28" />
        <div className="flex items-center gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px bg-pale-sky" />}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-pale-sky border border-pale-sky flex items-center justify-center">
                  <span className="text-[10px] text-blue-slate">{s.n}</span>
                </div>
                <span className="text-xs text-blue-slate hidden sm:block">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/sign-in" className="text-xs text-blue-slate hover:text-graphite">Sign in</Link>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-12">{children}</div>
    </div>
  )
}
