'use client'

import { useAuth } from '@/components/auth-provider'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function DashboardPage() {
    const { user, profile, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-pesa-green" />
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-12 px-4">
            {/* Logo and Welcome */}
            <div className="text-center">
                <Link href="/" className="inline-block mb-8 hover:opacity-90 transition-opacity">
                    <img
                        src="/logo_pesa.jpg"
                        alt="PlotPesa Logo"
                        className="h-24 w-auto object-contain mx-auto"
                    />
                </Link>
                <h2 className="text-4xl font-black text-pesa-green mb-4">
                    Welcome to the Portal
                </h2>
                {profile && (
                    <div className="mt-4 space-y-3">
                        <p className="text-xl text-gray-700 font-medium">
                            Hello, <span className="font-black text-pesa-green underline decoration-pesa-gold underline-offset-4">{profile.full_name || user?.email?.split('@')[0]}</span>
                        </p>
                        <div className="inline-block px-6 py-2 bg-pesa-green text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-pesa-green/10 border-b-2 border-pesa-gold/50">
                            {profile.role} ACCOUNT ACTIVE
                        </div>
                    </div>
                )}
            </div>

            {/* Dashboard Selection */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h3 className="font-black text-3xl text-pesa-green">Access Your Workspace</h3>
                    <p className="text-gray-500 font-medium tracking-tight">Select the dashboard that matches your current goal</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Seller Card */}
                    <Link
                        href="/dashboard/seller"
                        className="group relative overflow-hidden p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-pesa-green transition-all text-center hover:shadow-2xl transform hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-green/5 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="mb-6 flex justify-center">
                                <div className="p-6 bg-gray-50 rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-all transform group-hover:scale-110 shadow-inner">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="font-black text-xl text-pesa-green mb-2">Seller Hub</div>
                            <div className="text-sm text-gray-500 font-medium">List and manage your property portfolio</div>
                        </div>
                    </Link>

                    {/* Buyer Card */}
                    <Link
                        href="/dashboard/buyer"
                        className="group relative overflow-hidden p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-pesa-green transition-all text-center hover:shadow-2xl transform hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-green/5 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="mb-6 flex justify-center">
                                <div className="p-6 bg-gray-50 rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-all transform group-hover:scale-110 shadow-inner">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="font-black text-xl text-pesa-green mb-2">Buyer Portal</div>
                            <div className="text-sm text-gray-500 font-medium">Search, save and track your dream plots</div>
                        </div>
                    </Link>

                    {/* Legal Panel Card */}
                    <Link
                        href="/dashboard/legal"
                        className="group relative overflow-hidden p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-pesa-gold transition-all text-center hover:shadow-2xl transform hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-gold/5 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="mb-6 flex justify-center">
                                <div className="p-6 bg-gray-50 rounded-2xl group-hover:bg-pesa-gold group-hover:text-black transition-all transform group-hover:scale-110 shadow-inner">
                                    <ShieldCheck className="h-12 w-12" />
                                </div>
                            </div>
                            <div className="font-black text-xl text-pesa-green mb-2">Legal Panel</div>
                            <div className="text-sm text-gray-500 font-medium">Access vetted lawyers for due diligence</div>
                        </div>
                    </Link>

                    {/* NEW: Professional Services Card */}
                    <Link
                        href="/pro-services"
                        className="group relative overflow-hidden p-8 bg-white border-2 border-gray-100 rounded-3xl hover:border-pesa-green transition-all text-center hover:shadow-2xl transform hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-green/5 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="mb-6 flex justify-center">
                                <div className="p-6 bg-gray-50 rounded-2xl group-hover:bg-pesa-green group-hover:text-white transition-all transform group-hover:scale-110 shadow-inner">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                            <div className="font-black text-xl text-pesa-green mb-2">Pro Services</div>
                            <div className="text-sm text-gray-500 font-medium">Valuation, Surveying & Architecture</div>
                        </div>
                    </Link>

                    {/* NEW: Premium Advisory Card */}
                    <Link
                        href="/advisory"
                        className="group relative overflow-hidden p-8 bg-pesa-subtle border-2 border-pesa-border rounded-3xl hover:border-pesa-gold transition-all text-center hover:shadow-2xl transform hover:-translate-y-2"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-gold/10 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative">
                            <div className="mb-6 flex justify-center">
                                <div className="p-6 bg-white rounded-2xl group-hover:bg-pesa-gold group-hover:text-black transition-all transform group-hover:scale-110 shadow-inner">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="font-black text-xl text-pesa-green mb-2">Premium Advisory</div>
                            <div className="text-sm text-gray-500 font-medium">Real estate consultancy & strategies</div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
