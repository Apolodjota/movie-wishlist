const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'moviedb',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// Creación de la tabla de películas si no existe
pool.on('connect', (client) => {
  client.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      watched BOOLEAN DEFAULT false
    );
  `);
});

// --- Rutas de la API ---

// Obtener todas las películas
app.get('/api/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

// Agregar una nueva película
app.post('/api/movies', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query('INSERT INTO movies (title) VALUES ($1) RETURNING *', [title]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

// Marcar una película como vista/no vista
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { watched } = req.body;
    const result = await pool.query('UPDATE movies SET watched = $1 WHERE id = $2 RETURNING *', [watched, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend iniciado en el puerto ${port}`);
});