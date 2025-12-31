'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { deletePricingPlan } from '@/app/actions/pricing-actions'

interface PricingPlan {
  id: string
  name: string
}

interface DeletePricingDialogProps {
  plan: PricingPlan
  children: React.ReactNode
}

export function DeletePricingDialog({ plan, children }: DeletePricingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        await deletePricingPlan(plan.id)
        toast.success('Pricing plan deleted successfully')
        setOpen(false)
        router.refresh()
      } catch (error) {
        toast.error('Failed to delete pricing plan')
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent
        className="cms-card cms-border"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle
            className="cms-text-primary"
            style={{ 
              fontWeight: '600', 
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            This will permanently delete the pricing plan: <strong className="cms-text-primary">{plan.name}</strong>
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isPending}
            className="h-10 px-5 cms-card cms-border cms-text-secondary"
            style={{
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="h-10 px-5"
            style={{
              backgroundColor: isPending ? '#171717' : '#ef4444',
              color: isPending ? '#5a5a5a' : '#ffffff',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
