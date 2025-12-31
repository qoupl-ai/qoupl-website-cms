/**
 * Unified Page Editor
 * 
 * Generic page editor that works for any page type.
 * Replaces page-specific editors.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { createPage, updatePage, type CreatePageInput, type UpdatePageInput } from '@/app/actions/page-actions'

interface PageEditorProps {
  page?: {
    slug: string
    title: string
    description?: string
    published: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PageEditor({ page, open, onOpenChange }: PageEditorProps) {
  const router = useRouter()
  const isEditing = !!page
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    slug: page?.slug || '',
    title: page?.title || '',
    description: page?.description || '',
    published: page?.published ?? false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        const updateData: UpdatePageInput = {
          title: formData.title,
          description: formData.description || undefined,
          published: formData.published,
        }
        await updatePage(page.slug, updateData)
        toast.success('Page updated successfully')
      } else {
        const createData: CreatePageInput = {
          slug: formData.slug,
          title: formData.title,
          description: formData.description || undefined,
          published: formData.published,
        }
        await createPage(createData)
        toast.success('Page created successfully')
      }

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save page')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl cms-card cms-border"
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
            {isEditing ? 'Edit Page' : 'Create Page'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {isEditing
              ? 'Update page information and settings.'
              : 'Create a new page for your website.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="about"
                required
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
              <p className="text-sm text-muted-foreground">
                URL-friendly identifier (e.g., "about", "contact")
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="About Us"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Page description for SEO"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published">Published</Label>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
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
              disabled={loading}
              className="h-10 px-5 cms-card cms-border cms-text-secondary"
              style={{
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

