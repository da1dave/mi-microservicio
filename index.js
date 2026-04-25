const express = require('express');
const { Pool } = require('pg');
const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Crear tabla al iniciar
pool.query(`
  CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    precio NUMERIC
  )
`);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Microservicio funcionando', status: 'ok' });
});

app.get('/salud', (req, res) => {
  res.json({ status: 'saludable', timestamp: new Date() });
});

// Insertar producto
app.post('/productos', async (req, res) => {
  const { nombre, precio } = req.body;
  const result = await pool.query(
    'INSERT INTO productos (nombre, precio) VALUES ($1, $2) RETURNING *',
    [nombre, precio]
  );
  res.json(result.rows[0]);
});

// Consultar productos
app.get('/productos', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos');
  res.json(result.rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});