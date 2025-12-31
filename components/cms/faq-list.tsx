'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pencil, Trash2 } from 'lucide-react'
import { FAQDialog } from './faq-dialog'
import { DeleteFAQDialog } from './delete-faq-dialog'

interface FAQ {
  id: string
  question: string
  answer: string
  order_index: number
  published: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

interface FAQListProps {
  faqs: FAQ[]
  categories: Category[]
}

// Category color mapping
const getCategoryColor = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('technology') || name.includes('tech')) {
    return { bg: '#3b82f6', text: '#ffffff' } // Blue
  }
  if (name.includes('relationship') || name.includes('dating')) {
    return { bg: '#ec4899', text: '#ffffff' } // Pink
  }
  if (name.includes('safety') || name.includes('security')) {
    return { bg: '#10b981', text: '#ffffff' } // Green
  }
  if (name.includes('account') || name.includes('profile')) {
    return { bg: '#8b5cf6', text: '#ffffff' } // Purple
  }
  if (name.includes('payment') || name.includes('billing')) {
    return { bg: '#f59e0b', text: '#ffffff' } // Amber
  }
  // Default colors
  return { bg: '#6366f1', text: '#ffffff' } // Indigo
}

export function FAQList({ faqs, categories }: FAQListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category.id === selectedCategory)

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex items-center gap-4">
        <label 
          className="text-sm font-semibold whitespace-nowrap cms-text-secondary"
          style={{ fontWeight: '600' }}
        >
          Filter by category:
        </label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger 
            className="w-[250px]"
            style={{ 
              backgroundColor: '#212121',
              borderColor: '#2a2a2a',
              color: '#898989',
              fontSize: '13px'
            }}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cms-text-secondary" style={{ fontSize: '13px' }}>All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id} className="cms-text-secondary" style={{ fontSize: '13px' }}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm whitespace-nowrap cms-text-secondary" style={{ fontSize: '13px' }}>
          Showing {filteredFAQs.length} of {faqs.length} FAQs
        </span>
      </div>

      {/* FAQ Table */}
      <div className="rounded-md border overflow-x-auto cms-card-bg cms-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[60px] whitespace-nowrap cms-text-secondary" 
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                #
              </TableHead>
              <TableHead 
                className="min-w-[300px] cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Question
              </TableHead>
              <TableHead 
                className="w-[140px] whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Category
              </TableHead>
              <TableHead 
                className="w-[100px] whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Status
              </TableHead>
              <TableHead 
                className="w-[120px] text-right whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFAQs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 cms-text-secondary" style={{ fontSize: '13px' }}>
                  No FAQs found
                </TableCell>
              </TableRow>
            ) : (
              filteredFAQs.map((faq) => {
                const categoryColor = getCategoryColor(faq.category.name)
                return (
                  <TableRow 
                    key={faq.id}
                    className="hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a]"
                  >
                    <TableCell 
                      className="font-semibold cms-text-primary" 
                      style={{ fontWeight: '600', fontSize: '13px', padding: '12px 16px' }}
                    >
                      {faq.order_index}
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <div className="max-w-[500px]">
                        <p 
                          className="font-semibold mb-1 cms-text-primary" 
                          style={{ fontWeight: '600', fontSize: '13px', lineHeight: '1.4' }}
                        >
                          {faq.question}
                        </p>
                        <p 
                          className="text-sm line-clamp-2 cms-text-secondary" 
                          style={{ fontSize: '12px', lineHeight: '1.5' }}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Badge 
                        variant="outline"
                        className="whitespace-nowrap"
                        style={{ 
                          backgroundColor: categoryColor.bg,
                          color: categoryColor.text,
                          borderColor: categoryColor.bg,
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 10px'
                        }}
                      >
                        {faq.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ padding: '12px 16px' }}>
                      <Badge 
                        variant={faq.published ? 'default' : 'secondary'}
                        className="whitespace-nowrap"
                        style={{ 
                          backgroundColor: faq.published ? '#10b981' : '#6b7280',
                          color: '#ffffff',
                          borderColor: faq.published ? '#10b981' : '#6b7280',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 10px'
                        }}
                      >
                        {faq.published ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" style={{ padding: '12px 16px' }}>
                      <div className="flex items-center justify-end gap-2">
                        <FAQDialog
                          categories={categories}
                          mode="edit"
                          faq={faq}
                        >
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 cms-text-secondary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </FAQDialog>
                        <DeleteFAQDialog faq={faq}>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 cms-text-secondary"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </DeleteFAQDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
