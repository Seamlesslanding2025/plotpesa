
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

async function publishPendingListings() {
    console.log('🔍 Finding listings with pending_verification status...')

    const { data: pendingPlots, error: fetchError } = await supabase
        .from('plots')
        .select('*')
        .eq('status', 'pending_verification')

    if (fetchError) {
        console.error('❌ Error fetching plots:', fetchError.message)
        return
    }

    if (!pendingPlots || pendingPlots.length === 0) {
        console.log('✅ No pending listings found.')
        return
    }

    console.log(`📋 Found ${pendingPlots.length} pending listing(s):`)
    pendingPlots.forEach(plot => {
        console.log(`   - ${plot.title} (ID: ${plot.id})`)
    })

    console.log('\n📤 Publishing...')

    const { error: updateError } = await supabase
        .from('plots')
        .update({ status: 'published' })
        .eq('status', 'pending_verification')

    if (updateError) {
        console.error('❌ Error publishing listings:', updateError.message)
    } else {
        console.log('✅ All pending listings are now published!')
    }
}

publishPendingListings()
