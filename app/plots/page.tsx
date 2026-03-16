'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import PlotCard from '@/components/plot-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select-native'
import { Search, Loader2, Map as MapIcon, Grid3x3, SlidersHorizontal, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

export default function PlotsPage() {
    const searchParams = useSearchParams()
    const supabase = createClient()
    const [plots, setPlots] = useState<Database['public']['Tables']['plots']['Row'][]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [county, setCounty] = useState('')
    const [transactionType, setTransactionType] = useState(searchParams.get('type') || '')
    const [landStatus, setLandStatus] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [minSize, setMinSize] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
    const [filterCurrency, setFilterCurrency] = useState('KES')
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

    const MapViewer = dynamic(() => import('@/components/map-viewer'), {
        ssr: false,
        loading: () => <div className="h-[600px] w-full bg-gray-50 animate-pulse rounded-3xl flex items-center justify-center font-black text-gray-400">Loading Map Core...</div>
    })

    const fetchPlots = async (isLoadMore = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true)
            } else {
                setLoading(true)
                setPage(1)
            }
            setError(null)

            const currentPage = isLoadMore ? page + 1 : 1
            const pageSize = 12
            const from = (currentPage - 1) * pageSize
            const to = from + pageSize - 1

            // Add a timeout to prevent infinite spinning
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Marketplace synchronization timed out')), 15000)
            )

            let query = (supabase.from('plots') as any)
                .select('*', { count: 'exact' })
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .range(from, to)

            // Apply filters to query
            if (county) query = query.eq('county', county)
            if (transactionType) {
                const map: Record<string, string> = {
                    'buy': 'outright_purchase',
                    'lease': 'lease',
                    'swap': 'swap',
                    'jv': 'joint_venture'
                }
                const val = map[transactionType] || transactionType
                query = query.eq('transaction_type', val)
            }
            if (landStatus) query = query.eq('land_status', landStatus)
            if (maxPrice) query = query.lte('price_kes', parseFloat(maxPrice))
            if (minSize) query = query.gte('size_acres', parseFloat(minSize))

            const result = await Promise.race([query, timeoutPromise]) as any
            const { data, error, count } = result

            if (error) throw error
            
            if (data) {
                if (isLoadMore) {
                    setPlots(prev => [...prev, ...data])
                    setPage(currentPage)
                } else {
                    setPlots(data)
                }
                
                // Update hasMore based on count
                if (count !== null) {
                    setHasMore(plots.length + data.length < count)
                } else {
                    setHasMore(data.length === pageSize)
                }
            }
        } catch (err: any) {
            console.error("Error fetching plots:", err.message, err.details, err.hint, err)
            setError(err.message || "Failed to synchronize with marketplace")
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchPlots()
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchPlots()
    }

    return (
        <div className="min-h-screen bg-pesa-subtle">
            {/* Hero Section with Filter Bar */}
            <div className="bg-pesa-green text-white py-20 relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase">
                            Find Your <span className="text-pesa-gold">Plot</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                            Browse verified land listings across all 47 Kenyan counties.
                        </p>
                    </div>

                    {/* Filter Bar */}
                    <form onSubmit={handleSearch} className="max-w-5xl mx-auto relative group">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-8 border border-white/20">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Acquisition Method
                                    </label>
                                    <Select
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                        className="w-full h-14 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-black text-pesa-green px-4 outline-none"
                                    >
                                        <option value="">Any Method</option>
                                        <option value="buy">Buy (Outright)</option>
                                        <option value="lease">Lease (Long-term)</option>
                                        <option value="jv">Joint Venture</option>
                                        <option value="swap">Swap / Exchange</option>
                                    </Select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Land Status
                                    </label>
                                    <Select
                                        value={landStatus}
                                        onChange={(e) => setLandStatus(e.target.value)}
                                        className="w-full h-14 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-black text-pesa-green px-4 outline-none"
                                    >
                                        <option value="">Any Status</option>
                                        <option value="vacant">Vacant Land</option>
                                        <option value="redevelopment">Redevelopment</option>
                                    </Select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Market County
                                    </label>
                                    <Select
                                        value={county}
                                        onChange={(e) => setCounty(e.target.value)}
                                        className="w-full h-14 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-black text-pesa-green px-4 outline-none"
                                    >
                                        <option value="">National (All)</option>
                                        <option value="Nairobi">Nairobi</option>
                                        <option value="Mombasa">Mombasa</option>
                                        <option value="Kiambu">Kiambu</option>
                                        <option value="Machakos">Machakos</option>
                                        <option value="Kajiado">Kajiado</option>
                                        <option value="Nakuru">Nakuru</option>
                                        <option value="Uasin Gishu">Uasin Gishu</option>
                                        <option value="Kilifi">Kilifi</option>
                                        <option value="Kwale">Kwale</option>
                                        <option value="Lamu">Lamu</option>
                                        <option value="Laikipia">Laikipia</option>
                                        <option value="Meru">Meru</option>
                                        <option value="Nyeri">Nyeri</option>
                                        <option value="Murang'a">Murang'a</option>
                                        <option value="Kisumu">Kisumu</option>
                                    </Select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        Budget Cap
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Limit"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            className="h-14 flex-1 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-black text-pesa-green outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-pesa-green hover:opacity-90 text-white font-black text-lg rounded-2xl shadow-xl shadow-pesa-green/10 border-b-6 border-pesa-gold flex items-center justify-center gap-3 active:scale-95 transition-all"
                                    >
                                        <Search className="h-6 w-6" />
                                        Filter Plot Hub
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Results Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-pesa-green tracking-tight">
                            {loading ? 'Initializing Database...' : `${plots.length} ${plots.length === 1 ? 'Verified Listing' : 'Verified Listings'}`}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-pesa-gold animate-pulse"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                {county ? `Current Market: ${county}` : 'National Marketplace Active'}
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex bg-white p-1 rounded-2xl shadow-pesa border border-pesa-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'grid'
                                ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10 ring-2 ring-pesa-gold/20'
                                : 'text-gray-400 hover:text-pesa-green'
                                }`}
                        >
                            <Grid3x3 className="h-4 w-4" />
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'map'
                                ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10 ring-2 ring-pesa-gold/20'
                                : 'text-gray-400 hover:text-pesa-green'
                                }`}
                        >
                            <MapIcon className="h-4 w-4" />
                            Map View
                        </button>
                    </div>
                </div>

                {/* Main View Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <Loader2 className="h-16 w-16 animate-spin text-pesa-green opacity-20" />
                        <p className="font-black text-pesa-green uppercase tracking-widest text-xs opacity-50">Synchronizing Listings...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-24 bg-red-50 rounded-[3rem] border border-red-100 shadow-sm">
                        <div className="text-red-500 mb-8">
                            <AlertCircle className="h-24 w-24 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-black text-red-700 mb-2">Marketplace Sync Error</h3>
                        <p className="text-red-600 font-medium mb-10">{error}</p>
                        <Button onClick={() => fetchPlots()} className="bg-red-600 text-white font-black px-12 rounded-xl h-14 border-b-4 border-red-800">Retry Synchronization</Button>
                    </div>
                ) : plots.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-pesa-border shadow-pesa">
                        <div className="text-gray-200 mb-8">
                            <SlidersHorizontal className="h-24 w-24 mx-auto" />
                        </div>
                        <h3 className="text-2xl font-black text-pesa-green mb-2">No {transactionType ? `${transactionType.replace('_', ' ')} ` : ''}Assets Found</h3>
                        <p className="text-gray-400 font-medium mb-10">
                            We couldn't find any {transactionType || 'listings'} matching your specific filters in {county || 'the current area'}.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Button 
                                onClick={() => {
                                    setCounty('');
                                    setTransactionType('');
                                    setLandStatus('');
                                    setMaxPrice('');
                                    fetchPlots();
                                }}
                                className="bg-pesa-green text-white font-black px-12 rounded-xl h-14 border-b-4 border-pesa-gold"
                            >
                                View All Listings
                            </Button>
                            <Link href="/dashboard/buyer/wanted/create">
                                <Button variant="outline" className="text-pesa-green border-pesa-green/20 font-black px-12 rounded-xl h-14 hover:bg-pesa-green/5">
                                    Set Search Alert
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {plots.map(plot => (
                                        <PlotCard key={plot.id} plot={plot} />
                                    ))}
                                </div>
                                
                                {/* Pagination Control */}
                                {hasMore && (
                                    <div className="flex justify-center pt-8">
                                        <Button 
                                            onClick={() => fetchPlots(true)}
                                            disabled={loadingMore}
                                            className="bg-white text-pesa-green border-2 border-pesa-green hover:bg-pesa-green hover:text-white font-black px-12 rounded-2xl h-16 shadow-xl transition-all flex items-center gap-3 group"
                                        >
                                            {loadingMore ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <Grid3x3 className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                                            )}
                                            {loadingMore ? 'Loading More Assets...' : 'View More Listings'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-white border border-pesa-border min-h-[600px]">
                                <MapViewer plots={plots.map(p => ({
                                    id: p.id,
                                    title: p.title,
                                    price_kes: p.price_kes,
                                    latitude: p.latitude || -1.2921,
                                    longitude: p.longitude || 36.8219
                                }))} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
