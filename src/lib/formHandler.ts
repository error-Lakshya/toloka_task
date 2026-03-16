/**
 * Form submission handler for 12BRAVE.
 *
 * This handler sends every form submission to two destinations:
 * 1. Email to team@12brave.com via FormSubmit.co (for instant notification).
 * 2. Google Sheet via Apps Script (for centralized, Excel-compatible logging).
 *
 * Both work out-of-the-box with zero customer setup, except for a one-time
 * email verification click for FormSubmit.co.
 */

import { createClient } from "@supabase/supabase-js";

// --- Endpoints ---
const FORMSUBMIT_URL = "https://formsubmit.co/ajax/team@12brave.com";
const SHEET_URL = "https://script.google.com/macros/s/AKfycbyEmMmQjzwgw5ZG_IMkenczp21GlNwy1MwZ6ND5EixrYIzZ50o5kG3WCVZrnNvwbFI-/exec";

// --- Optional Supabase client ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function submitForm(data: Record<string, string>): Promise<void> {
  const timestamp = new Date().toISOString();
  data["_submitted_at"] = timestamp;

  // Normalize form data into a consistent row structure
  const row: Record<string, string> = {
    submitted_at: timestamp,
    form_name: data._form_name || "unknown",
    page_url: data._page_url || "",
    name: data.name || data.Name || data["name-2"] || "",
    email: data.email || data.Email || data["email-2"] || "",
    phone: data.Phone || "",
    linkedin: data.linkedin || data.Linkedin || "",
    whatsapp: data["Your-WhatsApp-number"] || "",
    why_join: data.why || "",
    discount_code: data["Discount-code"] || "",
    message: data.field || "",
  };

  // --- Destination 1: Email via FormSubmit.co (Critical Path) ---
  // This is the primary action. If it fails, the whole submission fails.
  const emailPromise = fetch(FORMSUBMIT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...row,
      _subject: `New ${row.form_name} submission from 12BRAVE`,
      _template: "table",
    }),
  });

  // --- Destination 2: Google Sheet Logging (Non-blocking) ---
  // This runs in parallel and does not block the user-facing result.
  const sheetPromise = fetch(SHEET_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
    mode: "no-cors", // Fire-and-forget, no response needed
  }).catch(err => {
    console.warn("Google Sheet logging failed (non-critical):", err);
  });

  // --- Destination 3: Supabase Logging (Optional, Non-blocking) ---
  const supabasePromise = supabase
    ? supabase
        .from("form_submissions")
        .insert({ ...row, raw_data: data })
        .then(({ error }) => {
          if (error) console.warn("Supabase log failed (non-critical):", error.message);
        })
    : Promise.resolve();

  // Wait for the critical email submission to complete
  const emailRes = await emailPromise;
  if (!emailRes.ok) {
    const body = await emailRes.text().catch(() => "");
    throw new Error(`Email delivery failed (${emailRes.status}): ${body}`);
  }

  // Wait for non-critical logging to finish (optional, for completeness)
  await Promise.all([sheetPromise, supabasePromise]);
}