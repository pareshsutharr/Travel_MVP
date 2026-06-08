import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Stale / revoked refresh token — wipe the sb-* cookies and continue as guest
  if (authError && (
    authError.message?.includes('Refresh Token') ||
    (authError as { code?: string }).code === 'refresh_token_not_found'
  )) {
    const clean = NextResponse.next({ request })
    request.cookies.getAll()
      .filter((c) => c.name.startsWith('sb-'))
      .forEach((c) => clean.cookies.delete(c.name))
    // If the stale session was trying to access a protected route, send to sign-in
    if (
      path.startsWith('/dashboard') ||
      path.startsWith('/admin') ||
      path.startsWith('/build')
    ) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('next', `${path}${request.nextUrl.search}`)
      const redirect = NextResponse.redirect(redirectUrl)
      request.cookies.getAll()
        .filter((c) => c.name.startsWith('sb-'))
        .forEach((c) => redirect.cookies.delete(c.name))
      return redirect
    }
    return clean
  }

  // Helper: fetch role once when needed
  async function getRole(): Promise<string | null> {
    if (!user) return null
    const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    return data?.role ?? null
  }

  // ── Already logged in → redirect away from auth pages ──────────────────────
  if (path === '/sign-in' || path === '/register') {
    if (user) {
      const role = await getRole()
      const dest = (role === 'admin' || role === 'counsellor') ? '/admin' : '/dashboard'
      return NextResponse.redirect(new URL(dest, request.url))
    }
    return supabaseResponse
  }

  // ── Dashboard: require login, redirect admins to /admin ────────────────────
  if (path.startsWith('/dashboard') || path.startsWith('/build')) {
    if (!user) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(redirectUrl)
    }
    // Admin/counsellor should use /admin, not /dashboard
    const role = await getRole()
    if (role === 'admin' || role === 'counsellor') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ── Admin: require login + correct role ────────────────────────────────────
  if (path.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('next', `${request.nextUrl.pathname}${request.nextUrl.search}`)
      return NextResponse.redirect(redirectUrl)
    }
    const role = await getRole()
    if (role !== 'admin' && role !== 'counsellor') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/sign-in', '/register', '/dashboard/:path*', '/admin/:path*', '/build/:path*'],
}
