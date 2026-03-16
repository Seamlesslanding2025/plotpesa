
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            users_profile: {
                Row: {
                    id: string
                    role: 'owner' | 'agent' | 'buyer' | 'admin'
                    full_name: string | null
                    phone: string | null
                    company_name: string | null
                    is_verified: boolean
                    verified_agent_badge: boolean
                    subscription_tier: 'free' | 'standard' | 'premium'
                    subscription_expires_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    role?: 'owner' | 'agent' | 'buyer' | 'admin'
                    full_name?: string | null
                    phone?: string | null
                    company_name?: string | null
                    is_verified?: boolean
                    verified_agent_badge?: boolean
                    subscription_tier?: 'free' | 'standard' | 'premium'
                    subscription_expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    role?: 'owner' | 'agent' | 'buyer' | 'admin'
                    full_name?: string | null
                    phone?: string | null
                    company_name?: string | null
                    is_verified?: boolean
                    verified_agent_badge?: boolean
                    subscription_tier?: 'free' | 'standard' | 'premium'
                    subscription_expires_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        plots: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    plot_type: 'residential' | 'commercial' | 'agricultural'
                    county: string
                    location_details: string | null
                    size_acres: number | null
                    price_kes: number
                    contact_phone: string | null
                    contact_whatsapp: string | null
                    latitude: number | null
                    longitude: number | null
                    status: 'draft' | 'pending_verification' | 'published' | 'sold' | 'expired'
                    is_featured: boolean
                    view_count: number
                    images: Json | null
                    created_at: string
                    updated_at: string
                    expires_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    plot_type: 'residential' | 'commercial' | 'agricultural'
                    county: string
                    location_details?: string | null
                    size_acres?: number | null
                    price_kes: number
                    contact_phone?: string | null
                    contact_whatsapp?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    status?: 'draft' | 'pending_verification' | 'published' | 'sold' | 'expired'
                    is_featured?: boolean
                    view_count?: number
                    images?: Json | null
                    created_at?: string
                    updated_at?: string
                    expires_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    plot_type?: 'residential' | 'commercial' | 'agricultural'
                    county?: string
                    location_details?: string | null
                    size_acres?: number | null
                    price_kes?: number
                    contact_phone?: string | null
                    contact_whatsapp?: string | null
                    latitude?: number | null
                    longitude?: number | null
                    status?: 'draft' | 'pending_verification' | 'published' | 'sold' | 'expired'
                    is_featured?: boolean
                    view_count?: number
                    images?: Json | null
                    created_at?: string
                    updated_at?: string
                    expires_at?: string | null
                }
            }
            documents: {
                Row: {
                    id: string
                    user_id: string
                    plot_id: string | null
                    document_type: 'title_deed' | 'survey_map' | 'agent_license' | 'registration_cert'
                    file_url: string
                    file_name: string | null
                    verification_status: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes: string | null
                    reviewed_by: string | null
                    reviewed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plot_id?: string | null
                    document_type: 'title_deed' | 'survey_map' | 'agent_license' | 'registration_cert'
                    file_url: string
                    file_name?: string | null
                    verification_status?: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plot_id?: string | null
                    document_type?: 'title_deed' | 'survey_map' | 'agent_license' | 'registration_cert'
                    file_url?: string
                    file_name?: string | null
                    verification_status?: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    reviewed_by?: string | null
                    reviewed_at?: string | null
                    created_at?: string
                }
            }
            wanted_listings: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    plot_type: string | null
                    counties: string[]
                    min_price_kes: number | null
                    max_price_kes: number | null
                    min_size_acres: number | null
                    max_size_acres: number | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    plot_type?: string | null
                    counties: string[]
                    min_price_kes?: number | null
                    max_price_kes?: number | null
                    min_size_acres?: number | null
                    max_size_acres?: number | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    plot_type?: string | null
                    counties?: string[]
                    min_price_kes?: number | null
                    max_price_kes?: number | null
                    min_size_acres?: number | null
                    max_size_acres?: number | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string
                    type: string
                    link: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: string
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
            }
            inquiries: {
                Row: {
                    id: string
                    plot_id: string
                    buyer_id: string
                    message: string
                    buyer_name: string
                    buyer_email: string
                    created_at: string
                    status: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost'
                    seller_notes: string | null
                }
                Insert: {
                    id?: string
                    plot_id: string
                    buyer_id: string
                    message: string
                    buyer_name: string
                    buyer_email: string
                    created_at?: string
                    status?: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost'
                    seller_notes?: string | null
                }
                Update: {
                    id?: string
                    plot_id?: string
                    buyer_id?: string
                    message?: string
                    buyer_name?: string
                    buyer_email?: string
                    created_at?: string
                    status?: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost'
                    seller_notes?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'owner' | 'agent' | 'buyer' | 'admin'
            plot_type: 'residential' | 'commercial' | 'agricultural'
            plot_status: 'draft' | 'pending_verification' | 'published' | 'sold' | 'expired'
            document_type: 'title_deed' | 'survey_map' | 'agent_license' | 'registration_cert'
            verification_status: 'pending' | 'under_review' | 'approved' | 'rejected'
            subscription_tier: 'free' | 'standard' | 'premium'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
