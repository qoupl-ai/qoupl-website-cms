/**
 * CMS Middleware
 * 
 * This middleware protects all CMS routes and requires admin authentication
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Log middleware execution in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] ${request.method} ${pathname}`)
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check environment variables
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[Middleware] Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[Middleware] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError && process.env.NODE_ENV === 'development') {
    console.error('[Middleware] Auth error:', authError.message)
  }

  // Allow login page without authentication
  if (pathname.startsWith('/login')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Allowing login page access')
    }
    return supabaseResponse
  }

  // Protect all other routes - require authentication
  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] No user, redirecting to login')
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // For /add-content routes, verify admin access
  if (pathname.startsWith('/add-content')) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Middleware] Checking admin access for user: ${user.id}`)
    }
    
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, user_id, email, is_active')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('[Middleware] Admin check error:', error.message)
    }

    if (error || !adminUser) {
      // User is authenticated but not an admin
      if (process.env.NODE_ENV === 'development') {
        console.warn('[Middleware] User is not an admin, redirecting')
      }
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(url)
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Middleware] Admin access granted')
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

