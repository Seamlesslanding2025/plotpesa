-- =============================================
-- PHASE 3: CRM & NOTIFICATION ENGINE SCHEMA
-- =============================================

-- Step 1: Inquiry Status Enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
        CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'negotiating', 'closed_won', 'closed_lost');
    END IF;
END $$;

-- Step 2: Add Status and Notes to Inquiries
ALTER TABLE inquiries 
ADD COLUMN IF NOT EXISTS status inquiry_status DEFAULT 'new',
ADD COLUMN IF NOT EXISTS seller_notes text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Step 3: Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users_profile(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'match' NOT NULL, -- 'match', 'system', 'payment'
  link text, -- Link to relevant plot or dashboard
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 4: Enable RLS on Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Step 5: Notifications RLS Policies
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Step 6: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_inquiries_seller_status ON public.inquiries(plot_id, status);
