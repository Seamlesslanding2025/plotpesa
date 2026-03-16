-- 1. Alter the user_role enum if you need to add the new professional roles that were added to the frontend
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'land_company';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'lawyer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'eia_expert';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'valuer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'surveyor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'architect';

-- 2. Convert the role column in users_profile to an array of text (or an array of user_role)
-- We must drop the default first before altering the type
ALTER TABLE public.users_profile ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.users_profile ALTER COLUMN role TYPE text[] USING ARRAY[role::text];
ALTER TABLE public.users_profile ALTER COLUMN role SET DEFAULT ARRAY['buyer']::text[];

-- 3. In the future, if you create a separate user_roles table for many-to-many relationship, run:
-- create table public.user_roles (
--   id uuid default gen_random_uuid() primary key,
--   user_id uuid references public.users_profile(id) on delete cascade not null,
--   role text not null,
--   unique(user_id, role)
-- );
-- insert into public.user_roles (user_id, role) 
-- select id, unnest(role) from public.users_profile;
-- But the text[] array approach on users_profile is the easiest and performs best for RLS.

-- No need to change RLS! Because most RLS policies currently look for "auth.uid() = user_id".
-- The Admin RLS policies might need an update to check if 'admin' = ANY(role):
-- example: where id = auth.uid() and 'admin' = ANY(role)
