'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, CreditCard, Upload, CheckCircle2, UserCircle2, MapPin, Briefcase, Award, Loader2, FileText, TrendingUp, Mail, Phone, Calendar, Sparkles, Crown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProfessionalHubPage() {
    const { user, profile } = useAuth()
    const router = useRouter()
    const [uploading, setUploading] = useState(false)
    const [uploadedDoc, setUploadedDoc] = useState<any>(null)
    const [leads, setLeads] = useState<any[]>([])
    const [loadingLeads, setLoadingLeads] = useState(true)
    const supabase = createClient()

    const isVerified = profile?.is_verified || false
    const role = profile?.role || 'professional'

    // Check if document exists on mount
    useEffect(() => {
        if (!user) return;
        const checkDoc = async () => {
             const { data } = await supabase.from('documents')
                .select('*')
                .eq('user_id', user.id)
                .in('document_type', ['agent_license', 'registration_cert'])
                .order('created_at', { ascending: false })
                .limit(1)
                
            if (data && data.length > 0) {
                setUploadedDoc(data[0])
            }
        }
        checkDoc()
    }, [user, supabase])

    // Fetch leads
    useEffect(() => {
        if (!user || !profile) return;

        const fetchLeads = async () => {
            setLoadingLeads(true);
            try {
                const roleToService: Record<string, string> = {
                    'lawyer': 'legal',
                    'eia_expert': 'eia',
                    'surveyor': 'surveying',
                    'architect': 'architectural',
                    'valuer': 'valuation'
                }

                const roles = Array.isArray(profile.role) ? profile.role : [profile.role]
                const allowedServices = roles
                    .map((r: string) => roleToService[r])
                    .filter(Boolean)

                if (allowedServices.length === 0 && !roles.includes('admin')) {
                    setLeads([])
                    return
                }

                let query = (supabase.from('service_leads') as any)
                    .select('*')
                    .order('created_at', { ascending: false })

                if (!roles.includes('admin')) {
                    query = query.in('service_type', allowedServices)
                }

                const { data, error } = await query
                if (error) throw error
                setLeads(data || [])
            } catch (err) {
                console.error("Error fetching leads:", err)
            } finally {
                setLoadingLeads(false)
            }
        }

        fetchLeads()
    }, [user, profile, supabase])

    const roleConfigs: Record<string, any> = {
        surveyor: {
            title: "Licensed Land Surveyor",
            board: "Institution of Surveyors of Kenya (ISK)",
            certName: "Annual Practicing License",
            icon: <MapPin className="h-6 w-6 text-pesa-green" />
        },
        architect: {
            title: "Registered Architect",
            board: "BORAQS Kenya",
            certName: "Annual Practicing Certificate",
            icon: <Award className="h-6 w-6 text-pesa-green" />
        },
        valuer: {
            title: "Registered Valuer",
            board: "Valuers Registration Board (VRB)",
            certName: "Practicing License",
            icon: <TrendingUp className="h-6 w-6 text-pesa-green" />
        },
        eia_expert: {
            title: "NEMA EIA/EA Expert",
            board: "NEMA Kenya / EIK",
            certName: "NEMA Practicing License",
            icon: <Shield className="h-6 w-6 text-pesa-green" />
        },
        lawyer: {
            title: "Verified Conveyancer",
            board: "Law Society of Kenya (LSK)",
            certName: "LSK Practicing Certificate",
            icon: <Shield className="h-6 w-6 text-pesa-green" />
        },
        agent: {
            title: "Registered Estate Agent",
            board: "Estate Agents Registration Board (EARB)",
            certName: "EARB Registration Certificate",
            icon: <Briefcase className="h-6 w-6 text-pesa-green" />
        },
        estate_agent: {
            title: "Registered Estate Agent",
            board: "EARB Kenya",
            certName: "EARB Practicing License",
            icon: <Briefcase className="h-6 w-6 text-pesa-green" />
        },
        land_company: {
            title: "Corporate Land Developer",
            board: "KPDA / EARB",
            certName: "Company Registration & Licensing",
            icon: <Briefcase className="h-6 w-6 text-pesa-green" />
        }
    }

    const currentConfig = roleConfigs[role] || {
        title: "Professional Specialist",
        board: "Relevant Regulatory Body",
        certName: "Professional License",
        icon: <Briefcase className="h-6 w-6 text-pesa-green" />
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !user) return

        setUploading(true)
        try {
            const fileName = `${user.id}/certs/${Date.now()}-${file.name}`
            const { error: uploadError } = await supabase.storage
                .from('plot-images') // Reusing single bucket to avoid missing bucket RLS failures on MVP
                .upload(fileName, file)

            if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`)

            const { data: { publicUrl } } = supabase.storage
                .from('plot-images')
                .getPublicUrl(fileName)

            const { error: dbError } = await (supabase.from('documents') as any).insert({
                user_id: user.id,
                document_type: 'registration_cert',
                file_url: publicUrl,
                file_name: file.name,
                verification_status: 'pending'
            })

            if (dbError) throw new Error(`Record Failed: ${dbError.message}`)
            
            alert('Certificate successfully uploaded and submitted for audit.')
            router.refresh()
            window.location.reload()
        } catch (err: any) {
            alert(err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-10 py-8 px-4 max-w-7xl mx-auto focus-visible:outline-none">
            {/* Elite Header */}
            <div className="bg-pesa-green rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                                <Award className="h-8 w-8 text-pesa-gold" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Pro Vendor <span className="text-pesa-gold">Hub</span></h1>
                        </div>
                        <p className="text-lg text-white/70 font-medium max-w-xl">
                            The central portal for verified experts. Manage your professional profile, credentials, and leads from PlotPesa.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl min-w-[300px]">
                        <p className="text-white/60 font-black text-xs uppercase tracking-widest mb-2 text-center md:text-left">Verification Status</p>
                        <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isVerified ? 'bg-green-500' : 'bg-amber-500'} shadow-lg`}>
                                {isVerified ? <CheckCircle2 className="h-7 w-7 text-white" /> : <Shield className="h-7 w-7 text-white" />}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-white">{isVerified ? 'Verified' : 'Pending'}</p>
                                <p className="text-xs font-bold text-white/60 uppercase">{currentConfig.title}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* 1. Profile & Board Info */}
                <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                        <div className="flex items-center gap-3">
                            <UserCircle2 className="h-6 w-6 text-pesa-green" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Expert Identity</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-[10px] font-black uppercase text-gray-400">FullName</Label>
                                <p className="font-bold text-gray-800">{profile?.full_name || 'Not Set'}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] font-black uppercase text-gray-400">Vertical Expertise</Label>
                                <p className="font-bold text-pesa-green capitalize">{role}</p>
                            </div>
                            <div>
                                <Label className="text-[10px] font-black uppercase text-gray-400">Assigned Board</Label>
                                <p className="text-sm font-medium text-gray-500">{currentConfig.board}</p>
                            </div>
                        </div>
                        <Link href="/dashboard/settings" className="block">
                            <Button variant="outline" className="w-full border-gray-100 rounded-xl font-bold hover:bg-gray-50">
                                Edit Identity
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* 2. Verification Documents */}
                <Card className={`rounded-[2.5rem] shadow-sm overflow-hidden border-2 transition-colors ${!isVerified ? 'border-amber-100 bg-amber-50/20' : 'border-gray-100'}`}>
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <Upload className="h-6 w-6 text-pesa-green" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">Compliance Proof</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6">
                        {!isVerified ? (
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                                    To appear in the verified directory, you must upload your <span className="font-bold text-gray-900">{currentConfig.certName}</span> for vetting.
                                </p>
                                <div className="border-2 border-dashed border-amber-200 rounded-2xl p-8 text-center bg-white space-y-3">
                                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                                        {uploading ? <Loader2 className="h-6 w-6 text-amber-500 animate-spin" /> : <Shield className="h-6 w-6 text-amber-500" />}
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase">Documents Required (PDF/JPG)</p>
                                    
                                    {uploadedDoc ? (
                                        <div className="mt-4 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center justify-between text-left">
                                            <div>
                                                <p className="font-bold text-amber-800 text-sm truncate max-w-[150px]">{uploadedDoc.file_name}</p>
                                                <p className="text-[10px] uppercase font-black tracking-widest text-amber-600">Under Review</p>
                                            </div>
                                            <a href={uploadedDoc.file_url} target="_blank" className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md"><FileText className="h-4 w-4 text-amber-600" /></a>
                                        </div>
                                    ) : (
                                        <div>
                                            <label htmlFor="certUpload" className={`bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl px-6 py-3 cursor-pointer inline-block transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {uploading ? 'Uploading Securely...' : 'Upload Credentials'}
                                            </label>
                                            <input id="certUpload" type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={handleFileUpload} disabled={uploading} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-4 text-green-800 border border-green-100">
                                    <CheckCircle2 className="h-6 w-6 shrink-0" />
                                    <span className="text-sm font-bold uppercase tracking-tight">Verification Active & Published</span>
                                </div>
                                <div className="p-4 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-black text-gray-400 uppercase">Current Certificate</p>
                                        <p className="font-bold text-gray-700">Practicing_Cert_2026.pdf</p>
                                    </div>
                                    <Button variant="ghost" className="h-8 w-8 rounded-lg p-0">
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* 3. Monetization / Subscriptions */}
                <Card className="rounded-[2.5rem] border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <CreditCard className="h-6 w-6 text-pesa-green" />
                            <CardTitle className="text-xl font-black uppercase tracking-tight">The Growth Engine</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 space-y-6">
                        <p className="text-sm font-medium text-gray-600">
                            Join our premium directory to receive direct commissions and inquiries from PlotPesa buyers.
                        </p>

                        <div className="space-y-4">
                            <div className="p-6 bg-pesa-subtle rounded-2xl border border-pesa-border/50 relative overflow-hidden group">
                                <TrendingUp className="absolute bottom-0 right-0 h-16 w-16 text-pesa-green/5 -mr-4 -mb-4 group-hover:scale-125 transition-transform" />
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-black text-pesa-green uppercase text-[10px] tracking-widest">Yearly Specialist</p>
                                    <span className="text-2xl font-black">Ksh 5,000</span>
                                </div>
                                <p className="text-xs font-medium text-gray-500 mb-4 font-italic italic">Recommended for individuals.</p>
                                <Link href="/dashboard/billing">
                                    <Button className="w-full bg-pesa-green text-white font-bold rounded-xl h-10 text-xs">
                                        Subscribe Yearly
                                    </Button>
                                </Link>
                            </div>

                            <div className="p-6 bg-white border-2 border-pesa-gold/20 rounded-2xl relative overflow-hidden group shadow-lg shadow-pesa-gold/5">
                                <Crown className="absolute top-2 right-2 h-4 w-4 text-pesa-gold animate-bounce" />
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-black text-pesa-gold uppercase text-[10px] tracking-widest">Platinum Firm</p>
                                    <span className="text-2xl font-black">Ksh 2,500</span>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold mb-4 uppercase">/ MONTH · FEATURED AT TOP</p>
                                <Link href="/dashboard/billing">
                                    <Button className="w-full bg-pesa-gold text-black font-black rounded-xl h-10 text-xs shadow-md">
                                        Join as Firm
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Elite Lead Management Dashboard */}
            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/50 p-10 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 bg-pesa-green rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-pesa-green/20">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-pesa-green">Exclusive Leads Dashboard</h2>
                            <p className="text-gray-400 font-medium">Strategic customer inquiries for your vertical.</p>
                        </div>
                    </div>
                    {leads.length > 0 && (
                        <div className="px-6 py-2 bg-pesa-gold/10 border border-pesa-gold/20 rounded-full flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-pesa-gold animate-ping"></div>
                            <span className="text-xs font-black uppercase text-pesa-green tracking-widest">{leads.length} Active leads</span>
                        </div>
                    )}
                </div>

                <div className="p-10">
                    {loadingLeads ? (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-12 w-12 text-pesa-green animate-spin opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Synchronizing Lead Vault...</p>
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="py-24 text-center space-y-6">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-gray-200">
                                <Mail className="h-10 w-10 text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase text-gray-400">The vault is currently empty</h3>
                                <p className="text-sm font-medium text-gray-400 max-w-sm mx-auto leading-relaxed">
                                    New client leads matching your expertise will appear here in real-time. ensure your profile is fully verified to build trust.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {leads.map((lead) => (
                                <div key={lead.id} className="group relative bg-white border border-gray-100 p-8 rounded-[2rem] hover:shadow-xl hover:border-pesa-green/20 transition-all flex flex-col md:flex-row justify-between gap-8 items-start md:items-center">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 bg-pesa-subtle text-pesa-green text-[10px] font-black uppercase tracking-widest rounded-lg border border-pesa-border">
                                                {lead.service_type}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(lead.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-gray-900 mb-1">{lead.full_name}</h4>
                                            <p className="text-gray-500 font-medium text-sm"><MapPin className="h-3 w-3 inline mr-1" />{lead.location || 'Location Not Specified'}</p>
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed max-w-2xl bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 italic underline-offset-4 decoration-pesa-gold/30 decoration-2">
                                            "{lead.message || 'No additional details provided.'}"
                                        </p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                                        <a href={`tel:${lead.phone}`} className="flex-1 sm:flex-none">
                                            <Button className="w-full h-14 bg-white border-2 border-pesa-green text-pesa-green font-black rounded-2xl flex items-center gap-3 px-8 hover:bg-pesa-green hover:text-white transition-all">
                                                <Phone className="h-5 w-5" />
                                                Call Now
                                            </Button>
                                        </a>
                                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} target="_blank" className="flex-1 sm:flex-none">
                                            <Button className="w-full h-14 bg-pesa-green text-white font-black rounded-2xl flex items-center gap-3 px-8 shadow-lg shadow-pesa-green/20 border-b-4 border-pesa-gold hover:opacity-90 transition-all">
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                Reach Out
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <p className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</p>
}
