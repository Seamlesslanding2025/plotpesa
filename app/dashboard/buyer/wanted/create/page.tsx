import CreateWantedListingForm from '@/components/create-wanted-listing-form'
import { Bell, Search, Target } from 'lucide-react'

export default function CreateWantedListingPage() {
    return (
        <div className="space-y-8 py-6">
            {/* Header Section */}
            <div className="bg-pesa-green rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-xl">
                            <Search className="h-10 w-10 text-pesa-gold" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight">Post Search Alert</h1>
                            <p className="text-white/70 font-bold uppercase tracking-widest text-xs mt-1">Official PlotPesa Buyer Portal</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <Target className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Define Criteria</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <Bell className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Get Notified</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-pesa-gold">
                                <Search className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-black">Find Instantly</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10">
                <CreateWantedListingForm />
            </div>
        </div>
    )
}
