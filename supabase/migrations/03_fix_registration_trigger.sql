-- ROBUST REGISTRATION TRIGGER
-- This handles the transition from string 'role' to text[] array
-- and ensures metadata from auth.signUp is correctly persisted.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' IS NOT NULL 
      THEN ARRAY[NEW.raw_user_meta_data->>'role']::text[]
      ELSE ARRAY['buyer']::text[]
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = COALESCE(EXCLUDED.full_name, users_profile.full_name),
    role = COALESCE(EXCLUDED.role, users_profile.role),
    updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is attached to auth.users
-- This requires high-level permissions usually, but standard for local/migration dev.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Auto-creates a public profile when a new user signs up via Supabase Auth.';
