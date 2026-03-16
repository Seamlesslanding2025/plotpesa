'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { useAuth } from '@/components/auth-provider'
import { PlusCircle, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SellerListingsPage() {
    const { user } = useAuth()
    const supabase = createClient()
    const [plots, setPlots] = useState<Database['public']['Tables']['plots']['Row'][]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return

        const fetchPlots = async () => {
            try {
                console.log("Fetching plots for user:", user.id)

                // Add a timeout to prevent infinite spinning
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Request timed out after 10 seconds')), 10000)
                )

                const queryPromise = (supabase as any).from('plots')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                const result = await Promise.race([queryPromise, timeoutPromise]) as any
                const { data, error } = result

                if (error) throw error

                console.log("Plots fetched:", data)
                if (data) setPlots(data)
            } catch (err: any) {
                console.error("Error fetching plots:", err)
                setError(err.message || "Failed to load listings")
            } finally {
                setLoading(false)
            }
        }

        fetchPlots()
    }, [user, supabase])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-6">
                <Loader2 className="h-12 w-12 animate-spin text-pesa-green" />
                <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Accessing Portal Listings...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-20 text-center">
                <div className="bg-red-50 text-red-600 px-8 py-4 rounded-2xl mb-6 inline-block font-bold border border-red-100">
                    {error}
                </div>
                <div>
                    <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl border-2 border-pesa-green text-pesa-green font-black">
                        Retry Connection
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tight">Property Portfolio</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage and track your listed plots in Kenya</p>
                </div>
                <Link href="/dashboard/seller/listings/create">
                    <Button className="bg-pesa-green hover:opacity-90 text-white font-black px-8 h-14 rounded-2xl shadow-xl shadow-pesa-green/10 border-b-4 border-pesa-gold">
                        <PlusCircle className="mr-2 h-6 w-6" />
                        List New Property
                    </Button>
                </Link>
            </div>

            {plots.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-pesa-border p-20 text-center shadow-pesa">
                    <div className="w-20 h-20 bg-pesa-subtle rounded-full flex items-center justify-center mx-auto mb-6">
                        <PlusCircle className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">Portfolio is Empty</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't listed any plots yet. Start listing today to reach thousands of buyers.</p>
                    <Link href="/dashboard/seller/listings/create">
                        <Button className="bg-pesa-green text-white font-black px-10 rounded-xl h-12">Create Your First Listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {plots.map(plot => (
                        <div key={plot.id} className="bg-white rounded-3xl border border-pesa-border shadow-pesa hover:shadow-2xl transition-all group overflow-hidden">
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${plot.status === 'published' ? 'bg-pesa-green text-white border border-pesa-gold/30' :
                                        plot.status === 'pending_verification' ? 'bg-pesa-gold/20 text-pesa-green' :
                                            'bg-pesa-subtle text-gray-400'
                                        }`}>
                                        {plot.status.replace(/_/g, ' ')}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300">ID: {plot.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <h3 className="text-xl font-black text-pesa-green mb-4 line-clamp-1 group-hover:underline decoration-pesa-gold decoration-4 underline-offset-4">{plot.title}</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-2 text-gray-500">
                                        <MapPin className="h-4 w-4 text-pesa-gold" />
                                        <span className="text-sm font-bold">{plot.county}</span>
                                    </div>
                                    <p className="text-3xl font-black text-pesa-green">
                                        <span className="text-xs uppercase tracking-widest text-gray-400 block mb-1">Price</span>
                                        KES {plot.price_kes.toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Link href={`/plots/${plot.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-pesa-border text-gray-600 font-bold hover:border-pesa-green hover:text-pesa-green transition-all" size="sm">
                                            View Public
                                        </Button>
                                    </Link>
                                    {plot.status === 'draft' && (
                                        <Button
                                            onClick={async () => {
                                                if (confirm('Submit this listing for official verification?')) {
                                                    const { error } = await (supabase as any).from('plots')
                                                        .update({ status: 'pending_verification' })
                                                        .eq('id', plot.id)

                                                    if (!error) {
                                                        alert('Successfully submitted for review!')
                                                        window.location.reload()
                                                    } else {
                                                        alert('Error: ' + error.message)
                                                    }
                                                }
                                            }}
                                            className="flex-1 h-12 rounded-xl bg-pesa-green text-white font-black hover:opacity-90 shadow-lg shadow-pesa-green/10 border-b-4 border-pesa-gold/30"
                                            size="sm"
                                        >
                                            Submit Info
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
