'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Eye, MessageSquare, TrendingUp, Target, Loader2, ArrowUpRight, MapPin, Sparkles, LayoutPanelLeft } from 'lucide-react'
import { Database } from '@/types/supabase'

type PlotAnalytics = Database['public']['Tables']['plots']['Row'] & {
    inquiry_count: number;
    conversion_ratio: number;
}

export default function SellerAnalyticsPage() {
    const { user } = useAuth()
    const supabase = createClient()
    const [stats, setStats] = useState<{
        totalViews: number;
        totalInquiries: number;
        avgConversion: number;
        plots: PlotAnalytics[];
    } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user) return
            setLoading(true)

            // 1. Fetch plots owned by user
            const { data: plotsData } = await (supabase.from('plots') as any)
                .select('id, title, view_count, county, price_kes, currency')
                .eq('user_id', user.id)
                .order('view_count', { ascending: false })

            // 2. Fetch inquiry counts per plot
            const { data: inquiriesData } = await (supabase.from('inquiries') as any)
                .select('plot_id')
                .in('plot_id', plotsData?.map((p: any) => p.id) || [])

            const inquiryCounts = (inquiriesData || []).reduce((acc: any, curr: any) => {
                acc[curr.plot_id] = (acc[curr.plot_id] || 0) + 1
                return acc
            }, {})

            // 3. Process data
            const processedPlots = (plotsData || []).map((p: any) => {
                const inquiries = inquiryCounts[p.id] || 0
                return {
                    ...p,
                    inquiry_count: inquiries,
                    conversion_ratio: p.view_count > 0 ? (inquiries / p.view_count) * 100 : 0
                }
            })

            const totalViews = processedPlots.reduce((sum: number, p: any) => sum + (p.view_count || 0), 0)
            const totalInquiries = processedPlots.reduce((sum: number, p: any) => sum + p.inquiry_count, 0)
            const avgConversion = totalViews > 0 ? (totalInquiries / totalViews) * 100 : 0

            setStats({
                totalViews,
                totalInquiries,
                avgConversion,
                plots: processedPlots
            })
            setLoading(false)
        }

        fetchAnalytics()
    }, [user])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-pesa-green opacity-20" />
                <p className="font-black text-pesa-green uppercase tracking-[0.2em] text-xs opacity-50">Calculating Market Metrics...</p>
            </div>
        )
    }

    if (!stats || stats.plots.length === 0) {
        return (
            <div className="bg-white rounded-[4rem] border-2 border-dashed border-pesa-border p-32 text-center shadow-pesa relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pesa-green/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="w-24 h-24 bg-pesa-subtle rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-pesa-subtle">
                    <TrendingUp className="h-12 w-12 text-pesa-green opacity-30" />
                </div>
                <h3 className="text-2xl font-black text-pesa-green mb-2">No Data Assets</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">Publish your first listing to start tracking engagement and lead conversion metrics.</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tighter italic">Listing Insights</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Performance analytics for your property portfolio</p>
                </div>
                <div className="bg-pesa-subtle px-6 py-3 rounded-2xl border border-pesa-border flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-pesa-gold" />
                    <span className="text-[10px] font-black text-pesa-green uppercase tracking-widest">Growth Engines Active</span>
                </div>
            </div>

            {/* Macro Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-white rounded-[2.5rem] border border-pesa-border shadow-pesa overflow-hidden relative group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Eye className="h-20 w-20 text-pesa-green" />
                    </div>
                    <CardContent className="p-10 space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total Portal Views</p>
                        <p className="text-6xl font-black text-pesa-green tracking-tighter">{stats.totalViews.toLocaleString()}</p>
                        <div className="flex items-center gap-2 text-pesa-gold text-xs font-bold pt-4">
                            <TrendingUp className="h-4 w-4" /> Lifetime reach
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white rounded-[2.5rem] border border-pesa-border shadow-pesa overflow-hidden relative group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <MessageSquare className="h-20 w-20 text-pesa-green" />
                    </div>
                    <CardContent className="p-10 space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Purchase Inquiries</p>
                        <p className="text-6xl font-black text-pesa-green tracking-tighter">{stats.totalInquiries.toLocaleString()}</p>
                        <div className="flex items-center gap-2 text-pesa-gold text-xs font-bold pt-4">
                            <ArrowUpRight className="h-4 w-4" /> Prospective leads
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-pesa-green rounded-[2.5rem] border border-pesa-border shadow-2xl overflow-hidden relative group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Target className="h-20 w-20 text-white" />
                    </div>
                    <CardContent className="p-10 space-y-2">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Conversion Ratio</p>
                        <p className="text-6xl font-black text-white tracking-tighter">{stats.avgConversion.toFixed(1)}%</p>
                        <div className="flex items-center gap-2 text-pesa-gold text-xs font-bold pt-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-pesa-gold animate-ping"></div>
                            Engagement Factor
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Listing Breakdown Table */}
            <div className="bg-white rounded-[3rem] border border-pesa-border shadow-pesa overflow-hidden">
                <div className="p-10 border-b border-pesa-subtle bg-pesa-subtle/20">
                    <h3 className="text-xl font-black text-pesa-green tracking-tight">Property Performance Hierarchy</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Detailed metrics per verified asset</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-pesa-subtle/10 border-b border-pesa-subtle">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Listing Asset</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">County</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Views</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Leads</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Potential Ratio</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pesa-subtle">
                            {stats.plots.map((plot) => (
                                <tr key={plot.id} className="group hover:bg-pesa-subtle/30 transition-colors">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 bg-pesa-green/5 rounded-xl flex items-center justify-center font-black text-pesa-green border border-pesa-green/10">
                                                {plot.title.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-pesa-green">{plot.title}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">ID: {plot.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3 text-pesa-gold" />
                                            <span className="text-xs font-bold text-gray-500">{plot.county}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-pesa-green">{plot.view_count.toLocaleString()}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="text-sm font-black text-pesa-green">{plot.inquiry_count}</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[80px] overflow-hidden">
                                                <div
                                                    className="h-full bg-pesa-gold rounded-full transition-all duration-1000"
                                                    style={{ width: `${Math.min(100, plot.conversion_ratio * 5)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-black text-pesa-green">{plot.conversion_ratio.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
