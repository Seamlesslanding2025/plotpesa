'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Bell, MapPin, Trash2, Power, Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Database } from '@/types/supabase'

type WantedListing = Database['public']['Tables']['wanted_listings']['Row']

export default function WantedListingsManagementPage() {
    const { user } = useAuth()
    const supabase = createClient()
    const router = useRouter()

    const [listings, setListings] = useState<WantedListing[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchListings = async () => {
        if (!user) return
        setLoading(true)
        const { data } = await (supabase.from('wanted_listings') as any)
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (data) setListings(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchListings()
    }, [user])

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        setActionLoading(id)
        const { error } = await (supabase.from('wanted_listings') as any)
            .update({ is_active: !currentStatus })
            .eq('id', id)

        if (!error) {
            setListings(prev => prev.map(l => l.id === id ? { ...l, is_active: !currentStatus } : l))
        }
        setActionLoading(null)
    }

    const deleteListing = async (id: string) => {
        if (!confirm('Are you sure you want to delete this search alert?')) return

        setActionLoading(id)
        const { error } = await (supabase.from('wanted_listings') as any)
            .delete()
            .eq('id', id)

        if (!error) {
            setListings(prev => prev.filter(l => l.id !== id))
        }
        setActionLoading(null)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-6">
                <Loader2 className="h-12 w-12 animate-spin text-pesa-green" />
                <p className="text-sm text-gray-400 font-black uppercase tracking-widest">Accessing Your Alerts...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tight">Search Alerts</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage your wanted listings and notification preferences</p>
                </div>
                <Link href="/dashboard/buyer/wanted/create" className="no-underline">
                    <Button className="bg-pesa-green hover:opacity-90 text-white font-black px-8 h-14 rounded-2xl shadow-xl shadow-pesa-green/10 border-b-4 border-pesa-gold">
                        <Plus className="mr-2 h-6 w-6" /> Create New Alert
                    </Button>
                </Link>
            </div>

            {listings.length === 0 ? (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Active Alerts</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mb-8">
                        Tell us what you're looking for, and we'll notify you as soon as a matching plot is verified on our portal!
                    </p>
                    <Link href="/dashboard/buyer/wanted/create">
                        <Button className="bg-pesa-green text-white font-black px-10 rounded-xl h-12">Set Your First Alert</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8">
                    {listings.map((listing: any) => (
                        <div
                            key={listing.id}
                            className={`bg-white rounded-3xl border-l-8 transition-all overflow-hidden shadow-sm hover:shadow-xl ${listing.is_active ? 'border-l-pesa-green' : 'border-l-gray-200 opacity-75'
                                }`}
                        >
                            <div className="p-8">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-2xl font-black text-pesa-green">{listing.title}</h3>
                                            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${listing.is_active ? 'bg-pesa-green text-white border border-pesa-gold/30' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                {listing.is_active ? 'SCANNING' : 'PAUSED'}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                                            <MapPin className="h-4 w-4 text-pesa-gold" />
                                            {listing.counties.join(', ')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={!!actionLoading}
                                            onClick={() => toggleStatus(listing.id, listing.is_active || false)}
                                            className={`h-12 px-6 rounded-xl border-2 font-black transition-all ${listing.is_active
                                                ? "border-pesa-gold text-pesa-green hover:bg-pesa-gold/10"
                                                : "border-pesa-green text-pesa-green hover:bg-pesa-green/5"
                                                }`}
                                        >
                                            <Power className="h-4 w-4 mr-2" />
                                            {actionLoading === listing.id ? '...' : listing.is_active ? 'Pause Tracking' : 'Resume Tracking'}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={!!actionLoading}
                                            onClick={() => deleteListing(listing.id)}
                                            className="h-12 w-12 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 p-0"
                                        >
                                            <Trash2 className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Price Filter ({listing.currency || 'KES'})</p>
                                        <p className="font-black text-pesa-green">
                                            {listing.min_price_kes ? `${listing.min_price_kes.toLocaleString()}` : '0'} -
                                            {listing.max_price_kes ? ` ${listing.max_price_kes.toLocaleString()}` : ' Any'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Size Range</p>
                                        <p className="font-black text-pesa-green">
                                            {listing.min_size_acres || 'Any'} - {listing.max_size_acres || 'Any'} Acres
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Property Type</p>
                                        <p className="font-black text-pesa-green capitalize">{listing.plot_type || 'Any Type'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-gray-400 font-black uppercase text-[10px] tracking-widest mb-1">Created On</p>
                                        <p className="font-black text-pesa-green">{new Date(listing.created_at || '').toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {listing.description && (
                                    <div className="mt-8 p-4 bg-pesa-gold/5 rounded-2xl border border-pesa-gold/10 text-xs text-pesa-green font-bold italic">
                                        &quot;{listing.description}&quot;
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
