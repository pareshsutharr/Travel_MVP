import Link from 'next/link'

const STEPS = [
  { n: 1, label: 'Travel type' },
  { n: 2, label: 'Your journey' },
  { n: 3, label: 'Review' },
  { n: 4, label: 'Confirm' },
]

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <header className="border-b border-[#E8E3D9] bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-[#B89A4E] flex items-center justify-center">
            <span className="font-serif text-[#B89A4E] text-xs">S</span>
          </div>
          <span className="font-serif text-[#1C1917] text-sm tracking-wider">SOLURA</span>
        </Link>
        <div className="flex items-center gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px bg-[#E8E3D9]" />}
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#F5F0E8] border border-[#E8E3D9] flex items-center justify-center">
                  <span className="text-[10px] text-[#9C9589]">{s.n}</span>
                </div>
                <span className="text-xs text-[#9C9589] hidden sm:block">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
        <Link href="/sign-in" className="text-xs text-[#9C9589] hover:text-[#1C1917]">Sign in</Link>
      </header>
      <div className="max-w-2xl mx-auto px-4 py-12">{children}</div>
    </div>
  )
}
