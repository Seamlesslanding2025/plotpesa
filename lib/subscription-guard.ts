import { createClient } from './supabase/server'

export type SubscriptionTier = 'free' | 'standard' | 'premium'

export const TIER_LIMITS: Record<SubscriptionTier, number> = {
    free: 1,
    standard: 5,
    premium: Infinity
}

export async function checkSubscriptionLimit(userId: string) {
    const supabase = await createClient()

    // 1. Get User Profile (Tier)
    const { data: profile, error: profileError } = await (supabase
        .from('users_profile')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', userId)
        .single())

    if (profileError || !profile) return { allowed: false, error: 'User profile not found' }

    const userProfile = profile as any
    // 2. Check if subscription is expired (if not free)
    if (userProfile.subscription_tier !== 'free' && userProfile.subscription_expires_at) {
        if (new Date(userProfile.subscription_expires_at) < new Date()) {
            return {
                allowed: false,
                reason: 'subscription_expired',
                limit: TIER_LIMITS.free,
                error: 'Your subscription has expired. Please renew to continue.'
            }
        }
    }

    const tier = (userProfile.subscription_tier as SubscriptionTier) || 'free'
    const limit = TIER_LIMITS[tier]

    // 3. Count published/pending listings
    const { count, error: countError } = await supabase
        .from('plots')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['published', 'pending_verification'])

    if (countError) return { allowed: false, error: 'Failed to check listing count' }

    const currentCount = count || 0

    return {
        allowed: currentCount < limit,
        currentCount,
        limit,
        tier,
        remaining: limit - currentCount
    }
}
