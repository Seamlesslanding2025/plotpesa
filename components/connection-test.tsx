'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function ConnectionTest() {
    const [status, setStatus] = useState<string>('Testing connection...')
    const [details, setDetails] = useState<any>(null)

    useEffect(() => {
        const testConnection = async () => {
            const supabase = createClient()
            try {
                const start = Date.now()
                // Try a very simple health check - checking the session
                const { data, error } = await supabase.auth.getSession()
                const duration = Date.now() - start

                if (error) throw error

                setStatus(`Connected! Pinging took ${duration}ms`)
                setDetails({ session: data.session ? 'Active' : 'No active session' })
            } catch (err: any) {
                setStatus('Connection Failed')
                setDetails(err.message)
                console.error("Connection test failed:", err)
            }
        }

        testConnection()
    }, [])

    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-xl border border-gray-200 z-50 max-w-sm">
            <h3 className="font-bold text-sm mb-2">Supabase Status</h3>
            <div className={`text-sm font-medium ${status.includes('Connected') ? 'text-green-600' : 'text-red-600'}`}>
                {status}
            </div>
            {details && (
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(details, null, 2)}
                </pre>
            )}
        </div>
    )
}
