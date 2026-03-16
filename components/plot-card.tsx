import Link from 'next/link'
import { MapPin, Maximize, Phone } from 'lucide-react'
import { getOptimizedImageUrl } from '@/lib/supabase/images'

// Use any to handle missing fields until type regeneration
type Plot = any

export default function PlotCard({ plot }: { plot: Plot }) {
    const images = plot.images || []
    const hasImages = images.length > 0

    return (
        <Link href={`/plots/${plot.id}`}>
            <div className="group relative bg-white rounded-2xl overflow-hidden shadow-pesa hover:shadow-2xl transition-all duration-300 border border-pesa-border hover:border-pesa-green transform hover:-translate-y-2">
                {/* Image Section */}
                <div className="relative h-56 bg-pesa-green flex items-center justify-center overflow-hidden border-b border-gray-50">
                    {hasImages ? (
                        <img
                            src={getOptimizedImageUrl(images[0], 400) || images[0]}
                            alt={plot.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 z-0"
                            loading="lazy"
                        />
                    ) : (
                        <div className="relative z-0 w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                            <div className="text-white text-center z-10">
                                <Maximize className="h-16 w-16 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity text-pesa-gold" />
                                <p className="text-sm opacity-75 font-bold uppercase tracking-widest">No Photos</p>
                            </div>
                        </div>
                    )}

                    {/* Listing Type Badge */}
                    <div className="absolute top-4 left-4 z-30">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black shadow-lg bg-white/95 backdrop-blur-sm text-pesa-green border border-white/50 uppercase tracking-tighter">
                            {(() => {
                                const type = plot.transaction_type || plot.listing_type || 'sale';
                                const map: Record<string, string> = {
                                    'outright_purchase': 'SALE',
                                    'sale': 'SALE',
                                    'lease': 'LEASE',
                                    'joint_venture': 'JV',
                                    'swap': 'SWAP'
                                };
                                return map[type] || type.replace(/_/g, ' ');
                            })()}
                        </span>
                    </div>

                    <div className="absolute top-4 right-4 z-30">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black shadow-lg ${plot.status === 'published'
                            ? 'bg-pesa-green/90 backdrop-blur-sm text-white border border-pesa-gold/30'
                            : plot.status === 'pending_verification'
                                ? 'bg-pesa-gold text-pesa-green'
                                : 'bg-gray-400/90 backdrop-blur-sm text-white'
                            }`}>
                            {plot.status === 'published' ? 'VERIFIED' : (plot.status || 'draft').replace(/_/g, ' ').toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Location */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin className="h-4 w-4 mr-1 text-pesa-gold" />
                        <span className="font-bold text-pesa-green">{plot.county}</span>
                        {plot.location_details && (
                            <span className="ml-1 text-gray-400 truncate tracking-tight flex-1 font-medium">• {plot.location_details}</span>
                        )}
                    </div>

                    {/* Title */}
                    <h3 
                        className="text-lg font-black text-gray-900 mb-3 min-h-[3.5rem] group-hover:text-pesa-green transition-colors leading-tight"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}
                    >
                        {plot.title}
                    </h3>

                    {/* Details Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-pesa-subtle">
                        <div className="bg-pesa-subtle p-2 rounded-lg border border-pesa-border">
                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Size</p>
                            <p className="text-xs font-bold text-pesa-green">{plot.size_acres} Ac</p>
                        </div>
                        <div className="bg-pesa-subtle p-2 rounded-lg border border-pesa-border">
                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Status</p>
                            <p className="text-xs font-bold text-pesa-green truncate capitalize">{plot.land_status?.replace(/_/g, ' ') || 'Vacant'}</p>
                        </div>
                        <div className="bg-pesa-subtle p-2 rounded-lg border border-pesa-border">
                            <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">Type</p>
                            <p className="text-xs font-bold text-pesa-green truncate capitalize">{plot.plot_type}</p>
                        </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                                {plot.transaction_type === 'swap' ? 'Acquisition Method' : 'Asking Price'}
                            </p>
                            <p className={`font-black text-pesa-green truncate ${plot.transaction_type === 'joint_venture' ? 'text-lg uppercase' : 'text-2xl'}`}>
                                {plot.transaction_type === 'swap' ? (
                                    <span className="text-pesa-gold">Swap Option</span>
                                ) : plot.transaction_type === 'joint_venture' && (!plot.price_kes || plot.price_kes === 0) ? (
                                    <span className="text-pesa-gold">JV Participation</span>
                                ) : (
                                    <>
                                        <span className="text-sm font-bold opacity-60 mr-1">{plot.currency || 'KES'}</span>
                                        {((plot.currency === 'USD' || plot.currency === 'EUR') ? (plot.price_kes || 0).toLocaleString() : ((plot.price_kes || 0) / 1000000).toFixed(1) + 'M')}
                                        {plot.transaction_type === 'lease' && <span className="text-xs font-bold opacity-60 ml-1">/mo</span>}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            {plot.contact_phone && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            const message = `Hi, I'm interested in your plot: ${plot.title} listed on PlotPesa for ${plot.currency || 'KES'} ${plot.price_kes.toLocaleString()}`
                                            window.open(`https://wa.me/${plot.contact_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
                                        }}
                                        className="p-3 bg-pesa-green text-white rounded-full hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg active:scale-90 border-b-2 border-pesa-gold/50"
                                        title="WhatsApp"
                                    >
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault()
                                            window.open(`tel:${plot.contact_phone}`, '_self')
                                        }}
                                        className="p-3 bg-white text-pesa-green rounded-full hover:bg-gray-50 transition-all shadow-md hover:shadow-lg active:scale-90 border-2 border-pesa-green"
                                        title="Call"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hover Overlay CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-pesa-green via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 pointer-events-none">
                    <div className="text-white font-black text-lg transform translate-y-4 group-hover:translate-y-0 transition-outer-transform bg-pesa-green/80 backdrop-blur-md px-8 py-2.5 rounded-full shadow-2xl border border-pesa-gold/30">
                        View Full Listing →
                    </div>
                </div>
            </div>
        </Link>
    )
}
