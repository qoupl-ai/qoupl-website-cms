/**
 * Zod Schemas for Section Validation
 * 
 * Type-safe validation for all section types.
 * Used in section-actions and section-editor.
 */

import { z } from 'zod'

// Base section schema
export const baseSectionSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  order_index: z.number().int().min(0),
  published: z.boolean(),
})

// Hero section schema
export const heroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().min(1, 'Title is required'),
    tagline: z.string().optional(),
    subtitle: z.string().optional(),
    cta: z.object({
      text: z.string().optional(),
      buttonText: z.string().optional(),
      subtext: z.string().optional(),
      badge: z.string().optional(),
    }).optional(),
    images: z.object({
      women: z.array(z.string()).optional(),
      men: z.array(z.string()).optional(),
    }).optional(),
  }),
})

// Blog post section schema
export const blogPostSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
    excerpt: z.string().min(20, 'Excerpt must be at least 20 characters'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    category_id: z.string().uuid().optional(),
    author: z.string().optional(),
    publish_date: z.string().optional(),
    read_time: z.number().int().min(1).optional(),
    featured_image: z.string().optional(),
  }),
})

// FAQ category section schema
export const faqCategorySectionSchema = baseSectionSchema.extend({
  data: z.object({
    category_id: z.string().uuid(),
    faqs: z.array(z.object({
      question: z.string().min(1, 'Question is required'),
      answer: z.string().min(1, 'Answer is required'),
      order_index: z.number().int().min(0).optional(),
    })),
  }),
})

// Feature category section schema
export const featureCategorySectionSchema = baseSectionSchema.extend({
  data: z.object({
    category_id: z.string().uuid(),
    features: z.array(z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      icon: z.string().optional(),
      order_index: z.number().int().min(0).optional(),
    })),
  }),
})

// Pricing plans section schema
export const pricingPlansSectionSchema = baseSectionSchema.extend({
  data: z.object({
    plans: z.array(z.object({
      name: z.string().min(1, 'Plan name is required'),
      price: z.number().min(0, 'Price must be non-negative'),
      currency: z.string().default('INR'),
      billing_period: z.string().optional(),
      features: z.array(z.string()),
      is_popular: z.boolean().default(false),
      order_index: z.number().int().min(0).optional(),
    })),
  }),
})

// Pricing hero section schema
export const pricingHeroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
  }),
})

// Free messages section schema
export const freeMessagesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    count: z.number().int().min(0).default(3),
    title: z.string().optional(),
    description: z.string().optional(),
  }),
})

// Message bundles section schema
export const messageBundlesSectionSchema = baseSectionSchema.extend({
  data: z.object({
    price_per_message: z.number().min(0).default(10),
    gst_rate: z.number().min(0).max(100).default(18),
    bundles: z.array(z.object({
      messages: z.number().int().min(1),
      popular: z.boolean().default(false),
    })),
    min_messages: z.number().int().min(1).default(5),
    max_messages: z.number().int().min(1).default(100),
    title: z.string().optional(),
    subtitle: z.string().optional(),
  }),
})

// Pricing info section schema
export const pricingInfoSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    items: z.array(z.string()),
  }),
})

// Pricing FAQ section schema
export const pricingFaqSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string().min(1, 'Question is required'),
      answer: z.string().min(1, 'Answer is required'),
    })),
    cta: z.object({
      text: z.string().optional(),
      link: z.string().optional(),
    }).optional(),
  }),
})

// How it works section schema
export const howItWorksSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    steps: z.array(z.object({
      step: z.string(),
      title: z.string().min(1, 'Step title is required'),
      description: z.string().min(1, 'Step description is required'),
      image: z.string().optional(),
    })),
  }),
})

// Gallery section schema
export const gallerySectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
    images: z.array(z.object({
      image: z.string(),
      alt: z.string().optional(),
      title: z.string().optional(),
      story: z.string().optional(),
    })),
    cta: z.object({
      text: z.string().optional(),
      highlight: z.string().optional(),
    }).optional(),
  }),
})

