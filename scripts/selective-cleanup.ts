
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

async function selectiveCleanup() {
    console.log('🔍 Finding newest 1/8 Acre listing to preserve...')

    // Get all plots ordered by creation date (newest first)
    const { data: allPlots, error: fetchError } = await supabase
        .from('plots')
        .select('*')
        .order('created_at', { ascending: false })

    if (fetchError) {
        console.error('❌ Error fetching plots:', fetchError.message)
        return
    }

    console.log(`📊 Found ${allPlots?.length || 0} total listings`)

    // Find the newest listing (should be user's manual entry)
    const newestPlot = allPlots?.[0]

    if (!newestPlot) {
        console.log('✅ No plots found. Database is already clean.')
        return
    }

    console.log(`\n🛡️  PRESERVING:`)
    console.log(`   Title: ${newestPlot.title}`)
    console.log(`   ID: ${newestPlot.id}`)
    console.log(`   Created: ${newestPlot.created_at}`)
    console.log(`   Status: ${newestPlot.status}`)

    // Get IDs of plots to delete (everything except the newest)
    const plotsToDelete = allPlots.slice(1).map(p => p.id)

    if (plotsToDelete.length === 0) {
        console.log('\n✅ Only one listing exists. Nothing to delete.')
        return
    }

    console.log(`\n🗑️  DELETING ${plotsToDelete.length} old listings...`)

    // Delete notifications related to old plots
    const { error: notifError } = await supabase
        .from('notifications')
        .delete()
        .in('plot_id', plotsToDelete)

    if (notifError) console.error('⚠️  Error deleting notifications:', notifError.message)
    else console.log('   ✅ Deleted related notifications')

    // Delete inquiries related to old plots
    const { error: inqError } = await supabase
        .from('inquiries')
        .delete()
        .in('plot_id', plotsToDelete)

    if (inqError) console.error('⚠️  Error deleting inquiries:', inqError.message)
    else console.log('   ✅ Deleted related inquiries')

    // Delete old plots
    const { error: plotError } = await supabase
        .from('plots')
        .delete()
        .in('id', plotsToDelete)

    if (plotError) {
        console.error('❌ Error deleting plots:', plotError.message)
    } else {
        console.log('   ✅ Deleted old plots')
    }

    console.log('\n✨ Cleanup complete! Only your newest listing remains.')
}

selectiveCleanup()
