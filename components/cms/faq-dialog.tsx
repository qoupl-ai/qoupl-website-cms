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
import { createFAQ, updateFAQ } from '@/app/actions/faq-actions'

const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  category_id: z.string().uuid('Please select a category'),
  order_index: z.number().int().min(1, 'Order must be at least 1'),
  published: z.boolean(),
})

type FAQFormValues = z.infer<typeof faqSchema>

interface Category {
  id: string
  name: string
  slug: string
}

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

interface FAQDialogProps {
  categories: Category[]
  mode: 'create' | 'edit'
  faq?: FAQ
  children: React.ReactNode
}

export function FAQDialog({ categories, mode, faq, children }: FAQDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<FAQFormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: mode === 'edit' && faq
      ? {
          question: faq.question,
          answer: faq.answer,
          category_id: faq.category.id,
          order_index: faq.order_index,
          published: faq.published,
        }
      : {
          question: '',
          answer: '',
          category_id: '',
          order_index: 1,
          published: false,
        },
  })

  function onSubmit(data: FAQFormValues) {
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createFAQ(data)
          toast.success('FAQ created successfully')
        } else if (faq) {
          await updateFAQ(faq.id, data)
          toast.success('FAQ updated successfully')
        }

        setOpen(false)
        form.reset()
        router.refresh()
      } catch (error) {
        toast.error(mode === 'create' ? 'Failed to create FAQ' : 'Failed to update FAQ')
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
            {mode === 'create' ? 'Create New FAQ' : 'Edit FAQ'}
          </DialogTitle>
          <DialogDescription
            className="cms-text-secondary"
            style={{ 
              fontSize: '13px',
              lineHeight: '1.5'
            }}
          >
            {mode === 'create'
              ? 'Add a new frequently asked question to your website'
              : 'Update the FAQ details below'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        style={{
                          backgroundColor: '#171717',
                          borderColor: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.id} 
                          value={category.id}
                          className="cms-text-secondary"
                          style={{ fontSize: '13px' }}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    Choose the category this FAQ belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Question
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What is qoupl?"
                      {...field}
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    The question users are asking
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                    Answer
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="qoupl is a dating app that..."
                      rows={6}
                      {...field}
                      style={{
                        backgroundColor: '#171717',
                        borderColor: '#2a2a2a',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </FormControl>
                  <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                    The detailed answer to the question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        style={{
                          backgroundColor: '#171717',
                          borderColor: '#2a2a2a',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      />
                    </FormControl>
                    <FormDescription className="cms-text-secondary" style={{ fontSize: '12px' }}>
                      Display order within category
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
                    <FormLabel className="cms-text-secondary" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'true')}
                      defaultValue={field.value ? 'true' : 'false'}
                    >
                      <FormControl>
                        <SelectTrigger
                          style={{
                            backgroundColor: '#171717',
                            borderColor: '#2a2a2a',
                            color: '#ffffff',
                            fontSize: '13px'
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true" className="cms-text-secondary" style={{ fontSize: '13px' }}>
                          Published
                        </SelectItem>
                        <SelectItem value="false" className="cms-text-secondary" style={{ fontSize: '13px' }}>
                          Draft
                        </SelectItem>
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
                  ? 'Create FAQ'
                  : 'Update FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
