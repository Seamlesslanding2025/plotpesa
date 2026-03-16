-- Create Blog Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES users_profile(id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'market_insights', -- market_insights, legal_guides, area_spotlight
    featured_image TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public Read Access" ON blog_posts
    FOR SELECT USING (true);

CREATE POLICY "Admin All Access" ON blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users_profile
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
