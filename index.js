require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const initDb = require('./config/initDb');

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const authRoutes = require('./routes/authRoutes');
const mensajeRoutes = require('./routes/mensajeRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Servir las vistas automáticamente
app.use(express.static(path.join(__dirname, 'views')));

// Rutas de la API REST (RF09)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/contacto', mensajeRoutes);
app.use('/api', authRoutes);
app.use('/api', (req, res) => res.status(404).json({ error: 'Recurso no encontrado' }));

// Rutas Frontend explícitas (alias sin la extensión .html)
const viewsPath = path.join(__dirname, 'views');
const pages = ['servicios', 'nosotros', 'contacto', 'login', 'admin-usuarios', 'admin-servicios', 'admin-mensajes'];
app.get('/', (req, res) => res.sendFile(path.join(viewsPath, 'index.html')));
pages.forEach((p) => app.get(`/${p}`, (req, res) => res.sendFile(path.join(viewsPath, `${p}.html`))));

// Manejador de errores genérico
app.use((err, req, res, next) => {
    console.error(err);
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
    res.status(500).json({ error: 'Error interno del servidor' });
});

initDb()
    .then(() => console.log('Base de datos lista'))
    .catch((err) => console.error('No se pudo inicializar la base de datos:', err.message))
    .finally(() => {
        app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
    });
