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
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Aggiorna le celle (colonne 1-based)
    const statoRange = sheet.getRange(row, statoCol);
    const notaRange = sheet.getRange(row, notaCol);
    
    statoRange.setValue(stato);
    notaRange.setValue(nota);
    
    // Successo
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `Riga ${row} aggiornata`
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Gestione richieste GET con JSONP (bypassa CORS)
function doGet(e) {
  try {
    const data = e.parameter;
    const spreadsheetId = data.spreadsheetId;
    const sheetName = data.sheetName;
    const row = parseInt(data.row);
    const statoCol = parseInt(data.statoCol);
    const notaCol = parseInt(data.notaCol);
    const stato = data.stato;
    const nota = data.nota;
    const callback = data.callback || 'callback';
    
    // Apri lo spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    let result;
    if (!sheet) {
      result = { error: 'Foglio non trovato: ' + sheetName };
    } else {
      // Aggiorna le celle (colonne 1-based)
      const statoRange = sheet.getRange(row, statoCol);
      const notaRange = sheet.getRange(row, notaCol);
      
      statoRange.setValue(stato);
      notaRange.setValue(nota);
      
      result = { success: true, message: `Riga ${row} aggiornata` };
    }
    
    // Risposta JSONP
    const jsonp = callback + '(' + JSON.stringify(result) + ');';
    return ContentService.createTextOutput(jsonp).setMimeType(ContentService.MimeType.JAVASCRIPT);
    
  } catch (error) {
    const callback = e.parameter.callback || 'callback';
    const jsonp = callback + '(' + JSON.stringify({ error: error.toString() }) + ');';
    return ContentService.createTextOutput(jsonp).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
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
