'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import GoogleAuthButton from '@/app/components/auth/GoogleAuthButton'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('error_description')
    if (authError) setError(authError)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError(err.message); setLoading(false); return }
    // Check role for redirect
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role === 'admin' || profile?.role === 'counsellor') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full border border-[#B89A4E] flex items-center justify-center">
              <span className="font-serif text-[#B89A4E] text-sm font-medium">S</span>
            </div>
            <span className="font-serif text-xl tracking-wider text-[#1C1917]">SOLURA</span>
          </div>
          <p className="text-xs tracking-widest text-[#9C9589] uppercase">Travel · India & Nepal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E8E3D9] rounded-2xl p-8">
          <h1 className="font-serif text-3xl text-[#1C1917] mb-1">Welcome back.</h1>
          <p className="text-sm text-[#9C9589] mb-8">Sign in to continue your journey.</p>

          <GoogleAuthButton label="Sign in with Google" />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#E8E3D9]" />
            <span className="text-[10px] uppercase tracking-widest text-[#9C9589]">or email</span>
            <div className="h-px flex-1 bg-[#E8E3D9]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#9C9589] mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-[#E8E3D9] rounded-lg px-4 py-3 text-sm text-[#1C1917] bg-[#FAFAF8] focus:outline-none focus:border-[#B89A4E] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-[#9C9589] mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-[#E8E3D9] rounded-lg px-4 py-3 text-sm text-[#1C1917] bg-[#FAFAF8] focus:outline-none focus:border-[#B89A4E] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-[#1C1917] text-white rounded-full py-3 text-sm font-medium hover:bg-[#B89A4E] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-[#9C9589]">
              No account yet?{' '}
              <Link href="/register" className="text-[#B89A4E] hover:underline">Begin a journey</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#9C9589] mt-8">
          <Link href="/" className="hover:text-[#B89A4E] transition-colors">← Back to Solura</Link>
        </p>
      </div>
    </div>
  )
}
