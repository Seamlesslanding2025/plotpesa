
'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, LayoutDashboard, FileText, Settings, ShieldCheck, Map, MessageSquare, Bell, CreditCard, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import NotificationBell from '@/components/notification-bell'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, profile, loading, signOut } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    if (loading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-pesa-subtle">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesa-green mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading PlotPesa Profile...</p>
                </div>
            </div>
        )
    }

    const rawRole = profile?.role;
    const userRoles: string[] = Array.isArray(rawRole) ? rawRole : (rawRole ? [rawRole as string] : []);
    
    // Determine access based on roles array (supports single or multiple roles)
    const isOwner = userRoles.some(r => ['owner', 'agent', 'estate_agent', 'land_company'].includes(r));
    const isPro = userRoles.some(r => ['valuer', 'surveyor', 'architect', 'eia_expert', 'lawyer', 'agent', 'estate_agent', 'land_company'].includes(r));
    const isAdmin = userRoles.includes('admin');
    
    // Everyone except pure admins can use buyer features by default on a marketplace
    const canBuy = !isAdmin;

    return (
        <div className="flex h-screen bg-pesa-subtle">
            {/* Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col shrink-0">
                <div className="flex flex-col flex-grow border-r border-pesa-border bg-white shadow-sm overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-6 py-6 h-20 border-b border-pesa-subtle">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/logo_pesa.jpg"
                                alt="PlotPesa Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>
                    <div className="mt-8 flex-grow flex flex-col">
                        <nav className="flex-1 px-4 space-y-2">
                            {/* Common links */}
                            <Link href="/dashboard" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                <LayoutDashboard className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard' ? 'text-pesa-gold' : ''}`} />
                                My Dashboard
                            </Link>

                            <Link href="/dashboard/billing" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard/billing' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                <CreditCard className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard/billing' ? 'text-pesa-gold' : ''}`} />
                                Billing & Tiers
                            </Link>

                            {/* Seller Links */}
                            {isOwner && (
                                <>
                                    <Link href="/dashboard/seller/listings" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard/seller/listings' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                        <FileText className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard/seller/listings' ? 'text-pesa-gold' : ''}`} />
                                        Property Listings
                                    </Link>
                                    <Link href="/dashboard/seller/inquiries" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard/seller/inquiries' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                        <MessageSquare className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard/seller/inquiries' ? 'text-pesa-gold' : ''}`} />
                                        Property Inquiries
                                    </Link>
                                    <Link href="/dashboard/seller/analytics" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard/seller/analytics' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                        <TrendingUp className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard/seller/analytics' ? 'text-pesa-gold' : ''}`} />
                                        Listing Analytics
                                    </Link>
                                </>
                            )}

                            {/* Admin Links */}
                            {isAdmin && (
                                <Link href="/dashboard/admin/verification" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname?.includes('admin') ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                    <ShieldCheck className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname?.includes('admin') ? 'text-pesa-gold' : ''}`} />
                                    Admin Panel
                                </Link>
                            )}

                            {/* Professional Links */}
                            {isPro && (
                                <Link href="/dashboard/pro-hub" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname === '/dashboard/pro-hub' ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                    <ShieldCheck className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname === '/dashboard/pro-hub' ? 'text-pesa-gold' : ''}`} />
                                    Professional Hub
                                </Link>
                            )}

                            {/* Buyer Links */}
                            {canBuy && (
                                <>
                                    <Link href="/dashboard/buyer/wanted" className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${pathname?.includes('buyer/wanted') ? 'bg-pesa-green text-white shadow-lg shadow-pesa-green/10' : 'text-gray-500 hover:bg-pesa-green/5 hover:text-pesa-green'}`}>
                                        <Bell className={`mr-3 h-5 w-5 flex-shrink-0 ${pathname?.includes('buyer/wanted') ? 'text-pesa-gold' : ''}`} />
                                        Search Alerts
                                    </Link>
                                    <Link href="/dashboard/buyer/saved" className="group flex items-center px-4 py-3 text-sm font-bold rounded-xl text-gray-400 hover:bg-gray-50 cursor-not-allowed">
                                        <Map className="mr-3 h-5 w-5 flex-shrink-0 text-gray-300" />
                                        Saved Favorites
                                    </Link>
                                </>
                            )}

                            {/* Account Settings (Placeholder) */}
                            <Link href="/dashboard/settings" className="group flex items-center px-4 py-3 text-sm font-bold rounded-xl text-gray-400 hover:bg-gray-50 cursor-not-allowed">
                                <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-gray-300" />
                                Account Settings
                            </Link>
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-pesa-border p-4 bg-pesa-subtle">
                        <div className="flex-shrink-0 w-full px-2">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-pesa-green flex items-center justify-center text-white font-black text-xs">
                                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-pesa-green truncate">{profile?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                                    <p className="text-[10px] font-black text-pesa-gold uppercase tracking-tighter">{userRoles.join(', ') || 'Member'}</p>
                                </div>
                            </div>
                            <button onClick={() => signOut()} className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-transparent hover:border-red-100">
                                <LogOut className="h-4 w-4" /> Sign Out from Portal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Dashboard Header Bar */}
                <header className="h-20 bg-pesa-subtle/30 backdrop-blur-md border-b border-pesa-border flex items-center justify-between px-8 shrink-0 z-30 relative">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-pesa-gold animate-pulse"></div>
                        <span className="text-[10px] font-black text-pesa-green uppercase tracking-widest">Portal Authority Active</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className="h-10 w-[1px] bg-pesa-border"></div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-pesa-green leading-tight">{profile?.full_name || 'Portal User'}</p>
                                <p className="text-[10px] font-bold text-pesa-gold uppercase tracking-tighter">{userRoles.join(', ')}</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-pesa-green text-white flex items-center justify-center font-black shadow-lg">
                                {profile?.full_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
