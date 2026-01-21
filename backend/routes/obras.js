const express = require('express');
const router = express.Router();
const obraController = require('../controllers/obraController');

// GET todas las obras
router.get('/', obraController.getObras);

// GET obra por slug
router.get('/slug/:slug', obraController.getObraBySlug);

// GET obra por ID
router.get('/:id', obraController.getObraById);

// POST crear nueva obra
router.post('/', obraController.createObra);

// PUT actualizar obra
router.put('/:id', obraController.updateObra);

// DELETE obra
router.delete('/:id', obraController.deleteObra);

module.exports = router;