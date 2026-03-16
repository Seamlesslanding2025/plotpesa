import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'
import { initiateStkPush } from '../../../../lib/mpesa'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { phoneNumber, amount, tier } = await req.json()

        if (!phoneNumber || !amount || !tier) {
            return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://plotpesa.vercel.app'
        const callbackUrl = `${siteUrl}/api/mpesa/callback`

        // 1. Initiate Real STK Push via Daraja API
        const mpesaResponse = await initiateStkPush({
            phoneNumber,
            amount,
            accountReference: `T-${tier.toUpperCase()}`,
            transactionDesc: `Subs: ${tier}`,
            callbackUrl
        })

        // 2. Record Pending Transaction in Supabase
        const { data: payment, error: dbError } = await (supabase
            .from('payments') as any)
            .insert({
                user_id: user.id,
                amount: parseFloat(amount),
                payment_type: 'subscription',
                tier: tier,
                transaction_ref: mpesaResponse.CheckoutRequestID, // Use Daraja's ID for tracking
                status: 'pending'
            })
            .select()
            .single()

        if (dbError) throw dbError

        return NextResponse.json({
            success: true,
            message: 'STK Push initiated successfully. Please check your phone.',
            paymentId: payment.id,
            checkoutRequestId: mpesaResponse.CheckoutRequestID
        })

    } catch (err: any) {
        console.error('M-Pesa API Error:', err)
        return NextResponse.json({ error: err.message || 'Payment initiation failed' }, { status: 500 })
    }
}
