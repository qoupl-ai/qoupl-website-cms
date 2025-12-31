'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Image as ImageIcon,
  History,
  Power,
  PanelLeft,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { CMSThemeToggle } from './cms-theme-toggle'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '@/lib/supabase/types'

interface CMSNavProps {
  user: User
  adminUser: AdminUser
}

const navItems = [
  { href: '/add-content', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/add-content/pages', label: 'Pages', icon: FileText },
  { href: '/add-content/global', label: 'Global Content', icon: Sparkles },
  { href: '/add-content/media', label: 'Media', icon: ImageIcon },
  { href: '/add-content/history', label: 'History', icon: History },
]

type SidebarMode = 'expanded' | 'collapsed' | 'hover'

export default function CMSNav({ user, adminUser }: CMSNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('hover')
  const [isHovered, setIsHovered] = useState(false)
  const [showModeMenu, setShowModeMenu] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [themeMenuPosition, setThemeMenuPosition] = useState({ top: 0, left: 0 })
  const themeButtonRef = useRef<HTMLButtonElement>(null)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Default to light during SSR to match server render
  const displayTheme = mounted ? (theme === 'system' ? resolvedTheme : theme) : 'light'

  // Determine if sidebar should be expanded based on mode
  const isExpanded = sidebarMode === 'expanded' || (sidebarMode === 'hover' && isHovered)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Update main content margin when sidebar expands/collapses
  useEffect(() => {
    const main = document.querySelector('main[data-cms-main]') as HTMLElement
    if (main) {
      const width = isExpanded ? '200px' : '60px'
      main.style.marginLeft = width
      main.style.transition = 'margin-left 300ms ease-in-out'
    }
  }, [isExpanded])

  // Close mode menu when clicking outside or when sidebar collapses
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-sidebar-mode-menu]')) {
        setShowModeMenu(false)
      }
    }

    if (showModeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModeMenu])

  // Close menu when sidebar collapses (if in hover mode)
  useEffect(() => {
    if (!isExpanded && showModeMenu && sidebarMode === 'hover') {
      setShowModeMenu(false)
    }
  }, [isExpanded, showModeMenu, sidebarMode])

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-theme-menu]')) {
        setShowThemeMenu(false)
      }
    }

    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showThemeMenu])

  // Close theme menu when sidebar collapses (if in hover mode)
  useEffect(() => {
    if (!isExpanded && showThemeMenu && sidebarMode === 'hover') {
      setShowThemeMenu(false)
    }
  }, [isExpanded, showThemeMenu, sidebarMode])

  // Calculate theme menu position based on button position
  useEffect(() => {
    if (showThemeMenu && themeButtonRef.current) {
      const updatePosition = () => {
        if (themeButtonRef.current) {
          const buttonRect = themeButtonRef.current.getBoundingClientRect()
          const menuHeight = 120 // Approximate height of menu (3 items × ~40px each)
          setThemeMenuPosition({
            top: buttonRect.top - menuHeight - 8, // Position above button with 8px gap
            left: buttonRect.right + 8, // Position to the right of button
          })
        }
      }
      
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        updatePosition()
      })
      
      // Recalculate on window resize or scroll
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
      
      return () => {
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    } else if (!showThemeMenu) {
      // Reset position when menu is closed
      setThemeMenuPosition({ top: 0, left: 0 })
    }
  }, [showThemeMenu, isExpanded])

  const modeOptions = [
    { value: 'expanded' as SidebarMode, label: 'Expanded' },
    { value: 'collapsed' as SidebarMode, label: 'Collapsed' },
    { value: 'hover' as SidebarMode, label: 'Expand on Hover' },
  ]

  return (
    <aside
      className={`fixed left-0 top-0 h-screen cms-sidebar-bg cms-sidebar-border transition-all duration-300 z-50 flex flex-col ${
        isExpanded ? 'w-[200px]' : 'w-[60px]'
      }`}
      style={{ fontFamily: "'Google Sans Flex', system-ui, sans-serif" }}
      onMouseEnter={() => {
        if (sidebarMode === 'hover' && !showModeMenu) {
          setIsHovered(true)
        }
      }}
      onMouseLeave={() => {
        if (sidebarMode === 'hover' && !showModeMenu) {
          setIsHovered(false)
        }
      }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-3 cms-sidebar-border-b">
        {isExpanded && (
          <Link href="/add-content" className="flex items-center gap-2">
            <div className="relative h-7 w-auto">
              <Image
                src="/images/quoupl.svg"
                alt="qoupl logo"
                width={80}
                height={28}
                className="h-7 w-auto cms-logo"
              />
            </div>
            <span className="text-xs font-semibold cms-text-secondary">CMS</span>
          </Link>
        )}
        {!isExpanded && (
          <Link href="/add-content" className="flex items-center justify-center w-full">
            <div className="relative h-7 w-7">
              <Image
                src="/images/quoupl.svg"
                alt="qoupl logo"
                width={28}
                height={28}
                className="h-7 w-7 cms-logo"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full gap-2 h-10 px-2 cms-sidebar-button transition-colors ${
                    isExpanded ? 'justify-start' : 'justify-center'
                  } ${
                    isActive ? 'cms-menu-item-active' : ''
                  }`}
                  style={{ fontWeight: '600' }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {isExpanded && (
                    <span className="font-semibold whitespace-nowrap" style={{ fontSize: '13px' }}>{item.label}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section - User, Logout, Sidebar Control, and Theme Toggle */}
      <div className="cms-sidebar-border-t space-y-1 mt-auto">
        {/* User Profile */}
        <div className="p-2">
          {isExpanded ? (
            <div className="px-2 py-1">
              <p className="font-semibold cms-text-primary truncate" style={{ fontWeight: '600', fontSize: '13px' }}>
                {adminUser.name || user.email}
              </p>
              <p className="cms-text-secondary font-medium" style={{ fontSize: '11px' }}>Admin</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="h-8 w-8 rounded-full cms-card-bg flex items-center justify-center cms-border border">
                <span className="text-xs cms-text-primary font-semibold" style={{ fontWeight: '600' }}>
                  {(adminUser.name || user.email || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="px-2">
          {isExpanded ? (
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-2 h-9 px-2 cms-sidebar-button"
              style={{ fontWeight: '600' }}
            >
              <Power className="h-4 w-4 shrink-0" />
              <span className="font-semibold" style={{ fontSize: '13px' }}>Sign Out</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="w-full h-9 cms-sidebar-button justify-center"
              title="Sign Out"
            >
              <Power className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sidebar Mode Control */}
        <div className="px-2 pb-2 relative" data-sidebar-mode-menu>
          <Button
            variant="ghost"
            onClick={() => setShowModeMenu(!showModeMenu)}
            className={`w-full gap-2 h-9 px-2 cms-sidebar-button ${
              isExpanded ? 'justify-start' : 'justify-center'
            }`}
            style={{ fontWeight: '600' }}
            onMouseEnter={() => {
              // Prevent sidebar from collapsing when hovering over the menu button
              if (sidebarMode === 'hover') {
                setIsHovered(true)
              }
            }}
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
            {isExpanded && (
              <span className="font-semibold" style={{ fontSize: '13px' }}>Sidebar</span>
            )}
          </Button>

          {/* Mode Menu - Positioned outside sidebar */}
          {showModeMenu && (
            <div 
              className="fixed cms-menu-bg cms-menu-border rounded-md shadow-lg overflow-hidden"
              style={{ 
                zIndex: 1000, 
                width: '140px',
                left: isExpanded ? '208px' : '68px',
                bottom: '80px'
              }}
              onMouseEnter={() => {
                // Keep sidebar expanded when hovering over menu
                if (sidebarMode === 'hover') {
                  setIsHovered(true)
                }
              }}
              onMouseLeave={() => {
                // Only collapse if not in expanded mode
                if (sidebarMode === 'hover') {
                  setIsHovered(false)
                }
              }}
            >
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSidebarMode(option.value)
                    setShowModeMenu(false)
                    // If switching to expanded, ensure it stays expanded
                    if (option.value === 'expanded') {
                      setIsHovered(false)
                    }
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors cms-menu-item ${
                    sidebarMode === option.value
                      ? 'cms-menu-item-active'
                      : 'cms-menu-item-inactive'
                  }`}
                  style={{ fontWeight: '600', fontSize: '12px' }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <div className="px-2 pb-2 relative" data-theme-menu>
          {isExpanded ? (
            <CMSThemeToggle />
          ) : (
            <>
              <Button
                ref={themeButtonRef}
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (!showThemeMenu && themeButtonRef.current) {
                    // Calculate position immediately when opening menu
                    const buttonRect = themeButtonRef.current.getBoundingClientRect()
                    const menuHeight = 120
                    const spaceAbove = buttonRect.top
                    const spaceBelow = window.innerHeight - buttonRect.bottom
                    
                    // Position above button if there's enough space, otherwise below
                    if (spaceAbove >= menuHeight + 8) {
                      setThemeMenuPosition({
                        top: buttonRect.top - menuHeight - 8,
                        left: buttonRect.right + 8,
                      })
                    } else {
                      setThemeMenuPosition({
                        top: buttonRect.bottom + 8,
                        left: buttonRect.right + 8,
                      })
                    }
                  }
                  setShowThemeMenu(!showThemeMenu)
                }}
                className="w-full h-9 cms-sidebar-button justify-center"
                title="Theme"
                onMouseEnter={() => {
                  // Prevent sidebar from collapsing when hovering over the theme button
                  if (sidebarMode === 'hover') {
                    setIsHovered(true)
                  }
                }}
              >
                {displayTheme === 'dark' ? <Moon className="h-4 w-4" /> : displayTheme === 'light' ? <Sun className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              {/* Theme Menu - Positioned outside sidebar */}
              {showThemeMenu && (
                <div 
                  className="fixed cms-menu-bg cms-menu-border rounded-md shadow-lg overflow-hidden"
                  style={{ 
                    zIndex: 1000, 
                    width: '140px',
                    top: `${themeMenuPosition.top}px`,
                    left: `${themeMenuPosition.left}px`
                  }}
                  onMouseEnter={() => {
                    // Keep sidebar expanded when hovering over menu
                    if (sidebarMode === 'hover') {
                      setIsHovered(true)
                    }
                  }}
                  onMouseLeave={() => {
                    // Only collapse if not in expanded mode
                    if (sidebarMode === 'hover') {
                      setIsHovered(false)
                    }
                  }}
                >
                  <button
                    onClick={() => {
                      setTheme('dark')
                      setShowThemeMenu(false)
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
                      setShowThemeMenu(false)
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
                      setShowThemeMenu(false)
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
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
