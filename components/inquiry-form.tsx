'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-provider'
import { MessageSquare, Send, Loader2, CheckCircle } from 'lucide-react'

interface InquiryFormProps {
    plotId: string;
    plotTitle: string;
}

export default function InquiryForm({ plotId, plotTitle }: InquiryFormProps) {
    const { user, profile } = useAuth()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [message, setMessage] = useState('')
    const [buyerName, setBuyerName] = useState(profile?.full_name || '')
    const [buyerEmail, setBuyerEmail] = useState(user?.email || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            alert('Please sign in to send an inquiry.')
            return
        }

        setLoading(true)
        try {
            const { error } = await (supabase.from('inquiries') as any).insert({
                plot_id: plotId,
                buyer_id: user.id,
                message,
                buyer_name: buyerName,
                buyer_email: buyerEmail
            })

            if (error) throw error
            setSent(true)
        } catch (err: any) {
            console.error('Inquiry Error:', err)
            alert('Failed to send inquiry: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <div className="bg-pesa-green/5 border border-pesa-green/10 rounded-3xl p-8 text-center">
                <div className="w-16 h-16 bg-pesa-green rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-white h-8 w-8" />
                </div>
                <h4 className="text-lg font-black text-pesa-green">Message Sent!</h4>
                <p className="text-sm text-gray-500 mt-2 font-medium">The seller has been notified of your interest in "{plotTitle}".</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Your Name</Label>
                        <Input
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                            required
                            className="bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl h-12 font-bold"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Email Address</Label>
                        <Input
                            type="email"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                            required
                            className="bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl h-12 font-bold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Message to Seller</Label>
                    <Textarea
                        placeholder="I am interested in this plot. Is the price negotiable?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="bg-pesa-subtle border-transparent focus:border-pesa-green rounded-2xl min-h-[120px] font-medium p-4"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading || !user}
                className="w-full h-14 bg-pesa-green hover:opacity-90 text-white font-black rounded-2xl shadow-xl shadow-pesa-green/10 flex items-center justify-center gap-3 border-b-4 border-pesa-gold"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                Send Inquiry to Portal
            </Button>

            {!user && (
                <p className="text-[10px] text-center text-red-500 font-bold uppercase tracking-widest">Sign in required to contact sellers</p>
            )}
        </form>
    )
}
