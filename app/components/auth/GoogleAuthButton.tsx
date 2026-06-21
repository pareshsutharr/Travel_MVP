'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface GoogleAuthButtonProps {
  label?: string
  next?: string
}

export default function GoogleAuthButton({
  label = 'Continue with Google',
  next = '/dashboard',
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    const supabase = createClient()
    const origin = window.location.origin

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      setLoading(false)
      window.location.href = `/sign-in?error_description=${encodeURIComponent(error.message)}`
    }
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-pale-sky bg-platinum px-4 py-3 text-sm font-medium text-graphite transition-colors hover:border-metallic-gold hover:bg-platinum disabled:opacity-50"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-pale-sky text-xs font-semibold text-graphite">
        G
      </span>
      {loading ? 'Opening Google...' : label}
    </button>
  )
}
