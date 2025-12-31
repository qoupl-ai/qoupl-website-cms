import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { FeatureList } from '@/components/cms/feature-list'
import { FeatureDialog } from '@/components/cms/feature-dialog'

export default async function FeaturesPage() {
  const supabase = await createClient()

  // Fetch all features with category information
  const { data: features } = await supabase
    .from('features')
    .select(`
      *,
      category:feature_categories(id, name, slug)
    `)
    .order('category_id', { ascending: true })
    .order('order_index', { ascending: true })

  // Fetch all categories for the dropdown
  const { data: categories } = await supabase
    .from('feature_categories')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
            Features
          </h1>
          <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Manage app features and highlights
          </p>
        </div>
        <FeatureDialog categories={categories || []} mode="create">
          <Button
            className="h-10 px-5 cms-card cms-border cms-text-secondary"
            style={{ 
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Feature
          </Button>
        </FeatureDialog>
      </div>

      <Card className="cms-card cms-border border">
        <CardHeader>
          <CardTitle className="cms-text-primary" style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}>
            All Features ({features?.length || 0})
          </CardTitle>
          <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Edit, reorder, or delete features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FeatureList features={features || []} categories={categories || []} />
        </CardContent>
      </Card>
    </div>
  )
}
