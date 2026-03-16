
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function verifyRegistration() {
  const testEmail = `verify_trigger_${Date.now()}@example.com`
  const testPassword = 'Password123!'
  const testFullName = 'Trigger Verify Bot'
  const testRole = 'lawyer' // Testing a professional role

  console.log(`--- Verification Started: ${testEmail} ---`)

  // 1. Create a user via Admin API
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: testPassword,
    user_metadata: { 
      full_name: testFullName,
      role: testRole 
    },
    email_confirm: true
  })

  if (authError) {
    console.error('Auth Error:', authError.message)
    return
  }

  const userId = authData.user.id
  console.log(`User created in auth.users: ${userId}`)

  // 2. Wait a moment for the trigger to fire
  console.log('Waiting for trigger to sync...')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 3. Check public.users_profile
  const { data: profileData, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.error('Profile Fetch Error:', profileError.message)
    // Cleanup
    await supabase.auth.admin.deleteUser(userId)
    return
  }

  console.log('Profile found:', JSON.stringify(profileData, null, 2))

  // 4. Validate Role Array
  if (Array.isArray(profileData.role) && profileData.role.includes(testRole)) {
    console.log('\n✅ SUCCESS: Registration Trigger is Working!')
    console.log('Role is correctly stored as an ARRAY:', profileData.role)
  } else {
    console.error('\n❌ FAILURE: Registration Trigger is NOT creating role arrays correctly.')
    console.log('Expected array containing:', testRole)
    console.log('Actual role value:', profileData.role)
  }

  // 5. Cleanup
  console.log('\nCleaning up test user...')
  await supabase.auth.admin.deleteUser(userId)
  console.log('Done.')
}

verifyRegistration()
