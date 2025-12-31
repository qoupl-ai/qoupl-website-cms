/**
 * Get public URL for a file in Supabase Storage
 * This is a pure function that works in both client and server components
 * Safe to import in client components
 */
export function getStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    return ''
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
