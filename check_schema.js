
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  console.log('Checking schema for table: plots')
  
  // Try to fetch one row with select(*) to see what columns we get
  const { data, error } = await supabase
    .from('plots')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching data:', error)
    return
  }

  if (data && data.length > 0) {
    console.log('Columns found in plots table:', Object.keys(data[0]))
  } else {
    // If table is empty, we can try to get column names from information_schema if we have enough permissions
    // or just try to fetch an empty set and see if it fails
    console.log('Table is empty, trying to probe for columns...')
    
    const possibleColumns = ['id', 'title', 'price_kes', 'transaction_type', 'land_status']
    for (const col of possibleColumns) {
      const { error: colError } = await supabase.from('plots').select(col).limit(0)
      if (colError) {
        console.log(`Column [${col}] does NOT exist. Error: ${colError.message}`)
      } else {
        console.log(`Column [${col}] exists.`)
      }
    }
  }

  console.log('\nChecking table: lawyer_profiles')
  const { error: lawyerError } = await supabase.from('lawyer_profiles').select('*').limit(0)
  if (lawyerError) {
    console.log(`Table [lawyer_profiles] does NOT exist. Error: ${lawyerError.message}`)
  } else {
    console.log('Table [lawyer_profiles] exists.')
    const { data: lawyerData } = await supabase.from('lawyer_profiles').select('*').limit(1)
    if (lawyerData && lawyerData.length > 0) {
      console.log('Columns in lawyer_profiles:', Object.keys(lawyerData[0]))
    } else {
      console.log('lawyer_profiles empty, probing for LSK number...')
      const { error: lskError } = await supabase.from('lawyer_profiles').select('lsk_number').limit(0)
      if (lskError) console.log('Column [lsk_number] does NOT exist.')
      else console.log('Column [lsk_number] exists.')
    }
  }

  console.log('\nChecking table: service_leads')
  const { error: leadsError } = await supabase.from('service_leads').select('*').limit(0)
  if (leadsError) {
    console.log(`Table [service_leads] does NOT exist. Error: ${leadsError.message}`)
  } else {
    console.log('Table [service_leads] exists.')
  }

  console.log('\nChecking table: survey_profiles')
  const { error: surveyError } = await supabase.from('survey_profiles').select('*').limit(0)
  if (surveyError) {
    console.log(`Table [survey_profiles] does NOT exist. Error: ${surveyError.message}`)
  } else {
    console.log('Table [survey_profiles] exists.')
  }

  console.log('\nChecking table: eia_profiles')
  const { error: eiaError } = await supabase.from('eia_profiles').select('*').limit(0)
  if (eiaError) {
    console.log(`Table [eia_profiles] does NOT exist. Error: ${eiaError.message}`)
  } else {
    console.log('Table [eia_profiles] exists.')
  }

  console.log('\nChecking table: documents')
  const { data: docData, error: docError } = await supabase.from('documents').select('*').limit(1)
  if (docError) {
    console.log(`Error checking documents: ${docError.message}`)
  } else if (docData && docData.length > 0) {
    console.log('Columns found in documents table:', Object.keys(docData[0]))
  } else {
    console.log('Documents table empty, probing for is_professional_cert...')
    const { error: certError } = await supabase.from('documents').select('is_professional_cert').limit(0)
    if (certError) {
       console.log(`Column [is_professional_cert] does NOT exist.`)
    } else {
       console.log(`Column [is_professional_cert] exists.`)
    }
  }

  console.log('\nChecking table: users_profile')
  const { data: profData, error: profError } = await supabase.from('users_profile').select('*').limit(1)
  if (profError) {
    console.log(`Error checking users_profile: ${profError.message}`)
  } else if (profData && profData.length > 0) {
    console.log('Columns found in users_profile table:', Object.keys(profData[0]))
    console.log('Sample role value:', profData[0].role)
  }
}

checkSchema()