// Testimonials section schema
export const testimonialsSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
    testimonials: z.array(z.object({
      name: z.string().min(1, 'Name is required'),
      image: z.string().optional(),
      text: z.string().min(1, 'Testimonial text is required'),
      location: z.string().optional(),
      rating: z.number().int().min(1).max(5).optional(),
      date: z.string().optional(),
    })),
    stats: z.object({
      text: z.string().optional(),
      icon: z.string().optional(),
    }).optional(),
  }),
})

// App download section schema
export const appDownloadSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
    benefits: z.array(z.string()).optional(),
    cta: z.object({
      text: z.string().optional(),
      subtext: z.string().optional(),
    }).optional(),
    platforms: z.array(z.object({
      name: z.string(),
      icon: z.string().optional(),
      coming: z.boolean().default(true),
    })).optional(),
    stats: z.object({
      text: z.string().optional(),
      count: z.string().optional(),
      suffix: z.string().optional(),
    }).optional(),
    images: z.object({
      decorative: z.array(z.string()).optional(),
    }).optional(),
  }),
})

// Coming soon section schema
export const comingSoonSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
    cta: z.object({
      text: z.string().optional(),
    }).optional(),
    platforms: z.array(z.object({
      name: z.string(),
      icon: z.string().optional(),
      coming: z.boolean().default(true),
    })).optional(),
    stats: z.object({
      text: z.string().optional(),
      count: z.string().optional(),
    }).optional(),
    screenshots: z.array(z.string()).optional(),
  }),
})

// Contact Hero section schema
export const contactHeroSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    badge: z.object({
      icon: z.string().optional(),
      text: z.string().optional(),
    }).optional(),
  }),
})

// Contact Info section schema
export const contactInfoSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    items: z.array(z.object({
      icon: z.string().optional(),
      title: z.string().optional(),
      details: z.string().optional(),
      link: z.string().nullable().optional(),
    })).optional(),
  }),
})

// Contact Info Details section schema (for the info cards on the right)
export const contactInfoDetailsSectionSchema = baseSectionSchema.extend({
  data: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    items: z.array(z.object({
      icon: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
    })).optional(),
    faq_link: z.object({
      text: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
  }),
})

// Registry of all section schemas
export const sectionSchemas: Record<string, z.ZodSchema> = {
  'hero': heroSectionSchema,
  'blog-post': blogPostSectionSchema,
  'faq-category': faqCategorySectionSchema,
  'feature-category': featureCategorySectionSchema,
  'pricing-plans': pricingPlansSectionSchema,
  'pricing-hero': pricingHeroSectionSchema,
  'free-messages': freeMessagesSectionSchema,
  'message-bundles': messageBundlesSectionSchema,
  'pricing-info': pricingInfoSectionSchema,
  'pricing-faq': pricingFaqSectionSchema,
  'contact-hero': contactHeroSectionSchema,
  'contact-info': contactInfoSectionSchema,
  'contact-info-details': contactInfoDetailsSectionSchema,
  'how-it-works': howItWorksSectionSchema,
  'gallery': gallerySectionSchema,
  'testimonials': testimonialsSectionSchema,
  'app-download': appDownloadSectionSchema,
  'coming-soon': comingSoonSectionSchema,
}

/**
 * Get schema for a section type
 */
export function getSectionSchema(type: string): z.ZodSchema {
  return sectionSchemas[type] || baseSectionSchema.extend({
    data: z.record(z.string(), z.any()),
  })
}

/**
 * Validate section data
 */
export function validateSectionData(type: string, data: any): { success: boolean; error?: string } {
  try {
    const schema = getSectionSchema(type)
    schema.parse({ type, data, order_index: 0, published: false })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      }
    }
    return { success: false, error: 'Validation failed' }
  }
}

