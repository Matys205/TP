const mercadopago = require('mercadopago');
const client = new mercadopago.MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const preference = new mercadopago.Preference(client);
const pool = require('../config/db');; // Asegúrate de ajustar la ruta según la estructura de tu proyecto

// Crear preferencia de pago de Mercado Pago
exports.crearPreferencia = async (req, res) => {
  try {
    const items = req.body.items;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items inválidos' });
    }
    const result = await preference.create({ body: { items } });
    res.json({ id: result.id });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    res.status(500).json({ error: error.message });
  }
};

// Simular pago y guardar en la base de datos
exports.simularPago = async (req, res) => {
  const { usuario_id, evento_id, monto, metodo } = req.body;
  try {
    await pool.query(
      "INSERT INTO pagos (usuario_id, evento_id, monto, metodo, fecha) VALUES (?, ?, ?, ?, NOW())",
      [usuario_id, evento_id, monto, metodo]
    );
    res.json({ mensaje: "Pago simulado y guardado correctamente" });
  } catch (error) {
    console.error("❌ Error al simular pago:", error);
    res.status(500).json({ error: "Error al simular pago" });
  }
};

// Obtener pagos por usuario
exports.obtenerPagosPorUsuario = async (req, res) => {
  const { usuario_id } = req.params;
  try {
    const [pagos] = await pool.query(
      "SELECT * FROM pagos WHERE usuario_id = ? ORDER BY fecha DESC",
      [usuario_id]
    );
    res.json(pagos);
  } catch (error) {
    console.error("❌ Error al obtener pagos:", error);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
};