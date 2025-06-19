const pool = require("../config/db");

// Obtener eventos
exports.getEvents = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible FROM eventos ORDER BY fecha ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener eventos:", error);
    res.status(500).json({ error: "Error al obtener eventos" });
  }
};

// Crear un evento
exports.createEvent = async (req, res) => {
  let { nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible } = req.body;

  // Validación básica
  if (!nombre || !descripcion || !fecha || !lugar || !precio || !horario || !imagen ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validación adicional: precio debe ser un número positivo
  precio = Number(precio);
  if (isNaN(precio) || precio < 0) {
    return res.status(400).json({ error: "El precio debe ser un número positivo" });
  }

  // Validación adicional: fecha debe tener formato válido
  if (isNaN(Date.parse(fecha))) {
    return res.status(400).json({ error: "La fecha no es válida" });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO eventos (nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible]
    );
    res.status(201).json({ mensaje: "Evento creado", eventoId: resultado.insertId });
  } catch (error) {
    console.error("❌ Error al crear evento:", error);
    res.status(500).json({ error: "Error al crear evento" });
  }
};

// Modificar un evento
exports.modifyEvent = async (req, res) => {
  const { id } = req.params;
  let { nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible } = req.body;

  //Validacion inicial
  if (!nombre || !descripcion || !fecha || !lugar || !precio || !horario || !imagen ) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

    // Validación adicional: precio debe ser un número positivo
  precio = Number(precio);
  if (isNaN(precio) || precio < 0) {
    return res.status(400).json({ error: "El precio debe ser un número positivo" });
  }

  // Validación adicional: fecha debe tener formato válido
  if (isNaN(Date.parse(fecha))) {
    return res.status(400).json({ error: "La fecha no es válida" });
  }

  try {
    const [resultado] = await pool.query(
      `UPDATE eventos 
      SET nombre = ?, descripcion = ?, fecha = ?, lugar = ?, precio = ?, horario = ?, imagen = ?, disponible = ?
      WHERE id = ?`,
      [nombre, descripcion, fecha, lugar, precio, horario, imagen, disponible, id]
    );
    res.json({ mensaje: "Evento actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar evento:", error);
    res.status(500).json({ error: "Error al actualizar evento" });
  };
};

// Eliminar un evento
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensaje: "Se requiere un ID de evento" });
  }

  try {
    const [resultado] = await pool.query("DELETE FROM eventos WHERE id = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json({ mensaje: "Evento eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar evento:", error);
    res.status(500).json({ error: "Error al eliminar evento" });
  }
};

// traer eventos por id 

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM eventos WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Evento no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener evento:", error);
    res.status(500).json({ mensaje: "Error al obtener evento" });
  }
};