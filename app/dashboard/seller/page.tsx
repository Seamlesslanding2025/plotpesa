'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, FileText, ArrowRight } from 'lucide-react'

export default function SellerDashboardPage() {
    return (
        <div className="space-y-10 py-6">
            <div>
                <h1 className="text-4xl font-black text-pesa-green tracking-tight">
                    Seller Portal
                </h1>
                <p className="text-gray-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Official PlotPesa Management Hub</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-none bg-white shadow-xl shadow-gray-100 rounded-3xl overflow-hidden group hover:shadow-2xl transition-all border border-gray-100">
                    <CardHeader className="flex flex-row items-center justify-between pb-6 pt-8 px-8">
                        <CardTitle className="text-xs font-black text-pesa-green uppercase tracking-widest">Property Portfolio</CardTitle>
                        <div className="p-3 bg-pesa-green/5 rounded-xl text-pesa-green group-hover:bg-pesa-green group-hover:text-white transition-colors">
                            <FileText className="h-6 w-6" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-3xl font-black text-pesa-green mb-2">Inventory</div>
                        <p className="text-sm text-gray-400 font-medium mb-8">
                            Monitor, edit and track performance of your verified listings.
                        </p>
                        <Link href="/dashboard/seller/listings">
                            <Button variant="outline" className="w-full h-14 border-2 border-pesa-green text-pesa-green font-black rounded-2xl hover:bg-pesa-green/5 transition-all flex items-center justify-between px-6">
                                View Portfolio
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Link href="/dashboard/seller/listings/create" className="block group">
                    <div className="h-full bg-pesa-green rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden border-b-8 border-pesa-gold flex flex-col items-center justify-center text-center transition-all hover:translate-y-[-4px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <div className="p-6 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors mb-6 shadow-xl border border-white/10">
                            <PlusCircle className="h-16 w-16 text-pesa-gold group-hover:scale-110 transition-transform" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-2">
                            List New Asset
                        </h3>
                        <p className="text-white/60 font-medium text-sm max-w-[200px]">
                            Initiate a new property verification and listing process.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    )
}
