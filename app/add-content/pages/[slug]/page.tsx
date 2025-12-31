/**
 * Page Editor - Sections Management
 * 
 * Edit a specific page and its sections.
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, ArrowLeft, GripVertical, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import SectionEditorButton from '@/components/cms/section-editor-button'
import SortableSectionsList from '@/components/cms/sortable-sections-list'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PageEditorPage({ params }: PageProps) {
  await assertAdmin()
  const supabase = await createClient()
  const { slug } = await params

  // Fetch page
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .single()

  if (pageError) {
    console.error(`[PageEditor] Error fetching page "${slug}":`, pageError)
    notFound()
  }

  if (!page) {
    console.error(`[PageEditor] Page "${slug}" not found`)
    notFound()
  }

  // Fetch sections for this page - get ALL sections (published and unpublished) for CMS editing
  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .eq('page_id', page.id)
    .order('order_index', { ascending: true })

  if (sectionsError) {
    console.error(`[PageEditor] Error fetching sections for page "${slug}":`, sectionsError)
    // Don't throw - show empty state instead
  }

  // Ensure sections is always an array
  const safeSections = Array.isArray(sections) ? sections : []
  const hasSections = safeSections.length > 0

  // For blog page, fetch blog posts to show what will be displayed
  let blogPosts: any[] = []
  if (slug === 'blog') {
    const { data: posts } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        published,
        publish_date,
        category:blog_categories(id, name)
      `)
      .order('publish_date', { ascending: false })
      .limit(10)
    
    blogPosts = posts || []
  }

  return (
    <div className="min-h-screen cms-main-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/add-content/pages">
              <Button 
                variant="ghost" 
                size="sm"
                className="cms-text-secondary"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-semibold mb-2 cms-text-primary">
                {page.title}
              </h1>
              <p className="text-sm cms-text-secondary">
                /{page.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {slug === 'blog' && (
              <Link href="/add-content/blog">
                <Button
                  variant="outline"
                  size="sm"
                  className="cms-card cms-border cms-text-secondary"
                  style={{ fontSize: '13px' }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Posts
                </Button>
              </Link>
            )}
            <SectionEditorButton pageId={page.id} />
          </div>
        </div>

        {/* Blog Posts Preview for Blog Page */}
        {slug === 'blog' && blogPosts.length > 0 && (
          <Card className="mb-6 cms-card cms-border border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="cms-text-primary" style={{ fontSize: '18px', fontWeight: '600' }}>
                    Blog Posts ({blogPosts.length})
                  </CardTitle>
                  <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', marginTop: '4px' }}>
                    These posts will be displayed on the blog page
                  </CardDescription>
                </div>
                <Link href="/add-content/blog">
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: '#662D91', fontSize: '13px' }}
                  >
                    View All
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {blogPosts.map((post) => {
                  const category = Array.isArray(post.category) ? post.category[0] : post.category
                  return (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-3 rounded-lg cms-main-bg cms-border border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate cms-text-primary">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {category && (
                            <span className="text-xs px-2 py-0.5 rounded cms-card-bg cms-text-secondary">
                              {category.name}
                            </span>
                          )}
                          <span 
                            className="text-xs"
                            style={{ color: post.published ? '#10b981' : '#6b7280' }}
                          >
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <Link href={`/add-content/blog`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cms-text-secondary"
                          style={{ fontSize: '12px' }}
                        >
                          Edit
                        </Button>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {hasSections ? (
          <>
            <div className="mb-6 p-4 rounded-lg border cms-card cms-border">
              <p className="text-sm flex items-center gap-2 cms-text-secondary">
                <GripVertical className="h-4 w-4" style={{ color: '#662D91' }} />
                <span>
                  <strong className="cms-text-primary">Tip:</strong> Drag sections by the grip icon to reorder them. Changes save automatically.
                </span>
              </p>
            </div>
            <SortableSectionsList sections={safeSections} pageId={page.id} pageSlug={page.slug} />
          </>
        ) : (
          <Card className="cms-card cms-border border">
            <CardHeader>
              <CardTitle className="cms-text-primary" style={{ fontSize: '18px', fontWeight: '600' }}>
                No Sections
              </CardTitle>
              <CardDescription className="cms-text-secondary" style={{ fontSize: '13px' }}>
                {slug === 'blog' 
                  ? 'This page displays blog posts directly. Use the "Manage Posts" button above to add or edit blog posts.'
                  : `This page doesn't have any sections yet. Create your first section to get started.${slug === 'pricing' ? ' For pricing page, you can add: pricing-hero, pricing-plans, free-messages, message-bundles, pricing-info, and pricing-faq sections.' : ''}`}
              </CardDescription>
            </CardHeader>
            {slug !== 'blog' && (
              <CardContent className="py-8 text-center">
                <p className="mb-6 text-sm cms-text-secondary">
                  Sections are the building blocks of your page. Add a hero section, content blocks, or any other component type.
                </p>
                <SectionEditorButton pageId={page.id} />
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}
