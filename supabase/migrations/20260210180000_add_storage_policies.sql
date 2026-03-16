-- Storage Bucket Policies for plot-images

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'plot-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'plot-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'plot-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all images in plot-images bucket
CREATE POLICY "Public can view all images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'plot-images');
