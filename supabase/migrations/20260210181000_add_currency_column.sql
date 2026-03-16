-- Add currency column to plots table

ALTER TABLE plots 
ADD COLUMN currency TEXT DEFAULT 'KES' CHECK (currency IN ('KES', 'USD', 'EUR'));

-- Update existing records to have KES as default
UPDATE plots 
SET currency = 'KES' 
WHERE currency IS NULL;
