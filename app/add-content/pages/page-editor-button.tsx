'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import PageEditor from '@/components/cms/page-editor'

export default function PageEditorButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="h-10 px-5"
        style={{ 
          backgroundColor: '#212121',
          borderColor: '#2a2a2a',
          color: '#898989',
          fontWeight: '600',
          fontSize: '14px'
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Page
      </Button>
      <PageEditor open={open} onOpenChange={setOpen} />
    </>
  )
}

