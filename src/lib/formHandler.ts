/**
 * Form submission handler for 12BRAVE.
 *
 * Sends form data to two destinations:
 * 1. Email notification to team@12brave.com (via Formspree)
 * 2. Spreadsheet logging (via Google Sheets Apps Script web app)
 *
 * SETUP REQUIRED:
 * - Replace FORMSPREE_ENDPOINT with your Formspree form ID
 *   (create at https://formspree.io, set recipient to team@12brave.com)
 * - Replace SHEET_ENDPOINT with your Google Apps Script web app URL
 *   (see /docs/google-sheet-setup.md for instructions)
 */

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORM_ID'
const SHEET_ENDPOINT = import.meta.env.VITE_SHEET_ENDPOINT || ''

export async function submitForm(data: Record<string, string>): Promise<void> {
  // Add timestamp
  data['_submitted_at'] = new Date().toISOString()

  // 1) Send email via Formspree
  const emailPromise = fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      ...data,
      _replyto: data.email || data.Email || '',
      _subject: `New ${data._form_name} submission from 12BRAVE`,
    }),
  }).then((res) => {
    if (!res.ok) throw new Error(`Formspree error: ${res.status}`)
  })

  // 2) Log to Google Sheet (fire-and-forget, don't block on failure)
  const sheetPromise = SHEET_ENDPOINT
    ? fetch(SHEET_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'no-cors', // Apps Script requires no-cors from browser
      }).catch(() => {
        // Sheet logging is non-blocking
        console.warn('Sheet logging failed (non-critical)')
      })
    : Promise.resolve()

  // Wait for email (required), sheet is fire-and-forget
  await Promise.all([emailPromise, sheetPromise])
}
