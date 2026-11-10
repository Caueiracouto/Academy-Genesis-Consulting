/*
# Create course_sessions table for training calendar

1. New Tables
- `course_sessions`
  - `id` (uuid, primary key)
  - `course_slug` (text, references course slugs from the courses data file)
  - `course_title` (text, denormalized for convenience)
  - `cert_code` (text, e.g. "SA", "SSM")
  - `instructor` (text)
  - `start_date` (date, when the training begins)
  - `end_date` (date, when the training ends)
  - `start_time` (text, e.g. "19:00")
  - `end_time` (text, e.g. "22:00")
  - `sessions` (text, e.g. "4 sessões de 4h")
  - `format` (text, e.g. "Live Virtual")
  - `seats_total` (int, total available seats)
  - `seats_filled` (int, default 0)
  - `status` (text, default 'open': open, full, closed)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `course_sessions`.
- Public read access (anon + authenticated) so visitors can see the calendar.
- Only authenticated users can insert/update/delete (admin management).

3. Notes
- This table stores scheduled training sessions (turmas) that appear on the public calendar.
- The app reads from this table to display upcoming training dates.
*/

CREATE TABLE IF NOT EXISTS course_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug text NOT NULL,
  course_title text NOT NULL,
  cert_code text NOT NULL,
  instructor text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  start_time text,
  end_time text,
  sessions text,
  format text DEFAULT 'Live Virtual',
  seats_total int DEFAULT 30,
  seats_filled int DEFAULT 0,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE course_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sessions" ON course_sessions;
CREATE POLICY "anon_select_sessions"
  ON course_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_sessions" ON course_sessions;
CREATE POLICY "auth_insert_sessions"
  ON course_sessions FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_sessions" ON course_sessions;
CREATE POLICY "auth_update_sessions"
  ON course_sessions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_sessions" ON course_sessions;
CREATE POLICY "auth_delete_sessions"
  ON course_sessions FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_course_sessions_start_date ON course_sessions(start_date);
