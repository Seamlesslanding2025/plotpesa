
-- Enable RLS
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read 'published' plots
CREATE POLICY "Public profiles are viewable by everyone" 
ON plots FOR SELECT 
USING ( true );

-- Policy to allow authenticated users to insert their own plots
CREATE POLICY "Users can insert their own plots" 
ON plots FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

-- Policy to allow users to update their own plots
CREATE POLICY "Users can update own plots" 
ON plots FOR UPDATE 
USING ( auth.uid() = user_id );

-- Policy to allow users to delete their own plots
CREATE POLICY "Users can delete own plots" 
ON plots FOR DELETE 
USING ( auth.uid() = user_id );
