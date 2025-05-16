const express = require('express');
const mysql = require('mysql2/promise');  // Usamos la versión con promesas
const app = express();
const PORT = 3000;

// Configuración de la conexión (usa variables de entorno)
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

app.get('/', (req, res) => {
  res.send('API COORDINADORA UP'); 
});

app.get('/users', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [users] = await connection.query('SELECT * FROM users');
    connection.end();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});