import { redirect } from 'next/navigation'

export default function Home() {
  // Always log
  console.log('🏠 [CMS Root] Redirecting to /add-content')
  
  redirect('/add-content')
}

