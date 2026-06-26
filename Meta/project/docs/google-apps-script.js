/**
 * Google Apps Script for Meta Online Service
 *
 * SETUP INSTRUCTIONS:
 * 1. Create a Google Sheet with 28 columns (A-AB) with headers in row 1
 * 2. Go to Extensions > Apps Script in your Google Sheet
 * 3. Delete any existing code and paste this entire file
 * 4. Click "Save" (Ctrl+S)
 * 5. Click "Deploy" > "New deployment"
 * 6. Click the gear icon and select "Web app"
 * 7. Set "Execute as" to "Me"
 * 8. Set "Who has access" to "Anyone"
 * 9. Click "Deploy"
 * 10. Copy the Web App URL
 * 11. Update your project code with this URL
 */

// ============================================
// CONFIGURATION
// ============================================
const SHEET_NAME = 'Sheet1'; // Change this if your sheet tab has a different name

// ============================================
// COLUMN INDEXES (0-based)
// ============================================
const COL_ID = 0;
const COL_CREATED_AT = 1;
const COL_FIRST_NAME = 2;
const COL_LAST_NAME = 3;
const COL_FATHER_NAME = 4;
const COL_CASE_TYPE = 5;
const COL_FAMILY_COUNT = 6;
const COL_PASSPORT = 7;
const COL_DOB = 8;
const COL_SONS_COUNT = 9;
const COL_DAUGHTERS_COUNT = 10;
const COL_COUNTRY = 11;
const COL_PROVINCE = 12;
const COL_WHATSAPP = 13;
const COL_EMERGENCY = 14;
const COL_EMAIL = 15;
const COL_Q1 = 16;
const COL_Q2 = 17;
const COL_Q3 = 18;
const COL_Q4 = 19;
const COL_Q5 = 20;
const COL_Q6 = 21;
const COL_Q7 = 22;
const COL_Q8 = 23;
const COL_Q9 = 24;
const COL_FORM_TYPE = 25;
const COL_APPOINTMENT = 26;
const COL_STATUS = 27;

// ============================================
// HANDLE POST REQUESTS (Form Submission)
// ============================================
function doPost(e) {
  // Set CORS headers for all responses
  const output = (data) => ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return output({
        success: false,
        error: 'Sheet not found'
      });
    }

    // Parse incoming data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      return output({
        success: false,
        error: 'Invalid JSON data'
      });
    }

    // Handle array of records (SheetDB format)
    const records = Array.isArray(data.data) ? data.data : [data];
    const results = [];

    for (const record of records) {
      const passportNumber = (record.passport_number || record.passport || '').toString().trim().toUpperCase();

      // Check for duplicate
      if (passportNumber && !isPassportUnique(sheet, passportNumber)) {
        return output({
          success: false,
          error: 'duplicate',
          message: 'شما مجاز به ثبت درخواست مجدد نیستید.'
        });
      }

      // Generate row data
      const rowData = [
        record.id || generateInvoiceId(),
        record.created_at || new Date().toISOString(),
        record.first_name || record.firstName || '',
        record.last_name || record.lastName || '',
        record.father_name || record.fatherName || '',
        record.case_type || record.caseType || 'individual',
        record.family_count || record.familyCount || '1',
        passportNumber,
        record.date_of_birth || record.dateOfBirth || '',
        record.sons_count || record.sonsCount || '0',
        record.daughters_count || record.daughtersCount || '0',
        record.country || '',
        record.province || '',
        record.whatsapp || record.whatsappNumber || '',
        record.emergency_contact || record.emergencyContact || '',
        record.email || '',
        record.q1_security || record.q1SecurityProblems || '',
        record.q2_prior || record.q2PriorFilings || '',
        record.q3_proof || record.q3ProofFiles || '',
        record.q4_budget || record.q4TransitBudget || '',
        record.q5_passport_validity || record.q5PassportValidity || '',
        record.q6_document || record.q6DocumentUpload || '',
        record.q7_reference || record.q7ReferenceChannel || '',
        record.q8_awareness || record.q8AwarenessSource || '',
        record.q9_legal_docs || record.q9LegalDocs || '',
        record.form_type || record.formType || '',
        record.appointment_date || record.appointmentDate || '',
        record.status || 'pending'
      ];

      // Append to sheet
      sheet.appendRow(rowData);
      results.push({ id: rowData[0] });
    }

    return output({
      success: true,
      created: results.length,
      data: results
    });

  } catch (error) {
    return output({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

// ============================================
// HANDLE GET REQUESTS (Search/Read)
// ============================================
function doGet(e) {
  const output = (data) => ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      return output([]);
    }

    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return output([]);
    }

    // Search by passport number (for duplicate check)
    const searchPassport = e.parameter.passport_number || e.parameter.passport;

    if (searchPassport) {
      const data = sheet.getRange(2, 1, lastRow - 1, 28).getValues();
      const results = [];

      for (let i = 0; i < data.length; i++) {
        const rowPassport = (data[i][COL_PASSPORT] || '').toString().toUpperCase();
        if (rowPassport === searchPassport.toUpperCase().trim()) {
          results.push(rowToObject(data[i]));
        }
      }

      return output(results);
    }

    // Search by ID
    const searchId = e.parameter.id;
    if (searchId) {
      const data = sheet.getRange(2, 1, lastRow - 1, 28).getValues();
      const results = [];

      for (let i = 0; i < data.length; i++) {
        if (data[i][COL_ID] === searchId) {
          results.push(rowToObject(data[i]));
        }
      }

      return output(results);
    }

    // Return all records
    const data = sheet.getRange(2, 1, lastRow - 1, 28).getValues();
    const jsonData = data.map(row => rowToObject(row));

    return output(jsonData);

  } catch (error) {
    return output({
      error: error.message
    });
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function isPassportUnique(sheet, passportNumber) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return true;
  }

  const passports = sheet.getRange(2, COL_PASSPORT + 1, lastRow - 1, 1).getValues();

  for (let i = 0; i < passports.length; i++) {
    const existing = (passports[i][0] || '').toString().toUpperCase();
    if (existing === passportNumber) {
      return false;
    }
  }

  return true;
}

