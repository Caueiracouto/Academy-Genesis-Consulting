/*
# Add admin role to profiles and lock course_sessions writes to admins

## Purpose
Allow an administrator to manage the training calendar (insert, update, delete
course sessions) while keeping that ability restricted to admin users only.
Regular authenticated users and anonymous visitors can still READ the calendar.

## Modified Tables

### profiles
- Added `role` (text, default 'member') — user role: 'admin' or 'member'.
  Existing profiles get 'member' automatically.

### course_sessions
- Tightened INSERT / UPDATE / DELETE policies: now restricted to authenticated
  users whose profile role is 'admin'. Previously any authenticated user could
  write — that was a placeholder left open during development.
- anon SELECT remains public so visitors can see the calendar.

## New Functions

### is_admin()
- SECURITY DEFINER function that returns true if the calling user's profile
  has role = 'admin'. Used by RLS policies to check admin status.

## Security
- profiles.role column is NOT writable by users (column-level privilege revoked).
  Only an admin or the database can change a role — there is no client-side path.
- course_sessions write policies now require is_admin() == true.
- The is_admin() function runs as owner (SECURITY DEFINER) and is callable by
  authenticated users (needed for RLS policy evaluation).

## Important Notes
1. To make a user an admin, run manually in SQL:
   UPDATE profiles SET role = 'admin' WHERE email = 'admin@example.com';
2. The role column has no default path for self-promotion — a user cannot make
   themselves admin through the app.
3. Existing course_sessions rows are unaffected — only future writes are gated.
*/

-- Add role column to profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text NOT NULL DEFAULT 'member';
  END IF;
END $$;

-- Revoke client ability to write the role column
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, phone, cpf, address, cep, avatar_url) ON profiles TO authenticated;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Allow authenticated users to call is_admin (needed for RLS policies)
REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Tighten course_sessions write policies to admin-only
DROP POLICY IF EXISTS "auth_insert_sessions" ON course_sessions;
CREATE POLICY "admin_insert_sessions"
  ON course_sessions FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_update_sessions" ON course_sessions;
CREATE POLICY "admin_update_sessions"
  ON course_sessions FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "auth_delete_sessions" ON course_sessions;
CREATE POLICY "admin_delete_sessions"
  ON course_sessions FOR DELETE
  TO authenticated USING (is_admin());

-- Index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);