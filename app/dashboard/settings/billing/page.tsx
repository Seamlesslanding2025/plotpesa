'use client'

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, Zap, Shield, Crown, CreditCard, Sparkles, Loader2, Phone } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function BillingPage() {
    const { profile } = useAuth()
    const currentTier = profile?.subscription_tier || 'free'
    const [loading, setLoading] = useState<string | null>(null)
    const [phoneNumber, setPhoneNumber] = useState(profile?.phone || '')

    const handleUpgrade = async (tier: string, amount: string) => {
        if (!phoneNumber) {
            alert('Please provide a phone number for M-Pesa STK Push.')
            return
        }

        setLoading(tier)
        try {
            const response = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber,
                    amount: amount.replace(/,/g, ''),
                    tier
                })
            })

            const result = await response.json()
            if (result.success) {
                alert(result.message)
            } else {
                throw new Error(result.error)
            }
        } catch (err: any) {
            alert('Payment failed: ' + err.message)
        } finally {
            setLoading(null)
        }
    }

    const tiers = [
        {
            name: 'Pesa Free',
            id: 'free',
            price: '0',
            icon: Shield,
            color: 'text-gray-400',
            bg: 'bg-gray-50',
            features: [
                'List up to 1 property',
                'Basic Marketplace visibility',
                'Standard support',
                'Public contact details'
            ]
        },
        {
            name: 'Pesa Standard',
            id: 'standard',
            price: '2,500',
            icon: Zap,
            color: 'text-pesa-gold',
            bg: 'bg-pesa-gold/5',
            features: [
                'List up to 5 properties',
                'Priority Verification (24h)',
                'Highlighted Search Results',
                'Direct WhatsApp Integration',
                'Social Media auto-posting'
            ],
            popular: true
        },
        {
            name: 'Pesa Premium',
            id: 'premium',
            price: '7,500',
            icon: Crown,
            color: 'text-emerald-500',
            bg: 'bg-pesa-green/[0.03]',
            features: [
                'Unlimited properties',
                'Instant Verification',
                'Featured "Plot of the Week"',
                'Agent Verified Badge',
                'Advanced Data Insights',
                'Dedicated Account Manager'
            ]
        }
    ]

    return (
        <div className="space-y-12 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-pesa-green tracking-tighter">Account Authority</h1>
                    <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Manage your PlotPesa visibility and tier status</p>
                </div>
                <div className="flex flex-col md:flex-row items-end gap-4 max-w-sm">
                    <div className="flex-1 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">M-Pesa Number</Label>
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="2547XXXXXXXX"
                            className="h-12 bg-white border-pesa-border rounded-xl font-bold"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl border border-pesa-border shadow-sm h-[68px]">
                    <div className="w-4 h-4 rounded-full bg-pesa-green animate-pulse"></div>
                    <span className="text-xs font-black text-pesa-green uppercase tracking-widest">Active Tier: {currentTier}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {tiers.map((tier) => (
                    <Card
                        key={tier.id}
                        className={`relative rounded-[3rem] border-2 transition-all duration-500 overflow-hidden group hover:shadow-2xl ${tier.popular ? 'border-pesa-gold shadow-pesa ring-8 ring-pesa-gold/5' : 'border-pesa-border bg-white shadow-sm'
                            }`}
                    >
                        {tier.popular && (
                            <div className="absolute top-6 right-8">
                                <span className="bg-pesa-gold text-pesa-green px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Most Popular</span>
                            </div>
                        )}

                        <CardHeader className="p-10 pb-0">
                            <div className={`w-16 h-16 ${tier.bg} rounded-2xl flex items-center justify-center mb-6 border border-pesa-border group-hover:scale-110 transition-transform`}>
                                <tier.icon className={`h-8 w-8 ${tier.color}`} />
                            </div>
                            <CardTitle className="text-2xl font-black text-pesa-green">{tier.name}</CardTitle>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">KSh</span>
                                <span className="text-5xl font-black text-pesa-green tracking-tighter">{tier.price}</span>
                                <span className="text-sm font-bold text-gray-400">/quarter</span>
                            </div>
                        </CardHeader>

                        <CardContent className="p-10 pt-8 space-y-8">
                            <div className="space-y-4">
                                {tier.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="shrink-0 mt-1">
                                            <Check className="h-4 w-4 text-pesa-gold" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-600 leading-tight">{feature}</p>
                                    </div>
                                ))}
                            </div>

                            <Button
                                disabled={currentTier === tier.id || !!loading}
                                onClick={() => handleUpgrade(tier.id, tier.price)}
                                className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border-b-6 active:translate-y-1 ${tier.popular
                                    ? 'bg-pesa-green text-white border-pesa-gold hover:opacity-90 shadow-xl shadow-pesa-green/10'
                                    : 'bg-pesa-subtle text-pesa-green border-pesa-border hover:bg-pesa-green hover:text-white'
                                    }`}
                            >
                                {loading === tier.id ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : currentTier === tier.id ? (
                                    'Active Authority'
                                ) : (
                                    'Upgrade Authority'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Billing History Stub */}
            <Card className="rounded-[3rem] border border-pesa-border bg-white shadow-pesa overflow-hidden">
                <CardContent className="p-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-2xl font-black text-pesa-green flex items-center gap-3 justify-center md:justify-start">
                                <CreditCard className="h-6 w-6 text-pesa-gold" />
                                Secure Transactions
                            </h3>
                            <p className="text-gray-500 font-medium max-w-sm">Payments are processed via secure M-Pesa STK Push. No cards required.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-pesa-subtle p-6 rounded-3xl border border-pesa-border max-w-sm">
                            <Sparkles className="h-10 w-10 text-pesa-gold shrink-0 mb-auto" />
                            <p className="text-xs text-pesa-green font-bold italic leading-relaxed">
                                Subscription tiers help us maintain the integrity of the portal and provide verified data to serious buyers across Kenya.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
