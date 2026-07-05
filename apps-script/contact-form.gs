/**
 * DokoDocs — Contact form handler (Google Apps Script Web App)
 * Appends each contact-form submission as a row in the linked Google Sheet.
 *
 * Sheet columns (row 1 headers, in this order):
 *   sn | email | message | time | mobilenumber | error
 *
 * ── Setup ──────────────────────────────────────────────────────────────
 * 1. Open your sheet:
 *    https://docs.google.com/spreadsheets/d/1RLZT-du3Q99eY1awJV-6FrGcpphlT-hIZ3UVamRnQ8c/edit
 * 2. Make sure row 1 has these headers exactly:
 *    sn   email   message   time   mobilenumber   error
 * 3. Extensions → Apps Script. Delete any sample code, paste THIS file, Save.
 * 4. Deploy → New deployment → type "Web app".
 *      - Description: DokoDocs contact form
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Click Deploy, authorize when prompted.
 * 5. Copy the Web app URL (ends in /exec).
 * 6. Paste it into contact.html:  data-endpoint="...your /exec URL..."
 *    Commit & push. Done.
 * ───────────────────────────────────────────────────────────────────────
 */

var SHEET_ID = '1RLZT-du3Q99eY1awJV-6FrGcpphlT-hIZ3UVamRnQ8c';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // avoid two submissions colliding on the same row
  try {
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName('Sheet1') || ss.getSheets()[0];

    var p = (e && e.parameter) || {};
    var lastRow = sheet.getLastRow();     // 1 = just the header row
    var sn = lastRow;                     // first submission becomes sn = 1

    // Column order must match the sheet: sn, email, message, time, mobilenumber, error
    sheet.appendRow([
      sn,
      p.email || '',
      p.message || '',
      new Date(),
      p.mobilenumber || '',
      ''                                  // error — blank on success
    ]);

    return json({ result: 'success', row: sn });
  } catch (err) {
    // Log the failure into the sheet's "error" column for visibility
    try {
      var ss2 = SpreadsheetApp.openById(SHEET_ID);
      var sheet2 = ss2.getSheetByName('Sheet1') || ss2.getSheets()[0];
      sheet2.appendRow(['', (e && e.parameter && e.parameter.email) || '', '', new Date(), '', String(err)]);
    } catch (ignore) {}
    return json({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Simple GET to confirm the deployment is live (visit the /exec URL in a browser)
function doGet() {
  return json({ result: 'ok', message: 'DokoDocs contact endpoint is live.' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
