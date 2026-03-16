'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, CreditCard, History, Crown, CheckCircle2, AlertCircle, TrendingUp, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BillingPage() {
    const { user, profile } = useAuth()
    const supabase = createClient()
    const [payments, setPayments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [paying, setPaying] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '')
    const [selectedTier, setSelectedTier] = useState<string | null>(null)
    const [paymentStatus, setPaymentStatus] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

    useEffect(() => {
        if (user) {
            fetchPayments()
            if (profile?.phone) setPhoneNumber(profile.phone)
        }
    }, [user, profile])

    const fetchPayments = async () => {
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', user?.id as any)
            .order('created_at', { ascending: false })

        if (!error) setPayments(data || [])
        setLoading(false)
    }

    const handleUpgrade = async (tier: string) => {
        if (!phoneNumber) {
            setPaymentStatus({ type: 'error', message: 'Please enter your phone number' })
            return
        }

        setSelectedTier(tier)
        setPaying(true)
        setPaymentStatus({ type: 'info', message: 'Sending M-Pesa prompt to your phone...' })

        try {
            let amount = 0
            if (tier === 'premium') amount = 3000
            else if (tier === 'standard') amount = 1500
            else if (tier === 'pro_standard') amount = 5000
            else if (tier === 'pro_platinum') amount = 2500

            const response = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber,
                    amount,
                    tier
                })
            })

            const result = await response.json()

            if (result.success) {
                setPaymentStatus({
                    type: 'success',
                    message: 'STK Push prompt sent! Please enter your M-Pesa PIN. Your account will upgrade automatically.'
                })
                
                // Start polling every 5 seconds for 1 minute
                let attempts = 0
                const interval = setInterval(async () => {
                    attempts++
                    await fetchPayments()
                    
                    // Check if current profile tier updated
                    const { data: currentProfile } = await (supabase.from('users_profile') as any).select('subscription_tier').eq('id', user?.id).single()
                    if (currentProfile?.subscription_tier === tier) {
                        setPaymentStatus({ type: 'success', message: `Victory! Your account is now ${tier.toUpperCase()}.` })
                        clearInterval(interval)
                    }

                    if (attempts > 12) clearInterval(interval)
                }, 5000)
            } else {
                throw new Error(result.error || 'Failed to initiate payment')
            }
        } catch (err: any) {
            setPaymentStatus({ type: 'error', message: err.message })
        } finally {
            setPaying(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-10 w-10 animate-spin text-pesa-green" />
        </div>
    )

    const tiers = [
        {
            name: 'free',
            label: 'Free',
            price: 'Ksh 0',
            features: ['1 Property Listing', 'Basic Support', 'Visible for 30 days'],
            current: profile?.subscription_tier === 'free',
            hidden: profile?.role === 'buyer'
        },
        {
            name: 'standard',
            label: 'Standard',
            price: 'Ksh 1,500',
            features: ['5 Property Listings', 'Priority Verification', '90 Days Visibility', 'Direct Buyer Leads'],
            current: profile?.subscription_tier === 'standard',
            hidden: !['owner', 'agent', 'company'].includes(profile?.role as any)
        },
        {
            name: 'premium',
            label: 'Platinum',
            price: 'Ksh 3,000',
            features: ['Unlimited Listings', 'VIP Homepage Featured', '365 Days Visibility', 'Verified Badge', 'Matching Intelligence'],
            current: profile?.subscription_tier === 'premium',
            hidden: !['owner', 'agent', 'company'].includes(profile?.role as any)
        },
        // Professional Tiers
        {
            name: 'pro_standard',
            label: 'Pro Specialist',
            price: 'Ksh 5,000',
            features: ['Verified Directory Badge', '1 Category Listing', 'Public Portfolio Page', 'Direct Inquiries', 'Yearly Subscription'],
            current: (profile?.subscription_tier as any) === 'pro_standard',
            hidden: !['valuer', 'surveyor', 'architect', 'eia_expert'].includes(profile?.role as any)
        },
        {
            name: 'pro_platinum',
            label: 'Pro Firm',
            price: 'Ksh 2,500',
            features: ['Top of Category Ranking', 'Lead Priority Bridge', 'Featured at Homepage', 'Firm Branding', 'Analytics Dashboard', 'Monthly Subscription'],
            current: (profile?.subscription_tier as any) === 'pro_platinum',
            hidden: !['valuer', 'surveyor', 'architect', 'eia_expert'].includes(profile?.role as any)
        }
    ]

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-10 focus-visible:outline-none">
            {/* Subscription Header */}
            <div className="bg-pesa-green rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>

                <div className="space-y-4 text-center md:text-left relative">
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                        <CreditCard className="h-8 w-8 text-pesa-gold" />
                        <h1 className="text-4xl font-black tracking-tight">Billing & Subscriptions</h1>
                    </div>
                    <p className="text-white/70 font-bold max-w-md">Manage your PlotPesa membership and view your payment history.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl relative min-w-[280px]">
                    <p className="text-white/60 font-black text-xs uppercase tracking-widest mb-1">Current Tier</p>
                    <div className="flex items-center gap-3">
                        <Crown className={`h-8 w-8 ${profile?.subscription_tier === 'premium' ? 'text-pesa-gold' : 'text-gray-300'}`} />
                        <span className="text-3xl font-black capitalize">{profile?.subscription_tier || 'Free'}</span>
                    </div>
                    {profile?.subscription_expires_at && profile.subscription_tier !== 'free' && (
                        <p className="text-white/60 text-xs font-bold mt-2">
                            Expires: {new Date(profile.subscription_expires_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>

            {/* Upgrade Section */}
            <div className={`grid gap-8 ${tiers.filter(t => !t.hidden).length === 1 ? 'max-w-md mx-auto' : 'md:grid-cols-3'}`}>
                {tiers.filter(t => !t.hidden).map((t) => (
                    <Card key={t.name} className={`rounded-3xl overflow-hidden border-2 transition-all ${t.current ? 'border-pesa-green shadow-xl' : 'border-gray-100 hover:border-pesa-gold'}`}>
                        <CardHeader className={`${t.name === 'premium' ? 'bg-gradient-to-br from-pesa-green to-pesa-dark text-white' : 'bg-gray-50'}`}>
                            {t.name === 'premium' && (
                                <div className="bg-pesa-gold text-black text-[10px] font-black px-2 py-0.5 rounded-full w-fit mb-2">MOST POPULAR</div>
                            )}
                            <CardTitle className="text-2xl font-black capitalize">{t.label}</CardTitle>
                            <CardDescription className={`${t.name === 'premium' ? 'text-white/60' : ''} font-black text-xl text-pesa-green`}>
                                {t.price} <span className="text-xs font-medium text-gray-500">/ period</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <ul className="space-y-4">
                                {t.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <CheckCircle2 className="h-4 w-4 text-pesa-green" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            {t.current ? (
                                <Button disabled className="w-full rounded-2xl bg-gray-100 text-gray-400 font-black">
                                    Current Plan
                                </Button>
                            ) : t.name !== 'free' ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-gray-400">M-Pesa Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                            <Input
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="254..."
                                                className="pl-10 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => handleUpgrade(t.name as any)}
                                        loading={paying && selectedTier === t.name}
                                        className="w-full rounded-2xl bg-pesa-gold hover:bg-pesa-gold/90 text-black font-black shadow-lg"
                                    >
                                        Upgrade Now
                                    </Button>
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {paymentStatus && (
                <div className={`p-6 rounded-2xl flex items-center gap-4 border ${paymentStatus.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                    paymentStatus.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                        'bg-blue-50 border-blue-100 text-blue-800'
                    }`}>
                    {paymentStatus.type === 'success' ? <CheckCircle2 className="h-6 w-6" /> :
                        paymentStatus.type === 'error' ? <AlertCircle className="h-6 w-6" /> :
                            <TrendingUp className="h-6 w-6 animate-pulse" />}
                    <p className="font-bold text-sm">{paymentStatus.message}</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto border-current"
                        onClick={fetchPayments}
                    >
                        Check Status
                    </Button>
                </div>
            )}

            {/* History Table */}
            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-10 overflow-hidden">
                <div className="flex items-center gap-3 mb-8">
                    <History className="h-8 w-8 text-pesa-green" />
                    <h2 className="text-2xl font-black text-pesa-green">Transaction History</h2>
                </div>

                {payments.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-2xl">
                        No transactions found yet. 💳
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-2 border-gray-50">
                                    <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Date</th>
                                    <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Description</th>
                                    <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Amount</th>
                                    <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Status</th>
                                    <th className="pb-4 font-black text-xs uppercase tracking-widest text-gray-400">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {payments.map((p) => (
                                    <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-5 font-bold text-sm text-gray-600">
                                            {new Date(p.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-5">
                                            <span className="px-3 py-1 bg-pesa-subtle text-pesa-green rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                {p.tier || 'Subscription'} Upgrade
                                            </span>
                                        </td>
                                        <td className="py-5 font-black text-gray-900">
                                            Ksh {p.amount.toLocaleString()}
                                        </td>
                                        <td className="py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                p.status === 'failed' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-5 font-mono text-xs text-gray-400">
                                            {p.transaction_ref || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
