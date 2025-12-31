import { redirect } from 'next/navigation'

export default function Home() {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[CMS Root] Redirecting to /add-content')
  }
  
  redirect('/add-content')
}

