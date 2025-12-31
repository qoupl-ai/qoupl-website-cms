'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function CMSBodyClass() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    // Add class to body when CMS is mounted
    document.body.classList.add('cms-page')
    
    // Theme-aware background colors are handled by CSS classes
    // No need to set inline styles here
    
    return () => {
      // Cleanup on unmount
      document.body.classList.remove('cms-page')
    }
  }, [resolvedTheme])

  return null
}

