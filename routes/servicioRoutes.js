const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { requireAuth, optionalAuth, requireRole } = require('../middleware/auth');

const gestores = [requireAuth, requireRole('Administrador', 'Operador')];

// Consulta pública (solo activos) o completa si hay sesión
router.get('/', optionalAuth, servicioController.getAll);
router.get('/categorias', servicioController.getCategorias);
router.get('/:id', optionalAuth, servicioController.getById);

// Gestión CRUD: Administrador y Operador
router.post('/', gestores, servicioController.create);
router.put('/:id', gestores, servicioController.update);
router.delete('/:id', gestores, servicioController.delete);

module.exports = router;
