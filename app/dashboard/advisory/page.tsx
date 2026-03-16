import { Lightbulb, TrendingUp, Handshake, ShieldCheck, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdvisoryPage() {
    return (
        <div className="space-y-12 py-12 px-6 max-w-7xl mx-auto">
            {/* Premium Header */}
            <div className="bg-pesa-green rounded-[3rem] p-16 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold text-center">
                <div className="absolute top-0 right-0 w-80 h-80 bg-pesa-gold/20 rounded-full -mr-40 -mt-40 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-center mb-4">
                        <div className="bg-pesa-gold/20 p-4 rounded-full border border-pesa-gold/30">
                            <Crown className="h-12 w-12 text-pesa-gold" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Premium Advisory</h1>
                    <p className="text-xl md:text-2xl text-white/70 font-medium max-w-3xl mx-auto leading-relaxed">
                        Expert consultancy for land developers, diaspora investors, and institutions seeking strategic real estate intelligence in Kenya.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Strategic Consultancy */}
                <div className="space-y-8">
                    <h2 className="text-4xl font-black text-pesa-green uppercase tracking-tighter">Our Expertise</h2>

                    <div className="space-y-6">
                        {[
                            {
                                title: "Feasibility Studies",
                                desc: "Comprehensive analysis of land potential, market demand, and ROI projections before you break ground.",
                                icon: <TrendingUp className="h-6 w-6 text-pesa-gold" />
                            },
                            {
                                title: "Diaspora Property Management",
                                desc: "A 'boots on the ground' service for Kenyans abroad, handling everything from project monitoring to tenant vetting.",
                                icon: <Handshake className="h-6 w-6 text-pesa-gold" />
                            },
                            {
                                title: "Land Subdivision Strategy",
                                desc: "Maximize your plot's value through strategic subdivision planning and mutation management.",
                                icon: <Lightbulb className="h-6 w-6 text-pesa-gold" />
                            }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-6 p-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="mt-1 p-3 bg-pesa-subtle rounded-xl">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-pesa-green uppercase mb-2">{item.title}</h3>
                                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lead Form / Contact */}
                <div className="bg-pesa-green p-12 rounded-[3.5rem] text-white flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-full h-full bg-pesa-gold/5 scale-150 -rotate-12 translate-x-1/2 -translate-y-1/2 group-hover:bg-pesa-gold/10 transition-all duration-700"></div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Book a Strategy <br />Session</h2>
                            <p className="text-white/70 font-medium text-lg italic">
                                Ready to take your land investment to the next level? Connect with our senior consultants.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                                <div className="flex items-center gap-4 mb-2">
                                    <ShieldCheck className="h-6 w-6 text-pesa-gold" />
                                    <span className="font-black uppercase tracking-widest text-sm">Verified Advisory</span>
                                </div>
                                <p className="text-sm font-medium text-white/80 leading-snug">
                                    Direct access to industry veterans with 15+ years of experience in the Kenyan land market.
                                </p>
                            </div>
                            <Button className="w-full h-16 bg-pesa-gold text-black font-black rounded-2xl text-xl shadow-2xl hover:scale-[1.05] transition-transform">
                                Contact Consultant
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
