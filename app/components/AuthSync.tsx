'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

// Silently signs out and clears stale cookies when a refresh-token error occurs.
// Mounted once in the root layout — no UI output.
export default function AuthSync() {
  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Session was cleared (expired token, sign-out, etc.)
        // Remove any leftover sb-* keys from localStorage to prevent stale state
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sb-'))
          .forEach((k) => localStorage.removeItem(k))
      }
    })

    // Proactively check: if the current session has an invalid refresh token,
    // Supabase will emit SIGNED_OUT automatically. We just need to be subscribed.
    supabase.auth.getSession().catch(() => {
      supabase.auth.signOut({ scope: 'local' })
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
