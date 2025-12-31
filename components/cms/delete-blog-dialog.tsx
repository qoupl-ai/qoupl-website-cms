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
import { deleteBlogPost } from '@/app/actions/blog-actions'

interface BlogPost {
  id: string
  title: string
}

interface DeleteBlogDialogProps {
  post: BlogPost
  children: React.ReactNode
}

export function DeleteBlogDialog({ post, children }: DeleteBlogDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteBlogPost(post.id)
        toast.success('Blog post deleted successfully')
        setOpen(false)
        router.refresh()
      } catch (error) {
        toast.error('Failed to delete blog post')
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
            This will permanently delete the blog post: <strong className="cms-text-primary">{post.title}</strong>
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
