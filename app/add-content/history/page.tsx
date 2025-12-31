import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HistoryList } from '@/components/cms/history-list'

export default async function HistoryPage() {
  await assertAdmin()
  const supabase = await createClient()

  // Fetch content history
  const { data: history, error } = await supabase
    .from('content_history')
    .select('*')
    .order('performed_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching history:', error)
  }

  // Fetch admin user details and entity details for each history entry
  const historyWithDetails = await Promise.all(
    (history || []).map(async (item) => {
      let adminDetails: { name: string; email: string } | null = null
      let entityDetails: any = null
      
      // Fetch admin user details
      if (item.performed_by) {
        try {
          const { data: adminUser } = await supabase
            .from('admin_users')
            .select('name, email')
            .eq('user_id', item.performed_by)
            .single()
          
          if (adminUser) {
            adminDetails = {
              name: adminUser.name || 'Admin',
              email: adminUser.email || 'Unknown',
            }
          }
        } catch (err) {
          console.error('Error fetching admin details:', err)
        }
      }
      
      // Fetch entity details based on type
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
      } catch (err) {
        console.error(`Error fetching entity details for ${item.entity_type}:`, err)
      }
      
      return {
        ...item,
        admin: adminDetails,
        entityDetails,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
          Content History
        </h1>
        <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
          View all content changes and updates ({historyWithDetails?.length || 0} entries)
        </p>
      </div>

      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All Activity
          </CardTitle>
          <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Complete history of content modifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistoryList history={historyWithDetails || []} />
        </CardContent>
      </Card>
    </div>
  )
}
