const express = require('express');
const router = express.Router();
const mensajeController = require('../controllers/mensajeController');
const { requireAuth, requireRole } = require('../middleware/auth');

const gestores = [requireAuth, requireRole('Administrador', 'Operador')];

router.post('/', mensajeController.create); // público
router.get('/', gestores, mensajeController.getAll);
router.patch('/:id', gestores, mensajeController.updateEstado);
router.delete('/:id', gestores, mensajeController.delete);

module.exports = router;
