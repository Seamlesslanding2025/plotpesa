-- Phase 6: Structural Refinement Migration

-- 1. Expand User Roles Enum
-- Since PostgreSQL doesn't allow ALTER TYPE ... ADD VALUE inside a transaction block easily,
-- and we want to ensure roles are distinct.
DO $$ BEGIN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'property_owner';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'estate_agent';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'land_company';
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'lawyer';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Transaction Type Enum
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('outright_purchase', 'lease', 'joint_venture');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Update Plots Table
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS transaction_type transaction_type DEFAULT 'outright_purchase',
ADD COLUMN IF NOT EXISTS has_title_deed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS has_deed_plan boolean DEFAULT false;

-- 4. Enable Lawyer Subscription Table
CREATE TABLE IF NOT EXISTS public.lawyer_profiles (
    id uuid REFERENCES public.users_profile(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
    firm_name text,
    law_society_no text,
    office_location text,
    bio text,
    specialties text[],
    is_panel_verified boolean DEFAULT false,
    subscription_status payment_status DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS for Lawyer Profiles
CREATE POLICY "Legal directory is public" ON public.lawyer_profiles
    FOR SELECT USING (is_panel_verified = true);

CREATE POLICY "Lawyers can update own profile" ON public.lawyer_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 5. Link documents to professional verification
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS is_professional_cert boolean DEFAULT false;
