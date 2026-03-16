import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const supabase = await createClient()

        console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2))

        const result = body.Body.stkCallback
        const checkoutRequestID = result.CheckoutRequestID
        const resultCode = result.ResultCode

        let status: 'completed' | 'failed' = 'failed'
        if (resultCode === 0) {
            status = 'completed'
        }

        // 1. Find and Update Payment Record by CheckoutRequestID
        const { data: updatedPayment, error: fetchError } = await (supabase
            .from('payments') as any)
            .update({
                status: status,
                updated_at: new Date().toISOString()
            })
            .eq('transaction_ref', checkoutRequestID)
            .select('user_id, tier')
            .single()

        if (fetchError) {
            console.error('Callback: Payment record not found for ID:', checkoutRequestID)
            return NextResponse.json({ error: 'Record not found' }, { status: 404 })
        }

        // 2. If success, upgrade user subscription tier
        if (status === 'completed' && updatedPayment) {
            let expiryDays = 30 // Default
            
            const tier = updatedPayment.tier
            if (tier === 'premium' || tier === 'pro_standard') {
                expiryDays = 365
            } else if (tier === 'standard') {
                expiryDays = 90
            } else if (tier === 'pro_platinum') {
                expiryDays = 30
            }

            const { error: profileError } = await (supabase
                .from('users_profile') as any)
                .update({
                    subscription_tier: tier,
                    subscription_expires_at: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
                })
                .eq('id', updatedPayment.user_id)

            if (profileError) throw profileError

            // 3. Log Success
            console.log(`Successfully upgraded user ${updatedPayment.user_id} to ${updatedPayment.tier}`)
        }

        return NextResponse.json({ success: true, status })

    } catch (err: any) {
        console.error('M-Pesa Callback Processing Error:', err)
        return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 })
    }
}
