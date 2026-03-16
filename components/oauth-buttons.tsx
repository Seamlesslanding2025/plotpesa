'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function OAuthButtons() {
    const supabase = createClient()
    const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleOAuthLogin = async (provider: 'google' | 'azure' | 'apple' | 'facebook') => {
        setLoadingProvider(provider)
        setError(null)
        
        try {
            const { error } = await (supabase.auth as any).signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            })

            if (error) throw error
            
        } catch (err: any) {
            setError(err.message)
            setLoadingProvider(null)
        }
    }

    return (
        <div className="w-full space-y-4">
            {error && (
                <div className="text-sm font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 mb-4 text-center">
                    {error}
                </div>
            )}
            
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        Or continue with
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                    onClick={() => handleOAuthLogin('google')}
                    disabled={loadingProvider !== null}
                    type="button"
                    className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {loadingProvider === 'google' ? (
                        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></span>
                    ) : (
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    )}
                    Google
                </button>

                <button
                    onClick={() => handleOAuthLogin('azure')}
                    disabled={loadingProvider !== null}
                    type="button"
                    className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {loadingProvider === 'azure' ? (
                        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></span>
                    ) : (
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21">
                            <path fill="#f25022" d="M1 1h9v9H1z"/>
                            <path fill="#00a4ef" d="M1 11h9v9H1z"/>
                            <path fill="#7fba00" d="M11 1h9v9h-9z"/>
                            <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                        </svg>
                    )}
                    Microsoft
                </button>

                <button
                    onClick={() => handleOAuthLogin('apple')}
                    disabled={loadingProvider !== null}
                    type="button"
                    className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {loadingProvider === 'apple' ? (
                        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></span>
                    ) : (
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M17.05 20.28c-.96.95-2.04 1.96-3.41 1.96-1.34 0-1.78-.82-3.32-.82-1.55 0-2.04.8-3.32.82-1.28 0-2.48-1.09-3.41-2.01-1.95-1.92-3.47-5.41-3.47-8.68 0-5.32 3.44-8.13 6.69-8.13 1.7 0 3.32.96 4.37.96 1.05 0 2.97-1.16 4.97-.96 1.28.05 4.88.51 6.55 3.12-2.73 1.6-2.29 5.39.46 6.51-1.28 3.12-3.13 6.31-4.11 7.23zM12.03 4.37C11.66 2.01 13.62.24 15.68.12c.26 2.37-1.89 4.54-3.65 4.25z"/>
                        </svg>
                    )}
                    Apple
                </button>

                <button
                    onClick={() => handleOAuthLogin('facebook')}
                    disabled={loadingProvider !== null}
                    type="button"
                    className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    {loadingProvider === 'facebook' ? (
                        <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></span>
                    ) : (
                        <svg className="w-5 h-5 mr-3 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    )}
                    Facebook
                </button>
            </div>
        </div>
    )
}
