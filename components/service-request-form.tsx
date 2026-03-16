'use client'

import { useState } from 'react'
import { X, Send, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'

interface ServiceRequestProps {
    isOpen: boolean
    onClose: () => void
    serviceTitle: string
}

export default function ServiceRequestForm({ isOpen, onClose, serviceTitle }: ServiceRequestProps) {
    const { user } = useAuth()
    const supabase = createClient()
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        plotLocation: '',
        message: ''
    })

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')

        try {
            // Map service title to type slug
            const serviceMap: Record<string, string> = {
                'Valuation & Appraisal': 'valuation',
                'Surveying & Beaconing': 'surveying',
                'Architectural Design': 'architectural',
                'EIA Assessment': 'eia',
                'Legal & Conveyancing': 'legal'
            }
            const serviceType = serviceMap[serviceTitle] || serviceTitle.toLowerCase()

            const { error } = await (supabase.from('service_leads') as any)
                .insert({
                    user_id: user?.id || null,
                    service_type: serviceType,
                    full_name: formData.name,
                    phone: formData.phone,
                    location: formData.plotLocation,
                    message: formData.message,
                    status: 'pending'
                })

            if (error) throw error

            setStatus('success')
        } catch (err: any) {
            console.error('Error submitting lead:', err)
            alert('Failed to submit request. Please try again.')
            setStatus('idle')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Glassmorphism Card */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 w-full max-w-lg rounded-[3rem] shadow-2xl shadow-black/20 overflow-hidden animate-in zoom-in-95 duration-300">

                {status === 'success' ? (
                    <div className="p-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-pesa-green rounded-full flex items-center justify-center mx-auto shadow-lg shadow-pesa-green/20 animate-bounce">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-pesa-green uppercase">Request Sent!</h2>
                            <p className="text-gray-600 font-medium mt-2">Our vetted {serviceTitle} experts will contact you shortly.</p>
                        </div>
                        <Button
                            onClick={onClose}
                            className="w-full bg-pesa-green text-white font-black h-14 rounded-2xl border-b-4 border-pesa-gold"
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Header */}
                        <div className="bg-pesa-green p-8 text-white relative border-b-4 border-pesa-gold">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                            <div className="flex items-center gap-3 mb-2">
                                <Sparkles className="h-5 w-5 text-pesa-gold animate-pulse" />
                                <span className="text-xs font-black uppercase tracking-widest text-white/70">Strategic Inquiry</span>
                            </div>
                            <h2 className="text-2xl font-black uppercase leading-tight">Request {serviceTitle}</h2>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Your Name</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full h-14 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-pesa-green transition-all font-medium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Phone Number</label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="07..."
                                        className="w-full h-14 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-pesa-green transition-all font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Plot Location</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Ruiru"
                                        className="w-full h-14 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-pesa-green transition-all font-medium"
                                        value={formData.plotLocation}
                                        onChange={(e) => setFormData({ ...formData, plotLocation: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Additional details</label>
                                <textarea
                                    placeholder="Tell us about your project..."
                                    className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:border-pesa-green transition-all font-medium min-h-[100px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <Button
                                disabled={status === 'loading'}
                                className="w-full h-16 bg-pesa-green text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 border-b-4 border-pesa-gold"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <>
                                        Submit Request <Send className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
