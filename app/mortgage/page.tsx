import MortgageCalculator from "@/components/mortgage-calculator"
import { Landmark, ShieldCheck, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function MortgagePage() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header / Tagline */}
            <div className="bg-pesa-green py-24 text-center border-b-8 border-pesa-gold relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 uppercase tracking-tighter">
                        Land <span className="text-pesa-gold">Loans</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mx-auto">
                        Own your dream plot today. We connect you with top Kenyan banks for easy land financing.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-12 gap-16 items-start">
                    {/* Calculator Section */}
                    <div className="lg:col-span-8 space-y-12">
                        <section className="space-y-6">
                            <h2 className="text-3xl font-black text-pesa-green uppercase tracking-tight">Interactive Estimator</h2>
                            <MortgageCalculator />
                        </section>

                        <section className="bg-gray-50 rounded-[2.5rem] p-12 border border-gray-100 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-pesa-green uppercase tracking-tight text-center">How It Works</h2>
                                <p className="text-gray-500 font-medium text-center">Transition from a buyer to a landowner in 4 simple steps.</p>
                            </div>

                            <div className="grid md:grid-cols-4 gap-8">
                                {[
                                    { icon: Landmark, title: "Pick a Plot", desc: "Select a verified plot with a clean title." },
                                    { icon: ShieldCheck, title: "Pre-Qualify", desc: "Use our calculator to check your eligibility." },
                                    { icon: Clock, title: "Apply", desc: "Connect with our banking partners." },
                                    { icon: CheckCircle2, title: "Own It", desc: "Complete the process and start building." }
                                ].map((step, i) => (
                                    <div key={i} className="text-center space-y-3">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-gray-100 text-pesa-green">
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-black text-xs text-pesa-green uppercase tracking-widest">{step.title}</h4>
                                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">{step.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Partners */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-pesa-subtle rounded-[2.5rem] p-8 border border-pesa-border/50 space-y-6">
                            <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Our Banking Partners</h3>
                            <div className="space-y-4">
                                {['KCB Bank Kenya', 'Equity Bank', 'NCBA Group', 'Absa Kenya', 'Co-operative Bank'].map((bank, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-pesa-gold transition-all shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 bg-gray-50 rounded-lg flex items-center justify-center font-black text-[10px] text-gray-300">LOGO</div>
                                            <span className="font-bold text-gray-700">{bank}</span>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-pesa-green transition-colors" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-medium text-gray-400 italic">
                                *Interest rates vary by institution. Currently averaging 13% - 16% in the Kenyan market.
                            </p>
                        </div>

                        <div className="bg-pesa-green p-8 rounded-[2.5rem] text-white shadow-2xl space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck className="h-24 w-24" />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight relative z-10">Need Assistance?</h3>
                            <p className="text-white/70 font-medium relative z-10">
                                Our financial advisors can help you prepare your documentation for a successful mortgage application.
                            </p>
                            <Link href="/advisory" className="block relative z-10">
                                <button className="w-full bg-pesa-gold text-pesa-green font-black py-4 rounded-2xl shadow-xl hover:bg-white transition-all">
                                    Talk to an Advisor
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
