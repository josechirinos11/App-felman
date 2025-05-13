// back/db.js
const ADODB = require('node-adodb');
ADODB.debug = false;  // true si quieres ver logs de OLE

// Sustituye la ruta por la tuya, dobla las barras:
const connection = ADODB.open(
  'Provider=Microsoft.ACE.OLEDB.12.0;' +
  'Data Source=C:\jose chirinos\code\app-felman\baseDeDatos.accdb;' +
  'Persist Security Info=False;'
);

module.exports = connection;
