-- Add EIA Expert to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'eia_expert';

-- Add EIA License to document_type enum
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'eia_license';
