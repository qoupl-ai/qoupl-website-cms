'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'

interface FeatureData {
  title: string
  description: string
  icon: string
  category_id: string
  order_index: number
  published: boolean
}

export async function createFeature(data: FeatureData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Create feature
  const { error } = await supabase.from('features').insert({
    title: data.title,
    description: data.description,
    icon: data.icon,
    category_id: data.category_id,
    order_index: data.order_index,
    published: data.published,
  })

  if (error) {
    throw new Error(`Failed to create feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}

export async function updateFeature(id: string, data: FeatureData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Update feature
  const { error } = await supabase
    .from('features')
    .update({
      title: data.title,
      description: data.description,
      icon: data.icon,
      category_id: data.category_id,
      order_index: data.order_index,
      published: data.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}

export async function deleteFeature(id: string) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Delete feature
  const { error } = await supabase.from('features').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete feature: ${error.message}`)
  }

  revalidatePath('/add-content/features')
}
