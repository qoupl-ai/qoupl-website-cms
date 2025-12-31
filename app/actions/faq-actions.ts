'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'

interface FAQData {
  question: string
  answer: string
  category_id: string
  order_index: number
  published: boolean
}

export async function createFAQ(data: FAQData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Create FAQ
  const { error } = await supabase.from('faqs').insert({
    question: data.question,
    answer: data.answer,
    category_id: data.category_id,
    order_index: data.order_index,
    published: data.published,
  })

  if (error) {
    throw new Error(`Failed to create FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}

export async function updateFAQ(id: string, data: FAQData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Update FAQ
  const { error } = await supabase
    .from('faqs')
    .update({
      question: data.question,
      answer: data.answer,
      category_id: data.category_id,
      order_index: data.order_index,
      published: data.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}

export async function deleteFAQ(id: string) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Delete FAQ
  const { error } = await supabase.from('faqs').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete FAQ: ${error.message}`)
  }

  revalidatePath('/add-content/faqs')
}
