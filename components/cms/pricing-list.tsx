'use client'

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
import { Pencil, Trash2, Check } from 'lucide-react'
import { PricingDialog } from './pricing-dialog'
import { DeletePricingDialog } from './delete-pricing-dialog'

interface PricingPlan {
  id: string
  name: string
  price: number
  billing_period: string
  description: string
  features: string[]
  is_popular: boolean
  published: boolean
  order_index: number
}

interface PricingListProps {
  plans: PricingPlan[]
}

export function PricingList({ plans }: PricingListProps) {
  return (
    <div className="space-y-4">
      {/* Pricing Plans Table */}
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
                className="min-w-[250px] cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Plan Name
              </TableHead>
              <TableHead 
                className="w-[120px] whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Price
              </TableHead>
              <TableHead 
                className="w-[100px] whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Features
              </TableHead>
              <TableHead 
                className="w-[100px] whitespace-nowrap cms-text-secondary"
                style={{ fontSize: '12px', fontWeight: '600', padding: '12px 16px' }}
              >
                Popular
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
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 cms-text-secondary" style={{ fontSize: '13px' }}>
                  No pricing plans found
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow 
                  key={plan.id}
                  className="hover:bg-[rgba(23,23,23,0.1)] dark:hover:bg-[#2a2a2a]"
                >
                  <TableCell 
                    className="font-semibold cms-text-primary" 
                    style={{ fontWeight: '600', fontSize: '13px', padding: '12px 16px' }}
                  >
                    {plan.order_index}
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="max-w-[300px]">
                      <p 
                        className="font-semibold mb-1 cms-text-primary" 
                        style={{ fontWeight: '600', fontSize: '13px', lineHeight: '1.4' }}
                      >
                        {plan.name}
                      </p>
                      <p 
                        className="text-sm line-clamp-1 cms-text-secondary" 
                        style={{ fontSize: '12px', lineHeight: '1.5' }}
                      >
                        {plan.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <div className="font-semibold cms-text-primary" style={{ fontWeight: '600', fontSize: '13px' }}>
                      ${plan.price}
                      <span className="text-sm font-normal cms-text-secondary" style={{ fontSize: '12px' }}>
                        /{plan.billing_period}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <span className="text-sm whitespace-nowrap cms-text-secondary" style={{ fontSize: '12px' }}>
                      {plan.features.length} items
                    </span>
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    {plan.is_popular && (
                      <Badge
                        className="whitespace-nowrap"
                        style={{ 
                          backgroundColor: '#f59e0b',
                          color: '#ffffff',
                          borderColor: '#f59e0b',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 10px'
                        }}
                      >
                        <Check className="h-3 w-3 mr-1 inline" />
                        Popular
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell style={{ padding: '12px 16px' }}>
                    <Badge 
                      variant={plan.published ? 'default' : 'secondary'}
                      className="whitespace-nowrap"
                      style={{ 
                        backgroundColor: plan.published ? '#10b981' : '#6b7280',
                        color: '#ffffff',
                        borderColor: plan.published ? '#10b981' : '#6b7280',
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '4px 10px'
                      }}
                    >
                      {plan.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" style={{ padding: '12px 16px' }}>
                    <div className="flex items-center justify-end gap-2">
                      <PricingDialog
                        mode="edit"
                        plan={plan}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 cms-text-secondary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </PricingDialog>
                      <DeletePricingDialog plan={plan}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 cms-text-secondary"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </DeletePricingDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
