import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { BlogList } from '@/components/cms/blog-list'
import { BlogDialog } from '@/components/cms/blog-dialog'

export default async function BlogPage() {
  const supabase = await createClient()

  // Fetch all blog posts with category information
  const { data: posts } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(id, name, slug)
    `)
    .order('publish_date', { ascending: false })

  // Fetch all categories for the dropdown
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name', { ascending: true })

  // Normalize category data - ensure it's always an object, not an array
  const normalizedPosts = (posts || []).map((post: any) => {
    const category = Array.isArray(post.category) ? post.category[0] : post.category
    return {
      ...post,
      category: category || null
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
            Blog Posts
          </h1>
          <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Manage blog content and articles
          </p>
        </div>
        <BlogDialog categories={categories || []} mode="create">
          <Button
            className="h-10 px-5 cms-card cms-border cms-text-secondary"
            style={{ 
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </BlogDialog>
      </div>

      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All Posts ({normalizedPosts.length})
          </CardTitle>
          <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Edit, publish, or delete blog posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogList posts={normalizedPosts as any} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
