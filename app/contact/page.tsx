'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Send to email service or Supabase
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero */}
            <div className="bg-pesa-green text-white py-24 relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase">Contact <span className="text-pesa-gold">Us</span></h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                        Have questions? Our support team is standing by to assist.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-24">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 relative group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-pesa-green/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150"></div>

                        <h2 className="text-3xl font-black text-pesa-green mb-8 relative z-10">Direct Message</h2>

                        {submitted && (
                            <div className="mb-8 bg-pesa-green/10 border border-pesa-green/20 text-pesa-green px-6 py-4 rounded-2xl font-bold flex items-center gap-3 animate-bounce">
                                <CheckCircle2 className="h-6 w-6" />
                                Message received! We'll reply shortly.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Your Full Name</Label>
                                <Input
                                    id="name"
                                    required
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="h-12 bg-gray-50 border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 bg-gray-50 border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Subject</Label>
                                <Input
                                    id="subject"
                                    required
                                    placeholder="Partnership, Verification, Listing Inquiry"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="h-12 bg-gray-50 border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Your Message</Label>
                                <Textarea
                                    id="message"
                                    required
                                    placeholder="How can we help you today?"
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="bg-gray-50 border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-medium p-4"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-16 bg-pesa-green hover:opacity-90 text-white font-black text-lg rounded-2xl shadow-xl shadow-pesa-green/10 border-b-6 border-pesa-gold"
                            >
                                <Send className="mr-3 h-6 w-6" />
                                Dispatch Message
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-3xl font-black text-pesa-green mb-6 tracking-tight">Portal Support</h2>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed">
                                Our dedicated team is available across multiple channels to ensure your property journey is seamless.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                <div className="p-4 bg-pesa-green/5 text-pesa-green rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-colors">
                                    <Mail className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-black text-pesa-green uppercase text-[10px] tracking-widest mb-1">Official Email</h3>
                                    <p className="text-lg font-bold text-gray-900">hello@plotpesa.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                <div className="p-4 bg-pesa-green/5 text-pesa-green rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-colors">
                                    <MessageCircle className="h-8 w-8 text-pesa-gold" />
                                </div>
                                <div>
                                    <h3 className="font-black text-pesa-green uppercase text-[10px] tracking-widest mb-1">WhatsApp Portal</h3>
                                    <p className="text-lg font-bold text-gray-900">+254 700 000 000</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all group">
                                <div className="p-4 bg-pesa-green/5 text-pesa-green rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-colors">
                                    <MapPin className="h-8 w-8" />
                                </div>
                                <div>
                                    <h3 className="font-black text-pesa-green uppercase text-[10px] tracking-widest mb-1">HQ Location</h3>
                                    <p className="text-lg font-bold text-gray-900">Westlands, Nairobi, Kenya</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="bg-pesa-green rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden ring-8 ring-pesa-gold/20">
                            <div className="absolute inset-0 bg-white/5"></div>
                            <h3 className="font-black text-pesa-gold uppercase text-xs tracking-[0.3em] mb-6 relative z-10">Operating Cycles</h3>
                            <div className="space-y-4 text-sm font-bold relative z-10">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-70">Weekdays (Mon-Fri)</span>
                                    <span>8:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="opacity-70">Weekends (Saturday)</span>
                                    <span>9:00 AM - 2:00 PM</span>
                                </div>
                                <div className="flex justify-between opacity-50">
                                    <span>Sunday</span>
                                    <span>Monitoring Only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
