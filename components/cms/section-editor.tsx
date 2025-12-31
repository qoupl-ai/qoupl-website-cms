/**
 * Unified Section Editor
 * 
 * Type-based section editor that adapts to different section types.
 * Replaces blog-dialog, faq-dialog, feature-dialog, pricing-dialog.
 */

'use client'

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ImageUploadField } from '@/components/cms/image-upload-field'
import { MultiImageUploadField } from '@/components/cms/multi-image-upload-field'
import { IconSelector } from '@/components/cms/icon-selector'
import { ColorPicker } from '@/components/cms/color-picker'
import { Plus, Trash2 } from 'lucide-react'
import {
  createSection,
  updateSection,
  type CreateSectionInput,
  type UpdateSectionInput,
} from '@/app/actions/section-actions'

// Base section schema
const baseSectionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  order_index: z.number().int().min(0),
  published: z.boolean(),
})

// Type-specific schemas
const sectionSchemas: Record<string, z.ZodSchema> = {
  'hero': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      tagline: z.string(),
      subtitle: z.string(),
      image: z.string().optional(),
      background_image: z.string().optional(),
      images: z.object({
        women: z.array(z.string()).optional(),
        men: z.array(z.string()).optional(),
      }).optional(),
      cta: z.object({
        text: z.string(),
        buttonText: z.string(),
        link: z.string().optional(),
      }).optional(),
    }),
  }),
  'blog-post': baseSectionSchema.extend({
    data: z.object({
      title: z.string().min(5),
      slug: z.string().min(3),
      excerpt: z.string().min(20),
      content: z.string().min(50),
      author: z.string().optional(),
      publish_date: z.string().optional(),
      read_time: z.number().int().optional(),
      featured_image: z.string().optional(),
    }),
  }),
  'faq-category': baseSectionSchema.extend({
    data: z.object({
      category_id: z.string(),
      faqs: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })),
    }),
  }),
  'feature-category': baseSectionSchema.extend({
    data: z.object({
      category_id: z.string(),
      features: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),
  }),
  'pricing-plans': baseSectionSchema.extend({
    data: z.object({
      plans: z.array(z.object({
        name: z.string(),
        price: z.number(),
        features: z.array(z.string()),
      })),
    }),
  }),
  'values': baseSectionSchema.extend({
    data: z.object({
      values: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        color: z.string().optional(),
      })),
    }),
  }),
  'how-it-works': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      steps: z.array(z.object({
        step: z.string(),
        title: z.string(),
        description: z.string(),
        image: z.string().optional(),
      })),
    }),
  }),
  'product-features': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      features: z.array(z.object({
        icon: z.string(),
        title: z.string(),
        description: z.string(),
        highlights: z.array(z.string()).optional(),
        image: z.string().optional(),
        color: z.string().optional(),
      })),
    }),
  }),
  'gallery': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      images: z.array(z.object({
        image: z.string(),
        alt: z.string().optional(),
        title: z.string().optional(),
        story: z.string().optional(),
      })),
      cta: z.object({
        text: z.string(),
        highlight: z.string().optional(),
      }).optional(),
    }),
  }),
  'testimonials': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      testimonials: z.array(z.object({
        name: z.string(),
        image: z.string(),
        text: z.string(),
        location: z.string().optional(),
        rating: z.number().optional(),
        date: z.string().optional(),
      })),
      stats: z.object({
        text: z.string(),
        icon: z.string().optional(),
      }).optional(),
    }),
  }),
  'app-download': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      benefits: z.array(z.string()).optional(),
      cta: z.object({
        text: z.string(),
        subtext: z.string().optional(),
      }).optional(),
      platforms: z.array(z.object({
        name: z.string(),
        icon: z.string(),
        coming: z.boolean().optional(),
      })),
      stats: z.object({
        text: z.string(),
        count: z.string().optional(),
        suffix: z.string().optional(),
      }).optional(),
      images: z.object({
        decorative: z.array(z.string()).optional(),
      }).optional(),
    }),
  }),
  'coming-soon': baseSectionSchema.extend({
    data: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      badge: z.object({
        icon: z.string(),
        text: z.string(),
      }).optional(),
      cta: z.object({
        text: z.string(),
      }).optional(),
      platforms: z.array(z.object({
        name: z.string(),
        icon: z.string(),
        coming: z.boolean().optional(),
      })),
      stats: z.object({
        text: z.string(),
        count: z.string().optional(),
      }).optional(),
      screenshots: z.array(z.string()).optional(),
    }),
  }),
  'timeline': baseSectionSchema.extend({
    data: z.object({
      timeline: z.array(z.object({
        year: z.string(),
        event: z.string(),
        description: z.string(),
      })),
    }),
  }),
  'why-join': baseSectionSchema.extend({
    data: z.object({
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),
  }),
  'content': baseSectionSchema.extend({
    data: z.record(z.string(), z.any()),
  }),
}

