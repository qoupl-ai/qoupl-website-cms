/**
 * Global Content Editor
 * 
 * Edit navbar, footer, social links, contact info, and site config.
 */

import { createClient } from '@/lib/supabase/server'
import { assertAdmin } from '@/lib/auth/assert-admin'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Link2, FileText, Smartphone, Mail, Settings } from 'lucide-react'
import GlobalContentEditor from '@/components/cms/global-content-editor'

export default async function GlobalContentPage() {
  await assertAdmin()
  const supabase = await createClient()

  // Fetch all global content
  const { data: globalContent, error } = await supabase
    .from('global_content')
    .select('*')
    .order('key', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch global content: ${error.message}`)
  }

  // Fetch all pages for the page selector
  const { data: pages } = await supabase
    .from('pages')
    .select('slug, title')
    .order('slug', { ascending: true })

  // Organize content by key
  const contentMap = new Map(globalContent?.map(item => [item.key, item]) || [])

  const contentItems = [
    {
      key: 'navbar',
      title: 'Navigation Bar',
      description: 'Edit navigation links and logo',
      icon: Link2,
    },
    {
      key: 'footer',
      title: 'Footer',
      description: 'Edit footer links, description, and copyright',
      icon: FileText,
    },
    {
      key: 'social_links',
      title: 'Social Links',
      description: 'Edit social media links (LinkedIn, Instagram)',
      icon: Smartphone,
    },
    {
      key: 'contact_info',
      title: 'Contact Information',
      description: 'Edit contact email, phone, and address',
      icon: Mail,
    },
    {
      key: 'site_config',
      title: 'Site Configuration',
      description: 'Edit site-wide settings (tagline, waitlist count)',
      icon: Settings,
    },
  ]

  return (
    <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
            Global Content
          </h1>
          <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Edit site-wide content that appears on all pages
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item) => {
            const content = contentMap.get(item.key)
            return (
              <Card 
                key={item.key} 
                className="transition-all cms-card cms-border border"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 cms-text-primary">
                    <item.icon className="h-5 w-5 cms-text-secondary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription className="cms-text-secondary">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {content ? (
                      <p className="text-sm cms-text-secondary">
                        Last updated: {new Date(content.updated_at).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-sm cms-text-secondary">
                        Not configured yet
                      </p>
                    )}
                    <GlobalContentEditor
                      key={item.key}
                      contentKey={item.key}
                      existingContent={content}
                      pages={pages || []}
                    >
                      <Button 
                        variant="outline" 
                        className="w-full h-10 cms-card cms-border cms-text-secondary"
                        style={{ 
                          fontWeight: '600',
                          fontSize: '14px'
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {content ? 'Edit' : 'Create'}
                      </Button>
                    </GlobalContentEditor>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
    </div>
  )
}
