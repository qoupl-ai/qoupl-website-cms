/**
 * Unified Page Actions
 * 
 * Generic CRUD operations for pages table.
 * All pages use the same structure regardless of content type.
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'

export interface PageData {
  slug: string
  title: string
  description?: string
  metadata?: Record<string, any>
  published: boolean
}

export interface CreatePageInput extends PageData {}

export interface UpdatePageInput {
  title?: string
  description?: string
  metadata?: Record<string, any>
  published?: boolean
}

/**
 * Create a new page
 */
export async function createPage(input: CreatePageInput) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  const { error } = await supabase.from('pages').insert({
    slug: input.slug,
    title: input.title,
    description: input.description,
    metadata: input.metadata || {},
    published: input.published,
  })

  if (error) {
    throw new Error(`Failed to create page: ${error.message}`)
  }

  revalidatePath('/add-content')
  revalidatePath('/add-content/pages')
}

/**
 * Update an existing page
 */
export async function updatePage(slug: string, input: UpdatePageInput) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (input.title !== undefined) updateData.title = input.title
  if (input.description !== undefined) updateData.description = input.description
  if (input.metadata !== undefined) updateData.metadata = input.metadata
  if (input.published !== undefined) updateData.published = input.published

  const { error } = await supabase
    .from('pages')
    .update(updateData)
    .eq('slug', slug)

  if (error) {
    throw new Error(`Failed to update page: ${error.message}`)
  }

  revalidatePath('/add-content')
  revalidatePath('/add-content/pages')
  revalidatePath(`/${slug}`)
}

/**
 * Delete a page
 */
export async function deletePage(slug: string) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  const { error } = await supabase.from('pages').delete().eq('slug', slug)

  if (error) {
    throw new Error(`Failed to delete page: ${error.message}`)
  }

  revalidatePath('/add-content')
  revalidatePath('/add-content/pages')
}

