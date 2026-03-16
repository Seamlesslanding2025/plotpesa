import { Shield, Lock, Eye, FileText } from "lucide-react"

export default function PrivacyPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-pesa-green py-20 text-center border-b-8 border-pesa-gold">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                        Privacy Policy & <span className="text-pesa-gold">Data Protection</span>
                    </h1>
                    <p className="text-lg text-white/70 font-medium">
                        How PlotPesa handles your personal data in compliance with the Data Protection Act 2019 (Kenya).
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-16 space-y-12 border border-gray-100">

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <Shield className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">1. Data Controller</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            PlotPesa is the Data Controller for information collected via our portal. We are committed to protecting your privacy and ensuring your personal data is handled in a lawful, fair, and transparent manner.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <Eye className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">2. Information We Collect</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium font-bold italic mb-4">
                            We collect only the minimum data necessary to facilitate land transactions:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Contact Details (Name, Phone, Email)",
                                "Professional Licenses (EARB/LSK)",
                                "Property Documentation (Title Deeds/Deed Plans)",
                                "Technical Data (IP Address, Device Type)",
                                "Location Data for Plot Pins"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm font-bold text-gray-700">
                                    <div className="w-1.5 h-1.5 bg-pesa-gold rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <Lock className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">3. Data Security</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            All personal data is encrypted both at rest and in transit using industry-standard AES-256 and SSL/TLS encryption. Sensitive property documents are stored in secure, restricted-access buckets with rigorous Row-Level Security (RLS) policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pesa-subtle rounded-lg">
                                <FileText className="h-6 w-6 text-pesa-green" />
                            </div>
                            <h2 className="text-2xl font-black text-pesa-green uppercase tracking-tight">4. Your Rights</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            Under the Data Protection Act 2019, you have the right to access your data, request corrections, or ask for the deletion of your personal information. You may exercise these rights by contacting our compliance division.
                        </p>
                        <div className="bg-pesa-green p-6 rounded-2xl text-white">
                            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Compliance Contact</p>
                            <p className="text-xl font-black">compliance@plotpesa.co.ke</p>
                        </div>
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
