/**
 * Global Content Editor
 * 
 * Visual editor for global content items (navbar, footer, etc.)
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, GripVertical, Linkedin, Instagram, Twitter, Facebook, Youtube, Github, Globe } from 'lucide-react'
import { IconSelector } from '@/components/cms/icon-selector'
import { toast } from 'sonner'
import { updateGlobalContent } from '@/app/actions/global-content-actions'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageSelector } from '@/components/cms/page-selector'
import { ImageUploadField } from '@/components/cms/image-upload-field'

interface Page {
  slug: string
  title: string
}

interface GlobalContentEditorProps {
  contentKey: string
  existingContent?: {
    id: string
    key: string
    content: any
    updated_at: string
  }
  pages?: Page[]
  children: React.ReactNode
}

function SortableLinkItem({ link, index, onUpdate, onDelete, pages }: {
  link: { href: string; label: string }
  index: number
  onUpdate: (index: number, field: string, value: string) => void
  onDelete: (index: number) => void
  pages: Page[]
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 w-full">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 flex items-center justify-center cms-text-secondary"
        style={{ minWidth: '24px' }}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <PageSelector
          value={link.href}
          onChange={(value) => onUpdate(index, 'href', value)}
          pages={pages}
          placeholder="Select a page..."
        />
      </div>
      <Input
        value={link.label}
        onChange={(e) => onUpdate(index, 'label', e.target.value)}
        placeholder="Link Label"
        className="flex-1 min-w-0"
        style={{
          backgroundColor: '#171717',
          borderColor: '#2a2a2a',
          color: '#ffffff',
          fontSize: '13px',
          height: '40px',
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onDelete(index)}
        className="h-10 w-10 p-0 flex-shrink-0"
        style={{ color: '#ef4444' }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default function GlobalContentEditor({
  contentKey,
  existingContent,
  pages = [],
  children,
}: GlobalContentEditorProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize form state based on content type
  const [formData, setFormData] = useState<any>(() => {
    if (!existingContent?.content) {
      return getDefaultContent(contentKey)
    }
    // Handle backward compatibility for social_links
    if (contentKey === 'social_links') {
      const content = existingContent.content
      // Convert old format { linkedin, instagram } to new format { links: [...] }
      if (content.linkedin || content.instagram) {
        const links: any[] = []
        if (content.linkedin) {
          links.push({ icon: 'Linkedin', url: content.linkedin, label: 'LinkedIn' })
        }
        if (content.instagram) {
          links.push({ icon: 'Instagram', url: content.instagram, label: 'Instagram' })
        }
        return { links }
      }
      // New format
      if (content.links && Array.isArray(content.links)) {
        return content
      }
      return getDefaultContent(contentKey)
    }
    return existingContent.content
  })

  useEffect(() => {
    if (existingContent?.content) {
      // Handle backward compatibility for social_links
      if (contentKey === 'social_links') {
        const content = existingContent.content
        // Convert old format { linkedin, instagram } to new format { links: [...] }
        if (content.linkedin || content.instagram) {
          const links: any[] = []
          if (content.linkedin) {
            links.push({ icon: 'Linkedin', url: content.linkedin, label: 'LinkedIn' })
          }
          if (content.instagram) {
            links.push({ icon: 'Instagram', url: content.instagram, label: 'Instagram' })
          }
          setFormData({ links })
        } else if (content.links && Array.isArray(content.links) && content.links.length > 0) {
          // New format with existing links
          setFormData(content)
        } else {
          // No links yet, use default
          setFormData(getDefaultContent(contentKey))
        }
      } else {
        setFormData(existingContent.content)
      }
    } else {
      setFormData(getDefaultContent(contentKey))
    }
  }, [existingContent, contentKey])

  function getDefaultContent(key: string): any {
    switch (key) {
      case 'navbar':
        return {
          links: [{ href: '/', label: 'Home' }],
          logo: { src: '/images/quoupl.svg', alt: 'qoupl', width: 120, height: 40 },
        }
      case 'footer':
        return {
          brand: {
            description: '',
            logo: { src: '/images/quoupl.svg', alt: 'qoupl', width: 120, height: 40 },
          },
          columns: {
            product: { title: 'Product', links: [] },
            company: { title: 'Company', links: [] },
            legal: { title: 'Legal', links: [] },
          },
          copyright: { text: '', company: '' },
        }
      case 'social_links':
        return { links: [] }
      case 'contact_info':
        return { email: '', phone: '', address: '', support_email: '' }
      case 'site_config':
        return { waitlist_count: 10000, tagline: '', subtitle: '' }
      default:
        return {}
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      await updateGlobalContent(contentKey, formData)
      toast.success(`${getContentTitle(contentKey)} updated successfully`)
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  function getContentTitle(key: string): string {
    const titles: Record<string, string> = {
      navbar: 'Navigation Bar',
      footer: 'Footer',
      social_links: 'Social Links',
      contact_info: 'Contact Information',
      site_config: 'Site Configuration',
    }
    return titles[key] || key
  }

  const handleDragEnd = (event: DragEndEvent, links: any[], setLinks: (links: any[]) => void) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex((_, i) => i === active.id)
    const newIndex = links.findIndex((_, i) => i === over.id)
    setLinks(arrayMove(links, oldIndex, newIndex))
  }

  const renderEditor = () => {
    switch (contentKey) {
      case 'navbar':
        return (
          <div className="space-y-6">
            {/* Logo */}
            <div className="space-y-4">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Logo
              </label>
              <ImageUploadField
                value={formData.logo?.src || ''}
                onChange={(src) => setFormData({
                  ...formData,
                  logo: { ...formData.logo, src },
                })}
                bucket="user-uploads"
                label="Logo Image"
                description="Upload your logo image (SVG, PNG, or JPG). You can also use existing images from /images/ folder."
              />
              <div>
                <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Alt Text</Label>
                <Input
                  value={formData.logo?.alt || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    logo: { ...formData.logo, alt: e.target.value },
                  })}
                  placeholder="qoupl"
                  style={{
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Navigation Links
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({
                    ...formData,
                    links: [...(formData.links || []), { href: '', label: '' }],
                  })}
                  className="h-8 px-3 text-xs cms-text-secondary"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Link
                </Button>
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, formData.links || [], (newLinks) => {
                  setFormData({ ...formData, links: newLinks })
                })}
              >
                <SortableContext
                  items={(formData.links || []).map((_: any, i: number) => i)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {(formData.links || []).map((link: any, index: number) => (
                      <SortableLinkItem
                        key={index}
                        link={link}
                        index={index}
                        pages={pages}
                        onUpdate={(idx, field, value) => {
                          const newLinks = [...(formData.links || [])]
                          newLinks[idx] = { ...newLinks[idx], [field]: value }
                          setFormData({ ...formData, links: newLinks })
                        }}
                        onDelete={(idx) => {
                          const newLinks = (formData.links || []).filter((_: any, i: number) => i !== idx)
                          setFormData({ ...formData, links: newLinks })
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )

      case 'footer':
        return (
          <div className="space-y-6">
            {/* Brand Section */}
            <div className="space-y-3 p-4 rounded-lg cms-card-bg cms-border border">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Brand Section
              </label>
              <div>
                <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Description</Label>
                <Textarea
                  value={formData.brand?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    brand: { ...formData.brand, description: e.target.value },
                  })}
                  rows={3}
                  placeholder="Brand description"
                  style={{
                    fontSize: '13px',
                  }}
                />
              </div>
              <ImageUploadField
                value={formData.brand?.logo?.src || ''}
                onChange={(src) => setFormData({
                  ...formData,
                  brand: {
                    ...formData.brand,
                    logo: { ...formData.brand?.logo, src },
                  },
                })}
                bucket="user-uploads"
                label="Logo Image"
                description="Upload your logo image (SVG, PNG, or JPG). You can also use existing images from /images/ folder."
              />
              <div>
                <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Alt Text</Label>
                <Input
                  value={formData.brand?.logo?.alt || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    brand: {
                      ...formData.brand,
                      logo: { ...formData.brand?.logo, alt: e.target.value },
                    },
                  })}
                  placeholder="qoupl"
                  style={{
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>

            {/* Footer Columns */}
            {['product', 'company', 'legal'].map((columnKey) => (
              <div key={columnKey} className="space-y-3 p-4 rounded-lg cms-card-bg cms-border border">
                <div className="flex items-center justify-between">
                  <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    {formData.columns?.[columnKey]?.title || columnKey.charAt(0).toUpperCase() + columnKey.slice(1)} Column
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newLinks = [...(formData.columns?.[columnKey]?.links || []), { href: '', label: '' }]
                      setFormData({
                        ...formData,
                        columns: {
                          ...formData.columns,
                          [columnKey]: { ...formData.columns?.[columnKey], links: newLinks },
                        },
                      })
                    }}
                    className="h-8 px-3 text-xs cms-text-secondary"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Link
                  </Button>
                </div>
                <div>
                  <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Column Title</Label>
                  <Input
                    value={formData.columns?.[columnKey]?.title || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      columns: {
                        ...formData.columns,
                        [columnKey]: { ...formData.columns?.[columnKey], title: e.target.value },
                      },
                    })}
                    placeholder={columnKey.charAt(0).toUpperCase() + columnKey.slice(1)}
                    style={{
                      fontSize: '13px',
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {(formData.columns?.[columnKey]?.links || []).map((link: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1">
                        <PageSelector
                          value={link.href || ''}
                          onChange={(value) => {
                            const newLinks = [...(formData.columns?.[columnKey]?.links || [])]
                            newLinks[index] = { ...newLinks[index], href: value }
                            setFormData({
                              ...formData,
                              columns: {
                                ...formData.columns,
                                [columnKey]: { ...formData.columns?.[columnKey], links: newLinks },
                              },
                            })
                          }}
                          pages={pages}
                          placeholder="Select a page..."
                        />
                      </div>
                      <Input
                        value={link.label || ''}
                        onChange={(e) => {
                          const newLinks = [...(formData.columns?.[columnKey]?.links || [])]
                          newLinks[index] = { ...newLinks[index], label: e.target.value }
                          setFormData({
                            ...formData,
                            columns: {
                              ...formData.columns,
                              [columnKey]: { ...formData.columns?.[columnKey], links: newLinks },
                            },
                          })
                        }}
                        placeholder="About"
                        className="flex-1"
                        style={{
                          fontSize: '13px',
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLinks = (formData.columns?.[columnKey]?.links || []).filter((_: any, i: number) => i !== index)
                          setFormData({
                            ...formData,
                            columns: {
                              ...formData.columns,
                              [columnKey]: { ...formData.columns?.[columnKey], links: newLinks },
                            },
                          })
                        }}
                        className="h-8 w-8 p-0"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Copyright */}
            <div className="space-y-3 p-4 rounded-lg cms-card-bg cms-border border">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Copyright
              </label>
              <div>
                <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Copyright Text</Label>
                <Input
                  value={formData.copyright?.text || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    copyright: { ...formData.copyright, text: e.target.value },
                  })}
                  placeholder="Made for meaningful connections"
                  style={{
                    fontSize: '13px',
                  }}
                />
              </div>
              <div>
                <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Company Name</Label>
                <Input
                  value={formData.copyright?.company || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    copyright: { ...formData.copyright, company: e.target.value },
                  })}
                  placeholder="qoupl by Xencus Technologies Private Limited"
                  style={{
                    fontSize: '13px',
                  }}
                />
              </div>
            </div>
          </div>
        )

      case 'social_links':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Social Media Links
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFormData({
                  ...formData,
                  links: [...(formData.links || []), { icon: 'Globe', url: '', label: '' }],
                })}
                className="h-8 px-3 text-xs cms-text-secondary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Link
              </Button>
            </div>
            <div className="space-y-3">
              {(formData.links || []).map((link: any, index: number) => (
                <div key={index} className="p-4 rounded-lg border cms-card-bg cms-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <label className="cms-text-secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Icon</label>
                      <IconSelector
                        value={link.icon || 'Globe'}
                        onChange={(icon) => {
                          const newLinks = [...(formData.links || [])]
                          newLinks[index] = { ...newLinks[index], icon }
                          setFormData({ ...formData, links: newLinks })
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>Label (Optional)</Label>
                      <Input
                        value={link.label || ''}
                        onChange={(e) => {
                          const newLinks = [...(formData.links || [])]
                          newLinks[index] = { ...newLinks[index], label: e.target.value }
                          setFormData({ ...formData, links: newLinks })
                        }}
                        placeholder="LinkedIn"
                        style={{
                          fontSize: '13px',
                          height: '40px',
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newLinks = (formData.links || []).filter((_: any, i: number) => i !== index)
                        setFormData({ ...formData, links: newLinks })
                      }}
                      className="h-10 w-10 p-0 flex-shrink-0"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label className="cms-text-secondary" style={{ fontSize: '12px' }}>URL</Label>
                    <Input
                      value={link.url || ''}
                      onChange={(e) => {
                        const newLinks = [...(formData.links || [])]
                        newLinks[index] = { ...newLinks[index], url: e.target.value }
                        setFormData({ ...formData, links: newLinks })
                      }}
                      placeholder="https://www.linkedin.com/company/qoupl-ai/"
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px',
                        height: '40px',
                      }}
                    />
                  </div>
                </div>
              ))}
              {(!formData.links || formData.links.length === 0) && (
                <div className="text-center py-8 rounded-lg border border-dashed cms-border">
                  <p className="cms-text-secondary" style={{ fontSize: '13px' }}>No social links added yet</p>
                  <p className="cms-text-secondary" style={{ fontSize: '12px', marginTop: '4px' }}>Click "Add Link" to add your first social media link</p>
                </div>
              )}
            </div>
          </div>
        )

      case 'contact_info':
        return (
          <div className="space-y-4">
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Email</Label>
              <Input
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="support@qoupl.ai"
                type="email"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Support Email</Label>
              <Input
                value={formData.support_email || ''}
                onChange={(e) => setFormData({ ...formData, support_email: e.target.value })}
                placeholder="help@qoupl.ai"
                type="email"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Phone</Label>
              <Input
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9103732229"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Address</Label>
              <Textarea
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                placeholder="B-98, Sector-2, Noida, UP 201301"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        )

      case 'site_config':
        return (
          <div className="space-y-4">
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Waitlist Count</Label>
              <Input
                value={formData.waitlist_count || ''}
                onChange={(e) => setFormData({ ...formData, waitlist_count: parseInt(e.target.value) || 0 })}
                type="number"
                placeholder="10000"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Tagline</Label>
              <Input
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Be couple with qoupl"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
            <div>
              <Label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Subtitle</Label>
              <Textarea
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                rows={3}
                placeholder="Find your vibe. Match your energy. Connect for real."
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                  fontSize: '13px',
                }}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
              Content (JSON)
            </Label>
            <Textarea
              value={JSON.stringify(formData, null, 2)}
              onChange={(e) => {
                try {
                  setFormData(JSON.parse(e.target.value))
                } catch (err) {
                  // Invalid JSON, ignore
                }
              }}
              rows={20}
              className="font-mono text-sm"
              placeholder='{"key": "value"}'
              style={{
                backgroundColor: '#171717',
                borderColor: '#2a2a2a',
                color: '#ffffff',
                fontSize: '13px',
                fontFamily: "'Google Sans Flex', system-ui, sans-serif"
              }}
            />
          </div>
        )
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Dialog open={open} onOpenChange={setOpen}>
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
              Edit {getContentTitle(contentKey)}
            </DialogTitle>
            <DialogDescription 
              className="cms-text-secondary"
              style={{ 
                fontSize: '13px',
                lineHeight: '1.5'
              }}
            >
              Make changes to the content. Changes will be reflected on the website.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {renderEditor()}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-10 px-5 cms-card cms-border cms-text-secondary"
              style={{
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSave} 
              disabled={loading}
              className="h-10 px-5"
              style={{
                backgroundColor: loading ? 'rgba(102, 45, 145, 0.5)' : '#662D91',
                borderColor: loading ? 'rgba(102, 45, 145, 0.5)' : '#662D91',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
