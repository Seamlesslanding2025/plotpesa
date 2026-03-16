'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { LogIn, Loader2 } from 'lucide-react'
import OAuthButtons from '@/components/oauth-buttons'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-8">
                        <img
                            src="/logo_pesa.jpg"
                            alt="PlotPesa Logo"
                            className="h-16 w-auto object-contain mx-auto"
                        />
                    </Link>
                    <h2 className="text-3xl font-black text-pesa-green">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-500 font-medium">Sign in to access your PlotPesa account</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pesa-green focus:bg-white rounded-xl outline-none transition-all font-medium"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Password
                                </label>
                                <Link href="/auth/forgot-password" className="text-[10px] font-black text-pesa-gold hover:text-pesa-green transition-colors uppercase tracking-widest">
                                    Recover Access
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pesa-green focus:bg-white rounded-xl outline-none transition-all font-medium"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-pesa-green hover:opacity-90 text-white font-black rounded-xl shadow-lg shadow-pesa-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-pesa-gold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <LogIn className="h-6 w-6" />
                                    Sign In to Portal
                                </>
                            )}
                        </button>
                        
                        <div className="mt-8">
                            <OAuthButtons />
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-sm text-gray-500 font-medium font-medium">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="font-black text-pesa-green hover:text-pesa-gold transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
