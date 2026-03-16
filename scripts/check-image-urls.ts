
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

async function checkImageURLs() {
    console.log('🔍 Checking image URLs...\n')

    const { data: plots, error } = await supabase
        .from('plots')
        .select('id, title, images')
        .order('created_at', { ascending: false })
        .limit(3)

    if (error) {
        console.error('❌ Error:', error.message)
        return
    }

    plots?.forEach((plot, index) => {
        console.log(`${index + 1}. ${plot.title}`)
        console.log(`   Images:`)
        if (plot.images && Array.isArray(plot.images)) {
            plot.images.forEach((url: string, i: number) => {
                console.log(`   ${i + 1}. ${url}`)
            })
        } else {
            console.log('   No images')
        }
        console.log('')
    })
}

checkImageURLs()
