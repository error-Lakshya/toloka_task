# Form Submission Setup

Forms are pre-configured to work with two services. No accounts to create, no API keys to generate.

## Email Delivery (FormSubmit.co)

**How it works:** Form submissions are sent to `https://formsubmit.co/ajax/team@12brave.com`. FormSubmit.co delivers the data as a formatted email to `team@12brave.com`.

**One-time activation:** After the very first form submission on the live site, FormSubmit.co sends a verification email to `team@12brave.com`. Someone with access to that inbox must click the confirmation link. After that, all future submissions deliver instantly with no further action needed.

**No account, no API key, no configuration required.**

**Privacy note:** FormSubmit.co is a third-party service that processes form submission data in order to deliver it via email. If your privacy policy or GDPR obligations require disclosure of third-party data processors, add FormSubmit.co (https://formsubmit.co) to your list of sub-processors.

## Spreadsheet Logging (Supabase)

**How it works:** Every form submission is also inserted into a `form_submissions` table in Supabase. Lovable has built-in Supabase integration.

**Setup steps:**

1. In Lovable, click **Connect Supabase** (or go to Project Settings -> Integrations -> Supabase)
2. Lovable auto-populates `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Open the Supabase Dashboard -> SQL Editor
4. Paste and run the contents of `supabase/migrations/001_create_form_submissions.sql`
5. Done. All form submissions now appear in the `form_submissions` table.

**Viewing/exporting data:** In Supabase Dashboard -> Table Editor -> `form_submissions`, you can view, filter, and export all submissions as CSV (which opens in Excel/Google Sheets).

## Table Schema

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Auto-incrementing primary key |
| submitted_at | timestamptz | Submission timestamp |
| form_name | text | Which form was submitted (e.g., "wf-form-popup-signup") |
| page_url | text | Page the form was on |
| name | text | Submitter's full name |
| email | text | Submitter's email |
| phone | text | Phone number |
| linkedin | text | LinkedIn profile URL |
| whatsapp | text | WhatsApp number |
| why_join | text | "Why do you want to join?" answer |
| discount_code | text | Discount code (if provided) |
| message | text | Free-text message (contact form) |
| raw_data | jsonb | Complete raw form data (all fields) |

## If Supabase is not connected

Email delivery still works (FormSubmit.co is independent). Only the spreadsheet logging is skipped. A console warning is logged: "Supabase log failed (non-critical)".
