'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { useAuth } from './auth-provider'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const pathname = usePathname()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Don't show navbar on dashboard pages (they have their own layout)
    if (pathname?.startsWith('/dashboard')) {
        return null
    }

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <img
                            src="/logo_pesa.jpg"
                            alt="PlotPesa Logo"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/about"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/about'
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/plots?type=buy"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/plots' && mounted && window.location.search.includes('type=buy')
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            For Sale
                        </Link>
                        <Link
                            href="/plots?type=lease"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/plots' && mounted && window.location.search.includes('type=lease')
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            For Lease
                        </Link>
                        <Link
                            href="/plots?type=jv"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/plots' && mounted && window.location.search.includes('type=jv')
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            Joint Ventures
                        </Link>
                        <Link
                            href="/pro-services"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/pro-services'
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            Experts
                        </Link>
                        <Link
                            href="/mortgage"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/mortgage'
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            Financing
                        </Link>
                        <Link
                            href="/faq"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/faq'
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            Help
                        </Link>
                        <Link
                            href="/contact"
                            className={`font-black uppercase text-xs tracking-widest transition-colors ${pathname === '/contact'
                                ? 'text-pesa-green border-b-2 border-pesa-gold pb-1'
                                : 'text-gray-500 hover:text-pesa-green'
                                }`}
                        >
                            Contact
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="bg-pesa-green hover:opacity-90 text-white font-bold border-b-2 border-pesa-gold/30">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth/login">
                                    <Button variant="ghost" className="text-pesa-green font-bold hover:bg-pesa-green/5">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button className="bg-pesa-green hover:opacity-90 text-white font-bold shadow-md shadow-pesa-green/10 border-b-2 border-pesa-gold/50">
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
