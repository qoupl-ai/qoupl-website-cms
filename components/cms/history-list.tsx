'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { FileText, Trash2, Edit, Plus } from 'lucide-react'

interface HistoryEntry {
  id: string
  entity_type: string
  entity_id: string
  action: string
  snapshot: any
  performed_at: string
  admin?: {
    name: string
    email: string
  } | null
  entityDetails?: {
    type: string
    title?: string
    componentType?: string
    pageTitle?: string
    pageSlug?: string
    slug?: string
  } | null
}

interface HistoryListProps {
  history: HistoryEntry[]
}

export function HistoryList({ history }: HistoryListProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <Plus className="h-4 w-4" style={{ color: '#10b981' }} />
      case 'updated':
        return <Edit className="h-4 w-4" style={{ color: '#3b82f6' }} />
      case 'deleted':
        return <Trash2 className="h-4 w-4" style={{ color: '#ef4444' }} />
      default:
        return <FileText className="h-4 w-4 cms-text-secondary" />
    }
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'created':
        return { bg: '#10b981', text: '#ffffff' } // Green
      case 'updated':
        return { bg: '#3b82f6', text: '#ffffff' } // Blue
      case 'deleted':
        return { bg: '#ef4444', text: '#ffffff' } // Red
      default:
        return { bg: '#6b7280', text: '#ffffff' } // Gray
    }
  }

  const getEntityTypeColor = (entityType: string) => {
    const type = entityType.toLowerCase()
    if (type.includes('blog')) {
      return { bg: '#8b5cf6', text: '#ffffff' } // Purple
    }
    if (type.includes('faq')) {
      return { bg: '#ec4899', text: '#ffffff' } // Pink
    }
    if (type.includes('feature')) {
      return { bg: '#f59e0b', text: '#ffffff' } // Amber
    }
    if (type.includes('pricing')) {
      return { bg: '#10b981', text: '#ffffff' } // Green
    }
    if (type.includes('page')) {
      return { bg: '#6366f1', text: '#ffffff' } // Indigo
    }
    return { bg: '#6b7280', text: '#ffffff' } // Gray
  }

  return (
    <div className="rounded-md border overflow-x-auto cms-card-bg cms-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[50px] whitespace-nowrap cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
            </TableHead>
            <TableHead 
              className="w-[140px] whitespace-nowrap cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Entity Type
            </TableHead>
            <TableHead 
              className="w-[100px] whitespace-nowrap cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Action
            </TableHead>
            <TableHead 
              className="min-w-[200px] cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Title/Name
            </TableHead>
            <TableHead 
              className="w-[180px] whitespace-nowrap cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              Performed By
            </TableHead>
            <TableHead 
              className="w-[140px] whitespace-nowrap cms-text-secondary"
              style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
            >
              When
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 cms-text-secondary" style={{ fontSize: '13px' }}>
                No history entries found
              </TableCell>
            </TableRow>
          ) : (
            history.map((entry) => {
              // Get title from entityDetails if available, otherwise from snapshot
              let title = entry.entityDetails?.title
              if (!title) {
                title = entry.snapshot?.title || 
                       entry.snapshot?.question || 
                       entry.snapshot?.name || 
                       entry.entity_id.slice(0, 8) + '...'
              }
              
              const actionColor = getActionBadge(entry.action)
              const entityColor = getEntityTypeColor(entry.entity_type)

              return (
                <TableRow 
                  key={entry.id}
                  className="hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a]"
                >
                  <TableCell style={{ padding: '12px 16px' }}>{getActionIcon(entry.action)}</TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <Badge 
                      variant="outline" 
                      className="capitalize whitespace-nowrap"
                      style={{ 
                        backgroundColor: entityColor.bg,
                        color: entityColor.text,
                        borderColor: entityColor.bg,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                    >
                      {entry.entity_type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <Badge 
                      variant="outline"
                      className="capitalize whitespace-nowrap"
                      style={{ 
                        backgroundColor: actionColor.bg,
                        color: actionColor.text,
                        borderColor: actionColor.bg,
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                    >
                      {entry.action}
                    </Badge>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="space-y-1">
                      <div 
                        className="max-w-[300px] truncate cms-text-primary" 
                        title={title}
                        style={{ fontWeight: '600', fontSize: '13px' }}
                      >
                        {title}
                      </div>
                      {entry.entityDetails?.type === 'section' && (
                        <div className="text-xs cms-text-secondary">
                          {entry.entityDetails.pageTitle && (
                            <span>on <span style={{ color: '#662D91' }}>{entry.entityDetails.pageTitle}</span> page</span>
                          )}
                          {entry.entityDetails.componentType && (
                            <span className="ml-2">• {entry.entityDetails.componentType.replace(/-/g, ' ')}</span>
                          )}
                        </div>
                      )}
                      {entry.entityDetails?.type === 'page' && entry.entityDetails.slug && (
                        <div className="text-xs cms-text-secondary">
                          /{entry.entityDetails.slug}
                        </div>
                      )}
                      {entry.entityDetails?.type === 'blog_post' && entry.entityDetails.slug && (
                        <div className="text-xs cms-text-secondary">
                          /blog/{entry.entityDetails.slug}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="text-sm">
                      {entry.admin ? (
                        <div>
                          <p className="font-semibold cms-text-primary" style={{ fontWeight: '600', fontSize: '13px' }}>
                            {entry.admin.name}
                          </p>
                          <p className="text-xs cms-text-secondary" style={{ fontSize: '12px' }}>
                            {entry.admin.email}
                          </p>
                        </div>
                      ) : (
                        <span className="cms-text-secondary" style={{ fontSize: '13px' }}>System</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="space-y-0.5">
                      <span className="text-sm whitespace-nowrap block cms-text-secondary" style={{ fontSize: '12px' }}>
                        {formatDistanceToNow(new Date(entry.performed_at), { addSuffix: true })}
                      </span>
                      <span className="text-xs whitespace-nowrap block" style={{ color: '#5a5a5a', fontSize: '11px' }}>
                        {new Date(entry.performed_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
