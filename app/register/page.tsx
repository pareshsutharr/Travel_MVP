'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import GoogleAuthButton from '@/app/components/auth/GoogleAuthButton'
import SoluraLogo from '@/app/components/SoluraLogo'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
      if (profile?.role === 'admin' || profile?.role === 'counsellor') {
        router.replace('/admin')
      } else {
        router.replace('/dashboard')
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    const supabase = createClient()
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    if (data.session) {
      window.location.href = '/dashboard'
      return
    }
    setSuccess('Account created. Please confirm your email, then sign in.')
  }

  return (
    <div className="min-h-screen bg-platinum flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <SoluraLogo href="/" showTagline className="w-48" />
        </div>

        <div className="bg-platinum border border-pale-sky rounded-2xl p-8">
          <h1 className="font-serif text-3xl text-graphite mb-1">Begin your journey.</h1>
          <p className="text-sm text-blue-slate mb-8">Create your Solura account.</p>

          <GoogleAuthButton label="Continue with Google" />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-pale-sky" />
            <span className="text-[10px] uppercase tracking-widest text-blue-slate">or create with email</span>
            <div className="h-px flex-1 bg-pale-sky" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase text-blue-slate mb-1.5">Full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full border border-pale-sky rounded-lg px-4 py-3 text-sm text-graphite bg-platinum focus:outline-none focus:border-metallic-gold transition-colors"
                placeholder="Eleanor Hart" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-blue-slate mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-pale-sky rounded-lg px-4 py-3 text-sm text-graphite bg-platinum focus:outline-none focus:border-metallic-gold transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-blue-slate mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                className="w-full border border-pale-sky rounded-lg px-4 py-3 text-sm text-graphite bg-platinum focus:outline-none focus:border-metallic-gold transition-colors"
                placeholder="min. 8 characters" />
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
            {success && <p className="text-xs text-success">{success}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-graphite text-platinum rounded-full py-3 text-sm font-medium hover:bg-metallic-gold transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Creating account…' : 'Begin →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-blue-slate">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-metallic-gold hover:underline">Sign in</Link>
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
