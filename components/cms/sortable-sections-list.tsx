'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  GripVertical, 
  Sparkles, 
  Layout, 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  HelpCircle, 
  Zap, 
  CreditCard, 
  Heart, 
  Clock, 
  Target, 
  FileText,
  Smartphone,
  Calendar,
  Info
} from 'lucide-react'
import SectionEditorButton from '@/components/cms/section-editor-button'
import { reorderSections } from '@/app/actions/section-actions'
import { toast } from 'sonner'

interface Section {
  id: string
  component_type: string
  order_index: number
  content: any
  published: boolean
}

interface SortableSectionsListProps {
  sections: Section[]
  pageId: string
  pageSlug: string
}

// Icon mapping for section types
const getSectionIcon = (componentType: string) => {
  const iconMap: Record<string, typeof Sparkles> = {
    'hero': Sparkles,
    'how-it-works': Layout,
    'product-features': Zap,
    'gallery': ImageIcon,
    'testimonials': MessageSquare,
    'app-download': Smartphone,
    'coming-soon': Calendar,
    'faq-category': HelpCircle,
    'feature-category': Zap,
    'pricing-plans': CreditCard,
    'pricing-hero': Sparkles,
    'free-messages': Heart,
    'message-bundles': MessageSquare,
    'pricing-info': Info,
    'pricing-faq': HelpCircle,
    'values': Heart,
    'timeline': Clock,
    'why-join': Target,
    'content': FileText,
    'blog-post': FileText,
  }
  return iconMap[componentType] || Layout
}

// User-friendly section type names
const getSectionTypeName = (componentType: string): string => {
  const typeNames: Record<string, string> = {
    'hero': 'Hero Section',
    'how-it-works': 'How It Works',
    'product-features': 'Product Features',
    'gallery': 'Image Gallery',
    'testimonials': 'Testimonials',
    'app-download': 'App Download',
    'coming-soon': 'Coming Soon',
    'faq-category': 'FAQ Category',
    'feature-category': 'Feature Category',
    'pricing-plans': 'Pricing Plans',
    'pricing-hero': 'Pricing Hero',
    'free-messages': 'Free Messages',
    'message-bundles': 'Message Bundles',
    'pricing-info': 'Pricing Info',
    'pricing-faq': 'Pricing FAQ',
    'values': 'Values',
    'timeline': 'Timeline',
    'why-join': 'Why Join',
    'content': 'Content Block',
    'blog-post': 'Blog Post',
  }
  return typeNames[componentType] || componentType
}

