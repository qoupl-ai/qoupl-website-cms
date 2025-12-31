/**
 * Get logo URL from Supabase Storage
 * Falls back to local path if storage URL is not available
 */

export function getLogoUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    console.warn('[Logo] NEXT_PUBLIC_SUPABASE_URL not set, using fallback')
    return '/images/quoupl.svg'
  }

  // Logo is stored in brand-assets/brand-logo/quoupl.svg
  return `${supabaseUrl}/storage/v1/object/public/brand-assets/brand-logo/quoupl.svg`
}

