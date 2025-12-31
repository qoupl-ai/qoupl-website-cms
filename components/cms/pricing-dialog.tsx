'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createPricingPlan, updatePricingPlan } from '@/app/actions/pricing-actions'
import { Plus, X } from 'lucide-react'

const pricingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  billing_period: z.string().min(1, 'Billing period is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  is_popular: z.boolean(),
  published: z.boolean(),
  order_index: z.number().int().min(1, 'Order must be at least 1'),
})

type PricingFormValues = z.infer<typeof pricingSchema>

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

interface PricingDialogProps {
  mode: 'create' | 'edit'
  plan?: PricingPlan
  children: React.ReactNode
}

export function PricingDialog({ mode, plan, children }: PricingDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [featureInput, setFeatureInput] = useState('')
  const router = useRouter()

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: mode === 'edit' && plan
      ? {
          name: plan.name,
          price: plan.price,
          billing_period: plan.billing_period,
          description: plan.description,
          features: plan.features,
          is_popular: plan.is_popular,
          published: plan.published,
          order_index: plan.order_index,
        }
      : {
          name: '',
          price: 0,
          billing_period: 'month',
          description: '',
          features: [],
          is_popular: false,
          published: false,
          order_index: 1,
        },
  })

  const features = form.watch('features')

  function addFeature() {
    if (featureInput.trim()) {
      form.setValue('features', [...features, featureInput.trim()])
      setFeatureInput('')
    }
  }

  function removeFeature(index: number) {
    form.setValue('features', features.filter((_, i) => i !== index))
  }

  function onSubmit(data: PricingFormValues) {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createPricingPlan(data)
          toast.success('Pricing plan created successfully')
        } else if (plan) {
          await updatePricingPlan(plan.id, data)
          toast.success('Pricing plan updated successfully')
        }

        setOpen(false)
        form.reset()
        router.refresh()
      } catch (error) {
        toast.error(mode === 'create' ? 'Failed to create pricing plan' : 'Failed to update pricing plan')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto cms-card cms-border"
        style={{
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="cms-text-primary"
            style={{ 
              fontWeight: '600', 
              fontSize: '18px',
              lineHeight: '1.4'
            }}
          >
            {mode === 'create' ? 'Create New Pricing Plan' : 'Edit Pricing Plan'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {mode === 'create'
              ? 'Add a new pricing plan to your website'
              : 'Update the pricing plan details below'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Plan Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Premium"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    The name of the pricing plan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Perfect for serious daters looking for meaningful connections..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Brief description of the plan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder="9.99"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Price in USD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="billing_period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Billing Period</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      How often the plan renews
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Features</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a feature (e.g., Unlimited likes)"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addFeature()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addFeature}
                          className="h-10 w-10"
                          style={{
                            backgroundColor: '#212121',
                            borderColor: '#2a2a2a',
                            color: '#898989'
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {features.length > 0 && (
                        <div className="space-y-2">
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-md border"
                              style={{
                                backgroundColor: '#171717',
                                borderColor: '#2a2a2a',
                              }}
                            >
                              <span className="text-sm cms-text-secondary">{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeature(index)}
                                className="h-7 w-7 cms-text-secondary"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Add features included in this plan
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Display order
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_popular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Popular</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Mark as popular
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-primary" style={{ fontWeight: '500', fontSize: '14px' }}>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Published</SelectItem>
                        <SelectItem value="false">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Publication status
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="h-10 px-5 cms-card cms-border cms-text-secondary"
                style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                className="h-10 px-5 cms-card cms-border cms-text-secondary"
                style={{
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isPending
                  ? mode === 'create'
                    ? 'Creating...'
                    : 'Updating...'
                  : mode === 'create'
                  ? 'Create Plan'
                  : 'Update Plan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
