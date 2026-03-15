# Google Sheet Logging Setup

## Step 1: Create a Google Sheet
1. Go to https://sheets.google.com and create a new spreadsheet
2. Name it "12BRAVE Form Submissions"
3. Add headers in row 1:
   ```
   Timestamp | Form Name | Page URL | Name | Email | Phone | LinkedIn | WhatsApp | Why | Discount Code | Message | Checkboxes
   ```

## Step 2: Add Apps Script
1. In the sheet, go to **Extensions → Apps Script**
2. Replace the default code with:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  var row = [
    data._submitted_at || new Date().toISOString(),
    data._form_name || '',
    data._page_url || '',
    data.name || data.Name || data['name-2'] || '',
    data.email || data.Email || data['email-2'] || '',
    data.Phone || data['name-2'] || '', // phone field sometimes uses name-2
    data.linkedin || data.Linkedin || '',
    data['Your-WhatsApp-number'] || '',
    data.why || '',
    data['Discount-code'] || '',
    data.field || '', // textarea "Your message"
    (data.checkbox ? 'Privacy:Yes' : '') + (data['checkbox-2'] ? ' WhatsApp:Yes' : '')
  ];

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Step 3: Deploy as Web App
1. Click **Deploy → New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy** and copy the web app URL

## Step 4: Configure the Environment Variable
Add to your `.env` file:
```
VITE_SHEET_ENDPOINT=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

## Step 5: Formspree Setup
1. Go to https://formspree.io and create a new form
2. Set the email recipient to `team@12brave.com`
3. Copy the form endpoint (e.g., `https://formspree.io/f/xwpkabcd`)
4. Add to your `.env` file:
```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```
