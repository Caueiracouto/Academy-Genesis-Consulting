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
- This is a no-auth app (no sign-in screen). All policies use `TO anon, authenticated`
  so the anon-key frontend can read/write its own data.
- RLS enabled on both tables.
- 4 separate policies per table (SELECT, INSERT, UPDATE, DELETE) — no `FOR ALL`.
- `USING (true)` is acceptable here because the data is intentionally writable by
  the anon frontend (single-tenant lead capture app).

## Important Notes
1. The app does NOT require sign-in. Visitors browse freely; we track page views
   and cart abandonment for lead generation.
2. `session_id` is generated client-side and stored in localStorage — it persists
   across visits on the same browser but is anonymous (not tied to auth).
3. The sales team can query abandoned_carts directly in Supabase to follow up.
*/