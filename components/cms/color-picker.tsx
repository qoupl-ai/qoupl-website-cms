'use client'

import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Palette } from 'lucide-react'

// Predefined color options
const colorOptions = [
  { name: 'Brand Purple', value: 'bg-[#662D91]', hex: '#662D91' },
  { name: 'Blue', value: 'bg-blue-500', hex: '#3b82f6' },
  { name: 'Green', value: 'bg-green-500', hex: '#10b981' },
  { name: 'Red', value: 'bg-red-500', hex: '#ef4444' },
  { name: 'Yellow', value: 'bg-yellow-500', hex: '#eab308' },
  { name: 'Pink', value: 'bg-pink-500', hex: '#ec4899' },
  { name: 'Indigo', value: 'bg-indigo-500', hex: '#6366f1' },
  { name: 'Purple', value: 'bg-purple-500', hex: '#a855f7' },
  { name: 'Orange', value: 'bg-orange-500', hex: '#f97316' },
  { name: 'Teal', value: 'bg-teal-500', hex: '#14b8a6' },
  { name: 'Cyan', value: 'bg-cyan-500', hex: '#06b6d4' },
  { name: 'Amber', value: 'bg-amber-500', hex: '#f59e0b' },
]

interface ColorPickerProps {
  value?: string
  onChange: (value: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label = 'Color' }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [customColor, setCustomColor] = useState('')

  // Extract hex from value if it's a Tailwind class
  const getHexFromValue = (val?: string) => {
    if (!val) return '#662D91'
    // If it's already a hex, return it
    if (val.startsWith('#')) return val
    // If it's a Tailwind class like bg-[#662D91], extract hex
    const match = val.match(/#[0-9A-Fa-f]{6}/)
    if (match) return match[0]
    // Find in predefined options
    const option = colorOptions.find(opt => opt.value === val)
    return option?.hex || '#662D91'
  }

  const currentHex = getHexFromValue(value)

  const handleCustomColor = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(`bg-[${hex}]`)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start cms-card cms-border cms-text-secondary"
          style={{
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          <div
            className="h-4 w-4 mr-2 rounded border"
            style={{
              backgroundColor: currentHex,
              borderColor: '#2a2a2a',
            }}
          />
          {value || `Select ${label}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 cms-card-bg cms-border"
      >
        <div className="p-3 space-y-3">
          <div>
            <label className="text-xs font-medium mb-2 block cms-text-secondary">
              Predefined Colors
            </label>
            <div className="grid grid-cols-4 gap-2">
              {colorOptions.map((color) => {
                const isSelected = value === color.value
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      onChange(color.value)
                      setOpen(false)
                    }}
                    className="relative p-1 rounded border transition-all hover:scale-110"
                    style={{
                      backgroundColor: color.hex,
                      borderColor: isSelected ? '#662D91' : '#2a2a2a',
                      borderWidth: isSelected ? '2px' : '1px',
                    }}
                    title={color.name}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-2 block cms-text-secondary">
              Custom Color (Hex)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="#662D91"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-9 flex-1"
                style={{
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a',
                  color: '#ffffff',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomColor(customColor)
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => handleCustomColor(customColor)}
                className="h-9 px-3"
                style={{
                  backgroundColor: '#212121',
                  borderColor: '#2a2a2a',
                  color: '#898989',
                }}
              >
                Apply
              </Button>
            </div>
            {customColor && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className="h-6 w-6 rounded border"
                  style={{
                    backgroundColor: customColor.match(/^#[0-9A-Fa-f]{6}$/) ? customColor : 'transparent',
                    borderColor: '#2a2a2a',
                  }}
                />
                <span className="text-xs cms-text-secondary">
                  {customColor.match(/^#[0-9A-Fa-f]{6}$/) ? 'Valid' : 'Invalid hex'}
                </span>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

