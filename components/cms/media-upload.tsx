'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const BUCKETS = [
  { value: 'hero-images', label: 'Hero Images' },
  { value: 'couple-photos', label: 'Couple Photos' },
  { value: 'app-screenshots', label: 'App Screenshots' },
  { value: 'blog-images', label: 'Blog Images' },
  { value: 'user-uploads', label: 'User Uploads' },
]

const CATEGORIES = [
  { value: 'hero', label: 'Hero' },
  { value: 'blog', label: 'Blog' },
  { value: 'gallery', label: 'Gallery' },
  { value: 'screenshot', label: 'Screenshot' },
  { value: 'other', label: 'Other' },
]

export function MediaUpload() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [bucket, setBucket] = useState('blog-images')
  const [category, setCategory] = useState('blog')
  const [altText, setAltText] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (20MB max)
    if (file.size > 20 * 1024 * 1024) {
      toast.error('File size must be less than 20MB')
      return
    }

    setSelectedFile(file)
    if (!altText) {
      setAltText(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file')
      return
    }

    setIsUploading(true)

    try {
      // Create FormData
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('bucket', bucket)
      formData.append('category', category)
      formData.append('altText', altText || selectedFile.name)

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      toast.success('File uploaded successfully!')
      
      // Reset form
      setSelectedFile(null)
      setAltText('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh page to show new media
      router.refresh()
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div 
      className="space-y-4 p-6 border rounded-lg"
      style={{ 
        backgroundColor: '#212121',
        borderColor: '#2a2a2a'
      }}
    >
      <div>
        <h3 
          className="text-lg font-semibold mb-2 cms-text-primary"
          style={{ fontWeight: '600' }}
        >
          Upload New Media
        </h3>
        <p 
          className="text-sm cms-text-secondary"
        >
          Upload images to Supabase Storage
        </p>
      </div>

      <div className="space-y-4">
        {/* File Input */}
        <div>
          <Label htmlFor="file" className="cms-text-secondary">File</Label>
          <div className="mt-2">
            {selectedFile ? (
              <div 
                className="flex items-center gap-2 p-3 border rounded-lg"
                style={{ 
                  backgroundColor: '#171717',
                  borderColor: '#2a2a2a'
                }}
              >
                <span className="flex-1 text-sm truncate cms-text-primary">
                  {selectedFile.name}
                </span>
                <span className="text-xs cms-text-secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="cms-text-secondary hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
                style={{ 
                  borderColor: '#2a2a2a',
                  backgroundColor: '#171717'
                }}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 cms-text-secondary" />
                <p className="text-sm cms-text-secondary">
                  Click to select or drag and drop
                </p>
                <p className="text-xs mt-1 cms-text-secondary">
                  PNG, JPG, WEBP up to 20MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Bucket Selection */}
        <div>
          <Label htmlFor="bucket" className="cms-text-secondary">Storage Bucket</Label>
          <Select value={bucket} onValueChange={setBucket}>
            <SelectTrigger 
              id="bucket" 
              className="mt-2"
              style={{ 
                backgroundColor: '#212121',
                borderColor: '#2a2a2a',
                color: '#898989'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUCKETS.map((b) => (
                <SelectItem key={b.value} value={b.value} className="cms-text-secondary">
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection */}
        <div>
          <Label htmlFor="category" className="cms-text-secondary">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger 
              id="category" 
              className="mt-2"
              style={{ 
                backgroundColor: '#212121',
                borderColor: '#2a2a2a',
                color: '#898989'
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value} className="cms-text-secondary">
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Alt Text */}
        <div>
          <Label htmlFor="altText" className="cms-text-secondary">Alt Text</Label>
          <Input
            id="altText"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describe the image"
            className="mt-2"
            style={{ 
              backgroundColor: '#171717',
              borderColor: '#2a2a2a',
              color: '#ffffff'
            }}
          />
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full h-10"
          style={{ 
            backgroundColor: (!selectedFile || isUploading) ? '#171717' : '#212121',
            borderColor: '#2a2a2a',
            color: (!selectedFile || isUploading) ? '#5a5a5a' : '#898989',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