interface SectionEditorProps {
  pageId: string
  section?: {
    id: string
    component_type: string
    order_index: number
    content: Record<string, unknown>
    published: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SectionEditor({
  pageId,
  section,
  open,
  onOpenChange,
}: SectionEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!section
  const sectionType = section?.component_type || 'hero'

  // Get schema for this section type, fallback to base
  const schema = sectionSchemas[sectionType] || baseSectionSchema.extend({
    data: z.record(z.string(), z.any()),
  })

  // Helper to get default data based on section type
  const getDefaultData = () => {
    if (!section?.content) return {}
    
    const content = { ...section.content }
    
    // Only add images structure for hero sections
    if (sectionType === 'hero' && content.images && typeof content.images === 'object' && !Array.isArray(content.images)) {
      const images = content.images as Record<string, unknown>
      content.images = {
        women: Array.isArray(images.women) ? images.women : [],
        men: Array.isArray(images.men) ? images.men : [],
        ...images,
      }
    }
    
    return content
  }

  // Type-safe helper functions
  const asString = (value: unknown): string => {
    return typeof value === 'string' ? value : ''
  }

  const asNumber = (value: unknown): number => {
    return typeof value === 'number' ? value : 0
  }

  const asArray = <T,>(value: unknown): T[] => {
    return Array.isArray(value) ? value as T[] : []
  }

  const asBoolean = (value: unknown): boolean => {
    return typeof value === 'boolean' ? value : false
  }

  // Use a more generic type to avoid type inference issues with dynamic schemas
  type FormData = {
    type: string
    order_index: number
    published: boolean
    data: Record<string, unknown>
  }

  // Type-safe resolver wrapper to handle Zod v4 compatibility with react-hook-form
  // Zod v4 uses 'unknown' types which are incompatible with react-hook-form's FieldValues
  // This type assertion is necessary for compatibility
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedResolver = zodResolver(schema as any) as Resolver<FormData>

  const form = useForm<FormData>({
    resolver: typedResolver,
    defaultValues: {
      type: sectionType,
      order_index: section?.order_index || 0,
      published: section?.published ?? false,
      data: getDefaultData(),
    },
  })

  useEffect(() => {
    if (section && open) {
      const defaultData = getDefaultData()
      form.reset({
        type: section.component_type,
        order_index: section.order_index,
        published: section.published,
        data: defaultData,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, open, sectionType])

  const onSubmit = async (values: FormData) => {
    try {
      if (isEditing && section) {
        const updateData: UpdateSectionInput = {
          type: values.type,
          order_index: values.order_index,
          data: values.data,
          published: values.published,
        }
        await updateSection(section.id, updateData)
        toast.success('Section updated successfully', {
          description: 'Changes have been saved and will appear immediately.',
        })
      } else {
        const createData: CreateSectionInput = {
          page_id: pageId,
          type: values.type,
          order_index: values.order_index,
          data: values.data,
          published: values.published,
        }
        await createSection(createData)
        toast.success('Section created successfully', {
          description: 'Your new section has been added.',
        })
      }

      onOpenChange(false)
      
      // Use startTransition for better UX during refresh
      startTransition(() => {
      router.refresh()
      })
    } catch (error) {
      toast.error('Failed to save section', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      })
    }
  }

  // Render type-specific fields
  const renderTypeSpecificFields = () => {
    switch (sectionType) {
      case 'hero':
        return (
          <>
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Hero Image</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={asString(field.value)}
                      onChange={field.onChange}
                      bucket="hero-images"
                      label=""
                      description="Main image displayed in the hero section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.background_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Background Image (Optional)</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={asString(field.value)}
                      onChange={field.onChange}
                      bucket="hero-images"
                      label=""
                      description="Background image for the hero section"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.images.women"
              render={({ field }) => {
                // Ensure we have an array
                const fieldValue = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])
                
                return (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Women Carousel Images</FormLabel>
                    <FormControl>
                      <MultiImageUploadField
                        value={fieldValue}
                        onChange={field.onChange}
                        bucket="hero-images"
                        label=""
                        description="Images for the carousel (women profiles)"
                        maxImages={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.images.men"
              render={({ field }) => {
                // Ensure we have an array
                const fieldValue = Array.isArray(field.value) ? field.value : (field.value ? [field.value] : [])
                
                return (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Men Carousel Images</FormLabel>
                    <FormControl>
                      <MultiImageUploadField
                        value={fieldValue}
                        onChange={field.onChange}
                        bucket="hero-images"
                        label=""
                        description="Images for the carousel (men profiles)"
                        maxImages={20}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.cta.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Call to Action Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Get Started" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.cta.buttonText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Button Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Sign Up Now" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.cta.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Button Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., /signup" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )

      case 'blog-post':
        return (
          <>
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Content</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={10} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.featured_image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUploadField
                      value={asString(field.value)}
                      onChange={field.onChange}
                      bucket="blog-images"
                      label="Featured Image"
                      description="Main image for the blog post"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Author</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Author name" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.read_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Read Time (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={asNumber(field.value)}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )

      case 'faq-category':
        return (
          <div className="space-y-4">
          <FormField
            control={form.control}
              name="data.category_id"
            render={({ field }) => (
              <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Category ID</FormLabel>
                <FormControl>
                    <Input {...field} placeholder="e.g., general" value={asString(field.value)} />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Category identifier for grouping FAQs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                FAQs
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFaqs = asArray<{ question: string; answer: string }>(form.getValues('data.faqs'))
                  form.setValue('data.faqs', [...currentFaqs, { question: '', answer: '' }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add FAQ
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.faqs"
                render={({ field }) => {
                  const faqs = asArray<{ question: string; answer: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {faqs.map((faq, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            FAQ #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFaqs = faqs.filter((_, i: number) => i !== index)
                              field.onChange(newFaqs)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.question`}
                          render={({ field: questionField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Question
                              </FormLabel>
                              <FormControl>
                                <Input {...questionField} placeholder="Enter question" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.answer`}
                          render={({ field: answerField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Answer
                              </FormLabel>
                              <FormControl>
                                <Textarea {...answerField} rows={3} placeholder="Enter answer" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {faqs.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
          </div>
        )

      case 'feature-category':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Category ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., core-features" value={asString(field.value)} />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Category identifier for grouping features
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Features
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFeatures = asArray<{ title: string; description: string; icon: string }>(form.getValues('data.features'))
                  form.setValue('data.features', [...currentFeatures, { title: '', description: '', icon: '' }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Feature
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.features"
                render={({ field }) => {
                  const features = asArray<{ title: string; description: string; icon: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {features.map((feature, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Feature #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const features = asArray<string>(field.value)
                              const newFeatures = features.filter((_, i: number) => i !== index)
                              field.onChange(newFeatures)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Feature title" value={asString(titleField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Feature description" value={asString(descField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.icon`}
                          render={({ field: iconField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Icon
                              </FormLabel>
                              <FormControl>
                                <IconSelector
                                  value={asString(iconField.value)}
                                  onChange={iconField.onChange}
                                  label="Icon"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {features.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No features added yet. Click &quot;Add Feature&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
          </div>
        )

      case 'pricing-plans':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Pricing Plans
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentPlans = asArray<{ name: string; price: number; features: string[] }>(form.getValues('data.plans'))
                  form.setValue('data.plans', [...currentPlans, { name: '', price: 0, features: [] }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Plan
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.plans"
                render={({ field }) => {
                  const plans = asArray<{ name: string; price: number; features: string[] }>(field.value)
                  return (
                  <div className="space-y-3">
                    {plans.map((plan, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Plan #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlans = plans.filter((_, i: number) => i !== index)
                              field.onChange(newPlans)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.plans.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Plan Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., Basic, Pro" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.plans.${index}.price`}
                            render={({ field: priceField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Price
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...priceField}
                                    onChange={(e) => priceField.onChange(parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Features
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentFeatures = plan.features || []
                                const updatedPlans = [...plans]
                                updatedPlans[index] = { ...updatedPlans[index], features: [...currentFeatures, ''] }
                                field.onChange(updatedPlans)
                              }}
                              className="h-6 px-2 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          {(plan.features || []).map((feature: string, featureIndex: number) => (
                            <div key={featureIndex} className="flex gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => {
                                  const updatedPlans = [...plans]
                                  updatedPlans[index] = { 
                                    ...updatedPlans[index], 
                                    features: updatedPlans[index].features.map((f, i) => i === featureIndex ? e.target.value : f)
                                  }
                                  field.onChange(updatedPlans)
                                }}
                                placeholder="Feature description"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedPlans = [...plans]
                                  updatedPlans[index] = { 
                                    ...updatedPlans[index], 
                                    features: plan.features.filter((_, i: number) => i !== featureIndex)
                                  }
                                  field.onChange(updatedPlans)
                                }}
                                className="h-9 w-9 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {plans.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No pricing plans added yet. Click &quot;Add Plan&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
          </div>
        )

      case 'pricing-hero':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Affordable Pricing" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Subtitle
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., Pay only for what you use. No hidden fees, no surprises." value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.badge.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Badge Text
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Simple & Transparent" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'free-messages':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Free Messages Count
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                    {...field}
                      value={asNumber(field.value)}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., First 3 Messages Free Per Match!" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., Start conversations with your matches without any additional cost." value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'message-bundles':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.price_per_message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Price Per Message (₹)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={asNumber(field.value)}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.gst_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      GST Rate (%)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={asNumber(field.value)}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="18"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.min_messages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Min Messages
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={asNumber(field.value)}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        placeholder="5"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.max_messages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Max Messages
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={asNumber(field.value)}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        placeholder="100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Section Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Message Bundles" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Section Subtitle
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., After your free messages, purchase message bundles to continue connecting" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Predefined Bundles
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentBundles = asArray<{ messages: number; popular: boolean }>(form.getValues('data.bundles'))
                  form.setValue('data.bundles', [...currentBundles, { messages: 5, popular: false }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Bundle
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.bundles"
              render={({ field }) => {
                const bundles = asArray<{ messages: number; popular: boolean }>(field.value)
                return (
                  <div className="space-y-3">
                    {bundles.map((bundle, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Bundle #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newBundles = bundles.filter((_, i: number) => i !== index)
                              field.onChange(newBundles)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.bundles.${index}.messages`}
                            render={({ field: messagesField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Messages
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...messagesField}
                                    value={asNumber(messagesField.value)}
                                    onChange={(e) => messagesField.onChange(parseInt(e.target.value) || 0)}
                                    placeholder="10"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.bundles.${index}.popular`}
                            render={({ field: popularField }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0 pt-7">
                                <FormControl>
                                  <Switch
                                    checked={asBoolean(popularField.value)}
                                    onCheckedChange={popularField.onChange}
                                  />
                                </FormControl>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Popular
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          </div>
        )

      case 'pricing-info':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., How it works" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Info Items
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentItems = asArray<string>(form.getValues('data.items'))
                  form.setValue('data.items', [...currentItems, ''])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.items"
              render={({ field }) => {
                const items = asArray<string>(field.value)
                return (
                  <div className="space-y-3">
                    {items.map((item: string, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={asString(item)}
                          onChange={(e) => {
                            const updatedItems = [...items]
                            updatedItems[index] = e.target.value
                            field.onChange(updatedItems)
                          }}
                          placeholder="e.g., Pay ₹10/month for platform access"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedItems = items.filter((_, i: number) => i !== index)
                            field.onChange(updatedItems)
                          }}
                          className="h-9 w-9 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
          </div>
        )

      case 'pricing-faq':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Section Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Frequently Asked Questions" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                FAQs
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentFaqs = asArray<{ question: string; answer: string }>(form.getValues('data.faqs'))
                  form.setValue('data.faqs', [...currentFaqs, { question: '', answer: '' }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add FAQ
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.faqs"
              render={({ field }) => {
                const faqs = asArray<{ question: string; answer: string }>(field.value)
                return (
                  <div className="space-y-3">
                    {faqs.map((faq, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            FAQ #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFaqs = faqs.filter((_, i: number) => i !== index)
                              field.onChange(newFaqs)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.question`}
                          render={({ field: questionField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Question
                              </FormLabel>
                              <FormControl>
                                <Input {...questionField} placeholder="e.g., Do message bundles expire?" value={asString(questionField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.faqs.${index}.answer`}
                          render={({ field: answerField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Answer
                              </FormLabel>
                              <FormControl>
                                <Textarea {...answerField} placeholder="e.g., No, your purchased message bundles never expire." value={asString(answerField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.cta.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    CTA Text
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Still have questions?" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.cta.link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    CTA Link
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., /contact" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'contact-hero':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Get in Touch" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Subtitle
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., Have questions about qoupl? We'd love to hear from you." value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.badge.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Badge Text
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., We're Here to Help" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.badge.icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Badge Icon
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., heart" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'contact-info':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Section Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Contact Information" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Contact Items
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentItems = asArray<{ icon: string; title: string; details: string; link: string | null }>(form.getValues('data.items'))
                  form.setValue('data.items', [...currentItems, { icon: '', title: '', details: '', link: null }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.items"
              render={({ field }) => {
                const items = asArray<{ icon: string; title: string; details: string; link: string | null }>(field.value)
                return (
                <div className="space-y-3">
                  {items.map((item, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium cms-text-secondary">
                          Item #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = items.filter((_, i: number) => i !== index)
                            field.onChange(newItems)
                          }}
                          className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.icon`}
                        render={({ field: iconField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Icon
                            </FormLabel>
                            <FormControl>
                              <Input {...iconField} placeholder="e.g., mail, phone, map-pin" value={asString(iconField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Title
                            </FormLabel>
                            <FormControl>
                              <Input {...titleField} placeholder="e.g., Email Us" value={asString(titleField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.details`}
                        render={({ field: detailsField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Details
                            </FormLabel>
                            <FormControl>
                              <Input {...detailsField} placeholder="e.g., support@qoupl.ai" value={asString(detailsField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.link`}
                        render={({ field: linkField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Link (optional, leave empty for no link)
                            </FormLabel>
                            <FormControl>
                              <Input {...linkField} placeholder="e.g., mailto:support@qoupl.ai" value={asString(linkField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  </div>
                )
              }}
            />
          </div>
        )

      case 'contact-info-details':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Let's Connect" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="e.g., Whether you have questions about features..." value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Info Items
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentItems = asArray<{ icon: string; title: string; description: string }>(form.getValues('data.items'))
                  form.setValue('data.items', [...currentItems, { icon: '', title: '', description: '' }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Item
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.items"
              render={({ field }) => {
                const items = asArray<{ icon: string; title: string; description: string }>(field.value)
                return (
                  <div className="space-y-3">
                    {items.map((item, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium cms-text-secondary">
                          Item #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = items.filter((_, i: number) => i !== index)
                            field.onChange(newItems)
                          }}
                          className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.icon`}
                        render={({ field: iconField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Icon
                            </FormLabel>
                            <FormControl>
                              <Input {...iconField} placeholder="e.g., clock, heart, message-square" value={asString(iconField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.title`}
                        render={({ field: titleField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Title
                            </FormLabel>
                            <FormControl>
                              <Input {...titleField} placeholder="e.g., Response Time" value={asString(titleField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.items.${index}.description`}
                        render={({ field: descField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Description
                            </FormLabel>
                            <FormControl>
                              <Textarea {...descField} placeholder="e.g., We typically respond within 24-48 hours..." value={asString(descField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
                )
              }}
            />
            <FormField
              control={form.control}
              name="data.faq_link.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    FAQ Link Text
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Visit FAQ" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.faq_link.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                    FAQ Link URL
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., /faq" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'values':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Values
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentValues = asArray<{ icon: string; title: string; description: string; color?: string }>(form.getValues('data.values'))
                  form.setValue('data.values', [...currentValues, { icon: '', title: '', description: '', color: 'bg-[#662D91]' }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Value
              </Button>
            </div>
              <FormField
                control={form.control}
                name="data.values"
                render={({ field }) => {
                  const values = asArray<{ icon: string; title: string; description: string; color?: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {values.map((value, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Value #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newValues = values.filter((_, i: number) => i !== index)
                              field.onChange(newValues)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.values.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <IconSelector
                                    value={asString(iconField.value)}
                                    onChange={iconField.onChange}
                                    label="Icon"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.values.${index}.color`}
                            render={({ field: colorField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Color
                                </FormLabel>
                                <FormControl>
                                  <ColorPicker
                                    value={asString(colorField.value)}
                                    onChange={colorField.onChange}
                                    label="Color"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.values.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Value title" value={asString(titleField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.values.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Value description" value={asString(descField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {values.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No values added yet. Click &quot;Add Value&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
          </div>
        )

      case 'how-it-works':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Steps
              </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentSteps = asArray<{ step: string; title: string; description: string; image?: string }>(form.getValues('data.steps'))
                    form.setValue('data.steps', [...currentSteps, { step: '', title: '', description: '', image: '' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.steps"
                render={({ field }) => {
                  const steps = asArray<{ step: string; title: string; description: string; image?: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {steps.map((step, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Step #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newSteps = steps.filter((_, i: number) => i !== index)
                              field.onChange(newSteps)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.steps.${index}.step`}
                            render={({ field: stepField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Step Number
                                </FormLabel>
                                <FormControl>
                                  <Input {...stepField} placeholder="e.g., 01" value={asString(stepField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.steps.${index}.image`}
                            render={({ field: imageField }) => (
                              <FormItem>
                                <FormControl>
                                  <ImageUploadField
                                    value={asString(imageField.value)}
                                    onChange={imageField.onChange}
                                    bucket="app-screenshots"
                                    label="Step Image"
                                    description="Image for this step"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.steps.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Step title" value={asString(titleField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.steps.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={3} placeholder="Step description" value={asString(descField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {steps.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No steps added yet. Click &quot;Add Step&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
          </div>
        )

      case 'product-features':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Features
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentFeatures = asArray<{ icon: string; title: string; description: string; highlights?: string[]; image?: string; color?: string }>(form.getValues('data.features'))
                    form.setValue('data.features', [...currentFeatures, { icon: '', title: '', description: '', highlights: [], image: '', color: 'bg-[#662D91]' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Feature
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.features"
                render={({ field }) => {
                  const features = asArray<{ icon: string; title: string; description: string; highlights?: string[]; image?: string; color?: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {features.map((feature, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Feature #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newFeatures = features.filter((_, i: number) => i !== index)
                              field.onChange(newFeatures)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.features.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <IconSelector
                                    value={asString(iconField.value)}
                                    onChange={iconField.onChange}
                                    label="Icon"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.features.${index}.color`}
                            render={({ field: colorField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Color
                                </FormLabel>
                                <FormControl>
                                  <ColorPicker
                                    value={asString(colorField.value)}
                                    onChange={colorField.onChange}
                                    label="Color"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Feature title" value={asString(titleField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Feature description" value={asString(descField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.features.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={asString(imageField.value)}
                                  onChange={imageField.onChange}
                                  bucket="couple-photos"
                                  label="Feature Image"
                                  description="Image for this feature"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Highlights
                            </label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentHighlights = asArray<string>(feature.highlights || [])
                                const updatedFeatures = [...features]
                                updatedFeatures[index] = { ...updatedFeatures[index], highlights: [...currentHighlights, ''] }
                                field.onChange(updatedFeatures)
                              }}
                              className="h-6 px-2 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          </div>
                          {(asArray<string>(feature.highlights || [])).map((highlight: string, highlightIndex: number) => (
                            <div key={highlightIndex} className="flex gap-2">
                              <Input
                                value={highlight}
                                onChange={(e) => {
                                  const updatedFeatures = [...features]
                                  const currentHighlights = asArray<string>(updatedFeatures[index].highlights || [])
                                  currentHighlights[highlightIndex] = e.target.value
                                  updatedFeatures[index] = { ...updatedFeatures[index], highlights: currentHighlights }
                                  field.onChange(updatedFeatures)
                                }}
                                placeholder="Highlight text"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedFeatures = [...features]
                                  const currentHighlights = asArray<string>(feature.highlights || [])
                                  updatedFeatures[index] = { 
                                    ...updatedFeatures[index], 
                                    highlights: currentHighlights.filter((_, i: number) => i !== highlightIndex)
                                  }
                                  field.onChange(updatedFeatures)
                                }}
                                className="h-9 w-9 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {features.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No features added yet. Click &quot;Add Feature&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={asString(field.value)}
                        onChange={field.onChange}
                        label="Badge Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Love Stories" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Gallery Images
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentImages = asArray<{ image: string; alt?: string; title?: string; story?: string }>(form.getValues('data.images'))
                    form.setValue('data.images', [...currentImages, { image: '', alt: '', title: '', story: '' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Image
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.images"
                render={({ field }) => {
                  const images = asArray<{ image: string; alt?: string; title?: string; story?: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {images.map((image, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Image #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newImages = images.filter((_, i: number) => i !== index)
                              field.onChange(newImages)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.images.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={asString(imageField.value)}
                                  onChange={imageField.onChange}
                                  bucket="couple-photos"
                                  label="Image"
                                  description="Gallery image"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.images.${index}.title`}
                            render={({ field: titleField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Title
                                </FormLabel>
                                <FormControl>
                                  <Input {...titleField} placeholder="e.g., Sarah & Raj" value={asString(titleField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.images.${index}.alt`}
                            render={({ field: altField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Alt Text
                                </FormLabel>
                                <FormControl>
                                  <Input {...altField} placeholder="Image alt text" value={asString(altField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.images.${index}.story`}
                          render={({ field: storyField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Story
                              </FormLabel>
                              <FormControl>
                                <Textarea {...storyField} rows={2} placeholder="Love story description" value={asString(storyField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {images.length === 0 && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No images added yet. Click &quot;Add Image&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
            <div className="space-y-2">
              <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Call to Action (Optional)
              </FormLabel>
              <FormField
                control={form.control}
                name="data.cta.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Be part of something beautiful." value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.cta.highlight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>Highlight Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Your story could be next." value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case 'testimonials':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Heart" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Beta User Success Stories" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Testimonials
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentTestimonials = asArray<{ name: string; image: string; text: string; location?: string; rating?: number; date?: string }>(form.getValues('data.testimonials'))
                    form.setValue('data.testimonials', [...currentTestimonials, { name: '', image: '', text: '', location: '', rating: 5, date: '' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Testimonial
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.testimonials"
                render={({ field }) => {
                  const testimonials = asArray<{ name: string; image: string; text: string; location?: string; rating?: number; date?: string }>(field.value)
                  return (
                    <div className="space-y-3">
                      {testimonials.map((testimonial, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Testimonial #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTestimonials = testimonials.filter((_, i: number) => i !== index)
                              field.onChange(newTestimonials)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="User name" value={asString(nameField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.location`}
                            render={({ field: locationField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Location
                                </FormLabel>
                                <FormControl>
                                  <Input {...locationField} placeholder="e.g., Mumbai, Maharashtra" value={asString(locationField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.rating`}
                            render={({ field: ratingField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Rating (1-5)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...ratingField}
                                    value={asNumber(ratingField.value)}
                                    onChange={(e) => ratingField.onChange(parseInt(e.target.value) || 5)}
                                    min={1}
                                    max={5}
                                    placeholder="5"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.testimonials.${index}.date`}
                            render={({ field: dateField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Date
                                </FormLabel>
                                <FormControl>
                                  <Input {...dateField} placeholder="e.g., Beta User" value={asString(dateField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.testimonials.${index}.image`}
                          render={({ field: imageField }) => (
                            <FormItem>
                              <FormControl>
                                <ImageUploadField
                                  value={asString(imageField.value)}
                                  onChange={imageField.onChange}
                                  bucket="hero-images"
                                  label="Profile Image"
                                  description="User profile image"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.testimonials.${index}.text`}
                          render={({ field: textField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Testimonial Text
                              </FormLabel>
                              <FormControl>
                                <Textarea {...textField} rows={3} placeholder="Testimonial content" value={asString(textField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(testimonials.length === 0) && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No testimonials added yet. Click &quot;Add Testimonial&quot; to get started.
                      </p>
                    )}
                    </div>
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join 10,000+ people waiting" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Icon</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={asString(field.value)}
                        onChange={field.onChange}
                        label="Stats Icon"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )

      case 'app-download':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sparkles" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Coming Soon" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px', display: 'block' }}>
                Benefits
              </label>
              <FormField
                control={form.control}
                name="data.benefits"
                render={({ field }) => {
                  const benefits = asArray<string>(field.value)
                  return (
                  <div className="space-y-2">
                    {benefits.map((benefit, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={asString(benefit)}
                          onChange={(e) => {
                            const updatedBenefits = [...benefits]
                            updatedBenefits[index] = e.target.value
                            field.onChange(updatedBenefits)
                          }}
                          placeholder="Benefit description"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updatedBenefits = benefits.filter((_, i: number) => i !== index)
                            field.onChange(updatedBenefits)
                          }}
                          className="h-9 w-9 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentBenefits = benefits
                        field.onChange([...currentBenefits, ''])
                      }}
                      className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Benefit
                    </Button>
                  </div>
                  )
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Call to Action
              </label>
              <FormField
                control={form.control}
                name="data.cta.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>CTA Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join the Waitlist" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.cta.subtext"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>CTA Subtext</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Limited spots available" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Platforms
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentPlatforms = asArray<{ name: string; icon: string; coming: boolean }>(form.getValues('data.platforms'))
                    form.setValue('data.platforms', [...currentPlatforms, { name: '', icon: '', coming: true }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Platform
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.platforms"
                render={({ field }) => {
                  const platforms = asArray<{ name: string; icon: string; coming: boolean }>(field.value)
                  return (
                  <div className="space-y-3">
                    {platforms.map((platform, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Platform #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlatforms = platforms.filter((_, i: number) => i !== index)
                              field.onChange(newPlatforms)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Platform Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., App Store" value={asString(nameField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <Input {...iconField} placeholder="e.g., 🍎 or Apple" value={asString(iconField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(platforms.length === 0) && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No platforms added yet. Click &quot;Add Platform&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Join" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Count</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10,000+" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.suffix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Suffix</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., on the waitlist" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.images.decorative"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploadField
                      value={asArray<string>(field.value)}
                      onChange={field.onChange}
                      bucket="couple-photos"
                      label="Decorative Images"
                      description="Decorative images for the section"
                      maxImages={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'coming-soon':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={2} value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.badge.icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Icon</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sparkles" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.badge.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Badge Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Launching Soon" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.cta.text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>CTA Text</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Join Waitlist Now" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Platforms
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentPlatforms = asArray<{ name: string; icon: string; coming: boolean }>(form.getValues('data.platforms'))
                    form.setValue('data.platforms', [...currentPlatforms, { name: '', icon: '', coming: true }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Platform
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.platforms"
                render={({ field }) => {
                  const platforms = asArray<{ name: string; icon: string; coming: boolean }>(field.value)
                  return (
                  <div className="space-y-3">
                    {platforms.map((platform, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Platform #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newPlatforms = platforms.filter((_, i: number) => i !== index)
                              field.onChange(newPlatforms)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.name`}
                            render={({ field: nameField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Platform Name
                                </FormLabel>
                                <FormControl>
                                  <Input {...nameField} placeholder="e.g., App Store" value={asString(nameField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.platforms.${index}.icon`}
                            render={({ field: iconField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Icon
                                </FormLabel>
                                <FormControl>
                                  <Input {...iconField} placeholder="e.g., Apple or Smartphone" value={asString(iconField.value)} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                    {(platforms.length === 0) && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No platforms added yet. Click &quot;Add Platform&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data.stats.text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Text</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., people already on the waitlist" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data.stats.count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500' }}>Stats Count</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 10,000+" value={asString(field.value)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="data.screenshots"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MultiImageUploadField
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      bucket="app-screenshots"
                      label="Screenshots"
                      description="App screenshots to display"
                      maxImages={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 'timeline':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Timeline Events
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentTimeline = asArray<{ year: string; event: string; description: string }>(form.getValues('data.timeline'))
                    form.setValue('data.timeline', [...currentTimeline, { year: '', event: '', description: '' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Event
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.timeline"
                render={({ field }) => {
                  const timeline = asArray<{ year: string; event: string; description: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {timeline.map((event, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Event #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newTimeline = timeline.filter((_, i: number) => i !== index)
                              field.onChange(newTimeline)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name={`data.timeline.${index}.year`}
                            render={({ field: yearField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Year
                                </FormLabel>
                                <FormControl>
                                  <Input {...yearField} placeholder="e.g., 2024" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`data.timeline.${index}.event`}
                            render={({ field: eventField }) => (
                              <FormItem>
                                <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                  Event Title
                                </FormLabel>
                                <FormControl>
                                  <Input {...eventField} placeholder="e.g., qoupl Founded" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.timeline.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Event description" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(timeline.length === 0) && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No timeline events added yet. Click &quot;Add Event&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
          </div>
        )

      case 'why-join':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                  Join Reasons
                </FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const currentItems = asArray<{ title: string; description: string; icon: string }>(form.getValues('data.items'))
                    form.setValue('data.items', [...currentItems, { title: '', description: '', icon: '' }])
                  }}
                  className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>
              <FormField
                control={form.control}
                name="data.items"
                render={({ field }) => {
                  const items = asArray<{ title: string; description: string; icon: string }>(field.value)
                  return (
                  <div className="space-y-3">
                    {items.map((item, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium cms-text-secondary">
                            Item #{index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newItems = items.filter((_, i: number) => i !== index)
                              field.onChange(newItems)
                            }}
                            className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.icon`}
                          render={({ field: iconField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Icon (Emoji or Text)
                              </FormLabel>
                              <FormControl>
                                <Input {...iconField} placeholder="e.g., 💜 or Heart" value={asString(iconField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.title`}
                          render={({ field: titleField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Title
                              </FormLabel>
                              <FormControl>
                                <Input {...titleField} placeholder="Item title" value={asString(titleField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`data.items.${index}.description`}
                          render={({ field: descField }) => (
                            <FormItem>
                              <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea {...descField} rows={2} placeholder="Item description" value={asString(descField.value)} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                    {(items.length === 0) && (
                      <p className="text-sm text-center py-4 cms-text-secondary">
                        No items added yet. Click &quot;Add Item&quot; to get started.
                      </p>
                    )}
                  </div>
                  )
                }}
              />
            </div>
          </div>
        )

      case 'content':
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="data.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Page Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Privacy Policy" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data.lastUpdated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Last Updated</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., December 2024" value={asString(field.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between mb-3">
              <label className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                Content Sections
              </label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const currentSections = asArray<{ heading: string; content: string; items: string[] }>(form.getValues('data.sections'))
                  form.setValue('data.sections', [...currentSections, { heading: '', content: '', items: [] }])
                }}
                className="h-8 px-3 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Section
              </Button>
            </div>
            <FormField
              control={form.control}
              name="data.sections"
              render={({ field }) => {
                const sections = asArray<{ heading: string; content: string; items: string[] }>(field.value)
                return (
                <div className="space-y-3">
                  {sections.map((section, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-md border cms-card-bg cms-border space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium cms-text-secondary">
                          Section #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newSections = sections.filter((_, i: number) => i !== index)
                            field.onChange(newSections)
                          }}
                          className="h-7 w-7 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <FormField
                        control={form.control}
                        name={`data.sections.${index}.heading`}
                        render={({ field: headingField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Heading
                            </FormLabel>
                            <FormControl>
                              <Input {...headingField} placeholder="e.g., 1. Acceptance of Terms" value={asString(headingField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`data.sections.${index}.content`}
                        render={({ field: contentField }) => (
                          <FormItem>
                            <FormLabel className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                              Content
                            </FormLabel>
                            <FormControl>
                              <Textarea {...contentField} rows={4} placeholder="Section content text..." value={asString(contentField.value)} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="cms-text-secondary" style={{ fontWeight: '400', fontSize: '12px' }}>
                            Items (Optional)
                          </label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const currentItems = asArray<string>(section.items)
                              const updatedSections = [...sections]
                              updatedSections[index].items = [...currentItems, '']
                              field.onChange(updatedSections)
                            }}
                              className="h-6 px-2 text-xs cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        {asArray<string>(section.items).map((item: string, itemIndex: number) => (
                          <div key={itemIndex} className="flex gap-2">
                            <Input
                              value={asString(item)}
                              onChange={(e) => {
                                const updatedSections = [...sections]
                                updatedSections[index].items[itemIndex] = e.target.value
                                field.onChange(updatedSections)
                              }}
                              placeholder="Item text"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedSections = [...sections]
                                updatedSections[index].items = asArray<string>(section.items).filter(
                                  (_: string, i: number) => i !== itemIndex
                                )
                                field.onChange(updatedSections)
                              }}
                              className="h-9 w-9 p-0 cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {(sections.length === 0) && (
                    <p className="text-sm text-center py-4" style={{ color: '#5a5a5a' }}>
                      No sections added yet. Click &quot;Add Section&quot; to get started.
                    </p>
                  )}
                  </div>
                )
              }}
            />
          </div>
        )

      default:
        return (
          <div className="p-4 rounded-md border cms-card-bg cms-border">
            <p className="text-sm cms-text-secondary">
              Visual editor not available for section type: <strong className="cms-text-primary">{sectionType}</strong>
            </p>
            <p className="text-xs mt-2 cms-text-secondary">
              Please contact the development team to add support for this section type.
            </p>
            <div className="mt-4 p-3 rounded cms-card-bg cms-border border">
              <p className="text-xs mb-2 cms-text-secondary">Current content:</p>
              <pre className="text-xs overflow-auto max-h-40 cms-text-secondary">
                {JSON.stringify(section?.content || {}, null, 2)}
              </pre>
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            {isEditing ? 'Edit Section' : 'Create Section'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {isEditing
              ? 'Update section content and settings.'
              : 'Create a new section for this page.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Section Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                        <SelectTrigger className="cms-card cms-border cms-text-primary">
                          <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                  </FormControl>
                      <SelectContent className="cms-card cms-border">
                        <SelectItem value="hero" className="cms-text-primary">Hero</SelectItem>
                        <SelectItem value="pricing-hero" className="cms-text-primary">Pricing Hero</SelectItem>
                        <SelectItem value="pricing-plans" className="cms-text-primary">Pricing Plans</SelectItem>
                        <SelectItem value="free-messages" className="cms-text-primary">Free Messages</SelectItem>
                        <SelectItem value="message-bundles" className="cms-text-primary">Message Bundles</SelectItem>
                        <SelectItem value="pricing-info" className="cms-text-primary">Pricing Info</SelectItem>
                        <SelectItem value="pricing-faq" className="cms-text-primary">Pricing FAQ</SelectItem>
                        <SelectItem value="faq-category" className="cms-text-primary">FAQ Category</SelectItem>
                        <SelectItem value="feature-category" className="cms-text-primary">Feature Category</SelectItem>
                        <SelectItem value="how-it-works" className="cms-text-primary">How It Works</SelectItem>
                        <SelectItem value="gallery" className="cms-text-primary">Gallery</SelectItem>
                        <SelectItem value="testimonials" className="cms-text-primary">Testimonials</SelectItem>
                        <SelectItem value="app-download" className="cms-text-primary">App Download</SelectItem>
                        <SelectItem value="coming-soon" className="cms-text-primary">Coming Soon</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Choose the type of section you want to create
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}
            {isEditing && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormControl>
                      <Input {...field} disabled={isEditing} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="order_index"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {renderTypeSpecificFields()}

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-4 rounded-lg border cms-card-bg cms-border">
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>
                      Publish Section
                    </FormLabel>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      {field.value 
                        ? 'This section will be visible on the website' 
                        : 'This section will be saved as a draft'}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

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
                disabled={form.formState.isSubmitting || isPending}
                className="h-10 px-5"
                style={{
                  backgroundColor: (form.formState.isSubmitting || isPending) ? 'rgba(102, 45, 145, 0.5)' : ((form.watch('published') as boolean) ? '#662D91' : 'transparent'),
                  borderColor: (form.watch('published') as boolean) ? '#662D91' : 'transparent',
                  color: (form.watch('published') as boolean) ? '#ffffff' : 'inherit',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {(form.formState.isSubmitting || isPending)
                  ? 'Saving...'
                  : form.watch('published')
                    ? (isEditing ? 'Save and Publish' : 'Create and Publish')
                    : (isEditing ? 'Save as Draft' : 'Create Draft')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

