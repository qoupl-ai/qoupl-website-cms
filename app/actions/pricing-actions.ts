'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'

interface PricingPlanData {
  plan_type?: string
  name: string
  price: number
  currency?: string
  billing_period: string
  description?: string
  features: string[]
  is_popular: boolean
  published: boolean
  order_index: number
}

export async function createPricingPlan(data: PricingPlanData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Create pricing plan
  const { error } = await supabase.from('pricing_plans').insert({
    plan_type: data.plan_type || 'subscription',
    name: data.name,
    price: data.price,
    currency: data.currency || 'INR',
    billing_period: data.billing_period,
    description: data.description || null,
    features: data.features,
    is_popular: data.is_popular,
    published: data.published,
    order_index: data.order_index,
  })

  if (error) {
    throw new Error(`Failed to create pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}

export async function updatePricingPlan(id: string, data: PricingPlanData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Update pricing plan
  const updateData: any = {
    name: data.name,
    price: data.price,
    billing_period: data.billing_period,
    features: data.features,
    is_popular: data.is_popular,
    published: data.published,
    order_index: data.order_index,
    updated_at: new Date().toISOString(),
  }
  
  // Add optional fields if provided
  if (data.plan_type !== undefined) updateData.plan_type = data.plan_type
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.description !== undefined) updateData.description = data.description
  
  const { error } = await supabase
    .from('pricing_plans')
    .update(updateData)
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}

export async function deletePricingPlan(id: string) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Delete pricing plan
  const { error } = await supabase.from('pricing_plans').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete pricing plan: ${error.message}`)
  }

  revalidatePath('/add-content/pricing')
}
