const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Registro de usuario
exports.registerUser = async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  // Validación básica
  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    const [[userExists]] = await pool.query("SELECT id FROM usuarios WHERE correo = ?", [correo]);
    if (userExists) {
      return res.status(400).json({ mensaje: "Correo ya registrado" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    await pool.query(
      "INSERT INTO usuarios (nombre, correo, contraseña) VALUES (?, ?, ?)",
      [nombre, correo, hashedPassword]
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("❌ Error en registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Inicio de sesión
exports.loginUser = async (req, res) => {
  const { correo, contraseña } = req.body;

  // Validación básica
  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  try {
    // Buscar usuario por correo (ahora también obtenemos el role)
    const [[usuario]] = await pool.query(
      "SELECT id, correo, contraseña, role FROM usuarios WHERE correo = ?", [correo]
    );

    if (!usuario) {
      return res.status(400).json({ mensaje: "Correo no encontrado" });
    }

    // Comparar contraseña
    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // GUARDAR EL TOKEN EN LA BD
    await pool.query(
      "UPDATE usuarios SET token = ? WHERE id = ?",
      [token, usuario.id]
    );

    // Enviar role en la respuesta
    res.json({
      token,
      role: usuario.role,
      correo: usuario.correo,
      id: usuario.id
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensaje: "Se requiere un ID de usuario" });
  }

  try {
    const [resultado] = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};