-- =============================================
-- NOTIFICATION ENGINE: MATCH TRIGGER LOGIC
-- =============================================

-- 1. Matching Function
CREATE OR REPLACE FUNCTION public.fn_match_and_notify_buyers()
RETURNS TRIGGER AS $$
DECLARE
    matching_record RECORD;
BEGIN
    -- Only trigger when status changes to 'published'
    IF (NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published')) THEN
        
        -- Loop through active wanted listings that match this plot
        FOR matching_record IN 
            SELECT DISTINCT user_id, id as wanted_id, title as wanted_title
            FROM wanted_listings
            WHERE is_active = true
              AND (counties @> ARRAY[NEW.county]::text[] OR counties = '{}')
              AND (min_price_kes IS NULL OR min_price_kes <= NEW.price_kes)
              AND (max_price_kes IS NULL OR max_price_kes >= NEW.price_kes)
              AND (min_size_acres IS NULL OR min_size_acres <= NEW.size_acres)
              AND (max_size_acres IS NULL OR max_size_acres >= NEW.size_acres)
              AND (plot_type IS NULL OR plot_type = NEW.plot_type OR plot_type = '')
        LOOP
            -- Insert Notification
            INSERT INTO public.notifications (
                user_id,
                title,
                message,
                type,
                link
            ) VALUES (
                matching_record.user_id,
                'Property Match Found! 🌟',
                'A new property matching your alert "' || matching_record.wanted_title || '" has been verified in ' || NEW.county || '.',
                'match',
                '/plots/' || NEW.id
            );
        END LOOP;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach Trigger to Plots Table
DROP TRIGGER IF EXISTS tr_match_on_publish ON public.plots;
CREATE TRIGGER tr_match_on_publish
AFTER UPDATE ON public.plots
FOR EACH ROW
EXECUTE FUNCTION public.fn_match_and_notify_buyers();

-- 3. Also trigger on initial INSERT if status is already published
DROP TRIGGER IF EXISTS tr_match_on_insert ON public.plots;
CREATE TRIGGER tr_match_on_insert
AFTER INSERT ON public.plots
FOR EACH ROW
EXECUTE FUNCTION public.fn_match_and_notify_buyers();
