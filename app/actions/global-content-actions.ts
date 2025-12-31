/**
 * Global Content Actions
 * 
 * Server actions for updating global content (navbar, footer, etc.)
 */

'use server'

import { revalidatePath } from 'next/cache'
import { adminClient } from '@/lib/supabase/admin'
import { assertAdmin } from '@/lib/auth/assert-admin'

export async function updateGlobalContent(key: string, content: any) {
  // Assert admin access
  await assertAdmin()

  const { error } = await adminClient
    .from('global_content')
    .upsert({
      key,
      content,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    throw new Error(`Failed to update global content: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content/global')
  revalidatePath('/') // Homepage uses global content
}

