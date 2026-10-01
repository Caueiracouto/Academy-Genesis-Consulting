/*
# Create page_visits and abandoned_carts tables

## Purpose
Track visitors to the Genesis Academy site and capture leads from abandoned carts —
when a user adds a course to the cart but doesn't complete the purchase, their contact
details are saved so the sales team can follow up.

## New Tables

### 1. page_visits
- `id` (uuid, PK) — unique visit record
- `session_id` (text) — anonymous browser session identifier (stored in localStorage)
- `page_path` (text) — which page was visited (e.g. "/", "/treinamento/leading-safe")
- `course_slug` (text, nullable) — if the visit was a course detail page, which course
- `referrer` (text, nullable) — referring URL if available
- `created_at` (timestamptz) — when the visit happened

### 2. abandoned_carts
- `id` (uuid, PK) — unique cart record
- `session_id` (text) — anonymous browser session identifier
- `name` (text, nullable) — visitor's name if they started filling checkout
- `email` (text, nullable) — visitor's email if they started filling checkout
- `phone` (text, nullable) — visitor's phone if provided
- `company` (text, nullable) — visitor's company if provided
- `cart_items` (jsonb) — array of course slugs/titles that were in the cart
- `cart_total` (numeric, nullable) — total value of items in cart
- `status` (text) — 'abandoned' (default) or 'contacted' or 'converted'
- `created_at` (timestamptz) — when the cart was first created
- `updated_at` (timestamptz) — last time the cart was modified

## Security
- No-auth app (no sign-in screen). All policies use `TO anon, authenticated`.
- RLS enabled on both tables with 4 separate policies each.
- `USING (true)` is acceptable: data is intentionally writable by the anon frontend.

## Notes
1. No sign-in required. Visitors browse freely; we track page views and cart abandonment.
2. `session_id` is generated client-side (localStorage) — anonymous, not tied to auth.
3. Sales team can query abandoned_carts in Supabase to follow up with leads.
*/

CREATE TABLE IF NOT EXISTS page_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  course_slug text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  name text,
  email text,
  phone text,
  company text,
  cart_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cart_total numeric,
  status text NOT NULL DEFAULT 'abandoned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE abandoned_carts ENABLE ROW LEVEL SECURITY;

-- page_visits policies
DROP POLICY IF EXISTS "anon_select_page_visits" ON page_visits;
CREATE POLICY "anon_select_page_visits" ON page_visits FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_page_visits" ON page_visits;
CREATE POLICY "anon_insert_page_visits" ON page_visits FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_page_visits" ON page_visits;
CREATE POLICY "anon_update_page_visits" ON page_visits FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_page_visits" ON page_visits;
CREATE POLICY "anon_delete_page_visits" ON page_visits FOR DELETE
  TO anon, authenticated USING (true);

-- abandoned_carts policies
DROP POLICY IF EXISTS "anon_select_abandoned_carts" ON abandoned_carts;
CREATE POLICY "anon_select_abandoned_carts" ON abandoned_carts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_abandoned_carts" ON abandoned_carts;
CREATE POLICY "anon_insert_abandoned_carts" ON abandoned_carts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_abandoned_carts" ON abandoned_carts;
CREATE POLICY "anon_update_abandoned_carts" ON abandoned_carts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_abandoned_carts" ON abandoned_carts;
CREATE POLICY "anon_delete_abandoned_carts" ON abandoned_carts FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON page_visits(session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_created_at ON page_visits(created_at);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_session_id ON abandoned_carts(session_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_status ON abandoned_carts(status);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_email ON abandoned_carts(email);