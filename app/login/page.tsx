'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/add-content'
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push(redirect)
      } else {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push(redirect)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, redirect])

  // AGGRESSIVE fix for input backgrounds - runs continuously but safely
  useEffect(() => {
    if (loading) return

    // Inject CSS with maximum specificity
    const styleId = 'login-input-override'
    let styleElement = document.getElementById(styleId) as HTMLStyleElement
    
    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      // Insert at the end of head to ensure it loads last
      document.head.appendChild(styleElement)
    }
    
    styleElement.textContent = `
      /* ULTRA SPECIFIC - Target exact Supabase classes with maximum specificity */
      input#email.supabase-auth-ui_ui-input,
      input#password.supabase-auth-ui_ui-input,
      .supabase-auth-ui_ui-input[type="email"],
      .supabase-auth-ui_ui-input[type="password"],
      .supabase-auth-ui_ui-input[type="text"],
      input.supabase-auth-ui_ui-input,
      .supabase-auth-ui_ui-input {
        background-color: #171717 !important;
        background: #171717 !important;
        background-image: none !important;
        border-color: #2a2a2a !important;
        border: 1px solid #2a2a2a !important;
        color: #ffffff !important;
      }
      input#email.supabase-auth-ui_ui-input:focus,
      input#password.supabase-auth-ui_ui-input:focus,
      .supabase-auth-ui_ui-input[type="email"]:focus,
      .supabase-auth-ui_ui-input[type="password"]:focus,
      .supabase-auth-ui_ui-input:focus {
        background-color: #171717 !important;
        background: #171717 !important;
        background-image: none !important;
        border-color: #662D91 !important;
        border: 1px solid #662D91 !important;
        color: #ffffff !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      /* FIX BROWSER AUTOFILL - This is the key fix! */
      input#email.supabase-auth-ui_ui-input:-webkit-autofill,
      input#password.supabase-auth-ui_ui-input:-webkit-autofill,
      .supabase-auth-ui_ui-input[type="email"]:-webkit-autofill,
      .supabase-auth-ui_ui-input[type="password"]:-webkit-autofill,
      input.supabase-auth-ui_ui-input:-webkit-autofill,
      .supabase-auth-ui_ui-input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #171717 inset !important;
        -webkit-text-fill-color: #ffffff !important;
        background-color: #171717 !important;
        background: #171717 !important;
        border-color: #2a2a2a !important;
        color: #ffffff !important;
      }
      
      input#email.supabase-auth-ui_ui-input:-webkit-autofill:hover,
      input#password.supabase-auth-ui_ui-input:-webkit-autofill:hover,
      .supabase-auth-ui_ui-input[type="email"]:-webkit-autofill:hover,
      .supabase-auth-ui_ui-input[type="password"]:-webkit-autofill:hover,
      input.supabase-auth-ui_ui-input:-webkit-autofill:hover,
      .supabase-auth-ui_ui-input:-webkit-autofill:hover {
        -webkit-box-shadow: 0 0 0 1000px #171717 inset !important;
        -webkit-text-fill-color: #ffffff !important;
        background-color: #171717 !important;
      }
      
      input#email.supabase-auth-ui_ui-input:-webkit-autofill:focus,
      input#password.supabase-auth-ui_ui-input:-webkit-autofill:focus,
      .supabase-auth-ui_ui-input[type="email"]:-webkit-autofill:focus,
      .supabase-auth-ui_ui-input[type="password"]:-webkit-autofill:focus,
      input.supabase-auth-ui_ui-input:-webkit-autofill:focus,
      .supabase-auth-ui_ui-input:-webkit-autofill:focus {
        -webkit-box-shadow: 0 0 0 1000px #171717 inset !important;
        -webkit-text-fill-color: #ffffff !important;
        background-color: #171717 !important;
        border-color: #662D91 !important;
      }
      
      input#email.supabase-auth-ui_ui-input:-webkit-autofill:active,
      input#password.supabase-auth-ui_ui-input:-webkit-autofill:active,
      .supabase-auth-ui_ui-input[type="email"]:-webkit-autofill:active,
      .supabase-auth-ui_ui-input[type="password"]:-webkit-autofill:active,
      input.supabase-auth-ui_ui-input:-webkit-autofill:active,
      .supabase-auth-ui_ui-input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 1000px #171717 inset !important;
        -webkit-text-fill-color: #ffffff !important;
        background-color: #171717 !important;
      }
    `

    // Apply styles directly - runs periodically but checks if already set
    const applyStyles = () => {
      const inputs = document.querySelectorAll('.supabase-auth-ui_ui-input, input#email, input#password, input[type="email"], input[type="password"]')
      inputs.forEach((input) => {
        const htmlInput = input as HTMLInputElement
        const currentBg = window.getComputedStyle(htmlInput).backgroundColor
        // Only apply if background is not already dark (avoid unnecessary work)
        if (currentBg !== 'rgb(23, 23, 23)' && currentBg !== '#171717') {
          htmlInput.style.setProperty('background-color', '#171717', 'important')
          htmlInput.style.setProperty('background', '#171717', 'important')
          htmlInput.style.setProperty('border-color', '#2a2a2a', 'important')
          htmlInput.style.setProperty('color', '#ffffff', 'important')
        }
      })
    }

    // Run multiple times to catch inputs at different render times
    const timers = [
      setTimeout(applyStyles, 100),
      setTimeout(applyStyles, 300),
      setTimeout(applyStyles, 600),
      setTimeout(applyStyles, 1000),
      setTimeout(applyStyles, 1500),
    ]

    // Run periodically but with longer intervals to avoid performance issues
    const interval = setInterval(applyStyles, 2000)

    return () => {
      timers.forEach(timer => clearTimeout(timer))
      clearInterval(interval)
    }
  }, [loading])

  if (loading) {
    return (
      <div 
        className="flex min-h-screen items-center justify-center"
        style={{ backgroundColor: '#171717' }}
      >
        <div className="text-center">
          <div 
            className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent mx-auto mb-4"
            style={{ 
              borderColor: '#662D91',
              borderTopColor: 'transparent'
            }}
          ></div>
          <p style={{ color: '#898989' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="login-page flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: '#171717' }}
    >
      <div className="w-full max-w-md">
        {/* Brand Logo */}
        <div className="mb-10 text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/images/quoupl.svg"
              alt="qoupl"
              width={120}
              height={40}
              className="h-10 w-auto"
              style={{ filter: 'brightness(0) invert(1)' }}
              priority
            />
          </div>
          <p style={{ color: '#898989', fontSize: '14px', fontWeight: '500' }}>
            Admin Portal
          </p>
        </div>

        {/* Login Card */}
        <div 
          className="rounded-lg border p-8 shadow-lg"
          style={{ 
            backgroundColor: '#212121',
            borderColor: '#2a2a2a'
          }}
        >
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#662D91',
                    brandAccent: '#8B3DB8',
                    inputBackground: '#171717',
                    inputBorder: '#2a2a2a',
                    inputText: '#ffffff',
                    inputLabelText: '#898989',
                    messageText: '#898989',
                    messageTextDanger: '#ef4444',
                    anchorTextColor: '#662D91',
                    anchorTextHoverColor: '#8B3DB8',
                  },
                  space: {
                    spaceSmall: '0.5rem',
                    spaceMedium: '1rem',
                    spaceLarge: '1.5rem',
                  },
                  fontSizes: {
                    baseBodySize: '14px',
                    baseInputSize: '14px',
                    baseLabelSize: '13px',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                input: 'w-full',
              },
            }}
            providers={[]}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}${redirect}`}
            onlyThirdPartyProviders={false}
            magicLink={false}
            view="sign_in"
            showLinks={false}
          />
        </div>

        <p 
          className="mt-6 text-center text-sm"
          style={{ color: '#898989' }}
        >
          Admin access only. Contact support if you need access.
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
