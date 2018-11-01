function onOpen() {
  // var menu = SpreadsheetApp.getUi().createMenu("Extract URLs");
  // menu.addItem("Process =EXTRACT_URL(A1) formulas", "processFormulas");
  // menu.addToUi();
}

function EXTRACT_URL() {
  return SpreadsheetApp.getActiveRange().getFormula();
}

function processFormulas() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var rows = sheet.getDataRange().getFormulas();
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r];
    for (var c = 0; c < row.length; c++) {
      var formula = row[c];
      if (formula) {
        var matched = formula.match(/^=EXTRACT_URL\((.*)\)$/i);
        if (matched) {
          var targetRange = matched[1];
          if (targetRange.indexOf("!") < 0) {
            targetRange = sheet.getName() + "!" + targetRange;
          }
          var result = Sheets.Spreadsheets.get(spreadsheet.getId(), {
            ranges: targetRange,
            fields: 'sheets.data.rowData.values.hyperlink'
          });
          try {
            var value = result.sheets[0].data[0].rowData[0].values[0].hyperlink;
            sheet.getRange(r + 1, c + 1).setValue(value);
          } catch (e) {
            // no hyperlink; just ignore
          }
        }
      }
    }
  }
}