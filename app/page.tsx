import Link from "next/link";
import { ArrowRight, MapPin, Search, Shield, Calculator, Handshake, Scale, UserCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PlotCard from "@/components/plot-card";

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredPlots } = await supabase
    .from('plots')
    .select('*')
    .eq('is_featured', true)
    .eq('status', 'published')
    .limit(3) as { data: any[] | null };
  return (
    <div className="bg-white min-h-screen">
      {/* Simple Hero */}
      <div className="relative isolate px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-8 mb-16">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-pesa-green leading-none">
              Buy. Sell. <span className="text-pesa-gold">Land.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto">
              The simplest way to browse and list verified plots in Kenya.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/plots" className="w-full sm:w-auto px-8 py-4 bg-pesa-green hover:opacity-90 text-white font-black rounded-xl shadow-lg shadow-pesa-green/20 transition-all border-b-4 border-pesa-gold flex items-center justify-center gap-2 uppercase tracking-widest text-sm text-center">
                    Invest & Browse <Search className="w-4 h-4" />
                </Link>
                <Link href="/dashboard/seller/listings/new" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-pesa-green border-2 border-pesa-green/20 hover:border-pesa-green font-black rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm text-center">
                    List & Represent <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
          </div>

          {/* Ecosystem Pathways */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto pb-24">
            <Link href="/plots?type=buy" className="group bg-pesa-green p-10 rounded-[3rem] text-white hover:shadow-2xl hover:-translate-y-2 transition-all shadow-xl">
              <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pesa-gold transition-colors">
                <Search className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Buy Land</h2>
              <p className="text-white/60 font-medium text-sm leading-relaxed">
                Outright purchase or mortgage-ready plots.
              </p>
            </Link>

            <Link href="/plots?type=lease" className="group bg-white p-10 rounded-[3rem] text-pesa-green border-2 border-gray-100 hover:border-pesa-green hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="bg-pesa-subtle w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pesa-green group-hover:text-white transition-colors">
                <MapPin className="h-7 w-7 text-gray-400 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Lease Land</h2>
              <p className="text-gray-400 font-medium text-sm leading-relaxed">
                Long-term commercial or agricultural leases.
              </p>
            </Link>

            <Link href="/advisory" className="group bg-pesa-subtle p-10 rounded-[3rem] text-pesa-green border border-pesa-border hover:border-pesa-gold hover:shadow-2xl hover:-translate-y-2 transition-all shadow-sm">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pesa-gold transition-colors">
                <Handshake className="h-7 w-7 text-pesa-gold group-hover:text-white" />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Joint Venture</h2>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Partner with developers or find project funding.
              </p>
            </Link>

            <Link href="/plots?type=swap" className="group bg-white p-10 rounded-[3rem] text-pesa-green border-2 border-gray-100 hover:border-pesa-gold hover:shadow-2xl hover:-translate-y-2 transition-all shadow-sm">
              <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pesa-gold group-hover:text-white transition-colors">
                <Calculator className="h-7 w-7 text-gray-400 group-hover:text-white" />
              </div>
              <h2 className="text-xl font-black mb-2 uppercase tracking-tight">Swap Land</h2>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">
                Asset exchange for value diversificaton.
              </p>
            </Link>
          </div>

          {/* Quick Discovery CTAs */}
          <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-pesa-green mb-4 tracking-tighter">Quick Discovery</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pb-24">
            <Link href="/pro-services/lawyers" className="bg-pesa-subtle p-8 rounded-3xl border border-pesa-border/50 hover:bg-white hover:border-pesa-gold hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Scale className="h-8 w-8 text-pesa-gold" />
                </div>
                <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight mb-2">Find a Lawyer</h3>
                <p className="text-sm text-gray-500 font-medium">Verified conveyancing experts for secure transactions.</p>
            </Link>

            <Link href="/pro-services/agents" className="bg-pesa-subtle p-8 rounded-3xl border border-pesa-border/50 hover:bg-white hover:border-pesa-gold hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UserCheck className="h-8 w-8 text-pesa-green" />
                </div>
                <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight mb-2">Find an Agent</h3>
                <p className="text-sm text-gray-500 font-medium">Browse our directory of registered EARB professionals.</p>
            </Link>

            <Link href="/mortgage" className="bg-pesa-subtle p-8 rounded-3xl border border-pesa-border/50 hover:bg-white hover:border-pesa-green hover:-translate-y-1 transition-all group flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Calculator className="h-8 w-8 text-pesa-green" />
                </div>
                <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight mb-2">Mortgage Calculator</h3>
                <p className="text-sm text-gray-500 font-medium">Estimate monthly repayments and financing limits.</p>
            </Link>
          </div>

          {/* Featured Properties */}
          <div className="pb-32">
              <div className="flex justify-between items-end mb-10">
                  <div>
                      <h2 className="text-3xl font-black text-pesa-green mb-2 tracking-tighter">Featured Properties</h2>
                      <p className="text-gray-500 font-medium">Premium listings handpicked by our team.</p>
                  </div>
                  <Link href="/plots" className="hidden sm:flex items-center gap-2 text-pesa-green font-bold hover:text-pesa-gold transition-colors">
                      View all listings <ArrowRight className="h-4 w-4" />
                  </Link>
              </div>
              
              {featuredPlots && featuredPlots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {featuredPlots.map((plot) => (
                          <PlotCard key={plot.id} plot={plot} />
                      ))}
                  </div>
              ) : (
                  <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                      <p className="text-gray-500 font-medium">Featured properties are currently being updated. Check back soon!</p>
                  </div>
              )}
              
              <Link href="/plots" className="sm:hidden mt-8 flex justify-center items-center gap-2 text-pesa-green font-bold py-4 bg-pesa-green/5 rounded-xl border border-pesa-green/10">
                  View all listings <ArrowRight className="h-4 w-4" />
              </Link>
          </div>
        </div>
      </div>

      {/* Trust Stats - Ultra Simple */}
      <div className="bg-pesa-green py-24 border-t-8 border-pesa-gold">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">47</div>
              <p className="text-pesa-gold font-bold uppercase tracking-widest text-xs">Counties</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">100%</div>
              <p className="text-pesa-gold font-bold uppercase tracking-widest text-xs">Verified</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">Direct</div>
              <p className="text-pesa-gold font-bold uppercase tracking-widest text-xs">Connections</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-black text-white">Secure</div>
              <p className="text-pesa-gold font-bold uppercase tracking-widest text-xs">Transactions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
