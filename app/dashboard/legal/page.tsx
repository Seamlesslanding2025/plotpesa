import { Shield, CreditCard, Scale, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

export default async function LegalPanelPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userRole = ""
    let isVerified = false

    if (user) {
        const { data: profile } = await supabase
            .from('users_profile')
            .select('role, is_verified')
            .eq('id', user.id)
            .single()

        userRole = (profile as any)?.role || ""
        isVerified = (profile as any)?.is_verified || false
    }

    return (
        <div className="space-y-12 py-12 px-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-pesa-green rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <div className="relative z-10 space-y-4">
                    <h1 className="text-5xl font-black uppercase tracking-tighter">Legal Panel & Due Diligence</h1>
                    <p className="text-xl text-white/70 font-medium max-w-2xl">
                        A vetted directory of solicitors specializing in real estate conveyancing and land verification.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* For Buyers */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 shadow-sm space-y-6">
                    <div className="w-16 h-16 bg-pesa-subtle rounded-3xl flex items-center justify-center">
                        <Scale className="h-8 w-8 text-pesa-green" />
                    </div>
                    <h2 className="text-3xl font-black text-pesa-green uppercase">For Buyers</h2>
                    <p className="text-gray-600 font-medium leading-relaxed">
                        Secure your investment with verified legal experts. Access our panel of approved lawyers to handle title verification, sales agreements, and transfer processes.
                    </p>
                    <Link href="/plots">
                        <Button className="w-full h-16 bg-pesa-gold text-black font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
                            Find Property & Lawyer
                        </Button>
                    </Link>
                </div>

                {/* For Lawyers */}
                <div className="bg-pesa-subtle rounded-[2.5rem] border border-pesa-border p-10 shadow-sm space-y-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-inner">
                        <CreditCard className="h-8 w-8 text-pesa-green" />
                    </div>
                    <h2 className="text-3xl font-black text-pesa-green uppercase">For Lawyers</h2>

                    {userRole === 'lawyer' && !isVerified ? (
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-4">
                            <div className="flex items-center gap-3 text-amber-800">
                                <Shield className="h-6 w-6" />
                                <span className="font-black uppercase tracking-tight">Verification Required</span>
                            </div>
                            <p className="text-amber-800/80 font-medium text-sm italic">
                                To list your firm on the PlotPesa Legal Panel, you must first upload your current LSK Annual Practicing Certificate for verification.
                            </p>
                            <Link href="/dashboard/settings" className="block">
                                <Button className="w-full bg-amber-500 text-white font-bold rounded-xl h-12 shadow-md">
                                    Upload LSK Certificate
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 font-medium leading-relaxed">
                                Join our exclusive panel of trusted legal experts. Increase your visibility to verified buyers and landowners looking for professional conveyancing services.
                            </p>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="font-black text-pesa-green uppercase text-xs tracking-widest">Subscription Plan</p>
                                    <p className="text-2xl font-black">KES 5,000 / mo</p>
                                </div>
                                <Button className="bg-pesa-green text-white font-bold h-12 px-6 rounded-xl">
                                    Join Panel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Verification Checklist */}
            <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-200">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-pesa-green uppercase">The Verification Standard</h3>
                    <p className="text-gray-500 font-bold mt-2">Every solicitor on our panel undergoes a multi-layer vetting process</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        "Current LSK Practicing Certificate",
                        "Firm Professional Indemnity Cover",
                        "Minimum 5 Years Real Estate Experience"
                    ].map((step, i) => (
                        <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <CheckCircle className="h-6 w-6 text-pesa-gold shrink-0" />
                            <p className="font-bold text-gray-700">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
