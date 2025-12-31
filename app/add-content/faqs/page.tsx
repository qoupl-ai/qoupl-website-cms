import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { FAQList } from '@/components/cms/faq-list'
import { FAQDialog } from '@/components/cms/faq-dialog'

export default async function FAQsPage() {
  const supabase = await createClient()

  // Fetch all FAQs with category information
  const { data: faqs } = await supabase
    .from('faqs')
    .select(`
      *,
      category:faq_categories(id, name, slug)
    `)
    .order('category_id', { ascending: true })
    .order('order_index', { ascending: true })

  // Fetch all categories for the dropdown
  const { data: categories } = await supabase
    .from('faq_categories')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
            FAQs
          </h1>
          <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Manage frequently asked questions across all categories
          </p>
        </div>
        <FAQDialog categories={categories || []} mode="create">
          <Button
            className="h-10 px-5 cms-card cms-border cms-text-secondary"
            style={{ 
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add FAQ
          </Button>
        </FAQDialog>
      </div>

      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All FAQs ({faqs?.length || 0})
          </CardTitle>
          <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Edit, reorder, or delete existing FAQs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQList faqs={faqs || []} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
