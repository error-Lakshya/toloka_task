# Form Submission Setup

## 1. Email Delivery (FormSubmit.co) - out-of-the-box

**How it works:** Form submissions are sent to `https://formsubmit.co/ajax/team@12brave.com`. FormSubmit.co delivers the data as a formatted email to `team@12brave.com`.

**One-time activation:** After the very first form submission on the live site, FormSubmit.co sends a verification email to `team@12brave.com`. Someone with access to that inbox must click the confirmation link. After that, all future submissions deliver instantly.

**No account, no API key, no configuration required.**

**Privacy note:** FormSubmit.co is a third-party service that processes form submission data in order to deliver it via email. If your privacy policy or GDPR obligations require disclosure of third-party data processors, add FormSubmit.co (https://formsubmit.co) to your list of sub-processors.

## 2. Centralized Excel Table (Google Sheets) - 5-minute setup

Every form submission is logged as a row in a Google Sheet. The sheet is accessible to the entire 12BRAVE team and can be downloaded as Excel at any time.

### Setup steps (5 minutes)

**Step 1:** Create a new Google Sheet at https://sheets.google.com. Name it "12BRAVE Form Submissions".

**Step 2:** Add these headers in row 1 (columns A through K):

```
Timestamp | Form Name | Page URL | Name | Email | Phone | LinkedIn | WhatsApp | Why Join | Discount Code | Message
```

**Step 3:** Go to **Extensions > Apps Script**. Delete any default code and paste this:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.submitted_at || new Date().toISOString(),
    data.form_name || '',
    data.page_url || '',
    data.name || '',
    data.email || '',
    data.phone || '',
    data.linkedin || '',
    data.whatsapp || '',
    data.why_join || '',
    data.discount_code || '',
    data.message || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Step 4:** Click **Deploy > New deployment**. Set type to **Web app**, execute as **Me**, access **Anyone**. Click **Deploy** and copy the URL (looks like `https://script.google.com/macros/s/.../exec`).

**Step 5:** In Lovable, go to **Project Settings > Environment Variables** and add:

```
VITE_GOOGLE_SHEET_URL = https://script.google.com/macros/s/YOUR_ID/exec
```

Done. All form submissions now appear as rows in the Google Sheet automatically.

### Viewing/exporting data

- Open the Google Sheet directly (it updates in real time)
- Download as Excel: **File > Download > Microsoft Excel (.xlsx)**
- Download as CSV: **File > Download > Comma-separated values (.csv)**
- Share with team: use standard Google Sheets sharing

## 3. Optional: Supabase (additional centralized storage)

If Lovable has Supabase connected (Project Settings > Integrations), submissions are also logged to a `form_submissions` table. Run the migration SQL in `supabase/migrations/001_create_form_submissions.sql` after connecting.

This is optional and complementary to Google Sheets logging.

## If Google Sheet URL is not set

Email delivery still works (FormSubmit.co is independent). Only spreadsheet logging is skipped. A console warning is logged.
