import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaGrid } from '@/components/cms/media-grid'
import { MediaUpload } from '@/components/cms/media-upload'
import { getStorageUrl } from '@/lib/supabase/storage'

export default async function MediaPage() {
  const supabase = await createClient()

  // Fetch all media from database
  const { data: mediaFiles } = await supabase
    .from('media')
    .select('*')
    .order('uploaded_at', { ascending: false })

  // Add URLs to media files
  const mediaWithUrls = mediaFiles?.map(file => ({
    ...file,
    url: getStorageUrl(file.bucket_name, file.storage_path)
  })) || []

  // Group by category
  const groupedMedia: Record<string, typeof mediaWithUrls> = {}
  mediaWithUrls.forEach(file => {
    const category = file.category || 'uncategorized'
    if (!groupedMedia[category]) {
      groupedMedia[category] = []
    }
    groupedMedia[category].push(file)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1.5 cms-text-primary" style={{ fontWeight: '600', fontSize: '20px', lineHeight: '1.3' }}>
            Media Library
          </h1>
          <p className="text-sm cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
            Browse and manage images from Supabase Storage ({mediaWithUrls.length} files)
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <MediaUpload />

      {Object.entries(groupedMedia).map(([category, files]) => (
        <Card 
          key={category}
          className="cms-card cms-border border"
        >
          <CardHeader>
            <CardTitle 
              className="capitalize cms-text-primary" 
              style={{ fontWeight: '600', fontSize: '16px', lineHeight: '1.4' }}
            >
              {category} ({files.length})
            </CardTitle>
            <CardDescription className="cms-text-secondary" style={{ fontSize: '13px', lineHeight: '1.5' }}>
              Images stored in Supabase Storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGrid media={files} />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
