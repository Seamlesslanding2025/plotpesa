import CreateListingForm from '@/components/create-listing-form'
import { MapPin, Home, FileText, CheckCircle, AlertCircle, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { checkSubscriptionLimit } from '@/lib/subscription-guard'
import Link from 'next/link'

export default async function CreateListingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: profile } = await supabase
        .from('users_profile')
        .select('role, is_verified')
        .eq('id', user.id)
        .single()

    const userRole = (profile as any)?.role as string
    const isVerified = (profile as any)?.is_verified

    // 1. Role-Locked Logic: Agents/Companies/Lawyers must be verified
    if ((userRole === 'estate_agent' || userRole === 'land_company' || userRole === 'lawyer') && !isVerified) {
        return (
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center">
                    <Shield className="h-12 w-12 text-amber-500" />
                </div>
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-black text-gray-900">Verification Pending</h2>
                    <p className="text-gray-500 mt-2 font-medium">
                        As a professional {userRole.replace('_', ' ')}, your account must be verified before listing properties. Please ensure your practicing certificate or license is uploaded in settings.
                    </p>
                </div>
                <Link href="/dashboard/settings">
                    <Button className="px-8 py-4 bg-pesa-gold text-black font-black rounded-2xl shadow-lg">
                        Complete Verification
                    </Button>
                </Link>
            </div>
        )
    }

    const guard = await checkSubscriptionLimit(user.id)

    if (!guard.allowed) {
        return (
            <div className="space-y-8 py-6">
                <div className="bg-pesa-green rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative">
                        <h1 className="text-4xl font-black tracking-tight">Listing Limit Reached</h1>
                        <p className="text-white/70 font-bold uppercase tracking-widest text-xs mt-1">Upgrade your account to list more</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center space-y-6">
                    <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl font-black text-gray-900">Maximum Listings Reached</h2>
                        <p className="text-gray-500 mt-2 font-medium">
                            {guard.reason === 'subscription_expired'
                                ? guard.error
                                : `Your ${guard.tier} account is limited to ${guard.limit} listing. You currently have ${guard.currentCount} active listings.`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link href="/dashboard/billing">
                            <button className="px-8 py-4 bg-pesa-gold text-black font-black rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto">
                                <TrendingUp className="h-5 w-5" />
                                Upgrade To Premium
                            </button>
                        </Link>
                        <Link href="/dashboard/seller/listings">
                            <button className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors mx-auto">
                                Manage Listings
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 py-6">
            {/* Header Section */}
            <div className="bg-pesa-green rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                            <Home className="h-10 w-10 text-pesa-gold" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">List Your Property</h1>
                            <p className="text-white/70 font-bold uppercase tracking-widest text-xs mt-1">Official PlotPesa Marketplace</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <MapPin className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Pin Location</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <FileText className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Add Details</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Verification</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                <CreateListingForm />
            </div>
        </div>
    )
}
