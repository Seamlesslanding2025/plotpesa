-- Add documents jsonb column to plots table
ALTER TABLE public.plots 
ADD COLUMN IF NOT EXISTS documents jsonb;

-- Ensure RLS allows the new column to be inserted/updated (inherited from table policies)
-- The existing policies for "Owners create plots" and "Admins update all plots" 
-- will automatically cover this new column.

COMMENT ON COLUMN public.plots.documents IS 'Array of URLs for Title Deed, Deed Plan etc.';
