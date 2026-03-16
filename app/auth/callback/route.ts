import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Extract searchParams and origin from the request URL
  const { searchParams, origin } = new URL(request.url)
  // Get the 'code' query parameter and 'next' (which specifies the redirect destination)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Forward to next destination or dashboard on success
      return NextResponse.redirect(`${origin}${next}`)
    } else {
        console.error("Auth Callback Error:", error.message)
    }
  }

  // If there's no code or an error occurred, return to login page
  return NextResponse.redirect(`${origin}/auth/login?error=Authentication%20failed`)
}
