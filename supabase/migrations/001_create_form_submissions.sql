-- Form submissions table for 12BRAVE
-- Run this in Supabase Dashboard -> SQL Editor after connecting Supabase in Lovable

CREATE TABLE IF NOT EXISTS form_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  form_name TEXT NOT NULL DEFAULT 'unknown',
  page_url TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  linkedin TEXT,
  whatsapp TEXT,
  why_join TEXT,
  discount_code TEXT,
  message TEXT,
  raw_data JSONB
);

-- Enable Row Level Security (required by Supabase)
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (form submissions from the public site)
CREATE POLICY "Allow anonymous inserts"
  ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated reads (for admin dashboard / export)
CREATE POLICY "Allow authenticated reads"
  ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for common queries
CREATE INDEX idx_form_submissions_submitted_at ON form_submissions (submitted_at DESC);
CREATE INDEX idx_form_submissions_form_name ON form_submissions (form_name);
