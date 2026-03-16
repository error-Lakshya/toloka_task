/**
 * Form submission handler for 12BRAVE.
 *
 * 1. Email to team@12brave.com via FormSubmit.co (out-of-the-box)
 * 2. Google Sheet logging via Apps Script web app (centralized Excel table)
 *    - Customer setup: create sheet, paste script, deploy, set env var (~5 min)
 *    - All submissions from all visitors stored in one central spreadsheet
 * 3. Optional: Supabase as additional centralized storage
 */

import { createClient } from '@supabase/supabase-js'

// --- Email ---
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/team@12brave.com'

// --- Google Sheet logging (Apps Script web app) ---
const SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || ''

// --- Supabase (optional) ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function submitForm(data: Record<string, string>): Promise<void> {
  const timestamp = new Date().toISOString()
  data['_submitted_at'] = timestamp

  const row: Record<string, string> = {
    submitted_at: timestamp,
    form_name: data._form_name || 'unknown',
    page_url: data._page_url || '',
    name: data.name || data.Name || data['name-2'] || '',
    email: data.email || data.Email || data['email-2'] || '',
    phone: data.Phone || '',
    linkedin: data.linkedin || data.Linkedin || '',
    whatsapp: data['Your-WhatsApp-number'] || '',
    why_join: data.why || '',
    discount_code: data['Discount-code'] || '',
    message: data.field || '',
  }

  // 1) Send email via FormSubmit.co (required — blocks on failure)
  const emailRes = await fetch(FORMSUBMIT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...row,
      _subject: `New ${row.form_name} submission from 12BRAVE`,
      _template: 'table',
    }),
  })

  if (!emailRes.ok) {
    const body = await emailRes.text().catch(() => '')
    throw new Error(`Email delivery failed (${emailRes.status}): ${body}`)
  }

  // 2) Log to Google Sheet (centralized Excel table — non-blocking)
  if (SHEET_URL) {
    fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(row),
      mode: 'no-cors',
    }).catch(() => {
      console.warn('Google Sheet logging failed (non-critical)')
    })
  }

  // 3) Log to Supabase (optional additional centralized storage — non-blocking)
  if (supabase) {
    supabase
      .from('form_submissions')
      .insert({ ...row, raw_data: data })
      .then(({ error }) => {
        if (error) console.warn('Supabase log failed (non-critical):', error.message)
      })
  }
}
