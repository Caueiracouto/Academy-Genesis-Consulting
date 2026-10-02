/*
# Create profiles table and add user_id to abandoned_carts

## Purpose
Support user authentication (email/password + Google/Outlook OAuth) for the Genesis Academy
checkout flow. When a user wants to finalize a purchase, they must sign in or create an
account. Their profile stores extra registration data (CPF, phone, address, CEP) that
Supabase Auth doesn't natively hold.

## New Tables

### profiles
- `id` (uuid, PK) — matches the user's auth.users id (1:1 relationship)
- `email` (text) — user's email (denormalized from auth.users for convenience)
- `full_name` (text, nullable) — full name from signup form
- `phone` (text, nullable) — phone/WhatsApp number
- `cpf` (text, nullable) — Brazilian CPF (individual taxpayer ID)
- `address` (text, nullable) — street address
- `cep` (text, nullable) — Brazilian postal code
- `avatar_url` (text, nullable) — OAuth provider avatar if available
- `created_at` (timestamptz) — when the profile was created
- `updated_at` (timestamptz) — last modification

## Modified Tables

### abandoned_carts
- Added `user_id` (uuid, nullable) — links a cart to an authenticated user.
  Existing anon carts remain with null user_id (no data loss).
  New carts created by logged-in users will have this populated.

## Security

### profiles
- RLS enabled.
- Each user can only SELECT, INSERT, UPDATE their own profile row (auth.uid() = id).
- No DELETE policy — profiles are never deleted from the frontend.
- Scoped to `TO authenticated` since only logged-in users interact with profiles.

### abandoned_carts
- RLS already enabled; policies updated to also work for authenticated users.
- No change to existing anon policies — they remain `TO anon, authenticated`.
- Added `user_id` column is nullable so existing carts are unaffected.

## Important Notes
1. Email confirmation is OFF — users can sign in immediately after signup.
2. Social providers (Google, Microsoft/Outlook) are configured in the Supabase dashboard.
3. The profile row is created automatically on first login via the frontend auth context.
4. CPF is stored as plain text (no validation at DB level) — validation is in the frontend.
5. The `id` column in profiles is NOT a default — it's set explicitly by the frontend
   to match auth.uid() after signup/login, because the INSERT must come from the
   authenticated client (the DEFAULT auth.uid() pattern is for tables where the client
   omits the owner column; here the profile id IS the user id and is always provided).
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  cpf text,
  address text,
  cep text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- profiles: SELECT own
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- profiles: INSERT own
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- profiles: UPDATE own
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Add user_id to abandoned_carts (nullable, no data loss)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'abandoned_carts' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE abandoned_carts ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index for profile lookups
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id ON abandoned_carts(user_id);