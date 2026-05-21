import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const authError = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (authError) {
    return NextResponse.redirect(
      new URL(`/sign-in?error_description=${encodeURIComponent(authError)}`, requestUrl.origin)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/sign-in?error_description=Missing%20Google%20authorization%20code', requestUrl.origin)
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(
      new URL(`/sign-in?error_description=${encodeURIComponent(error.message)}`, requestUrl.origin)
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/sign-in?error_description=Google%20sign-in%20did%20not%20return%20a%20user', requestUrl.origin)
    )
  }

  const metadata = user.user_metadata ?? {}
  const fullName =
    typeof metadata.full_name === 'string'
      ? metadata.full_name
      : typeof metadata.name === 'string'
        ? metadata.name
        : user.email?.split('@')[0] ?? 'Traveller'

  const avatarUrl = typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email ?? '',
      full_name: fullName,
      avatar_url: avatarUrl,
      role: 'user',
      preferences: {},
    })
  } else {
    await supabase
      .from('profiles')
      .update({
        email: user.email ?? '',
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq('id', user.id)
  }

  const redirectPath =
    profile?.role === 'admin' || profile?.role === 'counsellor'
      ? '/admin'
      : next.startsWith('/') && !next.startsWith('//')
        ? next
        : '/dashboard'

  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
}