function SortableSectionItem({ section, pageId }: { section: Section; pageId: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    border: isDragging ? '2px dashed #662D91' : 'none',
  }

  const content = section.content || {}
  const SectionIcon = getSectionIcon(section.component_type)
  
  // Generate a descriptive title based on section type and content
  const getSectionTitle = (): string => {
    // First, try to get explicit title/name/heading
    if (content.title) return content.title
    if (content.name) return content.name
    if (content.heading) return content.heading
    
    // For values section, show the actual value titles
    if (section.component_type === 'values' && content.values && content.values.length > 0) {
      const valueTitles = content.values
        .slice(0, 3)
        .map((v: any) => v.title)
        .filter(Boolean)
      if (valueTitles.length > 0) {
        const remaining = content.values.length - valueTitles.length
        if (remaining > 0) {
          return `${valueTitles.join(', ')} +${remaining} more`
        }
        return valueTitles.join(', ')
      }
      return `${content.values.length} Values`
    }
    
    // For steps (how-it-works), show step titles
    if (section.component_type === 'how-it-works' && content.steps && content.steps.length > 0) {
      const stepTitles = content.steps
        .slice(0, 2)
        .map((s: any) => s.title)
        .filter(Boolean)
      if (stepTitles.length > 0) {
        return `${stepTitles.join(', ')}${content.steps.length > 2 ? `... (${content.steps.length} steps)` : ''}`
      }
      return `${content.steps.length} Steps`
    }
    
    // For features, show feature titles
    if (section.component_type === 'product-features' && content.features && content.features.length > 0) {
      const featureTitles = content.features
        .slice(0, 2)
        .map((f: any) => f.title)
        .filter(Boolean)
      if (featureTitles.length > 0) {
        return `${featureTitles.join(', ')}${content.features.length > 2 ? `... (${content.features.length} features)` : ''}`
      }
      return `${content.features.length} Features`
    }
    
    // For FAQs, show question previews
    if (section.component_type === 'faq-category' && content.faqs && content.faqs.length > 0) {
      const firstQuestion = content.faqs[0]?.question
      if (firstQuestion) {
        const truncated = firstQuestion.length > 40 ? firstQuestion.substring(0, 40) + '...' : firstQuestion
        return `${truncated}${content.faqs.length > 1 ? ` (+${content.faqs.length - 1} more)` : ''}`
      }
      return `${content.faqs.length} FAQs`
    }
    
    // For testimonials, show names
    if (section.component_type === 'testimonials' && content.testimonials && content.testimonials.length > 0) {
      const names = content.testimonials
        .slice(0, 2)
        .map((t: any) => t.name)
        .filter(Boolean)
      if (names.length > 0) {
        return `Testimonials: ${names.join(', ')}${content.testimonials.length > 2 ? ` +${content.testimonials.length - 2}` : ''}`
      }
      return `${content.testimonials.length} Testimonials`
    }
    
    // For pricing plans, show plan names
    if (section.component_type === 'pricing-plans' && content.plans && content.plans.length > 0) {
      const planNames = content.plans
        .slice(0, 2)
        .map((p: any) => p.name)
        .filter(Boolean)
      if (planNames.length > 0) {
        return `${planNames.join(', ')}${content.plans.length > 2 ? ` +${content.plans.length - 2} more` : ''}`
      }
      return `${content.plans.length} Plans`
    }
    
    // For gallery, show image count
    if (section.component_type === 'gallery' && content.images && content.images.length > 0) {
      return `${content.images.length} Images`
    }
    
    // Default to section type name
    return getSectionTypeName(section.component_type)
  }
  
  const sectionTitle = getSectionTitle()

  const cardClassName = isDragging 
    ? 'transition-all hover:border-[#662D91]/50 cms-card cms-border border border-[#662D91] border-2'
    : 'transition-all hover:border-[#662D91]/50 cms-card cms-border border'

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={cardClassName}>
        <CardHeader>
          <div className="flex items-start gap-3">
            {/* Drag Handle - More Visible */}
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing flex items-center justify-center mt-1 p-2 rounded cms-sidebar-button transition-colors"
              suppressHydrationWarning
              title="Drag to reorder"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            
            {/* Section Icon */}
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 cms-main-bg cms-border border"
            >
              <SectionIcon className="h-5 w-5" style={{ color: '#662D91' }} />
            </div>

            {/* Section Info */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base mb-1 cms-text-primary">
                {sectionTitle}
              </CardTitle>
              <CardDescription className="text-xs flex items-center gap-2 flex-wrap cms-text-secondary">
                <span className="flex items-center gap-1.5">
                  <span style={{ 
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: section.published ? '#10b981' : '#6b7280'
                  }} />
                  {section.published ? 'Published' : 'Draft'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span style={{ color: '#662D91' }}>#{section.order_index + 1}</span>
                  <span className="text-[10px] cms-text-secondary">in order</span>
                </span>
                <span>•</span>
                <span className="text-[10px] cms-text-secondary">
                  {getSectionTypeName(section.component_type)}
                </span>
              </CardDescription>
            </div>

            {/* Edit Button */}
            <div className="shrink-0">
              <SectionEditorButton
                pageId={pageId}
                section={section}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs p-3 rounded overflow-auto max-h-32 cms-card-bg cms-border border cms-text-secondary">
            {(() => {
              const content = section.content || {}
              
              // Hero section
              if (section.component_type === 'hero') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.tagline && <p className="mb-1"><strong className="cms-text-primary">Tagline:</strong> {content.tagline}</p>}
                    {content.subtitle && <p className="mb-1 line-clamp-2"><strong className="cms-text-primary">Subtitle:</strong> {content.subtitle}</p>}
                    {(content.images?.women?.length || content.images?.men?.length) && (
                      <p className="mb-1"><strong className="cms-text-primary">Carousel:</strong> {content.images?.women?.length || 0} women, {content.images?.men?.length || 0} men</p>
                    )}
                  </>
                )
              }
              
              // Values section
              if (section.component_type === 'values') {
                if (!content.values || content.values.length === 0) {
                  return <p className="cms-text-secondary">No values added yet</p>
                }
                return (
                  <>
                    <p className="mb-2 text-[11px] cms-text-secondary">
                      <strong className="cms-text-primary">{content.values.length}</strong> value{content.values.length !== 1 ? 's' : ''}
                    </p>
                    {content.values.map((v: any, i: number) => (
                      <div key={i} className="mb-2 pb-2 border-b cms-border last:border-0">
                        <p className="text-[11px] font-medium mb-0.5 cms-text-primary">
                          {v.title || 'Untitled Value'}
                        </p>
                        {v.description && (
                          <p className="text-[10px] line-clamp-1 cms-text-secondary">
                            {v.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </>
                )
              }
              
              // How it works
              if (section.component_type === 'how-it-works') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.steps?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Steps:</strong> {content.steps.length} items</p>
                    )}
                    {content.steps?.slice(0, 2).map((s: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {s.title || 'Untitled step'}</p>
                    ))}
                  </>
                )
              }
              
              // Product features
              if (section.component_type === 'product-features') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.features?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Features:</strong> {content.features.length} items</p>
                    )}
                    {content.features?.slice(0, 2).map((f: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {f.title || 'Untitled feature'}</p>
                    ))}
                  </>
                )
              }
              
              // Gallery
              if (section.component_type === 'gallery') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.images?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Images:</strong> {content.images.length} items</p>
                    )}
                    {content.images?.slice(0, 2).map((img: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {img.title || 'Untitled image'}</p>
                    ))}
                  </>
                )
              }
              
              // Testimonials
              if (section.component_type === 'testimonials') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.testimonials?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Testimonials:</strong> {content.testimonials.length} items</p>
                    )}
                    {content.testimonials?.slice(0, 2).map((t: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {t.name || 'Anonymous'}</p>
                    ))}
                  </>
                )
              }
              
              // FAQ category
              if (section.component_type === 'faq-category') {
                return (
                  <>
                    {content.faqs?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">FAQs:</strong> {content.faqs.length} items</p>
                    )}
                    {content.faqs?.slice(0, 2).map((faq: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px] line-clamp-1">• {faq.question || 'Untitled question'}</p>
                    ))}
                  </>
                )
              }
              
              // Feature category
              if (section.component_type === 'feature-category') {
                return (
                  <>
                    {content.features?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Features:</strong> {content.features.length} items</p>
                    )}
                    {content.features?.slice(0, 2).map((f: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {f.title || 'Untitled feature'}</p>
                    ))}
                  </>
                )
              }
              
              // Pricing plans
              if (section.component_type === 'pricing-plans') {
                return (
                  <>
                    {content.plans?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Plans:</strong> {content.plans.length} items</p>
                    )}
                    {content.plans?.slice(0, 2).map((p: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {p.name || 'Untitled plan'} - ₹{p.price || 0}</p>
                    ))}
                  </>
                )
              }
              
              // Timeline
              if (section.component_type === 'timeline') {
                return (
                  <>
                    {content.timeline?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Events:</strong> {content.timeline.length} items</p>
                    )}
                    {content.timeline?.slice(0, 2).map((e: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {e.year} - {e.event}</p>
                    ))}
                  </>
                )
              }
              
              // Why join
              if (section.component_type === 'why-join') {
                return (
                  <>
                    {content.items?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Items:</strong> {content.items.length} items</p>
                    )}
                    {content.items?.slice(0, 2).map((item: any, i: number) => (
                      <p key={i} className="mb-1 text-[11px]">• {item.title || 'Untitled item'}</p>
                    ))}
                  </>
                )
              }
              
              // App download / Coming soon
              if (section.component_type === 'app-download' || section.component_type === 'coming-soon') {
                return (
                  <>
                    {content.title && <p className="mb-1"><strong className="cms-text-primary">Title:</strong> {content.title}</p>}
                    {content.platforms?.length > 0 && (
                      <p className="mb-1"><strong className="cms-text-primary">Platforms:</strong> {content.platforms.length} items</p>
                    )}
                    {content.stats?.count && (
                      <p className="mb-1"><strong className="cms-text-primary">Stats:</strong> {content.stats.count}</p>
                    )}
                  </>
                )
              }
              
              // Content section
              if (section.component_type === 'content') {
                const keys = Object.keys(content)
                return (
                  <>
                    {keys.length > 0 ? (
                      <>
                        <p className="mb-1"><strong className="cms-text-primary">Content keys:</strong> {keys.length}</p>
                        {keys.slice(0, 3).map((key, i) => (
                          <p key={i} className="mb-1 text-[11px]">• {key}</p>
                        ))}
                      </>
                    ) : (
                      <p className="cms-text-secondary">Empty content</p>
                    )}
                  </>
                )
              }
              
              // Default fallback
              return (
                <p className="cms-text-secondary">No preview available for this section type</p>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SortableSectionsList({ sections: initialSections, pageId, pageSlug }: SortableSectionsListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [sections, setSections] = useState(initialSections)
  const [mounted, setMounted] = useState(false)
  
  // All hooks must be called before any conditional returns
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Update sections when initialSections changes (after refresh)
  useEffect(() => {
    setSections(initialSections)
  }, [initialSections])
  
  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="space-y-4">
        {initialSections.map((section) => (
          <Card
            key={section.id}
            className="transition-all cms-card cms-border border"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-base cms-text-primary">
                    {section.component_type}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs cms-text-secondary">
                    Order: {section.order_index} •{' '}
                    {section.published ? 'Published' : 'Draft'}
                  </CardDescription>
                </div>
                <SectionEditorButton
                  pageId={pageId}
                  section={section}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs p-4 rounded overflow-auto max-h-40 cms-main-bg cms-text-secondary cms-border border">
                <p className="cms-text-tertiary">Loading...</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sections.findIndex((section) => section.id === active.id)
    const newIndex = sections.findIndex((section) => section.id === over.id)

    const newSections = arrayMove(sections, oldIndex, newIndex)
    setSections(newSections)

    // Update order_index for all sections
    try {
      const sectionIds = newSections.map((section) => section.id)
      await reorderSections(pageId, sectionIds)

      toast.success('Sections reordered successfully', {
        description: 'The new order has been saved.',
      })
      
      startTransition(() => {
        router.refresh()
      })
    } catch (error) {
      toast.error('Failed to reorder sections')
      // Revert on error
      setSections(sections)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sections.map((section) => (
            <SortableSectionItem
              key={section.id}
              section={section}
              pageId={pageId}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
