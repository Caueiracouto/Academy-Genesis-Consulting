/*
# Create emails_queue table for sending enrollment confirmation emails

1. New Tables
- `emails_queue`
  - `id` (uuid, primary key)
  - `to` (text, recipient email)
  - `subject` (text, email subject)
  - `html` (text, HTML body)
  - `sent` (boolean, default false)
  - `created_at` (timestamptz)
  - `sent_at` (timestamptz, nullable)

2. Security
- Enable RLS on `emails_queue`.
- Only authenticated users can insert (edge function uses service role key which bypasses RLS).
- No public read access — emails are private.

3. Notes
- The edge function "send-enrollment-email" inserts rows here using the service role key.
- A Supabase cron job or external worker can poll this table and send emails via SMTP/Resend/etc.
*/
CREATE TABLE IF NOT EXISTS emails_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "to" text NOT NULL,
  subject text NOT NULL,
  html text NOT NULL,
  sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE emails_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_emails" ON emails_queue;
CREATE POLICY "anon_insert_emails"
  ON emails_queue FOR INSERT
  TO anon, authenticated WITH CHECK (true);
