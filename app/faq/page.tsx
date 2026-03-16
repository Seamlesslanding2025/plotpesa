'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const faqs = [
    {
        category: "Portal Fundamentals",
        items: [
            {
                q: "How do I create an account on PlotPesa?",
                a: "Click 'Join the Portal' in the navigation. Choose your primary role (Buyer, Owner, or Agent), enter your credentials, and verify your email. Access takes less than 2 minutes!"
            },
            {
                q: "Is access to the portal free?",
                a: "Yes! Searching for plots and setting up smart search alerts is completely free. We prioritize accessibility for all buyers in Kenya."
            },
            {
                q: "Which counties does the portal cover?",
                a: "PlotPesa is a national portal covering all 47 counties of Kenya. From Nairobi metropolitan to the farthest reaches of Turkana, we map it all."
            }
        ]
    },
    {
        category: "Investor/Buyer Tools",
        items: [
            {
                q: "How do I navigate the marketplace?",
                a: "You can use the 'Browse Marketplace' page to filter by county, valuation (price), and size. We also offer an Interactive Map for visual geographic exploration."
            },
            {
                q: "What is a Search Alert?",
                a: "Can't find your specific plot? Create an alert with your criteria. Our AI monitoring system will notify you via email the moment a matching verified plot is listed."
            },
            {
                q: "How reliable are the listings?",
                a: "Every listing on PlotPesa undergoes a mandatory administration audit. we cross-check ownership intent and plot data to maintain a high-trust environment."
            }
        ]
    },
    {
        category: "Professional verification",
        items: [
            {
                q: "How are Estate Agents and Companies verified?",
                a: "Agents and Companies are required to upload a valid EARB Registration Certificate or EARB Annual Practicing License. Accounts are locked in 'Pending Review' status until our compliance team validates the documentation. This ensures 100% professional integrity."
            },
            {
                q: "What is the PlotPesa Legal Panel?",
                a: "We provide a directory of vetted law firms specializing in land conveyancing. Lawyers listed on our panel pay a subscription to maintain their presence, ensuring buyers have access to trusted legal due diligence."
            },
            {
                q: "Are Title Deeds mandatory for listing?",
                a: "Yes. To maintain our standard of transparency, every listing must include a Title Deed or Deed Plan upload as a minimum requirement for public display."
            }
        ]
    }
]

export default function FAQPage() {
    const [openItems, setOpenItems] = useState<string[]>([])

    const toggleItem = (id: string) => {
        setOpenItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero */}
            <div className="bg-pesa-green text-white py-24 relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase">Help <span className="text-pesa-gold">Center</span></h1>
                    <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
                        Clear answers to common questions about PlotPesa and land in Kenya.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-24">
                {faqs.map((category, catIndex) => (
                    <div key={catIndex} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">
                                {category.category}
                            </h2>
                            <div className="flex-1 h-px bg-pesa-gold/30"></div>
                        </div>

                        <div className="space-y-4">
                            {category.items.map((item, itemIndex) => {
                                const id = `${catIndex}-${itemIndex}`
                                const isOpen = openItems.includes(id)

                                return (
                                    <div
                                        key={id}
                                        className={`bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-pesa-green shadow-xl ring-4 ring-pesa-green/5' : 'border-gray-100 shadow-sm hover:border-pesa-green/30'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleItem(id)}
                                            className="w-full px-8 py-6 text-left flex items-center justify-between"
                                        >
                                            <span className={`text-lg font-black tracking-tight transition-colors ${isOpen ? 'text-pesa-green' : 'text-gray-900'}`}>
                                                {item.q}
                                            </span>
                                            <div className={`p-2 rounded-xl transition-all ${isOpen ? 'bg-pesa-green text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                                            </div>
                                        </button>
                                        {isOpen && (
                                            <div className="px-8 pb-8 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-gray-600 font-medium leading-relaxed italic">
                                                    {item.a}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Still have questions */}
                <div className="mt-24 bg-pesa-green rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                    <div className="absolute inset-0 bg-white/5 opacity-10"></div>
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                            <MessageCircle className="h-8 w-8 text-pesa-gold" />
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Still have questions?</h2>
                        <p className="text-white/70 mb-10 font-medium max-w-lg mx-auto leading-relaxed">
                            Our support division is ready to assist with any technical or procedural inquiries.
                        </p>
                        <Link href="/contact">
                            <Button className="h-16 px-12 bg-white text-pesa-green hover:bg-gray-100 font-black text-lg rounded-2xl shadow-2xl transition-all transform active:scale-95">
                                Reach Support Team
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
