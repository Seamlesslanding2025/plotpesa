/**
 * M-Pesa Daraja API Utility
 * Handles authentication and STK Push requests
 */

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET
const SHORTCODE = process.env.MPESA_SHORTCODE
const PASSKEY = process.env.MPESA_PASSKEY
const ENV = process.env.MPESA_ENV || 'sandbox'

const BASE_URL = ENV === 'sandbox'
    ? 'https://sandbox.safaricom.co.ke'
    : 'https://api.safaricom.co.ke'

export async function getMpesaToken() {
    try {
        const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64')
        const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`
            }
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Failed to get M-Pesa token: ${error}`)
        }

        const data = await response.json()
        return data.access_token
    } catch (err: any) {
        console.error('M-Pesa Token Error:', err)
        throw err
    }
}

export async function initiateStkPush({
    phoneNumber,
    amount,
    accountReference,
    transactionDesc,
    callbackUrl
}: {
    phoneNumber: string
    amount: number
    accountReference: string
    transactionDesc: string
    callbackUrl: string
}) {
    try {
        const token = await getMpesaToken()
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)
        const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64')

        // Format phone number to 254...
        let formattedPhone = phoneNumber.replace(/[^0-9]/g, '')
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '254' + formattedPhone.slice(1)
        } else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) {
            formattedPhone = '254' + formattedPhone
        }

        // Ensure it has 254 prefix
        if (!formattedPhone.startsWith('254')) {
            formattedPhone = '254' + formattedPhone
        }

        const body = {
            BusinessShortCode: SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount).toString(),
            PartyA: formattedPhone,
            PartyB: SHORTCODE,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: accountReference.slice(0, 12),
            TransactionDesc: transactionDesc.slice(0, 13)
        }

        const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.errorMessage || 'STK Push failed at Safaricom')
        }

        return await response.json()
    } catch (err: any) {
        console.error('STK Push Error:', err)
        throw err
    }
}
