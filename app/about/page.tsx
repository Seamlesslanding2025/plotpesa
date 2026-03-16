import { Shield, MapPin, Search, CheckCircle } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Header / Tagline */}
            <div className="bg-pesa-green py-24 text-center border-b-8 border-pesa-gold relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter">
                        About <span className="text-pesa-gold">Us</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed">
                        The safest way to discover, verify, and buy land in Kenya.
                    </p>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-6 p-10 bg-pesa-subtle rounded-3xl border-l-8 border-pesa-gold shadow-lg">
                        <h2 className="text-3xl font-black text-pesa-green uppercase tracking-tight">Our Vision</h2>
                        <p className="text-lg text-gray-700 leading-relaxed font-medium">
                            To become Kenya’s most trusted digital land marketplace by setting the standard for transparency, precision and confidence in property transactions across Africa.
                        </p>
                    </div>
                    <div className="space-y-6 p-10 bg-pesa-green text-white rounded-3xl shadow-xl">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Our Mission</h2>
                        <p className="text-lg text-white/90 leading-relaxed font-medium">
                            To simplify and secure land transactions in Kenya by providing a transparent, technology-driven marketplace powered by accurate location data and trusted verification.
                        </p>
                    </div>
                </div>
            </div>

            {/* The Story */}
            <div className="py-24 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl font-black text-pesa-green uppercase">The Story Behind PlotPesa</h2>
                        <div className="h-2 w-24 bg-pesa-gold mx-auto"></div>
                    </div>

                    <div className="prose prose-lg text-gray-600 font-medium leading-loose space-y-6">
                        <p>
                            PlotPesa was born out of a simple but powerful realization: The Kenyan land market needed transformation.
                            For too long, land transactions have been fragmented, opaque, and frustrating — leaving serious buyers uncertain and genuine sellers struggling to build trust.
                        </p>
                        <p>
                            We envisioned something different. A trusted digital marketplace where transparency is standard, locations are accurately mapped, and communication between buyers and sellers is seamless and immediate.
                        </p>
                        <p>
                            By combining advanced GIS mapping technology with deep local market expertise, PlotPesa delivers a single, reliable source of truth for land transactions in Kenya.
                            We are not just listing plots — we are modernizing how land is discovered, verified, and transacted.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pillars */}
            <div className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: Shield, title: "Verified", desc: "Rigorous document vetting" },
                        { icon: MapPin, title: "Precise", desc: "Accurate GPS coordinates" },
                        { icon: Search, title: "Transparent", desc: "Direct owner connections" },
                        { icon: CheckCircle, title: "Secure", desc: "Built on trust and integrity" }
                    ].map((pillar, i) => (
                        <div key={i} className="text-center space-y-4 p-8 border border-gray-100 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-2">
                            <div className="mx-auto w-16 h-16 bg-pesa-subtle rounded-2xl flex items-center justify-center">
                                <pillar.icon className="h-8 w-8 text-pesa-green" />
                            </div>
                            <h3 className="text-xl font-black text-pesa-green uppercase">{pillar.title}</h3>
                            <p className="text-gray-500 font-medium">{pillar.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trusted Partners / Compliance */}
            <div className="py-24 bg-pesa-subtle border-t border-pesa-border">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
                    <h2 className="text-[10px] font-black text-pesa-green uppercase tracking-[0.4em] opacity-40">Trusted & Compliant</h2>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                        <div className="flex items-center gap-3">
                            <Shield className="h-8 w-8 text-pesa-green" />
                            <span className="text-xl font-black text-pesa-green tracking-tighter uppercase">DPA 2019</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-pesa-green" />
                            <span className="text-xl font-black text-pesa-green tracking-tighter uppercase">LSK Verified</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="h-8 w-8 text-pesa-green" />
                            <span className="text-xl font-black text-pesa-green tracking-tighter uppercase">GIS Mapped</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
