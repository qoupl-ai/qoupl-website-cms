import { createClient } from "@/lib/supabase/server"

/**
 * Get public URL for a file in Supabase Storage
 * This is a pure function that works in both client and server components
 */
export function getStorageUrl(bucket: string, path: string): string {
  // Use environment variable that's available on both client and server
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined')
    return ''
  }

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

/**
 * Get all files from a storage bucket (server-side only)
 */
export async function listStorageFiles(bucket: string, folder: string = '') {
  
  const supabase = await createClient()

  const { data, error } = await supabase
    .storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  if (error) {
    console.error('Error listing storage files:', error)
    return []
  }

  return data || []
}

/**
 * Get media records from database with storage URLs (server-side only)
 */
export async function getMediaWithUrls() {
  
  const supabase = await createClient()

  const { data: mediaFiles } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })

  if (!mediaFiles) return []

  return mediaFiles.map(file => ({
    ...file,
    url: getStorageUrl(file.bucket_name, file.storage_path)
  }))
}
