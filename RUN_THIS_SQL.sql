-- =============================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- =============================================

-- Step 1: Add listing_type and images columns to plots table
ALTER TABLE plots 
ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'sale' CHECK (listing_type IN ('sale', 'joint_venture', 'long_term_lease')),
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS documents TEXT[];

-- Step 2: Create wanted_listings table
CREATE TABLE IF NOT EXISTS wanted_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    counties TEXT[] NOT NULL,
    min_price_kes BIGINT,
    max_price_kes BIGINT,
    min_size_acres DECIMAL(10,2),
    max_size_acres DECIMAL(10,2),
    plot_type TEXT,
    listing_type TEXT DEFAULT 'sale' CHECK (listing_type IN ('sale', 'joint_venture', 'long_term_lease')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable RLS on wanted_listings
ALTER TABLE wanted_listings ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for wanted_listings
DROP POLICY IF EXISTS "Users can view own wanted listings" ON wanted_listings;
DROP POLICY IF EXISTS "Users can create wanted listings" ON wanted_listings;
DROP POLICY IF EXISTS "Users can update own wanted listings" ON wanted_listings;
DROP POLICY IF EXISTS "Users can delete own wanted listings" ON wanted_listings;

CREATE POLICY "Users can view own wanted listings" 
    ON wanted_listings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create wanted listings" 
    ON wanted_listings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wanted listings" 
    ON wanted_listings FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wanted listings" 
    ON wanted_listings FOR DELETE 
    USING (auth.uid() = user_id);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_wanted_listings_user_id ON wanted_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_wanted_listings_active ON wanted_listings(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_plots_listing_type ON plots(listing_type);

-- =============================================
-- STORAGE BUCKET SETUP (Do this in Supabase Storage UI)
-- =============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create new bucket named: plot-images
-- 3. Make it PUBLIC
-- 4. Then run these policies in SQL Editor:

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'plot-images');

-- Allow public to view images  
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'plot-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'plot-images' AND (storage.foldername(name))[1] = auth.uid()::text);
