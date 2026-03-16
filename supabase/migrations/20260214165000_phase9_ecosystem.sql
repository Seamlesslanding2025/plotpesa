-- Phase 9: Holistic Land Ecosystem Migration

-- 1. Add 'swap' to Transaction Type Enum
DO $$ BEGIN
    ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'swap';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Land Status Enum
DO $$ BEGIN
    CREATE TYPE land_status AS ENUM ('vacant', 'redevelopment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Update Plots Table
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS land_status land_status DEFAULT 'vacant',
ALTER COLUMN price_kes DROP NOT NULL;

-- 4. Enable RLS or Policy updates if needed (using existing ones)
-- Note: price_kes being nullable allows for Swap listings without a fixed cash price.
