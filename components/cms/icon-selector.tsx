'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

// Direct imports for common/social media icons (guaranteed to work)
import {
  Heart, Shield, Zap, Users, Sparkles, Lock, Eye, Star,
  Filter, Bell, MapPin, Camera, Phone, MessageCircle, Code, Rocket,
  Mail, Target, TrendingUp, Globe, Settings, Home, User,
  Menu, X, Plus, Minus, Edit, Trash2, Save, Download, Upload,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Calendar, Clock, DollarSign, FileText, Image, Video, Music, Film,
  Linkedin, Instagram, Twitter, Facebook, Youtube, Github, Gitlab,
  Slack, Twitch, Dribbble, Figma,
} from 'lucide-react'

// Base icon map with directly imported icons
const baseIconMap: Record<string, React.ComponentType<any>> = {
  Heart, Shield, Zap, Users, Sparkles, Check, Lock, Eye, Star,
  Filter, Bell, MapPin, Camera, Phone, MessageCircle, Code, Rocket,
  Mail, Target, TrendingUp, Globe, Settings, Home, User, Search,
  Menu, X, Plus, Minus, Edit, Trash2, Save, Download, Upload,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ChevronRight, ChevronLeft,
  Calendar, Clock, DollarSign, FileText, Image, Video, Music, Film,
  Linkedin, Instagram, Twitter, Facebook, Youtube, Github, Gitlab,
  Slack, Twitch, Dribbble, Figma,
}

interface IconSelectorProps {
  value?: string
  onChange: (value: string) => void
  label?: string
}

export function IconSelector({ value, onChange, label = 'Icon' }: IconSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [iconMap, setIconMap] = useState<Record<string, React.ComponentType<any>>>(baseIconMap)
  const [iconNames, setIconNames] = useState<string[]>(Object.keys(baseIconMap))

  // Load additional icons dynamically on mount
  useEffect(() => {
    try {
      const allExports = Object.keys(LucideIcons)
      const additionalIcons: Record<string, React.ComponentType<any>> = {}
      const names = new Set<string>(Object.keys(baseIconMap))
      
      // Process all exports to find additional icons
      allExports.forEach((name) => {
        // Skip non-icon exports
        if (
          name === 'createLucideIcon' ||
          name === 'IconNode' ||
          name === 'IconProps' ||
          name === 'Icon' ||
          name.startsWith('Lucide') ||
          name.startsWith('_') ||
          name === 'default' ||
          name === '__esModule' ||
          name === 'lucideReact'
        ) {
          return
        }
        
        const exportValue = (LucideIcons as any)[name]
        
        // Must be a function (React component) and start with uppercase
        if (typeof exportValue === 'function' && name[0] === name[0].toUpperCase() && name.length > 0) {
          // If it ends with "Icon", extract base name
          if (name.endsWith('Icon')) {
            const baseName = name.slice(0, -4)
            if (baseName.length > 0 && !names.has(baseName)) {
              additionalIcons[baseName] = exportValue
              names.add(baseName)
            }
          } else {
            // Add base name directly if not already in base map
            if (!names.has(name)) {
              additionalIcons[name] = exportValue
              names.add(name)
            }
          }
        }
      })
      
      // Merge base icons with additional icons
      const mergedIcons = { ...baseIconMap, ...additionalIcons }
      const sortedNames = Array.from(names).sort()
      
      setIconMap(mergedIcons)
      setIconNames(sortedNames)
    } catch (error) {
      console.error('[IconSelector] Error loading additional icons:', error)
      // Keep base icons if dynamic loading fails
    }
  }, [])

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!search.trim()) {
      return iconNames
    }
    const searchLower = search.toLowerCase().trim()
    return iconNames.filter((icon) =>
      icon.toLowerCase().includes(searchLower)
    )
  }, [search, iconNames])

  // Sort: alphabetically
  const sortedIcons = useMemo(() => {
    return [...filteredIcons].sort((a, b) => a.localeCompare(b))
  }, [filteredIcons])

  // Get the selected icon component
  const SelectedIcon = value ? iconMap[value] : null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start cms-card cms-border cms-text-secondary"
          style={{
            fontSize: '13px',
            fontWeight: '500',
            height: '40px',
          }}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4 mr-2" />
              {value}
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              {value ? `${value} (not found)` : `Select ${label}`}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[200px] p-0 cms-card-bg cms-border"
        align="start"
        sideOffset={4}
        style={{
          padding: 0,
          maxHeight: '400px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="p-2 border-b cms-border flex-shrink-0">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
            style={{
              fontSize: '12px',
            }}
            autoFocus
          />
          <p className="text-xs mt-1.5 cms-text-secondary">
            {sortedIcons.length} {sortedIcons.length === 1 ? 'icon' : 'icons'} available
          </p>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '350px' }}>
          {sortedIcons.length > 0 ? (
            <div className="flex flex-col">
              {sortedIcons.map((iconName) => {
                const Icon = iconMap[iconName]
                const isSelected = value === iconName
                
                if (!Icon) {
                  return null
                }
                
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName)
                      setOpen(false)
                      setSearch('')
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 border-b cms-border transition-all hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a]"
                    style={{
                      backgroundColor: isSelected ? 'rgba(23,23,23,0.1)' : 'transparent',
                    }}
                    title={iconName}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 flex-shrink-0 cms-text-secondary" />
                      <span className="text-xs cms-text-primary" style={{ fontSize: '12px' }}>
                        {iconName}
                      </span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 flex-shrink-0" style={{ color: '#662D91' }} />
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm mb-2 cms-text-secondary">
                No icons found
              </p>
              <p className="text-xs cms-text-secondary">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
