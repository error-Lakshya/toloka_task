/**
 * Form submission handler for 12BRAVE.
 *
 * 1. Email to team@12brave.com via FormSubmit.co
 *    - Works out-of-the-box, no account or API key needed.
 *    - ONE-TIME SETUP: After the first submission, FormSubmit.co sends
 *      a verification email to team@12brave.com. Click the link to activate.
 *
 * 2. On-site CSV log (IndexedDB) — works out-of-the-box, zero setup.
 *    - Every submission is stored locally in IndexedDB.
 *    - Export as CSV (Excel-compatible) via /admin/export-csv route.
 *
 * 3. Optional: Supabase `form_submissions` table for centralized storage.
 *    - Requires: Connect Supabase in Lovable + run migration SQL.
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

// --- IndexedDB local CSV log ---

const DB_NAME = '12brave_submissions'
const STORE_NAME = 'submissions'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function logToIndexedDB(row: Record<string, string>): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add(row)
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    console.warn('IndexedDB log failed (non-critical)')
  }
}

export async function getAllSubmissions(): Promise<Record<string, string>[]> {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export function submissionsToCSV(rows: Record<string, string>[]): string {
  if (rows.length === 0) return ''
  const headers = [
    'submitted_at', 'form_name', 'page_url', 'name', 'email',
    'phone', 'linkedin', 'whatsapp', 'why_join', 'discount_code', 'message'
  ]
  const escape = (v: string) => `"${(v || '').replace(/"/g, '""')}"`
  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h] || '')).join(','))
  }
  return lines.join('\n')
}

export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// --- Main submit function ---

export async function submitForm(data: Record<string, string>): Promise<void> {
  const timestamp = new Date().toISOString()
  data['_submitted_at'] = timestamp

  // Normalize fields for consistent logging
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

  // 1) Send email via FormSubmit.co
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

  // 2) Log to IndexedDB (always, zero setup, non-blocking)
  logToIndexedDB(row)

  // 3) Log to Supabase (optional, non-blocking)
  if (supabase) {
    supabase
      .from('form_submissions')
      .insert({ ...row, raw_data: data })
      .then(({ error }) => {
        if (error) console.warn('Supabase log failed (non-critical):', error.message)
      })
  }
}
