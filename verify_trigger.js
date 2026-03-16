
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyRegistrationTrigger() {
  console.log('--- Verification: Registration Trigger Fix ---')
  
  // 1. Check for the most recently created profile
  const { data, error } = await supabase
    .from('users_profile')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  if (data && data.length > 0) {
    const latestProfile = data[0]
    console.log('Latest Profile Found:')
    console.log('ID:', latestProfile.id)
    console.log('Full Name:', latestProfile.full_name)
    console.log('Role:', latestProfile.role)
    console.log('Created At:', latestProfile.created_at)

    if (Array.isArray(latestProfile.role)) {
      console.log('SUCCESS: Role is correctly stored as an ARRAY.')
    } else {
      console.error('FAILURE: Role is NOT an array. Current value:', latestProfile.role)
    }
  } else {
    console.log('No profiles found in users_profile.')
  }
}

verifyRegistrationTrigger()
