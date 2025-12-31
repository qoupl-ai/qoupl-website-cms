'use client'

import { useState, useEffect, useRef } from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function CMSThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return null
  }

  const displayTheme = theme === 'system' ? resolvedTheme : theme
  const currentIcon = displayTheme === 'dark' ? <Moon className="h-4 w-4" /> : displayTheme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full gap-2 h-9 px-2 justify-start cms-theme-toggle-button"
        style={{ fontWeight: '600' }}
      >
        {currentIcon}
        <span className="font-semibold" style={{ fontSize: '13px' }}>Theme</span>
      </Button>

      {isOpen && (
        <div 
          className="fixed cms-menu-bg cms-menu-border rounded-md shadow-lg z-50 overflow-hidden"
          style={{ 
            width: '140px',
            left: '208px',
            bottom: '80px'
          }}
        >
          <button
            onClick={() => {
              setTheme('dark')
              setIsOpen(false)
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors cms-menu-item ${
              theme === 'dark'
                ? 'cms-menu-item-active'
                : 'cms-menu-item-inactive'
            }`}
            style={{ fontWeight: '600', fontSize: '12px' }}
          >
            <Moon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={() => {
              setTheme('light')
              setIsOpen(false)
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors cms-menu-item ${
              theme === 'light'
                ? 'cms-menu-item-active'
                : 'cms-menu-item-inactive'
            }`}
            style={{ fontWeight: '600', fontSize: '12px' }}
          >
            <Sun className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={() => {
              setTheme('system')
              setIsOpen(false)
            }}
            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors cms-menu-item ${
              theme === 'system'
                ? 'cms-menu-item-active'
                : 'cms-menu-item-inactive'
            }`}
            style={{ fontWeight: '600', fontSize: '12px' }}
          >
            <Monitor className="h-4 w-4" />
            System
          </button>
        </div>
      )}
    </div>
  )
}
