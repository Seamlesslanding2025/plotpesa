
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function ingestData() {
    const filePath = path.join(process.cwd(), 'data', 'listings.json')

    if (!fs.existsSync(filePath)) {
        console.error(`Error: Data file not found at ${filePath}`)
        process.exit(1)
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const listings = JSON.parse(fileContent)

    console.log(`Found ${listings.length} listings to ingest...`)

    // Get a user ID to assign these listings to (preferably an admin or the first user found)
    // For now, we'll try to find a user, or default to a specific one if you have it.
    // Ideally, this script should accept a USER_ID env var or argument.
    // Let's try to fetch the first user from auth.users (requires service role key)

    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers()

    if (userError || !users || users.length === 0) {
        console.error('Error: No users found in Supabase Auth. Please sign up a user first or provide a USER_ID.')
        console.error('User Error:', userError)
        process.exit(1)
    }

    // Use the first user found as the owner of these plots
    const userId = users[0].id
    console.log(`Assigning listings to User ID: ${userId} (${users[0].email})`)

    let successCount = 0
    let failCount = 0

    for (const listing of listings) {
        const {
            title,
            price_kes,
            county,
            plot_type,
            size_acres,
            location_details,
            description,
            listing_type,
            utilities,
            ideal_for,
            investment_highlights
        } = listing

        // Enhance description with extra fields if they exist
        let enhancedDescription = description || ''
        if (utilities) {
            enhancedDescription += `\n\nUtilities: Electricity: ${utilities.electricity}, Water: ${utilities.water}`
        }
        if (ideal_for && Array.isArray(ideal_for)) {
            enhancedDescription += `\n\nIdeal For: ${ideal_for.join(', ')}`
        }
        if (investment_highlights && Array.isArray(investment_highlights)) {
            enhancedDescription += `\n\nHighlights: ${investment_highlights.join(', ')}`
        }

        // Check if listing already exists by title
        const { data: existingPlots } = await supabase
            .from('plots')
            .select('id')
            .eq('title', title)
            .eq('user_id', userId)
            .maybeSingle()

        let error;

        if (existingPlots) {
            // Update existing record
            const { error: updateError } = await supabase
                .from('plots')
                .update({
                    price_kes,
                    county,
                    plot_type: plot_type || 'residential',
                    size_acres: size_acres || null,
                    location_details: location_details || null,
                    description: enhancedDescription,
                    listing_type: listing_type || 'sale',
                    status: 'published',
                    is_featured: false
                })
                .eq('id', existingPlots.id)
            error = updateError
        } else {
            // Insert new record
            const { error: insertError } = await supabase
                .from('plots')
                .insert({
                    user_id: userId,
                    title,
                    price_kes,
                    county,
                    plot_type: plot_type || 'residential',
                    size_acres: size_acres || null,
                    location_details: location_details || null,
                    description: enhancedDescription,
                    listing_type: listing_type || 'sale',
                    status: 'published',
                    is_featured: false,
                    view_count: 0
                })
            error = insertError
        }

        if (error) {
            console.error(`Failed to ingest "${title}":`, error.message)
            failCount++
        } else {
            console.log(`Successfully ingested: "${title}"`)
            successCount++
        }
    }

    console.log(`\nIngestion Complete!`)
    console.log(`Success: ${successCount}`)
    console.log(`Failed: ${failCount}`)
}

ingestData()
