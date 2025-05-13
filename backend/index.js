import express from 'express';
import { Sequelize } from 'sequelize';
// import ADODB from 'node-adodb';  // <-- Comenta mientras no pruebes Access
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// —– CONEXIÓN MSSQL con Sequelize —–
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    dialectOptions: { options: { encrypt: true } }
  }
);

// —– CÓDIGO ACCESS (comentado hasta que tengas Access/SQL instalados) —–
// ADODB.debug = false;
// const accessConn = ADODB.open(
//   `Provider=Microsoft.ACE.OLEDB.12.0;` +
//   `Data Source=${process.env.ACCESS_DB_PATH};` +
//   `Persist Security Info=False;`
// );

// Ruta de prueba para SQL Server
app.get('/', (req, res) => res.send('API MSSQL funcionando'));

// Ruta de prueba para Access (comentada)
// app.get('/access', async (req, res) => {
//   try {
//     const rows = await accessConn.query('SELECT TOP 10 * FROM TuTabla');
//     res.json(rows);
//   } catch (err) {
//     console.error('Error Access:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MSSQL OK');
  } catch (e) {
    console.error('Error MSSQL (se ignorará en esta ejecución):', e);
  } finally {
    app.listen(4000, () => console.log('API en http://localhost:4000'));
  }
})();

