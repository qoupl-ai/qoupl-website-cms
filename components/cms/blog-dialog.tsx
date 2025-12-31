'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createBlogPost, updateBlogPost } from '@/app/actions/blog-actions'
import { format } from 'date-fns'

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category_id: z.string().uuid('Please select a category'),
  publish_date: z.string(),
  read_time: z.number().int().min(1, 'Read time must be at least 1 minute'),
  published: z.boolean(),
})

type BlogFormValues = z.infer<typeof blogSchema>

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  publish_date: string
  read_time: number
  published: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface BlogDialogProps {
  categories: Category[]
  mode: 'create' | 'edit'
  post?: BlogPost
  children: React.ReactNode
}

export function BlogDialog({ categories, mode, post, children }: BlogDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: mode === 'edit' && post
      ? {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category_id: post.category.id,
          publish_date: format(new Date(post.publish_date), 'yyyy-MM-dd'),
          read_time: post.read_time,
          published: post.published,
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          category_id: '',
          publish_date: format(new Date(), 'yyyy-MM-dd'),
          read_time: 5,
          published: false,
        },
  })

  // Auto-generate slug from title
  const watchTitle = form.watch('title')
  if (mode === 'create' && watchTitle && !form.getValues('slug')) {
    const slug = watchTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    if (slug !== form.getValues('slug')) {
      form.setValue('slug', slug, { shouldValidate: false })
    }
  }

  function onSubmit(data: BlogFormValues) {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createBlogPost(data)
          toast.success('Blog post created successfully')
        } else if (post) {
          await updateBlogPost(post.id, data)
          toast.success('Blog post updated successfully')
        }

        setOpen(false)
        form.reset()
        router.refresh()
      } catch (error) {
        toast.error(mode === 'create' ? 'Failed to create blog post' : 'Failed to update blog post')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto cms-card cms-border"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="cms-text-primary"
            style={{ 
              fontWeight: '600', 
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            {mode === 'create' ? 'Create New Blog Post' : 'Edit Blog Post'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {mode === 'create'
              ? 'Write a new blog post for your website'
              : 'Update the blog post details below'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="10 Tips for Better Dating"
                      {...field}
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    The main title of your blog post
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Slug
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="10-tips-for-better-dating"
                        {...field}
                        style={{
                          backgroundColor: '#171717',
                          borderColor: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      URL-friendly version (auto-generated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          style={{
                            backgroundColor: '#171717',
                            borderColor: '#2a2a2a',
                            color: '#ffffff',
                            fontSize: '13px'
                          }}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id}
                            className="cms-text-secondary"
                            style={{ fontSize: '13px' }}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Post category
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Excerpt
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief summary of your blog post..."
                      rows={3}
                      {...field}
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Short description shown in listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Content
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your blog post content here (Markdown supported)..."
                      rows={12}
                      {...field}
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Full blog post content (supports Markdown)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="publish_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Publish Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        style={{
                          backgroundColor: '#171717',
                          borderColor: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Publication date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="read_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Read Time (min)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        style={{
                          backgroundColor: '#171717',
                          borderColor: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Estimated minutes
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger
                          style={{
                            backgroundColor: '#171717',
                            borderColor: '#2a2a2a',
                            color: '#ffffff',
                            fontSize: '13px'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                        <SelectItem value="true" className="cms-text-secondary" style={{ fontSize: '13px' }}>
                          Published
                        </SelectItem>
                        <SelectItem value="false" className="cms-text-secondary" style={{ fontSize: '13px' }}>
                          Draft
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Publication status
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="h-10 px-5 cms-card cms-border cms-text-secondary"
                style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="h-10 px-5 cms-card cms-border cms-text-secondary"
                style={{
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create Post'
                  : 'Update Post'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
