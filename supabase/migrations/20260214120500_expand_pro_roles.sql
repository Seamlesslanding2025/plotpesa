-- Add new roles to user_role enum
-- Note: PostgreSQL doesn't support adding to enums in a transaction easily if used in tables, 
-- but since these are new, we can alter type.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'lawyer'; -- Already added in previous conversation logic but ensuring here
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'estate_agent'; -- Generalizing agent
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'land_company';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'valuer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'surveyor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'architect';

-- Add new document types to document_type enum
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'lsk_certificate';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'earb_license';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'valuation_license';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'survey_license';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'architect_license';
ALTER TYPE document_type ADD VALUE IF NOT EXISTS 'deed_plan';
