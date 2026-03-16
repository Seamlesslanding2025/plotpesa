
-- Create Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plot_id UUID REFERENCES public.plots(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    buyer_name TEXT,
    buyer_email TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'negotiating', 'closed_won', 'closed_lost')),
    seller_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for Inquiries
CREATE POLICY "Buyers can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can view own inquiries" ON public.inquiries FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view inquiries for their plots" ON public.inquiries FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.plots WHERE id = inquiries.plot_id AND user_id = auth.uid())
);
CREATE POLICY "Sellers can update inquiries for their plots" ON public.inquiries FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.plots WHERE id = inquiries.plot_id AND user_id = auth.uid())
);

-- Policies for Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Database Function to Auto-Create Notification on Inquiry
CREATE OR REPLACE FUNCTION public.handle_new_inquiry()
RETURNS TRIGGER AS $$
DECLARE
    plot_owner_id UUID;
    plot_title TEXT;
BEGIN
    -- Get plot details
    SELECT user_id, title INTO plot_owner_id, plot_title
    FROM public.plots
    WHERE id = NEW.plot_id;

    -- Insert Notification
    IF plot_owner_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, title, message, type, link)
        VALUES (
            plot_owner_id,
            'New Inquiry Received',
            'You have a new inquiry for ' || plot_title || ' from ' || COALESCE(NEW.buyer_name, 'a buyer'),
            'inquiry',
            '/dashboard/seller/inquiries'
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Auto-Notification
DROP TRIGGER IF EXISTS on_inquiry_created ON public.inquiries;
CREATE TRIGGER on_inquiry_created
AFTER INSERT ON public.inquiries
FOR EACH ROW EXECUTE FUNCTION public.handle_new_inquiry();
