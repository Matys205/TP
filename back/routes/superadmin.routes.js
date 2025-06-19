const express = require("express");
const router = express.Router();
const { verifyRole } = require("../middleware/authMiddleware");
const { getAllUsers, deleteUser,deleteEvent,getEventById } = require("../controllers/superAdminController");



// 🔐 Obtener todos los usuarios (solo super-admin)
router.get("/usuarios", verifyRole("super_admin", "super-admin"), getAllUsers);

// 🔐 Eliminar usuario por ID (solo super-admin)
router.delete("/usuarios/:id", verifyRole("super_admin", "super-admin"), deleteUser);

// Eliminar eventos por ID
router.delete("/eventos/:id", verifyRole("admin", "super_admin", "super-admin"), deleteEvent);

// Obtener un evento por ID
router.get("/:id", getEventById);

module.exports = router;