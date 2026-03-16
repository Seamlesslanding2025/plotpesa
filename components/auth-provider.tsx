
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { Database } from '@/types/supabase'
import { Session, User } from '@supabase/supabase-js'

type ContextType = {
    session: Session | null
    user: User | null
    profile: Database['public']['Tables']['users_profile']['Row'] | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<ContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = createClient()
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Database['public']['Tables']['users_profile']['Row'] | null>(
        null
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setSession(session)
            setUser(session?.user ?? null)
            if (session?.user) {
                await fetchProfile(session.user.id)
            }

            // Only set loading to false after initial check
            setLoading(false)
        }
        initAuth()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                // If user signs in, we might want to show loading again briefly or just fetch background
                // setLoading(true) 
                await fetchProfile(session.user.id)
                // setLoading(false)
            } else {
                setProfile(null)
            }

            router.refresh()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router, supabase])

    const fetchProfile = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('users_profile')
                .select('*')
                .eq('id', userId)
                .single()
            setProfile(data)
        } catch (error) {
            console.error('Error fetching profile', error)
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        setProfile(null)
        router.push('/')
        router.refresh()
    }

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
