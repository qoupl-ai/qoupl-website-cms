'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'

interface BlogPostData {
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: string
  publish_date: string
  read_time: number
  published: boolean
}

export async function createBlogPost(data: BlogPostData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Create blog post
  const { error } = await supabase.from('blog_posts').insert({
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    category_id: data.category_id,
    publish_date: data.publish_date,
    read_time: data.read_time,
    published: data.published,
  })

  if (error) {
    throw new Error(`Failed to create blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
}

export async function updateBlogPost(id: string, data: BlogPostData) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Update blog post
  const { error } = await supabase
    .from('blog_posts')
    .update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      category_id: data.category_id,
      publish_date: data.publish_date,
      read_time: data.read_time,
      published: data.published,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to update blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
  revalidatePath(`/blog/${data.slug}`)
}

export async function deleteBlogPost(id: string) {
  // Assert admin access (throws if not authorized)
  await assertAdmin()

  const supabase = await createClient()

  // Delete blog post
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)

  if (error) {
    throw new Error(`Failed to delete blog post: ${error.message}`)
  }

  revalidatePath('/add-content/blog')
  revalidatePath('/blog')
}
