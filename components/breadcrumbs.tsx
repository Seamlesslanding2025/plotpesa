'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Breadcrumbs() {
    const pathname = usePathname()
    if (pathname === '/') return null

    const paths = pathname?.split('/').filter(p => p) || []

    // Don't show on dashboard as it has its own navigation style
    if (pathname?.startsWith('/dashboard')) return null

    return (
        <nav className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400 py-6 max-w-7xl mx-auto px-6">
            <Link href="/" className="hover:text-pesa-green flex items-center gap-1 transition-colors">
                <Home className="h-3.5 w-3.5" />
                Home
            </Link>
            {paths.map((path, i) => {
                const href = `/${paths.slice(0, i + 1).join('/')}`
                const isLast = i === paths.length - 1
                const label = path.replace(/-/g, ' ').replace(/\[.*\]/g, 'Details')

                return (
                    <div key={i} className="flex items-center gap-3">
                        <ChevronRight className="h-3 w-3 text-gray-300" />
                        {isLast ? (
                            <span className="text-pesa-green">{label}</span>
                        ) : (
                            <Link href={href} className="hover:text-pesa-green transition-colors">
                                {label}
                            </Link>
                        )}
                    </div>
                )
            })}
        </nav>
    )
}
