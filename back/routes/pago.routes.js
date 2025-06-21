const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Obtener pagos por usuario
router.get('/usuario/:usuario_id', pagoController.obtenerPagosPorUsuario);

// Registrar una venta (simulada o real)
router.post('/registrar', pagoController.registrarVentaSimulada);

module.exports = router;