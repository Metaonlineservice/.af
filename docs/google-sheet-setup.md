# Google Sheet Setup for Meta Online Service

## Your Configuration

| Item | Value |
|------|-------|
| **SheetDB API** | `https://sheetdb.io/api/v1/j92iddttd3260` |
| **Google Sheet ID** | `12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no` |
| **Google Sheet URL** | [Open Sheet](https://docs.google.com/spreadsheets/d/12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no/edit) |
| **Google Drive Folder** | [Open Folder](https://drive.google.com/drive/folders/1pGKxBnC_f5lu08_IdMBVDo8p6QH93vdH) |

---

## STEP 1: Set Up Column Headers in Google Sheet

Open your Google Sheet and add these 28 column headers in **Row 1** (cells A1 through AB1):

### Copy this row and paste into your sheet (Row 1):

```
id	created_at	first_name	last_name	father_name	case_type	family_count	passport_number	date_of_birth	sons_count	daughters_count	country	province	whatsapp	emergency_contact	email	q1_security	q2_prior	q3_proof	q4_budget	q5_passport_validity	q6_document	q7_reference	q8_awareness	q9_legal_docs	form_type	appointment_date	status
```

### Or add each column manually:

| Column | Header Name |
|--------|-------------|
| A | id |
| B | created_at |
| C | first_name |
| D | last_name |
| E | father_name |
| F | case_type |
| G | family_count |
| H | passport_number |
| I | date_of_birth |
| J | sons_count |
| K | daughters_count |
| L | country |
| M | province |
| N | whatsapp |
| O | emergency_contact |
| P | email |
| Q | q1_security |
| R | q2_prior |
| S | q3_proof |
| T | q4_budget |
| U | q5_passport_validity |
| V | q6_document |
| W | q7_reference |
| X | q8_awareness |
| Y | q9_legal_docs |
| Z | form_type |
| AA | appointment_date |
| AB | status |

---

## STEP 2: Verify SheetDB Connection

1. Go to https://sheetdb.io
2. Login to your account
3. You should see your API endpoint: `j92iddttd3260`
4. Click on it to verify it's connected to your Google Sheet

If not connected:
1. Click "Create New API"
2. Paste your Google Sheet URL: `https://docs.google.com/spreadsheets/d/12J6MajQek8zPPtx6roPR5EY2mP41GMYfgly-ZXOs4no/edit`
3. SheetDB will generate a new API endpoint
4. Update the code if a new endpoint is generated

---

## STEP 3: Test the Integration

After setting up the columns:

1. Deploy your website
2. Fill out the form with test data
3. Submit the form
4. Check your Google Sheet - a new row should appear

---

## Your Project is Ready!

The code is already configured with YOUR SheetDB API:

```typescript
// In src/components/VisaForm.tsx (line 22)
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/j92iddttd3260';
```

**Just make sure your Google Sheet has the 28 column headers in Row 1!**

---

## EmailJS Configuration (Already Set)

| Setting | Value |
|---------|-------|
| Service ID | `service_qogogdp` |
| Template ID | `template_7y36m2h` |
| Public Key | `GeH0jc48LNtGn4dsi` |

---

## How Data Flows

```
User fills form → Click Submit
        ↓
Check for duplicate passport in SheetDB
        ↓
Show preview modal
        ↓
User confirms
        ↓
Save to Google Sheet via SheetDB
        ↓
Send confirmation email via EmailJS
        ↓
Show success modal with invoice number
```

---

## Troubleshooting

### Data not appearing in Google Sheet?

1. Open your Google Sheet
2. Make sure Row 1 has ALL 28 column headers
3. Check SheetDB dashboard for errors
4. Try a test submission

### Duplicate check not working?

Make sure column H (passport_number) has the header exactly as: `passport_number`

### Email not sending?

1. Go to https://emailjs.com
2. Verify your template has variables: `{{to_name}}`, `{{to_email}}`, `{{invoice_number}}`, `{{appointment_date}}`
3. Check your service is active
