const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Toda la gestión de usuarios es exclusiva del Administrador
router.use(requireAuth, requireRole('Administrador'));

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.post('/', usuarioController.create);
router.put('/:id', usuarioController.update);
router.delete('/:id', usuarioController.delete);

module.exports = router;
