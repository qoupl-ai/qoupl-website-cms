/**
 * Authorization Utilities
 * 
 * Single source of truth for admin authorization.
 * All server actions and API routes must use these functions.
 */

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Asserts that the current user is an authenticated admin.
 * Throws an error or redirects if not authorized.
 * 
 * @throws {Error} If user is not authenticated or not an admin
 * @returns {Promise<{ user: User, adminUser: AdminUser }>} User and admin data
 */
export async function assertAdmin() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Verify admin access via admin_users table
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, user_id, email, name, is_active')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (adminError || !adminUser) {
    // Log for security monitoring
    console.error('Unauthorized admin access attempt:', {
      userId: user.id,
      email: user.email,
      error: adminError?.message,
    })
    throw new Error('Unauthorized: Admin access required')
  }

  return { user, adminUser }
}

/**
 * Checks if the current user is an admin (non-throwing).
 * Useful for conditional rendering or logging.
 * 
 * @returns {Promise<boolean>} True if user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  try {
    await assertAdmin()
    return true
  } catch {
    return false
  }
}

/**
 * Gets the current admin user if authenticated, null otherwise.
 * Does not throw or redirect.
 * 
 * @returns {Promise<{ user: User, adminUser: AdminUser } | null>}
 */
export async function getAdminUser() {
  try {
    return await assertAdmin()
  } catch {
    return null
  }
}

