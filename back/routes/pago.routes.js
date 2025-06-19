const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// ...otras rutas...
router.get('/usuario/:usuario_id', pagoController.obtenerPagosPorUsuario);

module.exports = router;