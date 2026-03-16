import { Scale, Users, FileCheck, AlertCircle } from "lucide-react"

export default function TermsOfService() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-pesa-green py-20 text-center border-b-8 border-pesa-gold">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        Terms of <span className="text-pesa-gold">Service</span>
                    </h1>
                    <p className="text-lg text-white/70 font-medium">
                        The legal agreement between you and PlotPesa regarding the use of our marketplace.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-16 space-y-12 border border-gray-100">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <Scale className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">1. Agreement to Terms</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            By accessing or using PlotPesa, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. We act as a technology platform connecting buyers and sellers; we do not own the properties listed on our site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <Users className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">2. User Verification</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Professionals (Agents, Lawyers, Surveyors) must provide valid license documentation. PlotPesa reserves the right to suspend any account that provides false or misleading credentials. Buyers and Sellers are responsible for their own due diligence.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <FileCheck className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">3. Listings & Transactions</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            All property listings must include valid Title Deed and Deed Plan scans. PlotPesa charges fees based on subscription tiers or featured listings. Payments are non-refundable once a service has been rendered or a listing published.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <AlertCircle className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">4. Limitation of Liability</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium font-bold italic mb-4">
                            PlotPesa is not liable for:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Disputes between Buyers and Sellers",
                                "Inaccuracies in user-provided documentation",
                                "Market fluctuations in land value",
                                "Third-party legal or professional fees",
                                "Connectivity or system downtime"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-pesa-gold rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <div className="pt-8 border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                            Last Updated: February 14, 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
