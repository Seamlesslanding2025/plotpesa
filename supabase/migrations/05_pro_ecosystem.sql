-- Phase 4: Professional Ecosystem Migration

-- 1. Service Leads Table
CREATE TABLE IF NOT EXISTS public.service_leads (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users_profile(id),
    service_type text NOT NULL, -- 'valuation', 'surveying', 'architectural', 'eia', 'legal'
    full_name text NOT NULL,
    phone text NOT NULL,
    location text,
    message text,
    status text DEFAULT 'pending', -- 'pending', 'contacted', 'closed'
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.service_leads ENABLE ROW LEVEL SECURITY;

-- RLS for Service Leads
CREATE POLICY "Users can create leads" ON public.service_leads
    FOR INSERT WITH CHECK (true); -- Allow guest/logged-in lead creation

CREATE POLICY "Professionals can view relevant leads" ON public.service_leads
    FOR SELECT USING (
        EXISTS (
            select 1 from public.users_profile
            where id = auth.uid() 
            and (
                (role @> ARRAY['lawyer']::text[] AND service_type = 'legal') OR
                (role @> ARRAY['eia_expert']::text[] AND service_type = 'eia') OR
                (role @> ARRAY['surveyor']::text[] AND service_type = 'surveying') OR
                (role @> ARRAY['architect']::text[] AND service_type = 'architectural') OR
                (role @> ARRAY['valuer']::text[] AND service_type = 'valuation') OR
                (role @> ARRAY['admin']::text[])
            )
        )
    );

-- 2. Professional Profile Tables
CREATE TABLE IF NOT EXISTS public.eia_profiles (
    id uuid REFERENCES public.users_profile(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    license_no text,
    firm_name text,
    bio text,
    is_panel_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.surveyor_profiles (
    id uuid REFERENCES public.users_profile(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    license_no text,
    firm_name text,
    bio text,
    is_panel_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.architect_profiles (
    id uuid REFERENCES public.users_profile(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    license_no text,
    firm_name text,
    bio text,
    is_panel_verified boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.eia_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveyor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architect_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "EIA profiles public view" ON public.eia_profiles FOR SELECT USING (is_panel_verified = true);
CREATE POLICY "EIA profiles own update" ON public.eia_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Surveyor profiles public view" ON public.surveyor_profiles FOR SELECT USING (is_panel_verified = true);
CREATE POLICY "Surveyor profiles own update" ON public.surveyor_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Architect profiles public view" ON public.architect_profiles FOR SELECT USING (is_panel_verified = true);
CREATE POLICY "Architect profiles own update" ON public.architect_profiles FOR UPDATE USING (auth.uid() = id);
