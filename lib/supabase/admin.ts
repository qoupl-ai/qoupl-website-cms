import { createClient } from '@supabase/supabase-js'

/**
 * Admin Supabase client with service role key
 *
 * CRITICAL SECURITY NOTES:
 * - This client BYPASSES Row Level Security (RLS)
 * - NEVER expose this client to the browser/client-side
 * - Only use in Server Components, Server Actions, or API Routes
 * - Service role key has full database access
 *
 * Use cases:
 * - Admin operations (CMS CRUD)
 * - Bulk data operations
 * - User management
 * - Storage bucket management
 */

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

/**
 * Helper function to verify the current user is an admin
 * Call this before any admin operations
 */
export async function verifyAdminAccess(userId: string): Promise<boolean> {
  const { data, error } = await adminClient
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    console.error('Admin verification failed:', error)
    return false
  }

  return true
}