function rowToObject(row) {
  return {
    id: row[COL_ID],
    created_at: row[COL_CREATED_AT],
    first_name: row[COL_FIRST_NAME],
    last_name: row[COL_LAST_NAME],
    father_name: row[COL_FATHER_NAME],
    case_type: row[COL_CASE_TYPE],
    family_count: row[COL_FAMILY_COUNT],
    passport_number: row[COL_PASSPORT],
    date_of_birth: row[COL_DOB],
    sons_count: row[COL_SONS_COUNT],
    daughters_count: row[COL_DAUGHTERS_COUNT],
    country: row[COL_COUNTRY],
    province: row[COL_PROVINCE],
    whatsapp: row[COL_WHATSAPP],
    emergency_contact: row[COL_EMERGENCY],
    email: row[COL_EMAIL],
    q1_security: row[COL_Q1],
    q2_prior: row[COL_Q2],
    q3_proof: row[COL_Q3],
    q4_budget: row[COL_Q4],
    q5_passport_validity: row[COL_Q5],
    q6_document: row[COL_Q6],
    q7_reference: row[COL_Q7],
    q8_awareness: row[COL_Q8],
    q9_legal_docs: row[COL_Q9],
    form_type: row[COL_FORM_TYPE],
    appointment_date: row[COL_APPOINTMENT],
    status: row[COL_STATUS]
  };
}

function generateInvoiceId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return 'META-' + timestamp + '-' + random;
}

// ============================================
// TEST FUNCTION (Run manually in editor)
// ============================================
function testSubmission() {
  const testData = {
    data: [{
      id: 'TEST-' + Date.now(),
      first_name: 'حمدالله',
      last_name: 'کریمی',
      father_name: 'محمد',
      case_type: 'individual',
      family_count: '1',
      passport_number: 'TEST123456',
      date_of_birth: '1990-01-01',
      email: 'test@example.com',
      country: 'افغانستان',
      province: 'کابل'
    }]
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const result = doPost(mockEvent);
  Logger.log('Result: ' + result.getContent());
}

function testSearch() {
  const mockEvent = {
    parameter: {
      passport_number: 'TEST123456'
    }
  };

  const result = doGet(mockEvent);
  Logger.log('Search Result: ' + result.getContent());
}

function clearTestData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
    Logger.log('Cleared ' + (lastRow - 1) + ' rows');
  }
}
