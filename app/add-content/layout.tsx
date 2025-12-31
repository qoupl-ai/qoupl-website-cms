import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CMSNav from '@/components/cms/cms-nav'
import CMSBodyClass from '@/components/cms/cms-body-class'
import { Toaster } from '@/components/ui/sonner'

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('[CMS Layout] Rendering CMS layout')
  
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError) {
    console.error('[CMS Layout] Auth error:', userError.message)
  }

  if (!user) {
    console.log('[CMS Layout] No user, redirecting to login')
    redirect('/login?redirect=/add-content')
  }

  console.log('[CMS Layout] User found:', user.id, user.email)

  // Check if user is admin
  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  if (adminError) {
    console.error('[CMS Layout] Admin check error:', adminError.message)
  }

  if (!adminUser) {
    console.warn('[CMS Layout] User is not an admin, redirecting')
    redirect('/')
  }

  console.log('[CMS Layout] Admin user confirmed:', adminUser.email)

  return (
    <>
      <CMSBodyClass />
      <div 
        className="min-h-screen cms-main-bg"
        style={{ 
          fontFamily: "'Google Sans Flex', system-ui, sans-serif"
        }}
      >
        <CMSNav user={user} adminUser={adminUser} />
      <main 
        data-cms-main
        className="transition-all duration-300 cms-main-bg"
        style={{ 
          marginLeft: '200px', // Default expanded width (w-[200px])
          padding: '2rem',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
      <Toaster position="top-center" richColors />
    </div>
    </>
  )
}
