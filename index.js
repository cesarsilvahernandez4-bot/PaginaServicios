require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Archivos estáticos (CSS, Imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Servir las vistas automáticamente
app.use(express.static(path.join(__dirname, 'views')));

// Rutas de la API (MVC)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api', authRoutes);

// Rutas Frontend explícitas (alias sin la extensión .html para las rutas principales)
const viewsPath = path.join(__dirname, 'views');
app.get('/', (req, res) => res.sendFile(path.join(viewsPath, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(viewsPath, 'login.html')));
app.get('/admin-usuarios', (req, res) => res.sendFile(path.join(viewsPath, 'admin-usuarios.html')));
app.get('/admin-servicios', (req, res) => res.sendFile(path.join(viewsPath, 'admin-servicios.html')));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
