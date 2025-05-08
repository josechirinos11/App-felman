import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mssql',
  dialectOptions: { options: { encrypt: true } }
});

app.get('/', (req, res) => res.send('API funcionando'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a BD OK');
    app.listen(4000, () => console.log('API en http://localhost:4000'));
  } catch (e) {
    console.error('Error BD:', e);
  }
})();
