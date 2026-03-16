import Link from 'next/link'
import { Search, MapPin, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-12">
                <div className="text-[12rem] font-black text-pesa-subtle leading-none select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-pesa-green p-8 rounded-[2.5rem] shadow-2xl border-b-8 border-pesa-gold transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <MapPin className="h-20 w-20 text-white animate-bounce" />
                    </div>
                </div>
            </div>

            <div className="max-w-md space-y-6">
                <h1 className="text-4xl font-black text-pesa-green uppercase tracking-tighter leading-tight">
                    Plot <span className="text-pesa-gold font-normal italic">Not Found</span>
                </h1>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                    It seems the land you're looking for isn't on our map yet. Let's get you back to the verified marketplace.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                    <Link href="/plots" className="flex-1">
                        <Button className="w-full h-16 bg-pesa-green hover:opacity-90 text-white font-black rounded-2xl shadow-xl transition-all border-b-4 border-black/20">
                            <Search className="mr-2 h-5 w-5" />
                            Explore Plots
                        </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                        <Button variant="outline" className="w-full h-16 border-2 border-pesa-green text-pesa-green font-black rounded-2xl hover:bg-pesa-green/5 transition-all">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-24 pt-12 border-t border-gray-100 w-full max-w-xl">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">PlotPesa Navigation Systems</p>
            </div>
        </div>
    )
}
