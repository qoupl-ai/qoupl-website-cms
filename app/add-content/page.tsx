import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Sparkles, DollarSign, Image as ImageIcon, Users } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CMSDashboard() {
  const supabase = await createClient()

  // Get counts for all content types
  const [
    { count: blogCount },
    { count: faqCount },
    { count: featureCount },
    { count: pricingCount },
    { count: mediaCount },
    { count: waitlistCount },
  ] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('faqs').select('*', { count: 'exact', head: true }),
    supabase.from('features').select('*', { count: 'exact', head: true }),
    supabase.from('pricing_plans').select('*', { count: 'exact', head: true }),
    supabase.from('media').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist_signups').select('*', { count: 'exact', head: true }),
  ])

  // Get recent activity with entity details
  const { data: recentHistory } = await supabase
    .from('content_history')
    .select('*')
    .order('performed_at', { ascending: false })
    .limit(5)

  // Fetch entity details for each history entry
  const historyWithDetails = await Promise.all(
    (recentHistory || []).map(async (item) => {
      let entityDetails: any = null
      
      try {
        if (item.entity_type === 'sections') {
          const { data: section } = await supabase
            .from('sections')
            .select(`
              id,
              component_type,
              content,
              page_id,
              pages!inner(slug, title)
            `)
            .eq('id', item.entity_id)
            .single()
          
          if (section) {
            const pagesData = Array.isArray(section.pages) ? section.pages[0] : (section.pages as any)
            const pageTitle = pagesData?.title
            const pageSlug = pagesData?.slug
            const sectionTitle = section.content?.title || 
                                section.content?.name || 
                                section.content?.heading ||
                                section.component_type
            
            entityDetails = {
              type: 'section',
              title: sectionTitle,
              componentType: section.component_type,
              pageTitle: pageTitle,
              pageSlug: pageSlug,
              content: section.content,
            }
          }
        } else if (item.entity_type === 'pages') {
          const { data: page } = await supabase
            .from('pages')
            .select('id, slug, title')
            .eq('id', item.entity_id)
            .single()
          
          if (page) {
            entityDetails = {
              type: 'page',
              title: page.title,
              slug: page.slug,
            }
          }
        } else if (item.entity_type === 'blog_posts') {
          const { data: post } = await supabase
            .from('blog_posts')
            .select('id, title, slug')
            .eq('id', item.entity_id)
            .single()
          
          if (post) {
            entityDetails = {
              type: 'blog_post',
              title: post.title,
              slug: post.slug,
            }
          }
        } else if (item.entity_type === 'faqs') {
          const { data: faq } = await supabase
            .from('faqs')
            .select('id, question')
            .eq('id', item.entity_id)
            .single()
          
          if (faq) {
            entityDetails = {
              type: 'faq',
              title: faq.question,
            }
          }
        } else if (item.entity_type === 'features') {
          const { data: feature } = await supabase
            .from('features')
            .select('id, title')
            .eq('id', item.entity_id)
            .single()
          
          if (feature) {
            entityDetails = {
              type: 'feature',
              title: feature.title,
            }
          }
        } else if (item.entity_type === 'pricing_plans') {
          const { data: plan } = await supabase
            .from('pricing_plans')
            .select('id, name')
            .eq('id', item.entity_id)
            .single()
          
          if (plan) {
            entityDetails = {
              type: 'pricing_plan',
              title: plan.name,
            }
          }
        }
      } catch (error) {
        console.error(`Error fetching details for ${item.entity_type}:`, error)
      }
      
      return {
        ...item,
        entityDetails,
      }
    })
  )

  const stats = [
    {
      title: 'Blog Posts',
      count: blogCount || 0,
      icon: FileText,
      href: '/add-content/blog',
    },
    {
      title: 'FAQs',
      count: faqCount || 0,
      icon: MessageSquare,
      href: '/add-content/faqs',
    },
    {
      title: 'Features',
      count: featureCount || 0,
      icon: Sparkles,
      href: '/add-content/features',
    },
    {
      title: 'Pricing Plans',
      count: pricingCount || 0,
      icon: DollarSign,
      href: '/add-content/pricing',
    },
    {
      title: 'Media Files',
      count: mediaCount || 0,
      icon: ImageIcon,
      href: '/add-content/media',
    },
    {
      title: 'Waitlist Signups',
      count: waitlistCount || 0,
      icon: Users,
      href: '/add-content/waitlist',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2 cms-text-primary">
          CMS Dashboard
        </h1>
        <p className="text-sm cms-text-secondary">
          Manage all your website content from one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="transition-all cursor-pointer cms-card cms-border border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium cms-text-secondary">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 cms-text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold cms-text-primary">
                    {stat.count}
                  </div>
                  <p className="text-xs mt-1 cms-text-secondary">
                    Total items
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary">Recent Activity</CardTitle>
          <CardDescription className="cms-text-secondary">
            Latest content updates and changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyWithDetails && historyWithDetails.length > 0 ? (
            <div className="space-y-4">
              {historyWithDetails.map((item) => {
                const getActionColor = (action: string) => {
                  switch (action) {
                    case 'created': return '#10b981'
                    case 'updated': return '#3b82f6'
                    case 'deleted': return '#ef4444'
                    case 'published': return '#10b981'
                    case 'unpublished': return '#f59e0b'
                    default: return '#898989'
                  }
                }

                const getEntityTypeLabel = (entityType: string) => {
                  const labels: Record<string, string> = {
                    'sections': 'Section',
                    'pages': 'Page',
                    'blog_posts': 'Blog Post',
                    'faqs': 'FAQ',
                    'features': 'Feature',
                    'pricing_plans': 'Pricing Plan',
                  }
                  return labels[entityType] || entityType
                }

                return (
                  <div
                    key={item.id}
                    className="pb-4 last:pb-0 cms-border border-b"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: getActionColor(item.action) + '20',
                              color: getActionColor(item.action),
                            }}
                          >
                            {item.action.charAt(0).toUpperCase() + item.action.slice(1)}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded cms-card-bg cms-text-secondary">
                            {getEntityTypeLabel(item.entity_type)}
                          </span>
                        </div>
                        
                        {item.entityDetails ? (
                          <div className="mt-2">
                            {item.entityDetails.type === 'section' && (
                              <>
                                <p className="font-medium text-sm mb-1 cms-text-primary">
                                  {item.entityDetails.title || item.entityDetails.componentType}
                                </p>
                                <p className="text-xs cms-text-secondary">
                                  on <span style={{ color: '#662D91' }}>{item.entityDetails.pageTitle || item.entityDetails.pageSlug}</span> page
                                </p>
                                {item.entityDetails.componentType && (
                                  <p className="text-xs mt-0.5 cms-text-tertiary">
                                    Type: {item.entityDetails.componentType.replace(/-/g, ' ')}
                                  </p>
                                )}
                              </>
                            )}
                            {item.entityDetails.type === 'page' && (
                              <p className="font-medium text-sm cms-text-primary">
                                {item.entityDetails.title} ({item.entityDetails.slug})
                              </p>
                            )}
                            {item.entityDetails.type === 'blog_post' && (
                              <p className="font-medium text-sm cms-text-primary">
                                {item.entityDetails.title}
                              </p>
                            )}
                            {item.entityDetails.type === 'faq' && (
                              <p className="font-medium text-sm cms-text-primary">
                                {item.entityDetails.title}
                              </p>
                            )}
                            {item.entityDetails.type === 'feature' && (
                              <p className="font-medium text-sm cms-text-primary">
                                {item.entityDetails.title}
                              </p>
                            )}
                            {item.entityDetails.type === 'pricing_plan' && (
                              <p className="font-medium text-sm cms-text-primary">
                                {item.entityDetails.title}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm mt-1 cms-text-secondary">
                            {item.entity_type} (ID: {item.entity_id.slice(0, 8)}...)
                          </p>
                        )}
                        
                        <p className="text-xs mt-2 cms-text-tertiary">
                          {new Date(item.performed_at).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
              <Link href="/add-content/history" className="mt-4 block">
                <Button 
                  variant="outline" 
                  className="w-full h-10 cms-card cms-border cms-text-secondary"
                >
                  View All History
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-sm cms-text-secondary">
              No recent activity to display
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary">Quick Actions</CardTitle>
          <CardDescription className="cms-text-secondary">
            Common tasks and operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/add-content/blog">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <FileText className="mr-2 h-4 w-4" />
                Create Blog Post
              </Button>
            </Link>
            <Link href="/add-content/faqs">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Add FAQ
              </Button>
            </Link>
            <Link href="/add-content/features">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Add Feature
              </Button>
            </Link>
            <Link href="/add-content/media">
              <Button 
                variant="outline" 
                className="w-full justify-start h-10 cms-card cms-border cms-text-secondary"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Media
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
