'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            })

            if (resetError) throw resetError

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-pesa-subtle flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Back */}
                <div className="mb-8 text-center">
                    <Link href="/auth/login" className="inline-flex items-center text-xs font-black text-gray-500 hover:text-pesa-green uppercase tracking-widest mb-6 transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                    </Link>
                    <Link href="/">
                        <img src="/logo_pesa.jpg" alt="PlotPesa Logo" className="h-10 mx-auto rounded-xl shadow-sm border border-pesa-border" />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-pesa-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-green/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <h1 className="text-2xl font-black text-pesa-green mb-2 tracking-tight">Account Recovery</h1>
                    <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">
                        Enter the email address associated with your PlotPesa portal account, and we'll send you a secure recovery link.
                    </p>

                    {success ? (
                        <div className="bg-pesa-subtle p-6 rounded-2xl text-center border-l-4 border-pesa-green">
                            <CheckCircle2 className="h-12 w-12 text-pesa-green mx-auto mb-4" />
                            <h3 className="font-black text-pesa-green text-lg mb-2">Recovery Link Dispatched</h3>
                            <p className="text-sm text-gray-600 font-medium font-mono text-xs">{email}</p>
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                                Please check your inbox and spam folder. The link will expire in 15 minutes for security purposes.
                            </p>
                            <Link href="/auth/login" className="mt-6 inline-block w-full py-4 rounded-xl border-2 border-pesa-green text-pesa-green font-black uppercase tracking-widest text-xs hover:bg-pesa-green/5 transition-all">
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                    Registered Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-pesa-subtle border-transparent focus:bg-white focus:border-pesa-green focus:ring-4 focus:ring-pesa-green/10 rounded-xl text-gray-900 font-bold transition-all outline-none shadow-inner"
                                        placeholder="johndoe@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-xl text-sm font-black text-white bg-pesa-green hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed border-b-4 border-pesa-gold"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Dispatch Recovery Link'
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="mt-8 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <p>Protected by PlotPesa Security Framework</p>
                </div>
            </div>
        </div>
    )
}
