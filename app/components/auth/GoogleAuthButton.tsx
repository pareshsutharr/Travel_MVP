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
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
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
      className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E8E3D9] bg-white px-4 py-3 text-sm font-medium text-[#1C1917] transition-colors hover:border-[#B89A4E] hover:bg-[#FAFAF8] disabled:opacity-50"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E8E3D9] text-xs font-semibold text-[#1C1917]">
        G
      </span>
      {loading ? 'Opening Google...' : label}
    </button>
  )
}
