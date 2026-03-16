# Database & Storage Setup Instructions

## Run this SQL in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `SETUP_DATABASE.sql`
5. Click **Run** or press `Ctrl+Enter`

## Create Storage Bucket for Images

1. In Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name it: `plot-images`
4. Make it **Public** (check the box)
5. Click **Create Bucket**

## Set Storage Policies

After creating the bucket, click on it and go to **Policies**, then add:

```sql
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
```

## Verify Setup

- Table `wanted_listings` should appear in **Table Editor**
- `plots` table should have `images` and `documents` columns
- `plot-images` bucket should be visible in **Storage**

Then refresh your PlotPesa app!
