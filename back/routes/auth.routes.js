const express = require("express");
const router = express.Router();
const { registerUser, loginUser, deleteUser } = require("../controllers/authController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Ruta de registro
router.post("/register", registerUser);

// Ruta de login
router.post("/login", loginUser);

// Ruta protegida: solo super-admin puede eliminar usuarios
// Acepta tanto "super_admin" como "super-admin" gracias al middleware
router.delete("/:id", verifyRole("super_admin", "super-admin"), deleteUser);

// Ruta de prueba
router.get("/test", (req, res) => {
  res.status(200).json({ mensaje: "Ruta auth funcionando!" });
});

module.exports = router;