'use client'

import { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ExternalLink, Link as LinkIcon } from 'lucide-react'

interface Page {
  slug: string
  title: string
}

interface PageSelectorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  pages: Page[]
}

export function PageSelector({ value, onChange, placeholder = 'Select a page...', pages }: PageSelectorProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [customValue, setCustomValue] = useState('')

  useEffect(() => {
    // Check if current value is a custom URL (not in pages list)
    const pageSlug = value.startsWith('/') ? value.slice(1) : value
    const isInPages = pages.some(p => p.slug === pageSlug || `/${p.slug}` === value)
    setIsCustom(!isInPages && value !== '')
    if (!isInPages && value !== '') {
      setCustomValue(value)
    }
  }, [value, pages])

  const handlePageSelect = (selectedSlug: string) => {
    if (selectedSlug === '__custom__') {
      setIsCustom(true)
      setCustomValue(value || '')
    } else {
      setIsCustom(false)
      // Use slug directly, or prepend / if needed
      const href = selectedSlug === 'home' ? '/' : `/${selectedSlug}`
      onChange(href)
    }
  }

  const handleCustomSave = () => {
    onChange(customValue)
  }

  if (isCustom) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          placeholder="/custom-path or https://example.com"
          className="flex-1"
          style={{
            backgroundColor: '#171717',
            borderColor: '#2a2a2a',
            color: '#ffffff',
            fontSize: '13px',
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCustomSave}
          className="h-8 px-3"
          style={{ color: '#662D91' }}
        >
          Save
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsCustom(false)
            setCustomValue('')
            onChange('')
          }}
          className="h-8 px-3 cms-text-secondary"
        >
          Cancel
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Select value={value === '/' ? 'home' : value.replace(/^\//, '') || ''} onValueChange={handlePageSelect}>
        <SelectTrigger className="flex-1" style={{ height: '40px' }}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="home">Home (/)</SelectItem>
          {pages
            .filter(p => p.slug !== 'home')
            .map((page) => (
              <SelectItem key={page.slug} value={page.slug}>
                {page.title} (/{page.slug})
              </SelectItem>
            ))}
          <SelectItem value="__custom__">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-3 w-3" />
              Custom URL
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => window.open(value.startsWith('http') ? value : `http://localhost:3000${value}`, '_blank')}
          className="h-8 w-8 p-0 cms-text-secondary"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

