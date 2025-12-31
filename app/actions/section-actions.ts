/**
 * Unified Section Actions
 * 
 * Generic CRUD operations for sections table.
 * Replaces blog-actions, faq-actions, feature-actions, pricing-actions.
 * 
 * All sections use the same table structure:
 * - id, page_id, type, order_index, data (JSONB), published
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { validateSectionData } from '@/lib/validation/section-schemas'

export interface SectionData {
  page_id: string
  type: string
  order_index: number
  data: Record<string, any>
  published: boolean
}

export interface CreateSectionInput extends SectionData {}

export interface UpdateSectionInput {
  type?: string
  order_index?: number
  data?: Record<string, any>
  published?: boolean
}

/**
 * Create a new section
 */
export async function createSection(input: CreateSectionInput) {
  // Assert admin access
  await assertAdmin()

  // Validate section data
  const validation = validateSectionData(input.type, input.data)
  if (!validation.success) {
    throw new Error(`Validation failed: ${validation.error}`)
  }

  const supabase = await createClient()

  const { error } = await supabase.from('sections').insert({
    page_id: input.page_id,
    component_type: input.type,
    order_index: input.order_index,
    content: input.data,
    published: input.published,
  })

  if (error) {
    throw new Error(`Failed to create section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  revalidatePath(`/add-content/pages/${input.page_id}`)
  
  // Get page slug to revalidate frontend page
  const { data: page } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', input.page_id)
    .single()
  
  if (page?.slug) {
    // Revalidate frontend page (homepage uses '/', others use '/slug')
    const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(frontendPath)
  }
}

/**
 * Update an existing section
 */
export async function updateSection(id: string, input: UpdateSectionInput) {
  // Assert admin access
  await assertAdmin()

  // Validate section data if type or data is being updated
  if (input.type && input.data) {
    const validation = validateSectionData(input.type, input.data)
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.error}`)
    }
  }

  const supabase = await createClient()

  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (input.type !== undefined) updateData.component_type = input.type
  if (input.order_index !== undefined) updateData.order_index = input.order_index
  if (input.data !== undefined) updateData.content = input.data
  if (input.published !== undefined) updateData.published = input.published

  const { error, data } = await supabase
    .from('sections')
    .update(updateData)
    .eq('id', id)
    .select('page_id')
    .single()

  if (error) {
    throw new Error(`Failed to update section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  if (data?.page_id) {
    // Revalidate CMS page
    revalidatePath(`/add-content/pages/${data.page_id}`)
    
    // Get page slug to revalidate frontend page
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', data.page_id)
      .single()
    
    if (page?.slug) {
      // Revalidate frontend page (homepage uses '/', others use '/slug')
      const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
      revalidatePath(frontendPath)
    }
  }
}

/**
 * Delete a section
 */
export async function deleteSection(id: string) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  // Get page_id before deletion for revalidation
  const { data: section } = await supabase
    .from('sections')
    .select('page_id')
    .eq('id', id)
    .single()

  const { error } = await supabase.from('sections').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete section: ${error.message}`)
  }

  // Revalidate relevant paths
  revalidatePath('/add-content')
  if (section?.page_id) {
    revalidatePath(`/add-content/pages/${section.page_id}`)
    
    // Get page slug to revalidate frontend page
    const { data: page } = await supabase
      .from('pages')
      .select('slug')
      .eq('id', section.page_id)
      .single()
    
    if (page?.slug) {
      // Revalidate frontend page (homepage uses '/', others use '/slug')
      const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
      revalidatePath(frontendPath)
    }
  }
}

/**
 * Reorder sections for a page
 */
export async function reorderSections(pageId: string, sectionIds: string[]) {
  // Assert admin access
  await assertAdmin()

  const supabase = await createClient()

  // Update order_index for each section
  const updates = sectionIds.map((id, index) =>
    supabase
      .from('sections')
      .update({ order_index: index })
      .eq('id', id)
      .eq('page_id', pageId)
  )

  await Promise.all(updates)

  revalidatePath('/add-content')
  revalidatePath(`/add-content/pages/${pageId}`)
  
  // Get page slug to revalidate frontend page
  const { data: page } = await supabase
    .from('pages')
    .select('slug')
    .eq('id', pageId)
    .single()
  
  if (page?.slug) {
    // Revalidate frontend page (homepage uses '/', others use '/slug')
    const frontendPath = page.slug === 'home' ? '/' : `/${page.slug}`
    revalidatePath(frontendPath)
  }
}

