'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Loader2, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        // In Supabase, the hash contains the access_token. 
        // The auth listener automatically sets the session.
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                // If there's no session, the link might be invalid or expired
                // setError("Invalid or expired recovery link. Please request a new one.")
            }
        }
        checkSession()
    }, [supabase])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.")
            return
        }

        setLoading(true)
        setError(null)

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            })

            if (updateError) throw updateError

            setSuccess(true)
            
            // Redirect after 3 seconds
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
            
        } catch (err: any) {
            setError(err.message || 'Failed to update password. Link may be expired.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-pesa-subtle flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/">
                        <img src="/logo_pesa.jpg" alt="PlotPesa Logo" className="h-10 mx-auto rounded-xl shadow-sm border border-pesa-border" />
                    </Link>
                </div>

                <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-pesa-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pesa-green/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    
                    <h1 className="text-2xl font-black text-pesa-green mb-2 tracking-tight">Set New Password</h1>
                    <p className="text-gray-500 font-medium mb-8 text-sm leading-relaxed">
                        Secure your PlotPesa account with a new, strong password.
                    </p>

                    {success ? (
                        <div className="bg-pesa-subtle p-6 rounded-2xl text-center border-l-4 border-pesa-green animate-in fade-in zoom-in">
                            <CheckCircle2 className="h-12 w-12 text-pesa-green mx-auto mb-4" />
                            <h3 className="font-black text-pesa-green text-lg mb-2">Password Secured</h3>
                            <p className="text-sm text-gray-600 font-medium">
                                Your account is now active with the new credentials. Diverting to Dashboard...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 shadow-sm animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="h-5 w-5 text-pesa-green" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-pesa-subtle border-transparent focus:bg-white focus:border-pesa-green focus:ring-4 focus:ring-pesa-green/10 rounded-xl text-gray-900 font-bold transition-all outline-none shadow-inner"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 ml-1">Min. 8 Chars, Mixed Case required</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-12 pr-4 py-4 bg-pesa-subtle border-transparent focus:bg-white focus:border-pesa-green focus:ring-4 focus:ring-pesa-green/10 rounded-xl text-gray-900 font-bold transition-all outline-none shadow-inner"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !password || !confirmPassword}
                                className="w-full mt-2 flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-xl text-sm font-black text-white bg-pesa-green hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-pesa-gold"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    'Update Credentials'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
