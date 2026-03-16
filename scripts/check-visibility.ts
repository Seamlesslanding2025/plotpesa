
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkVisibility() {
    console.log('--- Checking Data Visibility ---')

    // 1. Check with Service Role Key (Bypass RLS)
    const adminClient = createClient(supabaseUrl!, serviceKey!)
    const { count: adminCount, error: adminError } = await adminClient
        .from('plots')
        .select('*', { count: 'exact', head: true })

    if (adminError) console.error('Admin Check Error:', adminError.message)
    console.log(`Admin (Service Role) sees: ${adminCount} listings`)

    // 2. Check with Anon Key (Simulate Frontend - Exact Query)
    const anonClient = createClient(supabaseUrl!, anonKey!)
    const { data, error: anonError } = await anonClient
        .from('plots')
        .select('id, title, price_kes, currency, county, size_acres, images, status, plot_type, location_details, contact_phone, created_at')
        .eq('status', 'published')

    if (anonError) console.error('Anon Check Error:', anonError.message)
    console.log(`Anon (Frontend Query) sees: ${data?.length} listings`)
    if (data && data.length > 0) {
        console.log('Sample Row:', data[0])
    }

    const anonCount = data ? data.length : 0
    if (adminCount && adminCount > 0 && anonCount === 0) {
        console.log('\nCONCLUSION: RLS is blocking the frontend from seeing the data.')
    } else if (adminCount === 0) {
        console.log('\nCONCLUSION: The database is actually empty. Ingestion might have failed silently or been rolled back.')
    } else {
        console.log('\nCONCLUSION: Data is visible. The issue might be frontend filtering or caching.')
    }
}

checkVisibility()
