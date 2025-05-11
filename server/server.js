import express from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import { pool } from './db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const app = express();
const port = process.env.PORT || 3000;
const host = '0.0.0.0';

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Rutas
app.use('/api', apiRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'index.html'));
});

// Ruta para servicios
app.get('/servicios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services');
        res.sendFile(join(__dirname, '../public', 'servicios.html'));
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar los servicios');
    }
});

// Ruta para detalle del servicio
app.get('/detalle-servicio', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'detalle-servicio.html'));
});

// Ruta para formulario
app.get('/formulario', (req, res) => res.sendFile('public/formulario.html', { root: '.' }));

app.get('/conocenos', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'conocenos.html'));
});

app.get('/portafolio', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'portafolio.html'));
});

app.get('/referencias', (req, res) => {
    res.sendFile(join(__dirname, '../public', 'referencias.html'));
});

app.listen(port, host, () => {
    console.log(`Servidor corriendo en ${host}:${port}`);
});
