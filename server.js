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
app.use(express.static(path.join(__dirname, '/')));

// Rutas de la API (MVC)
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api', authRoutes);

// Rutas Frontend Privadas (Mock - en una app real se validaría token)
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/admin-usuarios', (req, res) => res.sendFile(path.join(__dirname, 'admin-usuarios.html')));
app.get('/admin-servicios', (req, res) => res.sendFile(path.join(__dirname, 'admin-servicios.html')));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
