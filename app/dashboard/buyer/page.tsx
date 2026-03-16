'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, MapPin, TrendingUp, Bell, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BuyerDashboardPage() {
    const supabase = createClient()
    const [stats, setStats] = useState({ totalPlots: 0, counties: 0 })

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await (supabase.from('plots') as any).select('county').eq('status', 'published')
            if (data) {
                const uniqueCounties = new Set((data as any[])?.map((p: any) => p.county))
                setStats({
                    totalPlots: data.length,
                    counties: uniqueCounties.size
                })
            }
        }
        fetchStats()
    }, [supabase])

    return (
        <div className="space-y-10 py-6">
            <div>
                <h1 className="text-4xl font-black text-pesa-green tracking-tight">
                    Find Your Perfect Plot
                </h1>
                <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Official PlotPesa Buyer Portal</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-none bg-pesa-green shadow-xl shadow-pesa-green/10 text-white rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.totalPlots}</div>
                        <p className="text-[10px] font-bold text-pesa-gold mt-1 uppercase tracking-tighter">Verified Listings</p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-pesa rounded-3xl overflow-hidden relative border border-pesa-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Counties</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-pesa-green">{stats.counties}</div>
                        <p className="text-[10px] font-bold text-pesa-gold mt-1 uppercase tracking-tighter">Locations in Kenya</p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white shadow-pesa rounded-3xl overflow-hidden relative border border-pesa-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-pesa-green">
                            <TrendingUp className="h-10 w-10 text-pesa-gold" />
                        </div>
                        <p className="text-[10px] font-bold text-pesa-gold mt-1 uppercase tracking-tighter">Price Trends: Active</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="hover:shadow-2xl transition-all border-none bg-white rounded-3xl p-4 shadow-pesa group">
                    <CardHeader>
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-pesa-green rounded-2xl group-hover:bg-pesa-gold group-hover:text-pesa-green transition-colors text-white shadow-lg">
                                <Search className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-pesa-green">Browse Database</CardTitle>
                                <p className="text-sm text-gray-400 font-medium tracking-tight">Search by county, usage, and size</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Link href="/plots">
                            <Button className="w-full h-14 bg-pesa-green hover:opacity-90 text-white font-black rounded-2xl shadow-xl shadow-pesa-green/10 border-b-4 border-pesa-gold">
                                Enter Marketplace
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl transition-all border-none bg-white rounded-3xl p-4 shadow-pesa group">
                    <CardHeader>
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-pesa-subtle rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-colors text-pesa-green shadow-inner">
                                <MapPin className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-pesa-green">Interactive Map</CardTitle>
                                <p className="text-sm text-gray-400 font-medium tracking-tight">Locate properties geographically</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Link href="/plots">
                            <Button variant="outline" className="w-full h-14 border-2 border-pesa-green text-pesa-green font-black rounded-2xl hover:bg-pesa-green/5 transition-all">
                                Open Map Viewer
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* Wanted Listings Card */}
            <Card className="hover:shadow-2xl transition-all border-none bg-white shadow-pesa rounded-3xl p-6 group">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="p-4 bg-pesa-gold/10 rounded-2xl text-pesa-green shadow-sm border border-pesa-gold/10">
                                <Bell className="h-7 w-7 text-pesa-gold" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black text-pesa-green">Smart Search Alerts</CardTitle>
                                <p className="text-sm text-gray-500 font-medium tracking-tight max-w-md mt-1">Can't find your plot? Set an alert and we'll notify you when a match is verified.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/dashboard/buyer/wanted/create">
                                <Button className="h-14 bg-pesa-green hover:opacity-90 text-white font-black px-8 rounded-2xl shadow-xl shadow-pesa-green/10 border-b-4 border-pesa-gold">
                                    <Plus className="mr-2 h-5 w-5" /> Set Alert
                                </Button>
                            </Link>
                            <Link href="/dashboard/buyer/wanted">
                                <Button variant="outline" className="h-14 border-2 border-pesa-border text-gray-500 font-black px-8 rounded-2xl hover:border-pesa-green hover:text-pesa-green transition-all">
                                    My Alerts
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
