'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select } from './ui/select-native'
import { Loader2, Search, CheckCircle2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

const COUNTIES = [
    'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo/Marakwet', 'Embu',
    'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
    'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
    'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
    'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Muranga', 'Nairobi City',
    'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
    'Samburu', 'Siaya', 'Taita/Taveta', 'Tana River', 'Tharaka-Nithi',
    'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

export default function CreateWantedListingForm() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        counties: [] as string[],
        minPrice: '',
        maxPrice: '',
        currency: 'KES',
        minSize: '',
        maxSize: '',
        plotType: '',
        description: ''
    })

    const handleCountyToggle = (county: string) => {
        setFormData(prev => ({
            ...prev,
            counties: prev.counties.includes(county)
                ? prev.counties.filter(c => c !== county)
                : [...prev.counties, county]
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!user) {
            setError('Account verification needed. Please login.')
            setLoading(false)
            return
        }

        if (formData.counties.length === 0) {
            setError('Please pick at least one county for tracking')
            setLoading(false)
            return
        }

        const { error: insertError } = await (supabase
            .from('wanted_listings') as any)
            .insert({
                user_id: user.id,
                title: formData.title,
                counties: formData.counties,
                min_price_kes: formData.minPrice ? parseInt(formData.minPrice) : null,
                max_price_kes: formData.maxPrice ? parseInt(formData.maxPrice) : null,
                min_size_acres: formData.minSize ? parseFloat(formData.minSize) : null,
                max_size_acres: formData.maxSize ? parseFloat(formData.maxSize) : null,
                plot_type: formData.plotType || null,
                description: formData.description,
                currency: formData.currency
            })

        if (insertError) {
            setError(insertError.message)
            setLoading(false)
        } else {
            alert("Search Alert Activated!")
            router.push('/dashboard/buyer/wanted')
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-600 font-bold flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                        <CheckCircle2 className="h-4 w-4 rotate-45" />
                    </div>
                    {error}
                </div>
            )}

            {/* Step 1: Identity */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">1</span>
                    <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight">Alert Identity</h3>
                </div>
                <div>
                    <Label htmlFor="title" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest mb-2 block">What are you looking for?</Label>
                    <Input
                        id="title"
                        placeholder="e.g. Mixed development land in Kajiado or Machakos"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold outline-none"
                    />
                </div>
            </div>

            {/* Step 2: Geography */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">2</span>
                    <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight">Target Geography</h3>
                </div>
                <div>
                    <Label className="font-bold text-gray-700 uppercase text-[10px] tracking-widest mb-4 block">Select Counties for Monitoring</Label>
                    <div className="p-6 bg-pesa-subtle rounded-3xl border border-pesa-border grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto scrollbar-hide shadow-inner">
                        {COUNTIES.map(county => (
                            <div
                                key={county}
                                onClick={() => handleCountyToggle(county)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${formData.counties.includes(county)
                                    ? 'bg-pesa-green text-white border-pesa-gold shadow-lg shadow-pesa-green/10'
                                    : 'bg-white border-transparent hover:border-pesa-green/30 text-gray-600'
                                    }`}
                            >
                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${formData.counties.includes(county) ? 'bg-pesa-gold border-pesa-gold' : 'bg-gray-50 border-gray-200'}`}>
                                    {formData.counties.includes(county) && <CheckCircle2 className="h-3 w-3 text-pesa-green" />}
                                </div>
                                <span className="text-xs font-black uppercase tracking-tighter">{county}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-pesa-green font-black uppercase tracking-widest mt-4 flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-pesa-gold" />
                        {formData.counties.length} Locations Monitored
                    </p>
                </div>
            </div>

            {/* Step 3: Range */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">3</span>
                    <h3 className="text-lg font-black text-pesa-green uppercase tracking-tight">Financial & Physical Range</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="font-bold text-gray-700 uppercase text-[10px] tracking-widest block">Preferred Currency</Label>
                        <div className="flex bg-pesa-subtle p-2 rounded-2xl border border-pesa-border">
                            {['KES', 'USD', 'EUR'].map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, currency: c })}
                                    className={`flex-1 py-3 rounded-xl font-black text-xs transition-all ${formData.currency === c
                                        ? 'bg-pesa-green text-white shadow-lg'
                                        : 'text-gray-400 hover:text-pesa-green'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="minPrice" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Min Price</Label>
                            <Input
                                id="minPrice"
                                type="number"
                                placeholder="0"
                                value={formData.minPrice}
                                onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl font-bold outline-none shadow-pesa"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxPrice" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Max Price</Label>
                            <Input
                                id="maxPrice"
                                type="number"
                                placeholder="e.g. 5,000,000"
                                value={formData.maxPrice}
                                onChange={(e) => setFormData({ ...formData, maxPrice: e.target.value })}
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl font-bold outline-none shadow-pesa"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="minSize" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Min Area (Acres)</Label>
                            <Input
                                id="minSize"
                                type="number"
                                step="0.01"
                                placeholder="0.1"
                                value={formData.minSize}
                                onChange={(e) => setFormData({ ...formData, minSize: e.target.value })}
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl font-bold outline-none shadow-pesa"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxSize" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Max Area (Acres)</Label>
                            <Input
                                id="maxSize"
                                type="number"
                                step="0.01"
                                placeholder="e.g. 10"
                                value={formData.maxSize}
                                onChange={(e) => setFormData({ ...formData, maxSize: e.target.value })}
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl font-bold outline-none shadow-pesa"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="plotType" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest mb-2 block">Preferred Plot Type</Label>
                        <Select
                            id="plotType"
                            value={formData.plotType}
                            onChange={(e) => setFormData({ ...formData, plotType: e.target.value })}
                            className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green rounded-xl font-bold px-4 w-full outline-none shadow-pesa"
                        >
                            <option value="">Any Usage Type</option>
                            <option value="residential">Residential Use</option>
                            <option value="commercial">Commercial Use</option>
                            <option value="agricultural">Agricultural Use</option>
                            <option value="mixed">Mixed Use</option>
                        </Select>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest mb-2 block">Specific Requirements (Bio)</Label>
                    <Textarea
                        id="description"
                        placeholder="soil type, water access, near school, title deed status etc..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="bg-pesa-subtle border-transparent focus:border-pesa-green rounded-2xl font-medium p-4 outline-none shadow-pesa"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="w-full h-18 text-xl font-black bg-pesa-green hover:opacity-90 text-white rounded-2xl shadow-2xl transition-all transform active:scale-95 border-b-6 border-pesa-gold"
            >
                {loading ? (
                    <>
                        <Loader2 className="mr-3 h-7 w-7 animate-spin" />
                        Initializing Tracker...
                    </>
                ) : (
                    <>
                        <Search className="mr-3 h-7 w-7" /> Activate Search Alert
                    </>
                )}
            </Button>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Our AI matching system will notify you via email when a match is verified.
            </p>
        </form>
    )
}
