'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import SectionEditor from '@/components/cms/section-editor'

interface SectionEditorButtonProps {
  pageId: string
  section?: {
    id: string
    component_type: string
    order_index: number
    content: any
    published: boolean
  }
}

export default function SectionEditorButton({
  pageId,
  section,
}: SectionEditorButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="cms-card cms-border cms-text-secondary"
        style={{
          fontWeight: '600',
          fontSize: '13px'
        }}
      >
        {section ? (
          'Edit'
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </>
        )}
      </Button>
      <SectionEditor
        pageId={pageId}
        section={section}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

