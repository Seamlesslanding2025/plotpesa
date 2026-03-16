'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Ruler, Phone, ArrowLeft, Share2, Heart, CheckCircle2, Info, MessageCircle, ShieldCheck, FileText, ExternalLink, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import dynamic from 'next/dynamic'
import InquiryForm from '@/components/inquiry-form'
import { getOptimizedImageUrl } from '@/lib/supabase/images'

type Plot = Database['public']['Tables']['plots']['Row'] & {
    images?: any;
    documents?: any;
    listing_type?: string | null;
    currency?: string | null;
    transaction_type?: string | null;
    land_status?: string | null;
}

export default function PlotDetailPage() {
    const params = useParams()
    const id = params.id as string
    const supabase = createClient()
    const { user } = useAuth()

    const [plot, setPlot] = useState<Plot | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)

    // Dynamic import for MapViewer
    const MapViewer = dynamic(() => import('@/components/map-viewer'), {
        ssr: false,
        loading: () => <div className="h-[400px] w-full bg-pesa-subtle animate-pulse rounded-2xl flex items-center justify-center font-bold text-gray-400 border border-pesa-border">Loading Spatial Data...</div>
    })

    useEffect(() => {
        const fetchPlot = async () => {
            try {
                setLoading(true)
                const { data, error } = await (supabase.from('plots') as any)
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) throw error
                if (data) setPlot(data as Plot)
            } catch (err) {
                console.error("Error fetching plot:", err)
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchPlot();
            // Increment view count via RPC
            (supabase.rpc as any)('increment_view_count', { plot_id: id }).then(() => {
                // View incremented silently
            })
        }
    }, [id, supabase])

    const nextImage = () => {
        if (!plot?.images) return
        setActiveImage((prev) => (prev + 1) % (plot.images as string[]).length)
    }

    const prevImage = () => {
        if (!plot?.images) return
        setActiveImage((prev) => (prev - 1 + (plot.images as string[]).length) % (plot.images as string[]).length)
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pesa-green"></div>
            <p className="text-xs font-black text-pesa-green uppercase tracking-[0.2em] animate-pulse">Synchronizing Asset Data...</p>
        </div>
    )

    if (!plot) return (
        <div className="max-w-5xl mx-auto px-4 py-32 text-center">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Info className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900">Listing Unavailable</h2>
            <p className="text-gray-500 mt-2 font-medium">This property may have been sold or removed from the marketplace.</p>
            <Link href="/plots" className="mt-10 inline-block bg-pesa-green text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:opacity-90 transition-all">
                Browse Active Listings
            </Link>
        </div>
    )

    const images = (plot.images as string[]) || []
    const hasImages = images.length > 0
    const documents = (plot.documents as string[]) || []

    // GEO: Generative Engine Optimization - JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": plot.title,
        "description": plot.description,
        "identifier": plot.id,
        "datePosted": plot.created_at,
        "priceSpecification": {
            "@type": "PriceSpecification",
            "price": plot.price_kes,
            "priceCurrency": plot.currency || "KES"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": plot.location_details,
            "addressRegion": plot.county,
            "addressCountry": "KE"
        },
        "itemOffered": {
            "@type": "RealEstateProperty",
            "name": plot.title,
            "description": plot.description,
            "lotSize": {
                "@type": "QuantitativeValue",
                "value": plot.size_acres,
                "unitCode": "ACR"
            },
            "address": `${plot.location_details}, ${plot.county}, Kenya`
        }
    }

    return (
        <div className="bg-pesa-subtle min-h-screen pb-32">
            {/* GEO: JSON-LD for AI Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Minimal Sticky Nav */}
            <div className="bg-white/80 backdrop-blur-md border-b border-pesa-border py-4 sticky top-0 z-50 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <Link href="/plots" className="group flex items-center text-xs font-black text-pesa-green uppercase tracking-widest hover:text-pesa-gold transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Marketplace
                    </Link>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-300 hidden sm:block uppercase tracking-tighter mr-2">Property {plot.id.slice(0, 6)}</span>
                        <div className="flex gap-2">
                            <button className="p-2.5 text-gray-400 hover:text-red-500 transition-colors bg-white rounded-xl border border-pesa-border shadow-sm">
                                <Heart className="h-4 w-4" />
                            </button>
                            <button className="p-2.5 text-gray-400 hover:text-pesa-green transition-colors bg-white rounded-xl border border-pesa-border shadow-sm">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* LEFT PANEL: Visuals & Bio (8 cols) */}
                    <div className="lg:col-span-8 space-y-10">

                        {/* 1. Dynamic Carousel */}
                        <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-2 border-white ring-1 ring-pesa-border group">
                            {hasImages ? (
                                <>
                                    <Image
                                        src={getOptimizedImageUrl(images[activeImage], 1200) || images[activeImage]}
                                        alt={plot.title}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        priority
                                        unoptimized={true}
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button onClick={prevImage} className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100">
                                                <ChevronLeft className="h-6 w-6" />
                                            </button>
                                            <button onClick={nextImage} className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-white/40 transition-all border border-white/20 opacity-0 group-hover:opacity-100">
                                                <ChevronRight className="h-6 w-6" />
                                            </button>
                                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                                {images.map((_, i) => (
                                                    <div key={i} className={`h-1.5 transition-all rounded-full ${i === activeImage ? 'w-8 bg-pesa-gold' : 'w-2 bg-white/50'}`}></div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-pesa-green/30 bg-pesa-subtle">
                                    <div className="p-10 bg-white shadow-inner rounded-full mb-4">
                                        <MapPin className="h-16 w-16" />
                                    </div>
                                    <p className="font-black text-xs tracking-[0.3em] uppercase">Visual Assets Pending</p>
                                </div>
                            )}

                            {/* Badges Overlay */}
                            <div className="absolute top-8 left-8 flex gap-3">
                                <div className={`px-5 py-2 rounded-xl text-[10px] font-black shadow-2xl backdrop-blur-xl border border-white/20 ${plot.status === 'published' ? 'bg-pesa-green/90 text-white' : 'bg-pesa-gold text-pesa-green'}`}>
                                    {plot.status === 'published' ? 'PORTAL VERIFIED' : 'UNDER AUDIT'}
                                </div>
                                <div className="px-5 py-2 rounded-xl text-[10px] font-black shadow-2xl backdrop-blur-xl bg-white/90 text-pesa-green border border-white/20 uppercase tracking-widest">
                                    {plot.transaction_type ? plot.transaction_type.replace(/_/g, ' ') : 'Outright Purchase'}
                                </div>
                            </div>
                        </div>

                        {/* 2. Headline & Overview */}
                        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-pesa border border-pesa-border relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-pesa-gold/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

                            <div className="relative">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                                    <div className="space-y-4 max-w-2xl">
                                        <h1 className="text-4xl md:text-6xl font-black text-pesa-green tracking-tighter leading-[0.9]">
                                            {plot.title}
                                        </h1>
                                        <div className="flex items-center text-gray-500 font-bold text-lg md:text-xl">
                                            <MapPin className="h-6 w-6 mr-2 text-pesa-gold" />
                                            <span>{plot.location_details}, Kenya</span>
                                        </div>
                                    </div>
                                    <div className="bg-pesa-subtle p-8 rounded-[2rem] border-2 border-pesa-border shadow-inner text-center md:text-right min-w-[280px]">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                                            {plot.transaction_type === 'swap' ? 'Acquisition Preference' : 'Acquisition Method'}
                                        </p>
                                        <p className="text-5xl font-black text-pesa-green">
                                            {plot.transaction_type === 'swap' ? (
                                                <span className="text-pesa-gold">SWAP / BARTER</span>
                                            ) : (
                                                <>
                                                    <span className="text-xl mr-1">{plot.currency || 'KSh'}</span>
                                                    {((plot.currency === 'USD' || plot.currency === 'EUR') ? (plot.price_kes || 0).toLocaleString() : ((plot.price_kes || 0) / 1000000).toFixed(2) + 'M')}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 border-t border-pesa-subtle pt-12">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Dimension</p>
                                        <p className="text-xl font-black text-pesa-green">{plot.size_acres} Acres</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Current Status</p>
                                        <p className="text-xl font-black text-pesa-green capitalize">{plot.land_status?.replace(/_/g, ' ') || 'Vacant'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">County</p>
                                        <p className="text-xl font-black text-pesa-green">{plot.county}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ownership</p>
                                        <div className="flex items-center gap-1.5 text-pesa-green">
                                            <CheckCircle2 className="h-5 w-5 text-pesa-gold" />
                                            <span className="text-xl font-black">Title Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Description & Details */}
                        <div className="bg-white rounded-[3rem] p-12 shadow-pesa border border-pesa-border">
                            <h3 className="text-2xl font-black text-pesa-green mb-8 flex items-center gap-4">
                                <span className="w-2 h-10 bg-pesa-gold rounded-full"></span>
                                Property Intelligence
                            </h3>
                            <div className="prose prose-pesa max-w-none text-gray-600 leading-[1.6] text-xl font-medium whitespace-pre-wrap">
                                {plot.description || 'No additional bio provided for this property profile.'}
                            </div>
                        </div>

                        {/* 4. Official Documents (Phase 2 Component) */}
                        {documents.length > 0 && (
                            <div className="bg-white rounded-[3rem] p-12 shadow-pesa border border-pesa-border">
                                <h3 className="text-2xl font-black text-pesa-green mb-8 flex items-center gap-4">
                                    <span className="w-2 h-10 bg-pesa-green rounded-full"></span>
                                    Official Documents
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {documents.map((doc, idx) => (
                                        <a href={doc} key={idx} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-6 bg-pesa-subtle rounded-[2rem] border border-pesa-border hover:bg-pesa-green transition-all shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-white rounded-2xl text-pesa-green shadow-sm group-hover:scale-110 transition-transform">
                                                    <FileText className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-pesa-green group-hover:text-white">Legal Verification Doc {idx + 1}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/60">Restricted Access</p>
                                                </div>
                                            </div>
                                            <ExternalLink className="h-5 w-5 text-pesa-gold group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 5. Map & Precincts */}
                        <div className="bg-white rounded-[3rem] p-12 shadow-pesa border border-pesa-border">
                            <h3 className="text-2xl font-black text-pesa-green mb-8 flex items-center gap-4">
                                <span className="w-2 h-10 bg-pesa-green rounded-full"></span>
                                Spatial Localization
                            </h3>
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-pesa-border ring-[12px] ring-pesa-subtle">
                                <MapViewer plots={[{
                                    id: plot.id,
                                    title: plot.title,
                                    price_kes: plot.price_kes,
                                    latitude: plot.latitude || -1.2921,
                                    longitude: plot.longitude || 36.8219
                                }]} />
                            </div>
                        </div>

                    </div>

                    {/* RIGHT PANEL: Contact & Inquiry (4 cols) */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-28 space-y-8">

                            {/* Contact Box */}
                            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white ring-1 ring-pesa-border">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="h-32 w-32 bg-pesa-green rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-5xl font-black shadow-2xl mb-6 border-b-8 border-pesa-gold relative">
                                            {plot.title.charAt(0)}
                                            <div className="absolute -bottom-2 -right-2 bg-pesa-gold p-2 rounded-xl shadow-lg">
                                                <ShieldCheck className="h-6 w-6 text-pesa-green" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-black text-pesa-green tracking-tighter">Verified Seller</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">{plot.county} Division Office</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            className="w-full text-lg h-20 bg-pesa-green hover:opacity-90 text-white font-black shadow-xl shadow-pesa-green/10 transition-all border-b-6 border-pesa-gold"
                                            onClick={() => {
                                                const message = `Hi, I'm interested in the property "${plot.title}" listed for ${plot.transaction_type === 'swap' ? 'Swap Exchange' : (plot.currency || 'KES') + ' ' + (plot.price_kes || 0).toLocaleString()} on PlotPesa.`
                                                let phone = plot.contact_phone?.replace(/[^0-9]/g, '') || ''
                                                if (phone.startsWith('0')) phone = '254' + phone.substring(1)
                                                else if (phone.startsWith('7') || phone.startsWith('1')) phone = '254' + phone
                                                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
                                            }}
                                        >
                                            <MessageCircle className="mr-3 h-8 w-8" />
                                            WhatsApp Seller
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full text-lg h-16 border-2 border-pesa-green text-pesa-green font-black hover:bg-pesa-green/5 transition-all"
                                            onClick={() => window.open(`tel:${plot.contact_phone}`, '_self')}
                                        >
                                            <Phone className="mr-3 h-7 w-7" />
                                            Direct Call
                                        </Button>
                                    </div>

                                    <div className="mt-12 pt-10 border-t border-pesa-subtle">
                                        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Portal Status: Protected</p>
                                        <div className="bg-pesa-subtle p-6 rounded-3xl border border-pesa-border text-center">
                                            <p className="text-sm font-black text-pesa-green">Documents Audited ✅</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Inquiry Form Card (Phase 2 Upgrade) */}
                            <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white ring-1 ring-pesa-border">
                                <CardContent className="p-10">
                                    <h3 className="text-2xl font-black text-pesa-green mb-8 flex items-center gap-3">
                                        <MessageSquare className="h-6 w-6 text-pesa-gold" />
                                        Direct Inquiry
                                    </h3>
                                    <InquiryForm plotId={plot.id} plotTitle={plot.title} />
                                </CardContent>
                            </Card>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
