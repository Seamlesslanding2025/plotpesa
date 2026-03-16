
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkCoordinates() {
    console.log('🔍 Checking coordinates of all listings...\n')

    const { data: plots, error } = await supabase
        .from('plots')
        .select('id, title, latitude, longitude, county, location_details')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('❌ Error:', error.message)
        return
    }

    plots?.forEach((plot, index) => {
        console.log(`${index + 1}. ${plot.title}`)
        console.log(`   County: ${plot.county}`)
        console.log(`   Location: ${plot.location_details}`)
        console.log(`   Coordinates: ${plot.latitude}, ${plot.longitude}`)
        console.log(`   ID: ${plot.id}`)
        console.log('')
    })
}

checkCoordinates()
