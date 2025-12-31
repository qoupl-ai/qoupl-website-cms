/**
 * Content Fetching Helpers
 * 
 * Functions to fetch content from Supabase tables:
 * - global_content (navbar, footer, social links, etc.)
 * - sections (page sections/components)
 */

import { createClient } from '@/lib/supabase/server'
import { getStorageUrl } from '@/lib/supabase/storage-url'

// ============================================================================
// Global Content Helpers
// ============================================================================

export async function getGlobalContent(key: string): Promise<any> {
  const supabase = await createClient()
  
  try {
    // Use maybeSingle() instead of single() to handle missing rows gracefully
    const { data, error } = await supabase
      .from('global_content')
      .select('content')
      .eq('key', key)
      .maybeSingle()

    if (error) {
      // Log error but don't throw - return null for graceful fallback
      console.warn(`[getGlobalContent] Key "${key}" not found or error:`, error.message)
      return null
    }

    // Return null if no data found (key doesn't exist in database)
    if (!data || !data.content) {
      return null
    }

    return data.content
  } catch (error) {
    // Catch any unexpected errors
    console.error(`[getGlobalContent] Unexpected error for key "${key}":`, error)
    return null
  }
}

export async function getNavbarContent(): Promise<NavbarContent | null> {
  const content = await getGlobalContent('navbar')
  // Ensure content matches NavbarContent structure
  if (content && typeof content === 'object' && 'links' in content) {
    return content as NavbarContent
  }
  return null
}

export async function getFooterContent() {
  return await getGlobalContent('footer')
}

export async function getSocialLinks(): Promise<SocialLinks | null> {
  const content = await getGlobalContent('social_links')
  if (!content) return null
  
  // Handle backward compatibility: convert old format { linkedin, instagram } to new format { links: [...] }
  if (content.linkedin || content.instagram) {
    const links: SocialLink[] = []
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
    return content as SocialLinks
  }
  
  return null
}

export async function getContactInfo() {
  return await getGlobalContent('contact_info')
}

export async function getSiteConfig() {
  return await getGlobalContent('site_config')
}

// ============================================================================
// Section Helpers
// ============================================================================

export async function getPageSections(pageSlug: string) {
  const supabase = await createClient()

  try {
    // Get page ID - don't filter by published here, let RLS handle it
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', pageSlug)
      .maybeSingle()

    if (pageError) {
      console.error(`[getPageSections] Error fetching page ${pageSlug}:`, pageError.message, pageError)
      return []
    }

    if (!page) {
      console.warn(`[getPageSections] Page not found: ${pageSlug}`)
      return []
    }

    // Get sections for this page - RLS will filter by published automatically
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', page.id)
      .order('order_index', { ascending: true })

    if (sectionsError) {
      console.error(`[getPageSections] Error fetching sections for ${pageSlug}:`, sectionsError.message, sectionsError)
      return []
    }

    // Filter by published manually as a fallback (RLS should handle this, but just in case)
    const publishedSections = (sections || []).filter(s => s.published === true)
    
    // Normalize component_type field (handle both column names)
    const normalizedSections = publishedSections.map(s => ({
      ...s,
      component_type: s.component_type || (s as any).section_type || 'unknown',
    }))
    
    if (normalizedSections.length === 0 && (sections || []).length > 0) {
      console.warn(`[getPageSections] Found ${sections?.length || 0} sections for ${pageSlug}, but none are published`)
    }

    return normalizedSections
  } catch (error) {
    console.error(`[getPageSections] Unexpected error for ${pageSlug}:`, error)
    return []
  }
}

export async function getSectionByType(pageSlug: string, componentType: string) {
  const sections = await getPageSections(pageSlug)
  return sections.find((s) => s.component_type === componentType)
}

// ============================================================================
// Helper: Process image paths to full URLs
// ============================================================================

export function processImagePath(path: string, bucket?: string): string {
  if (!path) return ''
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  // If path includes bucket, extract it
  if (path.includes('/')) {
    const parts = path.split('/')
    const bucketName = bucket || parts[0]
    const imagePath = parts.slice(1).join('/')
    return getStorageUrl(bucketName, imagePath)
  }

  // Default bucket if not specified
  const defaultBucket = bucket || 'hero-images'
  return getStorageUrl(defaultBucket, path)
}

// ============================================================================
// Type Definitions
// ============================================================================

export interface NavbarContent {
  links: Array<{ href: string; label: string }>
  logo: {
    src: string
    alt: string
    width: number
    height: number
  }
}

export interface FooterContent {
  brand: {
    description: string
    logo: {
      src: string
      alt: string
      width: number
      height: number
    }
  }
  columns: {
    product: {
      title: string
      links: Array<{ href: string; label: string }>
    }
    company: {
      title: string
      links: Array<{ href: string; label: string }>
    }
    legal: {
      title: string
      links: Array<{ href: string; label: string }>
    }
  }
  copyright: {
    text: string
    company: string
  }
}

export interface SocialLink {
  icon: string
  url: string
  label?: string
}

export interface SocialLinks {
  links: SocialLink[]
}

export interface SiteConfig {
  waitlist_count: number
  tagline: string
  subtitle: string
}

