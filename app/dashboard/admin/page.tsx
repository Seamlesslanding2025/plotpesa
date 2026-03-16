'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, FileText, CheckCircle, XCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminDashboardPage() {
    const { profile } = useAuth()
    const router = useRouter()
    const supabase = createClient()
    const [stats, setStats] = useState({
        pending: 0,
        published: 0,
        draft: 0,
        total: 0
    })

    useEffect(() => {
        if (profile?.role !== 'admin') {
            router.push('/dashboard')
            return
        }

        const fetchStats = async () => {
            const { data: allPlots } = await (supabase.from('plots') as any).select('status')

            if (allPlots) {
                setStats({
                    pending: (allPlots as any[]).filter(p => p.status === 'pending_verification').length,
                    published: (allPlots as any[]).filter(p => p.status === 'published').length,
                    draft: (allPlots as any[]).filter(p => p.status === 'draft').length,
                    total: (allPlots as any[]).length
                })
            }
        }

        fetchStats()
    }, [profile, router, supabase])

    if (profile?.role !== 'admin') {
        return (
            <div className="p-20 text-center bg-white rounded-3xl border border-pesa-border shadow-pesa">
                <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-pesa-green mb-2">Access Denied</h2>
                <p className="text-gray-500 font-medium">Secured Administration Zone. Your credentials lack necessary clearance.</p>
                <Link href="/dashboard" className="mt-8 inline-block">
                    <Button variant="outline" className="border-2 border-pesa-green text-pesa-green font-black rounded-xl">Return to Portal</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-10 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tight">Governance Hub</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Official PlotPesa Administration</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-pesa-green/[0.03] rounded-2xl border border-pesa-green/10">
                    <ShieldCheck className="h-6 w-6 text-pesa-gold" />
                    <span className="text-sm font-black text-pesa-green uppercase tracking-tighter">Admin Authority Active</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stat 1: Total */}
                <Card className="border-none bg-white shadow-pesa rounded-3xl overflow-hidden relative border border-pesa-border">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-pesa-green">{stats.total}</div>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">System-wide listings</p>
                        <FileText className="absolute top-8 right-8 h-8 w-8 text-pesa-green/10" />
                    </CardContent>
                </Card>

                {/* Stat 2: Pending */}
                <Card className="border-none bg-pesa-gold text-pesa-green shadow-xl shadow-pesa-gold/10 rounded-3xl overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest">Awaiting Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.pending}</div>
                        <p className="text-[10px] font-black mt-1 uppercase tracking-tighter">Verification Queue</p>
                        <Clock className="absolute top-8 right-8 h-8 w-8 opacity-20" />
                    </CardContent>
                </Card>

                {/* Stat 3: Published */}
                <Card className="border-none bg-pesa-green text-white shadow-xl shadow-pesa-green/10 rounded-3xl overflow-hidden relative">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-pesa-gold uppercase tracking-widest">Market Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black">{stats.published}</div>
                        <p className="text-[10px] font-bold mt-1 uppercase tracking-tighter opacity-70">Publicly visible</p>
                        <CheckCircle className="absolute top-8 right-8 h-8 w-8 text-pesa-gold opacity-20" />
                    </CardContent>
                </Card>

                {/* Stat 4: Drafts */}
                <Card className="border-none bg-white shadow-pesa rounded-3xl overflow-hidden relative border border-pesa-border opacity-60">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Draft Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-gray-600">{stats.draft}</div>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter text-gray-400">Owner in-progress</p>
                        <XCircle className="absolute top-8 right-8 h-8 w-8 text-gray-100" />
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden group">
                <CardHeader className="p-12 pb-6">
                    <CardTitle className="text-2xl font-black text-pesa-green flex items-center gap-4">
                        <div className="p-3 bg-pesa-green/5 rounded-2xl text-pesa-green">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        Critical Operations
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-12 pt-0">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Link href="/dashboard/admin/verification">
                            <Button className="w-full h-20 bg-pesa-green hover:opacity-90 text-white font-black text-xl rounded-2xl shadow-xl shadow-pesa-green/10 border-b-6 border-pesa-gold flex items-center justify-between px-10">
                                <div className="flex items-center gap-4">
                                    <Clock className="h-8 w-8" />
                                    <span>Verify Listings</span>
                                </div>
                                <div className="bg-pesa-gold text-pesa-green px-4 py-1 rounded-full text-lg">
                                    {stats.pending}
                                </div>
                            </Button>
                        </Link>

                        <div className="p-8 bg-pesa-subtle rounded-[2rem] border border-pesa-border flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-pesa-green">System Integrity</h3>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">All Services Operational</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-pesa-green animate-pulse"></div>
                                <div className="w-3 h-3 rounded-full bg-pesa-green/30"></div>
                                <div className="w-3 h-3 rounded-full bg-pesa-green/30"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
