'use client'

import { useState } from 'react'
import { Ruler, Map, Building2, Landmark, Shield, Leaf, Sparkles, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ServiceRequestForm from '@/components/service-request-form'

export default function ProServicesPage() {
    const [selectedService, setSelectedService] = useState<string | null>(null)

    const services = [
        {
            title: "Valuation & Appraisal",
            icon: <Landmark className="h-8 w-8 text-pesa-green" />,
            description: "Get bank-grade property valuations from registered valuers (ISK). Essential for financing and fair market pricing.",
            license: "Valuation License"
        },
        {
            title: "Surveying & Beaconing",
            icon: <Map className="h-8 w-8 text-pesa-green" />,
            description: "Accurate boundary verification, mutation forms, and beacon re-establishment by licensed land surveyors.",
            license: "Survey License"
        },
        {
            title: "Architectural Design",
            icon: <Building2 className="h-8 w-8 text-pesa-green" />,
            description: "Planning and design services for your plot. From feasibility studies to full building plans (BORAQS).",
            license: "Architectural License"
        },
        {
            title: "EIA Assessment",
            icon: <Leaf className="h-8 w-8 text-pesa-green" />,
            bg: "bg-emerald-50 content-['']",
            description: "Environmental Impact Assessments for sustainable development. Mandatory for NEMA compliance on major projects.",
            license: "NEMA EIA License"
        }
    ]

    return (
        <div className="bg-[#fdfdfd] min-h-screen">
            <div className="space-y-16 py-16 px-6 max-w-7xl mx-auto">
                {/* Elite Header */}
                <div className="bg-pesa-green rounded-[4rem] p-16 text-white shadow-2xl relative overflow-hidden border-b-[12px] border-pesa-gold animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -mr-48 -mt-48 blur-[100px] animate-pulse"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-px w-12 bg-pesa-gold"></div>
                            <span className="text-pesa-gold font-black uppercase tracking-[0.3em] text-xs">One-Stop land Shop</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
                            Our <span className="text-pesa-gold">Experts</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl leading-relaxed">
                            Kenya's elite network of vetted land experts ensuring your real estate investment is legally bulletproof and technically precise.
                        </p>
                    </div>
                </div>

                {/* Service Grid - Glassmorphism effects */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="group relative bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:border-pesa-green/30 transition-all duration-500 hover:-translate-y-4 animate-in fade-in slide-in-from-bottom-10"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="w-20 h-20 bg-pesa-subtle rounded-[2rem] flex items-center justify-center mb-8 group-hover:bg-pesa-green group-hover:text-white transition-colors duration-500 group-hover:rotate-6">
                                {service.icon}
                            </div>

                            <h2 className="text-2xl font-black text-pesa-green uppercase mb-4 leading-tight group-hover:text-pesa-gold transition-colors">
                                {service.title}
                            </h2>

                            <p className="text-gray-500 font-medium leading-relaxed mb-10 text-sm">
                                {service.description}
                            </p>

                            <Button
                                onClick={() => setSelectedService(service.title)}
                                className="w-full h-14 bg-white border-2 border-pesa-green/20 text-pesa-green font-black rounded-2xl group-hover:bg-pesa-green group-hover:text-white group-hover:border-pesa-green transition-all shadow-sm"
                            >
                                Request {service.title.split(' ')[0]}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* PlotPesa Shield Banner */}
                <div className="bg-pesa-subtle/50 backdrop-blur-md border border-pesa-border rounded-[4rem] p-12 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden">
                    <div className="flex items-center gap-8 relative z-10">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border border-pesa-border relative">
                            <Shield className="h-10 w-10 text-pesa-green" />
                            <div className="absolute inset-0 bg-pesa-gold/10 rounded-full animate-ping"></div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-pesa-green uppercase">The Vetting standard</h3>
                            <p className="text-gray-500 font-bold max-w-lg">
                                We manually verify LSK, EARB, ISK, and BORAQS registrations for every professional on our panel. Zero exceptions.
                            </p>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <Link href="/about">
                            <Button className="bg-white text-pesa-green font-black px-10 h-16 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 group-hover:bg-pesa-green group-hover:text-white transition-all">
                                Learn About Our Ethics <ChevronRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Lead Form Modal */}
            <ServiceRequestForm
                isOpen={!!selectedService}
                onClose={() => setSelectedService(null)}
                serviceTitle={selectedService || ''}
            />
        </div>
    )
}
