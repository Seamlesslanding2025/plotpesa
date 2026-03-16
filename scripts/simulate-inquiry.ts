
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
    console.error('Error: Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function simulateInquiry() {
    console.log('--- Simulating Inquiry & Notification ---')

    // 1. Get a plot and its owner
    const { data: plots } = await supabase
        .from('plots')
        .select('id, title, user_id')
        .limit(1)
        .single()

    if (!plots) {
        console.error('No plots found to inquire about.')
        return
    }

    const plot = plots
    const ownerId = plot.user_id
    console.log(`Target Plot: ${plot.title} (${plot.id})`)
    console.log(`Owner ID: ${ownerId}`)

    // 2. Insert Inquiry
    const inquiryData = {
        plot_id: plot.id,
        buyer_id: ownerId, // Self-inquiry for testing, or any ID
        message: 'I am interested in this plot. Is it still available?',
        buyer_name: 'Test Buyer',
        buyer_email: 'test@buyer.com',
        status: 'new'
    }

    const { data: inquiry, error: inquiryError } = await supabase
        .from('inquiries')
        .insert(inquiryData)
        .select()
        .single()

    if (inquiryError) {
        console.error('Failed to create inquiry:', inquiryError.message)
    } else {
        console.log('Inquiry Created:', inquiry.id)
    }

    // 3. Insert Notification for the Owner
    const notificationData = {
        user_id: ownerId,
        title: 'New Inquiry Received',
        message: `You have a new inquiry for ${plot.title} from Test Buyer.`,
        type: 'inquiry',
        link: '/dashboard/seller/inquiries',
        is_read: false
    }

    const { data: notification, error: notifError } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single()

    if (notifError) {
        console.error('Failed to create notification:', notifError.message)
    } else {
        console.log('Notification Created:', notification.id)
    }
}

simulateInquiry()
