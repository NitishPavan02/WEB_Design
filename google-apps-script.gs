/**
 * EditKaro.in — Google Apps Script Web App
 *
 * HOW TO DEPLOY:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. In your Google Sheet, create two sheets: "Contact" and "Newsletter"
 * 4. Paste your Spreadsheet ID on line 18 below
 * 5. Deploy → New deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL into script.js → SHEETS_URL
 */

const SPREADSHEET_ID = "1iwlLOKqQiuue4ihvntI6pwKGXa2O4GKFTXrcG1tLHXU"; // ← replace this

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheetName = data.sheet === "Newsletter" ? "Newsletter" : "Contact";
    let sheet = ss.getSheetByName(sheetName);

    // Auto-create the sheet with headers if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (sheetName === "Contact") {
        sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Project Type", "Message"]);
      } else {
        sheet.appendRow(["Timestamp", "Email"]);
      }
      sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight("bold");
    }

    if (sheetName === "Contact") {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name    || "",
        data.email   || "",
        data.phone   || "",
        data.project || "",
        data.message || "",
      ]);
    } else {
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.email || "",
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Needed so the browser can preflight OPTIONS requests (CORS)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
