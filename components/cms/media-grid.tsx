'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Check, ExternalLink, File } from 'lucide-react'
import { toast } from 'sonner'

interface MediaFile {
  id: string
  filename: string
  storage_path: string
  bucket_name: string
  file_type: string
  file_size: number
  category: string
  url: string
  created_at: string
}

interface MediaGridProps {
  media: MediaFile[]
}

export function MediaGrid({ media }: MediaGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      toast.success('URL copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {media.map((file) => (
        <div
          key={file.id}
          className="group relative border rounded-lg overflow-hidden transition-all"
          style={{ 
            backgroundColor: '#212121',
            borderColor: '#2a2a2a'
          }}
        >
          {/* Image Preview */}
          <div className="aspect-square relative cms-card-bg">
            {file.file_type.startsWith('image/') ? (
              <Image
                src={file.url}
                alt={file.filename}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <File className="h-12 w-12 cms-text-secondary" />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => window.open(file.url, '_blank')}
                style={{ 
                  backgroundColor: '#212121',
                  color: '#898989'
                }}
                className="hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => copyToClipboard(file.url, file.id)}
                style={{ 
                  backgroundColor: '#212121',
                  color: '#898989'
                }}
                className="hover:cms-text-primary hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a] dark:hover:text-white"
              >
                {copiedId === file.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* File Info */}
          <div className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold truncate cms-text-primary" title={file.filename} style={{ fontWeight: '600' }}>
                {file.filename}
              </p>
              <Badge 
                variant="outline" 
                className="text-xs shrink-0"
                style={{ 
                  borderColor: '#2a2a2a',
                  color: '#898989',
                  backgroundColor: '#171717'
                }}
              >
                {formatFileSize(file.file_size)}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ 
                  backgroundColor: '#171717',
                  color: '#898989'
                }}
              >
                {file.bucket_name}
              </Badge>
            </div>

            <p className="text-xs font-mono truncate cms-text-secondary">
              {file.storage_path}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
