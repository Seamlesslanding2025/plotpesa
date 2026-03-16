'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Calendar, User, Mail, ArrowRight, Loader2, Sparkles, Inbox, Target, CheckCircle, XCircle, Clock, Edit3, Save } from 'lucide-react'
import Link from 'next/link'

interface Inquiry {
    id: string;
    plot_id: string;
    buyer_id: string;
    message: string;
    buyer_name: string;
    buyer_email: string;
    created_at: string;
    status: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost';
    seller_notes: string | null;
    plots: {
        title: string;
    };
}

export default function SellerInquiriesPage() {
    const { user } = useAuth()
    const supabase = createClient()
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)

    const updateInquiry = async (id: string, updates: Partial<Inquiry>) => {
        const { error } = await (supabase.from('inquiries') as any)
            .update(updates)
            .eq('id', id)

        if (!error) {
            setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, ...updates } : inq))
        }
    }

    useEffect(() => {
        const fetchInquiries = async () => {
            if (!user) return
            const { data } = await supabase
                .from('inquiries')
                .select('*, plots!inner(title, user_id)')
                .eq('plots.user_id', user.id)
                .order('created_at', { ascending: false })

            if (data) setInquiries(data as Inquiry[])
            setLoading(false)
        }
        fetchInquiries()
    }, [user, supabase])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-pesa-green opacity-20" />
                <p className="font-black text-pesa-green uppercase tracking-[0.2em] text-xs opacity-50">Opening Inquiry Inbox...</p>
            </div>
        )
    }

    return (
        <div className="space-y-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tighter italic">Property Leads</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Official PlotPesa Communication Portal</p>
                </div>
                <div className="bg-pesa-green text-white px-6 py-3 rounded-2xl border-b-4 border-pesa-gold shadow-xl">
                    <span className="text-xs font-black uppercase tracking-widest">
                        {inquiries.length} {inquiries.length === 1 ? 'Message' : 'Messages'} Received
                    </span>
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white rounded-[4rem] border-2 border-dashed border-pesa-border p-32 text-center shadow-pesa relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pesa-green/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="w-24 h-24 bg-pesa-subtle rounded-full flex items-center justify-center mx-auto mb-8 ring-8 ring-pesa-subtle">
                        <Inbox className="h-12 w-12 text-pesa-green opacity-30" />
                    </div>
                    <h3 className="text-2xl font-black text-pesa-green mb-2">Inbox is Pristine</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto">Once buyers start inquiring about your listings, their messages will appear here for you to manage.</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {inquiries.map((inquiry) => (
                        <Card key={inquiry.id} className="bg-white rounded-[2.5rem] border border-pesa-border shadow-pesa overflow-hidden group hover:shadow-2xl transition-all duration-500">
                            <div className="p-10">
                                <div className="flex flex-col lg:flex-row gap-10">
                                    <div className="lg:w-80 shrink-0">
                                        <div className="bg-pesa-subtle rounded-[2rem] p-8 border border-pesa-border shadow-inner space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-pesa-green text-white rounded-xl flex items-center justify-center font-black shadow-lg">
                                                    {inquiry.buyer_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-pesa-green">{inquiry.buyer_name}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prospective Buyer</p>
                                                </div>
                                            </div>
                                            <div className="space-y-3 pt-4 border-t border-pesa-border">
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Mail className="h-4 w-4 text-pesa-gold" />
                                                    <span className="text-xs font-bold truncate">{inquiry.buyer_email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-gray-600">
                                                    <Calendar className="h-4 w-4 text-pesa-gold" />
                                                    <span className="text-xs font-bold">{new Date(inquiry.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link href={`/plots/${inquiry.plot_id}`} className="block">
                                                <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-pesa-green text-pesa-green font-black hover:bg-pesa-green hover:text-white transition-all text-xs uppercase tracking-tighter">
                                                    View Property Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between py-2">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="h-5 w-5 text-pesa-gold" />
                                                <h3 className="text-xl font-black text-pesa-green tracking-tight">Regarding: {inquiry.plots.title}</h3>
                                            </div>
                                            <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-sm relative">
                                                <MessageSquare className="absolute -top-3 -left-3 h-10 w-10 text-pesa-green opacity-5" />
                                                <p className="text-gray-600 leading-relaxed font-medium italic">
                                                    &quot;{inquiry.message}&quot;
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-gray-50">
                                            <div className="flex items-center gap-3">
                                                <Target className="h-4 w-4 text-pesa-gold" />
                                                <select
                                                    value={inquiry.status || 'new'}
                                                    onChange={(e) => updateInquiry(inquiry.id, { status: e.target.value as any })}
                                                    className="bg-pesa-subtle border-transparent rounded-lg font-black text-[10px] uppercase tracking-widest px-4 py-2 text-pesa-green focus:ring-2 ring-pesa-gold outline-none"
                                                >
                                                    <option value="new">New Lead</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="negotiating">Negotiating</option>
                                                    <option value="closed_won">Closed (Sold)</option>
                                                    <option value="closed_lost">Closed (Failed)</option>
                                                </select>
                                            </div>
                                            <Button
                                                className="bg-pesa-green text-white font-black px-8 py-3 rounded-xl shadow-lg border-b-4 border-pesa-gold"
                                                onClick={() => window.open(`mailto:${inquiry.buyer_email}?subject=Regarding your inquiry on PlotPesa: ${inquiry.plots.title}`)}
                                            >
                                                Reply via Email <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="mt-8 bg-pesa-subtle/30 rounded-3xl p-6 border border-pesa-border/50">
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                                    <Edit3 className="h-3 w-3" /> Private CRM Notes
                                                </label>
                                                {inquiry.seller_notes && <span className="text-[8px] font-bold text-pesa-green uppercase bg-white px-2 py-0.5 rounded-full border border-pesa-border">Saved to Cloud</span>}
                                            </div>
                                            <textarea
                                                placeholder="Add context about this buyer..."
                                                className="w-full bg-white border border-pesa-border rounded-xl p-4 text-sm font-medium focus:ring-2 ring-pesa-green outline-none min-h-[100px] resize-none"
                                                defaultValue={inquiry.seller_notes || ''}
                                                onBlur={(e) => updateInquiry(inquiry.id, { seller_notes: e.target.value })}
                                            />
                                        </div>
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
