'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { useAuth } from '@/components/auth-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2, AlertCircle, MapPin, Phone, Calendar, ShieldCheck, FileText, ExternalLink, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Plot = Database['public']['Tables']['plots']['Row'] & {
    documents?: any[];
    images?: any[];
}

export default function AdminVerificationPage() {
    const { user, profile } = useAuth()
    const router = useRouter()
    const supabase = createClient()
    const [plots, setPlots] = useState<Plot[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)

    useEffect(() => {
        if (!loading && profile?.role !== 'admin') {
            router.push('/dashboard')
            return
        }

        if (user && profile?.role === 'admin') {
            fetchPendingPlots()
        }
    }, [user, profile, router])

    const fetchPendingPlots = async () => {
        setLoading(true)
        const { data } = await (supabase.from('plots') as any)
            .select('*')
            .in('status', ['draft', 'pending_verification'])
            .order('created_at', { ascending: false })

        if (data) setPlots(data as Plot[])
        setLoading(false)
    }

    const handleApprove = async (plot: Plot) => {
        setProcessing(plot.id)
        try {
            const { error } = await (supabase.from('plots') as any)
                .update({ status: 'published' })
                .eq('id', plot.id)

            if (error) throw error

            // Trigger In-App Notification for Phase 10 compliance
            await (supabase.from('notifications') as any).insert({
                user_id: plot.user_id,
                title: 'Asset Verified',
                message: `Excellent! Your property "${plot.title}" has passed our audit and is now live on the marketplace.`,
                type: 'listing_approved',
                link: `/plots/${plot.id}`
            })

            alert('Plot approved and published!')
            fetchPendingPlots()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setProcessing(null)
        }
    }

    const handleReject = async (plot: Plot) => {
        const reason = prompt('Reason for rejection (this will be logged and sent to seller):')
        if (reason === null) return // Cancelled

        setProcessing(plot.id)
        try {
            const { error } = await (supabase.from('plots') as any)
                .update({ status: 'draft' })
                .eq('id', plot.id)

            if (error) throw error

            // Trigger In-App Rejection Notification
            await (supabase.from('notifications') as any).insert({
                user_id: plot.user_id,
                title: 'Audit Failed',
                message: `Your property "${plot.title}" was rejected and reverted to draft. Reason: ${reason}. Please update your listing.`,
                type: 'listing_rejected',
                link: `/dashboard/seller/listings`
            })

            alert('Plot rejected and reverted to draft status.')
            fetchPendingPlots()
        } catch (err: any) {
            alert(`Error: ${err.message}`)
        } finally {
            setProcessing(null)
        }
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="p-20 text-center bg-white rounded-3xl border border-pesa-border shadow-pesa">
                <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-pesa-green mb-2">Access Denied</h2>
                <p className="text-gray-500 font-medium">Secured Administration Zone.</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-pesa-green opacity-20" />
                <p className="font-black text-pesa-green uppercase tracking-[0.2em] text-xs opacity-50">Syncing Audit Queue...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tighter">Governance Audit</h1>
                    <p className="text-gray-500 font-medium mt-1">Manual verification of property title and visual assets</p>
                </div>
                <div className="bg-pesa-gold text-pesa-green px-6 py-3 rounded-2xl border border-pesa-gold/20 shadow-lg shadow-pesa-gold/10">
                    <span className="text-xs font-black uppercase tracking-widest">
                        {plots.length} {plots.length === 1 ? 'Asset' : 'Assets'} Flagged for Review
                    </span>
                </div>
            </div>

            {plots.length === 0 ? (
                <div className="bg-white rounded-[4rem] border-2 border-dashed border-pesa-border p-32 text-center shadow-pesa">
                    <div className="w-24 h-24 bg-pesa-subtle rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-pesa-subtle">
                        <CheckCircle className="h-12 w-12 text-pesa-green opacity-50" />
                    </div>
                    <h3 className="text-2xl font-black text-pesa-green mb-2">All Clear</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">No pending property listings require attention at this time.</p>
                </div>
            ) : (
                <div className="grid gap-10">
                    {plots.map(plot => (
                        <Card key={plot.id} className="bg-white rounded-[3rem] border border-pesa-border shadow-pesa overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="p-10">
                                <div className="flex flex-col xl:flex-row justify-between gap-10">

                                    {/* Asset Identity */}
                                    <div className="flex-1 space-y-8">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-4 mb-4">
                                                <h3 className="text-3xl font-black text-pesa-green leading-none">{plot.title}</h3>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${plot.status === 'pending_verification'
                                                    ? 'bg-pesa-gold text-pesa-green border border-pesa-gold/20 shadow-sm'
                                                    : 'bg-pesa-subtle text-gray-400'
                                                    }`}>
                                                    {plot.status.replace(/_/g, ' ')}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-8 items-center text-gray-500">
                                                <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-pesa-gold" /><span className="text-sm font-bold">{plot.county}</span></div>
                                                <div className="flex items-center gap-2"><Phone className="h-5 w-5 text-pesa-gold" /><span className="text-sm font-bold">{plot.contact_phone || 'Unlisted'}</span></div>
                                                <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-pesa-gold" /><span className="text-sm font-bold">{new Date(plot.created_at).toLocaleDateString()}</span></div>
                                                <div className="flex items-center gap-2 text-pesa-green"><ShieldCheck className="h-5 w-5 text-pesa-gold" /><span className="text-sm font-black uppercase tracking-tighter">KSh {plot.price_kes.toLocaleString()}</span></div>
                                            </div>
                                        </div>

                                        {/* Visual Audit */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon className="h-3 w-3" /> Property Visuals (Compressed)
                                            </p>
                                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                                {plot.images && (plot.images as string[]).map((img, i) => (
                                                    <a key={i} href={img} target="_blank" rel="noreferrer" className="relative group/img h-24 w-36 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-pesa-border hover:border-pesa-gold transition-all shadow-md">
                                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                                            <ExternalLink className="h-5 w-5 text-white" />
                                                        </div>
                                                    </a>
                                                ))}
                                                {(!plot.images || (plot.images as string[]).length === 0) && (
                                                    <div className="h-24 w-full bg-pesa-subtle rounded-2xl border-2 border-dashed border-pesa-border flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                                                        No visual assets provided
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Document Audit (Phase 2 Upgrade) */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText className="h-3 w-3" /> Official Paperwork Inspection
                                            </p>
                                            <div className="flex flex-wrap gap-4">
                                                {(plot.documents as string[] || []).map((doc, i) => {
                                                    const label = i === 0 ? 'Title Deed' : i === 1 ? 'Deed Plan' : `Document ${i + 1}`;
                                                    return (
                                                        <a key={i} href={doc} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-pesa-subtle px-5 py-3 rounded-2xl border border-pesa-border hover:bg-pesa-green hover:text-white transition-all group/doc">
                                                            <FileText className="h-5 w-5 text-pesa-green group-hover/doc:text-white" />
                                                            <span className="text-xs font-black uppercase tracking-tighter">{label}</span>
                                                            <ExternalLink className="h-4 w-4 text-pesa-gold" />
                                                        </a>
                                                    );
                                                })}
                                                {(!plot.documents || (plot.documents as string[]).length === 0) && (
                                                    <div className="px-5 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                                                        <XCircle className="h-4 w-4" /> Proof of Ownership Missing
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Verification Controls */}
                                    <div className="flex xl:flex-col gap-4 min-w-[300px] border-t xl:border-t-0 xl:border-l border-pesa-border pt-10 xl:pt-0 xl:pl-10">
                                        <Button
                                            onClick={() => handleApprove(plot)}
                                            disabled={processing === plot.id}
                                            className="h-20 flex-1 bg-pesa-green hover:opacity-90 text-white font-black rounded-[2rem] shadow-2xl shadow-pesa-green/20 border-b-8 border-pesa-gold flex items-center justify-center gap-4 text-lg"
                                        >
                                            {processing === plot.id ? (
                                                <Loader2 className="h-6 w-6 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-7 w-7" />
                                                    Verify & Publish
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(plot)}
                                            disabled={processing === plot.id}
                                            variant="outline"
                                            className="h-16 flex-1 border-2 border-red-100 text-red-500 font-black rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                                        >
                                            <XCircle className="h-5 w-5" />
                                            Decline Asset
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
