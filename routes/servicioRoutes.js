const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

router.get('/', servicioController.getAll);
router.post('/', servicioController.create);
router.put('/:id', servicioController.update);
router.delete('/:id', servicioController.delete);

module.exports = router;
