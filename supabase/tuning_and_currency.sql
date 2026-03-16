-- =============================================
-- PERFORMANCE TUNING & MULTI-CURRENCY SCHEMA
-- =============================================

-- Step 1: Add Currency Support
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'currency_type') THEN
        CREATE TYPE currency_type AS ENUM ('KES', 'USD', 'EUR');
    END IF;
END $$;

-- Step 2: Update plots table
ALTER TABLE plots 
ADD COLUMN IF NOT EXISTS currency currency_type DEFAULT 'KES';

-- Step 3: Update wanted_listings table
ALTER TABLE wanted_listings 
ADD COLUMN IF NOT EXISTS currency currency_type DEFAULT 'KES';

-- Step 4: Create Critical Performance Indexes
-- Index for published status (most common query filter)
CREATE INDEX IF NOT EXISTS idx_plots_status_published ON plots(status) WHERE status = 'published';

-- Index for county searches
CREATE INDEX IF NOT EXISTS idx_plots_county ON plots(county);

-- Composite index for price filtering within a county
CREATE INDEX IF NOT EXISTS idx_plots_county_price ON plots(county, price_kes);

-- Index for sorting by newest
CREATE INDEX IF NOT EXISTS idx_plots_created_at_desc ON plots(created_at DESC);

-- Index for wanted listings monitoring
CREATE INDEX IF NOT EXISTS idx_wanted_listings_active_monitoring ON wanted_listings(is_active, created_at DESC) WHERE is_active = true;

-- Step 5: Optimization for Stats counting
CREATE INDEX IF NOT EXISTS idx_plots_status_county ON plots(status, county);
