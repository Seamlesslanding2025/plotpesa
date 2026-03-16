-- Create wanted_listings table for buyer search alerts
CREATE TABLE IF NOT EXISTS wanted_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    counties TEXT[] NOT NULL, -- Array of county names
    min_price_kes BIGINT,
    max_price_kes BIGINT,
    min_size_acres DECIMAL(10,2),
    max_size_acres DECIMAL(10,2),
    plot_type TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE wanted_listings ENABLE ROW LEVEL SECURITY;

-- Users can view their own wanted listings
CREATE POLICY "Users can view own wanted listings"
    ON wanted_listings FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create their own wanted listings
CREATE POLICY "Users can create wanted listings"
    ON wanted_listings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own wanted listings
CREATE POLICY "Users can update own wanted listings"
    ON wanted_listings FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own wanted listings
CREATE POLICY "Users can delete own wanted listings"
    ON wanted_listings FOR DELETE
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wanted_listings_user_id ON wanted_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_wanted_listings_active ON wanted_listings(is_active) WHERE is_active = true;
