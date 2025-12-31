/**
 * Get logo URL from Supabase Storage
 * Falls back to local path if storage URL is not available
 * Works in both client and server components
 */

export function getLogoUrl(): string {
  // In Next.js, NEXT_PUBLIC_* env vars are available on both client and server
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    console.warn('⚠️ [Logo] NEXT_PUBLIC_SUPABASE_URL not set, using fallback')
    return '/images/quoupl.svg'
  }

  // Logo is stored in brand-assets/quoupl.svg (verified via curl test)
  const logoUrl = `${supabaseUrl}/storage/v1/object/public/brand-assets/quoupl.svg`
  
  // Log in development to help debug
  if (process.env.NODE_ENV === 'development') {
    console.log('🖼️ [Logo] Generated URL:', logoUrl)
  }
  
  return logoUrl
}

