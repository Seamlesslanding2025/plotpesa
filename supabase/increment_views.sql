-- Function to increment plot view count
CREATE OR REPLACE FUNCTION increment_view_count(plot_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE plots
    SET view_count = view_count + 1
    WHERE id = plot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
