'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { UserPlus, Loader2 } from 'lucide-react'
import OAuthButtons from '@/components/oauth-buttons'

export default function Register() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [role, setRole] = useState<'buyer' | 'owner' | 'estate_agent' | 'land_company' | 'lawyer' | 'eia_expert'>('buyer')
    const [consent, setConsent] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!consent) {
            setError("You must agree to the Privacy Policy and Terms of Service to proceed.")
            return
        }
        if (password.length < 8 || !/(?=.*[a-z])/.test(password) || !/(?=.*[A-Z])/.test(password) || !/(?=.*\d)/.test(password)) {
            setError("Password must be at least 8 characters long, include uppercase, lowercase, and a number.")
            return
        }

        setLoading(true)
        setError(null)

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (authError) {
            setError(authError.message)
            setLoading(false)
            return
        }

        if (authData.user) {
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
                        Join PlotPesa
                    </h2>
                    <p className="mt-2 text-gray-500 font-medium">Create your account and start your land journey</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
                    {error && (
                        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Full Name
                            </label>
                            <input
                                id="full-name"
                                type="text"
                                required
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pesa-green focus:bg-white rounded-xl outline-none transition-all font-medium"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Email Address
                            </label>
                            <input
                                id="email"
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
                            <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                I am a...
                            </label>
                            <select
                                id="role"
                                required
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pesa-green focus:bg-white rounded-xl outline-none transition-all font-medium bg-white"
                                value={role}
                                onChange={(e) => setRole(e.target.value as any)}
                            >
                                <option value="buyer">🔍 Buyer (Looking for plots)</option>
                                <option value="owner">🏡 Homeowner (Selling own land)</option>
                                <option value="agent">💼 Registered Estate Agent</option>
                                <option value="owner">🏢 Land Development Company</option>
                                <option value="lawyer">⚖️ Lawyer / Solicitor</option>
                                <option value="owner">🌿 EIA / NEMA Expert</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="password" title="Encryption active">
                                <span className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Password</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pesa-green focus:bg-white rounded-xl outline-none transition-all font-medium"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {password && (
                                <div className="mt-2 flex items-center justify-between animate-in fade-in">
                                    <div className="flex gap-1 flex-1 max-w-[150px]">
                                        {[1, 2, 3, 4, 5].map(v => {
                                            let score = 0;
                                            if (password.length > 7) score++;
                                            if (/(?=.*[a-z])/.test(password)) score++;
                                            if (/(?=.*[A-Z])/.test(password)) score++;
                                            if (/(?=.*\d)/.test(password)) score++;
                                            if (/(?=.*[@$!%*?&])/.test(password)) score++;
                                            const color = score <= 2 ? 'bg-red-500' : (score <= 4 ? 'bg-yellow-500' : 'bg-pesa-green');
                                            const text = score <= 2 ? 'Weak' : (score <= 4 ? 'Good' : 'Strong');
                                            return (
                                                <div key={v} className={`h-1.5 flex-1 rounded-full ${v <= score ? color : 'bg-gray-200'}`}></div>
                                            );
                                        })}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        {[1, 2, 3, 4, 5].map(v => {
                                            let score = 0;
                                            if (password.length > 7) score++;
                                            if (/(?=.*[a-z])/.test(password)) score++;
                                            if (/(?=.*[A-Z])/.test(password)) score++;
                                            if (/(?=.*\d)/.test(password)) score++;
                                            if (/(?=.*[@$!%*?&])/.test(password)) score++;
                                            return score;
                                        }).pop()! <= 2 ? <span className="text-red-500">Weak</span> :
                                        [1, 2, 3, 4, 5].map(v => {
                                            let score = 0;
                                            if (password.length > 7) score++;
                                            if (/(?=.*[a-z])/.test(password)) score++;
                                            if (/(?=.*[A-Z])/.test(password)) score++;
                                            if (/(?=.*\d)/.test(password)) score++;
                                            if (/(?=.*[@$!%*?&])/.test(password)) score++;
                                            return score;
                                        }).pop()! <= 4 ? <span className="text-yellow-600">Good</span> :
                                        <span className="text-pesa-green">Strong</span>}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* DPA Consent Checkbox */}
                        <div className="flex items-start gap-3 p-4 bg-pesa-subtle/30 rounded-2xl border border-pesa-border/20">
                            <input
                                type="checkbox"
                                id="consent"
                                className="mt-1 h-5 w-5 rounded-lg accent-pesa-green cursor-pointer"
                                checked={consent}
                                onChange={(e) => setConsent(e.target.checked)}
                            />
                            <label htmlFor="consent" className="text-sm font-medium text-gray-600 leading-relaxed cursor-pointer">
                                I agree to the <Link href="/privacy" className="text-pesa-green font-bold underline">Privacy Policy</Link> and <Link href="/terms" className="text-pesa-green font-bold underline">Terms of Service</Link>. I understand that my data is protected under the Data Protection Act 2019.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-pesa-green hover:opacity-90 text-white font-black rounded-xl shadow-lg shadow-pesa-green/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-4 border-pesa-gold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="h-6 w-6" />
                                    Create My Account
                                </>
                            )}
                        </button>
                        
                        <div className="mt-8">
                            <OAuthButtons />
                        </div>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-sm text-gray-500 font-medium">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="font-black text-pesa-green hover:text-pesa-gold transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
