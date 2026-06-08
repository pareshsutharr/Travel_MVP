'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import GoogleAuthButton from '@/app/components/auth/GoogleAuthButton'
import SoluraLogo from '@/app/components/SoluraLogo'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [nextPath, setNextPath] = useState('/dashboard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const authError = params.get('error_description')
    if (authError) setError(authError)
    const next = params.get('next')
    if (next?.startsWith('/') && !next.startsWith('//')) setNextPath(next)

    // Already logged in — middleware will redirect, but handle client-side too
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'admin' || profile?.role === 'counsellor') {
        router.replace('/admin')
      } else {
        router.replace(next?.startsWith('/') && !next?.startsWith('//') ? next : '/dashboard')
      }
    })
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
      router.push(nextPath)
    }
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-platinum flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <SoluraLogo href="/" showTagline className="w-48" />
        </div>

        {/* Card */}
        <div className="bg-platinum border border-pale-sky rounded-2xl p-8">
          <h1 className="font-serif text-3xl text-graphite mb-1">Welcome back.</h1>
          <p className="text-sm text-blue-slate mb-8">Sign in to continue your journey.</p>

          <GoogleAuthButton label="Sign in with Google" next={nextPath} />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-pale-sky" />
            <span className="text-[10px] uppercase tracking-widest text-blue-slate">or email</span>
            <div className="h-px flex-1 bg-pale-sky" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-blue-slate mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-pale-sky rounded-lg px-4 py-3 text-sm text-graphite bg-platinum focus:outline-none focus:border-metallic-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-blue-slate mb-1.5">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-pale-sky rounded-lg px-4 py-3 text-sm text-graphite bg-platinum focus:outline-none focus:border-metallic-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-graphite text-platinum rounded-full py-3 text-sm font-medium hover:bg-metallic-gold transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-blue-slate">
              No account yet?{' '}
              <Link href="/register" className="text-metallic-gold hover:underline">Begin a journey</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-blue-slate mt-8">
          <Link href="/" className="hover:text-metallic-gold transition-colors">← Back to Solura</Link>
        </p>
      </div>
    </div>
  )
}
