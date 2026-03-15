/**
 * Form submission handler for 12BRAVE.
 *
 * Two destinations, both work out-of-the-box:
 * 1. Email to team@12brave.com via FormSubmit.co (no account needed)
 * 2. Supabase `form_submissions` table (Lovable auto-connects Supabase)
 *
 * ONE-TIME SETUP: After the very first form submission, FormSubmit.co
 * sends a verification email to team@12brave.com. Click the link in
 * that email to activate. All subsequent submissions deliver instantly.
 */

import { createClient } from '@supabase/supabase-js'

// FormSubmit.co AJAX endpoint - sends email to team@12brave.com
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/team@12brave.com'

// Supabase client - Lovable auto-populates these env vars when Supabase is connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null

export async function submitForm(data: Record<string, string>): Promise<void> {
  const timestamp = new Date().toISOString()
  data['_submitted_at'] = timestamp

  // 1) Send email via FormSubmit.co
  const emailRes = await fetch(FORMSUBMIT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: data.name || data.Name || data['name-2'] || '',
      email: data.email || data.Email || data['email-2'] || '',
      phone: data.Phone || '',
      linkedin: data.linkedin || data.Linkedin || '',
      whatsapp: data['Your-WhatsApp-number'] || '',
      message: data.field || '',
      why_join: data.why || '',
      discount_code: data['Discount-code'] || '',
      form_name: data._form_name || 'unknown',
      page_url: data._page_url || '',
      _subject: `New ${data._form_name || 'form'} submission from 12BRAVE`,
      _template: 'table',
    }),
  })

  if (!emailRes.ok) {
    const body = await emailRes.text().catch(() => '')
    throw new Error(`Email delivery failed (${emailRes.status}): ${body}`)
  }

  // 2) Log to Supabase form_submissions table (non-blocking)
  if (supabase) {
    supabase
      .from('form_submissions')
      .insert({
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
        raw_data: data,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase log failed (non-critical):', error.message)
      })
  }
}
