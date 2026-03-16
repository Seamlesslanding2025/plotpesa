-- PERFORMANCE INDEXES (Phase 3)
-- Optimizes queries for filters used in the /plots Marketplace hub.

-- Index for County filtering
CREATE INDEX IF NOT EXISTS idx_plots_county ON public.plots (county);

-- Index for Price-based queries (KES)
CREATE INDEX IF NOT EXISTS idx_plots_price_kes ON public.plots (price_kes);

-- Index for Status (usually used with 'published')
CREATE INDEX IF NOT EXISTS idx_plots_status ON public.plots (status);

-- Index for Transaction Type (Buy, Lease, JV, Swap)
CREATE INDEX IF NOT EXISTS idx_plots_transaction_type ON public.plots (transaction_type);

-- Composite index for the most common search pattern (published assets by county + date)
CREATE INDEX IF NOT EXISTS idx_plots_published_county_date ON public.plots (status, county, created_at DESC) 
WHERE status = 'published';

COMMENT ON INDEX public.idx_plots_published_county_date IS 'Optimizes primary marketplace queries for verified assets.';
