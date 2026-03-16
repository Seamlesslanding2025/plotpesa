'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select-native'
import { compressImage } from '@/lib/image-utils'
import { useAuth } from '@/components/auth-provider'
import { Upload, X, MapPin, CheckCircle2, Phone, FileText, Loader2, Sparkles } from 'lucide-react'

export default function CreateListingForm() {
    const { user } = useAuth()
    const router = useRouter()
    const supabase = createClient()

    // Dynamic import to avoid SSR issues with Leaflet
    const LocationPicker = dynamic(() => import('@/components/location-picker'), {
        ssr: false,
        loading: () => <div className="h-[300px] w-full bg-pesa-subtle animate-pulse rounded-2xl flex items-center justify-center font-bold text-gray-400 border border-pesa-border">Loading Map Engine...</div>
    })

    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)

    // Hydration fix
    useEffect(() => {
        setMounted(true)
    }, [])

    // Images State
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    // Documents State (Phase 2)
    const [titleDeed, setTitleDeed] = useState<File | null>(null)
    const [deedPlan, setDeedPlan] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        plot_type: 'residential',
        listing_type: 'sale',
        county: 'Nairobi',
        location_details: '',
        size_acres: '',
        price_kes: '',
        currency: 'KES',
        contact_phone: '',
        status: 'draft',
        latitude: -1.2921, // Default Nairobi
        longitude: 36.8219,
        transaction_type: 'outright_purchase',
        land_status: 'vacant'
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files).slice(0, 3) // Max 3 images
        const totalFiles = imageFiles.length + newFiles.length

        if (totalFiles > 3) {
            setError('Maximum 3 images allowed')
            return
        }

        setImageFiles(prev => [...prev, ...newFiles].slice(0, 3))

        // Create previews
        newFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string].slice(0, 3))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleDocChange = (type: 'title' | 'deed', file: File | null) => {
        if (type === 'title') setTitleDeed(file)
        if (type === 'deed') setDeedPlan(file)
    }

    // List of 47 Counties in Kenya (Alphabetical)
    const counties = [
        'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo/Marakwet', 'Embu',
        'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
        'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
        'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
        'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi City',
        'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
        'Samburu', 'Siaya', 'Taita/Taveta', 'Tana River', 'Tharaka-Nithi',
        'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleLocationChange = (pos: { lat: number, lng: number }) => {
        setFormData(prev => ({ ...prev, latitude: pos.lat, longitude: pos.lng }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            alert("User not found! Please login again.")
            return
        }

        // 0. Policy: Mandatory Documentation For Verification
        if (!titleDeed || !deedPlan) {
            setError("Mandatory: Please upload both Title Deed and Deed Plan to proceed.")
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)
        setStatusMessage("Optimizing photos for portal efficiency...")

        try {
            // 1. Compress Images Client-Side
            const compressedImages: File[] = []
            for (const file of imageFiles) {
                const compressed = await compressImage(file)
                compressedImages.push(compressed)
            }

            // 2. Upload images to public bucket
            let imageUrls: string[] = []
            if (compressedImages.length > 0) {
                setStatusMessage("Uploading property photos...")
                for (const file of compressedImages) {
                    const fileName = `${user.id}/images/${Date.now()}-${file.name}`
                    const { error: uploadError } = await (supabase.storage
                        .from('plot-images')
                        .upload(fileName, file) as any)

                    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)

                    const { data: { publicUrl } } = supabase.storage
                        .from('plot-images')
                        .getPublicUrl(fileName)
                    imageUrls.push(publicUrl)
                }
            }

            // 3. Upload documents to private documents bucket (Phase 2)
            let docUrls: string[] = []
            const docsToUpload = [
                { file: titleDeed, name: 'Title Deed' },
                { file: deedPlan, name: 'Deed Plan' }
            ]

            setStatusMessage("Securing official documents...")
            for (const item of docsToUpload) {
                if (item.file) {
                    const fileName = `${user.id}/docs/${Date.now()}-${item.file.name}`
                    const { error: uploadError } = await (supabase.storage
                        .from('plot-images') 
                        .upload(fileName, item.file) as any)

                    if (uploadError) throw new Error(`${item.name} upload failed: ${uploadError.message}`)

                    const { data: { publicUrl } } = supabase.storage
                        .from('plot-images')
                        .getPublicUrl(fileName)
                    docUrls.push(publicUrl)
                }
            }

            setStatusMessage("Finalizing listing...")
            const payload = {
                user_id: user.id,
                title: formData.title,
                description: formData.description,
                plot_type: formData.plot_type as any,
                county: formData.county,
                location_details: formData.location_details,
                size_acres: formData.size_acres ? parseFloat(formData.size_acres) : null,
                price_kes: formData.transaction_type === 'swap' ? null : parseFloat(formData.price_kes),
                contact_phone: formData.contact_phone,
                land_status: formData.land_status,
                latitude: formData.latitude,
                longitude: formData.longitude,
                images: imageUrls.length > 0 ? imageUrls : null,
                documents: docUrls.length > 0 ? docUrls : null,
                status: 'pending_verification',
                listing_type: formData.listing_type,
                transaction_type: formData.transaction_type,
                currency: formData.currency
            }

            const { error: dbError } = await (supabase.from('plots') as any).insert(payload)

            if (dbError) throw dbError

            alert("Asset submitted for portal verification!")
            router.push('/dashboard/seller/listings')
            router.refresh()
        } catch (err: any) {
            console.error('Submission Error:', err)
            setError(err.message || 'Failed to sync with portal')
        } finally {
            setLoading(false)
            setStatusMessage(null)
        }
    }

    if (!mounted) {
        return (
            <div className="h-[600px] w-full bg-pesa-subtle animate-pulse rounded-3xl flex items-center justify-center font-bold text-gray-400 border border-pesa-border">
                Initializing Secure Protocol...
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Basic Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-pesa-border">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">1</span>
                    <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Basic Property Information</h3>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Listing Title</Label>
                        <Input
                            id="title"
                            name="title"
                            required
                            className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold outline-none"
                            placeholder="e.g. 50x100 Plot in Ruiru, Nairobi"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="county" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">County</Label>
                            <Select
                                id="county"
                                name="county"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold px-4 outline-none"
                                value={formData.county}
                                onChange={handleChange}
                            >
                                {counties.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plot_type" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Plot Type</Label>
                            <Select
                                id="plot_type"
                                name="plot_type"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold px-4 outline-none"
                                value={formData.plot_type}
                                onChange={handleChange}
                            >
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="agricultural">Agricultural</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="listing_type" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">How will you list this?</Label>
                            <Select
                                id="listing_type"
                                name="listing_type"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold px-4 outline-none"
                                value={formData.listing_type}
                                onChange={handleChange}
                            >
                                <option value="sale">Outright Sale</option>
                                <option value="joint_venture">Joint Venture</option>
                                <option value="long_term_lease">Long-term Lease</option>
                                <option value="swap">Swap / Exchange</option>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="transaction_type" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Acquisition Method</Label>
                            <Select
                                id="transaction_type"
                                name="transaction_type"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold px-4 outline-none"
                                value={formData.transaction_type}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFormData(prev => ({
                                        ...prev,
                                        transaction_type: val,
                                        // CONSTRAINT: If Lease, Status cannot be Redevelopment
                                        land_status: val === 'lease' ? 'vacant' : prev.land_status
                                    }))
                                }}
                            >
                                <option value="outright_purchase">Direct Purchase</option>
                                <option value="lease">Lease (Rent)</option>
                                <option value="joint_venture">Joint Venture</option>
                                <option value="swap">Swap / Exchange</option>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="land_status" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Current Land Status</Label>
                            <Select
                                id="land_status"
                                name="land_status"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold px-4 outline-none"
                                value={formData.land_status}
                                onChange={handleChange}
                            >
                                <option value="vacant">Vacant (Fresh Land)</option>
                                {formData.transaction_type !== 'lease' && (
                                    <option value="redevelopment">For Redevelopment</option>
                                )}
                            </Select>
                            {formData.transaction_type === 'lease' && (
                                <p className="text-[10px] text-orange-600 font-bold italic mt-1">
                                    Note: Leasing is only available for Vacant land types.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Step 2: Visuals & Compression */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-pesa-border">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">2</span>
                    <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Property Visuals</h3>
                </div>

                <div className="border-2 border-dashed border-pesa-green/30 bg-pesa-subtle rounded-3xl p-8 text-center transition-all hover:bg-pesa-green/[0.05]">
                    <Label htmlFor="images" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-pesa-green/50 mb-4" />
                        <p className="text-pesa-green font-black uppercase tracking-widest text-sm">Upload Photos</p>
                        <p className="text-xs text-gray-400 mt-2 font-bold italic">Max 3 photos. Automatic "Smart Lossy" optimization will be applied.</p>
                    </Label>
                    <input
                        id="images"
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                    />

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group aspect-video">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-cover rounded-2xl border-4 border-white shadow-pesa group-hover:scale-[1.02] transition-transform"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-xl transform transition-transform hover:scale-110"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Step 3: Location & Map */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-pesa-border">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">3</span>
                    <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Precise Location</h3>
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl overflow-hidden border-2 border-pesa-border shadow-inner min-h-[300px]">
                        <LocationPicker
                            position={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : null}
                            onChange={handleLocationChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="latitude" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Latitude</Label>
                            <Input
                                id="latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold shadow-sm"
                                placeholder="-1.2921"
                                value={formData.latitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Longitude</Label>
                            <Input
                                id="longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                required
                                className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold shadow-sm"
                                placeholder="36.8219"
                                value={formData.longitude}
                                onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_details" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Town, Estate or Milestone</Label>
                        <Input
                            id="location_details"
                            name="location_details"
                            required
                            className="h-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold outline-none"
                            placeholder="e.g. Kitengela, near International School"
                            value={formData.location_details}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Step 4: Documents (Phase 2 Upgrade) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-pesa-border">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">4</span>
                    <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Official Paperwork Inspection</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-pesa-green/[0.03] border border-pesa-border rounded-3xl">
                    {/* Title Deed Slot */}
                    <div className={`relative p-6 rounded-2xl border-2 transition-all ${titleDeed ? 'bg-white border-pesa-green shadow-lg' : 'bg-pesa-subtle border-dashed border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${titleDeed ? 'bg-pesa-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-pesa-green">Title Deed</p>
                                    <p className="text-[10px] text-gray-400 font-bold">Mandatory Scan</p>
                                </div>
                            </div>
                            {titleDeed && (
                                <button onClick={() => handleDocChange('title', null)} className="text-red-500 hover:scale-110 transition-transform">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {titleDeed ? (
                            <p className="text-xs font-bold text-pesa-green truncate">{titleDeed.name}</p>
                        ) : (
                            <Label htmlFor="title-deed" className="cursor-pointer block text-center py-2 bg-white border border-pesa-border rounded-xl text-[10px] font-black uppercase text-pesa-green hover:bg-pesa-green hover:text-white transition-all">
                                Select File
                            </Label>
                        )}
                        <input id="title-deed" type="file" onChange={(e) => handleDocChange('title', e.target.files?.[0] || null)} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" />
                    </div>

                    {/* Deed Plan Slot */}
                    <div className={`relative p-6 rounded-2xl border-2 transition-all ${deedPlan ? 'bg-white border-pesa-green shadow-lg' : 'bg-pesa-subtle border-dashed border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${deedPlan ? 'bg-pesa-green text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-pesa-green">Deed Plan</p>
                                    <p className="text-[10px] text-gray-400 font-bold">Mandatory Survey Map</p>
                                </div>
                            </div>
                            {deedPlan && (
                                <button onClick={() => handleDocChange('deed', null)} className="text-red-500 hover:scale-110 transition-transform">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        {deedPlan ? (
                            <p className="text-xs font-bold text-pesa-green truncate">{deedPlan.name}</p>
                        ) : (
                            <Label htmlFor="deed-plan" className="cursor-pointer block text-center py-2 bg-white border border-pesa-border rounded-xl text-[10px] font-black uppercase text-pesa-green hover:bg-pesa-green hover:text-white transition-all">
                                Select File
                            </Label>
                        )}
                        <input id="deed-plan" type="file" onChange={(e) => handleDocChange('deed', e.target.files?.[0] || null)} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" />
                    </div>
                </div>
            </div>

            {/* Step 5: Pricing & Contact */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-pesa-border">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-pesa-green text-white font-black text-sm">5</span>
                    <h3 className="text-xl font-black text-pesa-green uppercase tracking-tight">Finances & Contact</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2 text-center bg-pesa-subtle p-6 rounded-3xl border border-pesa-border shadow-pesa">
                        <Label htmlFor="price_kes" className="font-black text-pesa-green uppercase text-[12px] tracking-widest">
                            {formData.transaction_type === 'swap' ? 'Acquisition Logic' : 'Asking Price'}
                        </Label>
                        <div className="flex gap-2">
                            {formData.transaction_type === 'swap' ? (
                                <div className="h-16 flex-1 flex items-center justify-center bg-white rounded-2xl border-2 border-dashed border-pesa-gold text-pesa-green font-black">
                                    Swap / Barter Enabled
                                </div>
                            ) : (
                                <>
                                    <Select
                                        id="currency"
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="h-16 w-32 bg-white border-transparent focus:border-pesa-green rounded-2xl font-black text-pesa-green shadow-inner"
                                    >
                                        <option value="KES">KES</option>
                                        <option value="USD">USD</option>
                                        <option value="EUR">EUR</option>
                                    </Select>
                                    <Input
                                        id="price_kes"
                                        name="price_kes"
                                        type="number"
                                        required={formData.transaction_type !== 'swap'}
                                        className="h-16 flex-1 text-2xl text-center bg-white border-transparent focus:border-pesa-green rounded-2xl font-black text-pesa-green shadow-inner"
                                        placeholder="1,500,000"
                                        value={formData.price_kes}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="space-y-2 text-center bg-pesa-subtle p-6 rounded-3xl border border-pesa-border shadow-pesa">
                        <Label htmlFor="size_acres" className="font-black text-pesa-green uppercase text-[12px] tracking-widest">Land Size (Acres)</Label>
                        <Input
                            id="size_acres"
                            name="size_acres"
                            type="number"
                            step="0.01"
                            className="h-16 text-2xl text-center bg-white border-transparent focus:border-pesa-green rounded-2xl font-black text-pesa-green shadow-inner"
                            placeholder="0.5"
                            value={formData.size_acres}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="contact_phone" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Agent/Seller Phone Number</Label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="contact_phone"
                            name="contact_phone"
                            type="tel"
                            className="h-12 pl-12 bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-xl font-bold shadow-sm"
                            placeholder="+254 7XX XXX XXX"
                            value={formData.contact_phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="font-bold text-gray-700 uppercase text-[10px] tracking-widest">Property Bio</Label>
                    <Textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="bg-pesa-subtle border-transparent focus:border-pesa-green focus:bg-white rounded-2xl font-medium p-6 outline-none shadow-sm"
                        placeholder="Describe soil type, amenities, nearby schools, title status etc..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 font-bold flex items-start gap-3">
                    <div className="bg-white p-1 rounded-full shadow-sm">
                        <X className="h-4 w-4" />
                    </div>
                    <p>{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-20 text-xl font-black bg-pesa-green hover:opacity-90 text-white rounded-3xl shadow-2xl transition-all transform active:scale-[0.98] border-b-8 border-pesa-gold"
                >
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <span className="flex items-center gap-3"><Loader2 className="h-6 w-6 animate-spin text-pesa-gold" /> Process Active</span>
                            <span className="text-[10px] uppercase tracking-tighter opacity-70 mt-1">{statusMessage}</span>
                        </div>
                    ) : (
                        <>
                            <Sparkles className="mr-3 h-7 w-7 text-pesa-gold" /> Submit Asset for Verification
                        </>
                    )}
                </Button>
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6 bg-pesa-subtle py-2 rounded-full inline-block px-8 mx-auto w-full">
                    Official PlotPesa Secure Transmission Protocol Active
                </p>
            </div>
        </form>
    )
}
