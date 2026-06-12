/**
 * Google Apps Script - Proxy per scrittura su Google Sheets
 * 
 * Deploy: 
 * 1. Vai su https://script.google.com/
 * 2. Crea nuovo progetto
 * 3. Incolla questo codice
 * 4. Deploy > New deployment > Web app
 * 5. Accesso: "Anyone" (chiunque può accedere)
 * 6. Copia l'URL e inseriscilo in localStorage con chiave "gs_script_url"
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { spreadsheetId, sheetName, row, statoCol, notaCol, stato, nota } = data;
    
    // Apri lo spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'Foglio non trovato: ' + sheetName
      })).setMimeType(ContentService.MimeType.JSON).setResponseCode(404);
    }
    
    // Aggiorna le celle (colonne 1-based)
    const statoRange = sheet.getRange(row, statoCol);
    const notaRange = sheet.getRange(row, notaCol);
    
    statoRange.setValue(stato);
    notaRange.setValue(nota);
    
    // Successo
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Riga ${row} aggiornata: stato=${stato}, nota=${nota}`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON).setResponseCode(500);
  }
}

// Gestione richieste OPTIONS per CORS (preflight)
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setResponseCode(204)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// Test
function test() {
  const mockData = {
    spreadsheetId: '1ldv_2mf2uQOiwXgiMa6ihUt5wIHU6Cu0O2ApPNyIfKE',
    sheetName: 'Fornitori',
    row: 2,
    statoCol: 13,
    notaCol: 14,
    stato: 'Da contattare',
    nota: 'Test nota'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(mockData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
