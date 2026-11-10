/*
# Optimize profiles RLS policies (auth_rls_initplan fix)

## Purpose
The Supabase database linter flagged 3 WARN-level performance findings on the
profiles table: the RLS policies for SELECT, INSERT, and UPDATE re-evaluate
`auth.uid()` for every row scanned, producing suboptimal query performance at
scale. This migration rewrites those policies to use `(select auth.uid())`,
which Postgres treats as an "initialization plan" — evaluated once per query
instead of once per row.

## Modified Tables
### profiles
- `select_own_profile` — rewritten: `auth.uid()` → `(select auth.uid())`
- `insert_own_profile` — rewritten: `auth.uid()` → `(select auth.uid())`
- `update_own_profile` — rewritten: both USING and WITH CHECK updated

## Security
- No change to access control logic — the ownership check is identical, only
  the evaluation strategy changes.
- RLS remains enabled. Grants are unchanged.

## Important Notes
1. This is a performance-only optimization recommended by Supabase docs:
   https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
2. The 6 unused-index INFO findings and the auth-connection INFO finding are
   informational and not actionable via migration — they are left as-is.
*/

-- SELECT: optimize auth.uid() evaluation
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated USING ((select auth.uid()) = id);

-- INSERT: optimize auth.uid() evaluation
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated WITH CHECK ((select auth.uid()) = id);

-- UPDATE: optimize auth.uid() evaluation (both USING and WITH CHECK)
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);